import { computed, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatest, concatMap, EMPTY, filter, map, mergeMap, Observable, of, shareReplay, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductData } from './product-data';
import { HttpErrorService } from '@utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  selectedProductId = signal<number | undefined>(undefined);

  constructor(private http: HttpClient,
    private reviewService: ReviewService,
    private errorService: HttpErrorService) { }

  private productsResult$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map(p => ({ data: p }) as Result<Product[]>),
      tap((data) => console.log(JSON.stringify(data))),
      shareReplay(1),
      catchError(err => of({
        data: [],
        error: this.errorService.formatError(err)
      } as Result<Product[]>))
    );

  private productsResult = toSignal(this.productsResult$,
    { initialValue: ({ data: [] }) as Result<Product[]> });

  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);

  // products = computed(() => { 
  //   try {
  //     return toSignal(this.products$, { initialValue: [] as Product[] })();
  //   } catch (error) {
  //     return [] as Product[];
  //   }
  // });

  // private productResult1$ = toObservable(this.selectedProductId)
  //   .pipe(
  //     filter(Boolean),
  //     switchMap(id => {
  //       const productUrl = this.productsUrl + '/' + id;
  //       return this.http.get<Product>(productUrl)
  //         .pipe(
  //           tap(() => console.log('htp.get by id pipe')),
  //           switchMap((product) => this.getProductWithReviews(product)),
  //           catchError((err) => of({
  //             data: undefined,
  //             error: this.errorService.formatError(err)
  //           } as Result<Product>)),
  //         );
  //     }),
  //     map(p => ({ data: p }) as Result<Product>)
  //   );

  private foundProduct = computed(() => {
    // Dependent signals
    const p = this.products();
    const id = this.selectedProductId();
    if (p && id) {
      return p.find(product => product.id === id);
    }
    return undefined;
  });

  private productResult$ = toObservable(this.foundProduct)
    .pipe(
      filter(Boolean),
      switchMap(product => this.getProductWithReviews(product)),
      map(p => ({ data: p } as Result<Product>)),
      catchError(err => of({
        data: undefined,
        error: this.errorService.formatError(err)
      } as Result<Product>))
    );

  private productResult = toSignal(this.productResult$);
  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);
  
  // productResult2$ = combineLatest([
  //   this.productSelected,
  //   this.products
  // ]).pipe(
  //   map(([selectedProductId, products]) =>
  //     products.find(product => product.id === selectedProductId)
  //   ),
  //   filter(Boolean),
  //   switchMap((product) => this.getProductWithReviews(product)),
  //   catchError((err) => this.handleError(err)),
  // );

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map(reviews => ({ ...product, reviews } as Product))
        );
    }
    return of(product);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
  }
}
