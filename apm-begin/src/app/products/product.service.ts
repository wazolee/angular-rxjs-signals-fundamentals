import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatest, concatMap, EMPTY, filter, map, mergeMap, Observable, of, shareReplay, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
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

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();
  // private http = inject(HttpClient);

  constructor(private http: HttpClient,
    private reviewService: ReviewService,
    private errorService: HttpErrorService) { }

  private products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap((data) => console.log(JSON.stringify(data))),
      shareReplay(1),
      catchError(err => this.handleError(err)),
    );

  products = toSignal(this.products$, { initialValue: [] as Product[] });

  readonly product1$ = this.productSelected$
    .pipe(
      filter(Boolean),
      switchMap(id => {
        const productUrl = this.productsUrl + '/' + id;
        return this.http.get<Product>(productUrl)
          .pipe(
            tap(() => console.log('htp.get by id pipe')),
            switchMap((product) => this.getProductWithReviews(product)),
            catchError((err) => this.handleError(err)),
          );
      })
    );

  product$ = combineLatest([
    this.productSelected$,
    this.products$
  ]).pipe(
    map(([selectedProductId, products]) =>
      products.find(product => product.id === selectedProductId)
    ),
    filter(Boolean),
    switchMap((product) => this.getProductWithReviews(product)),
    catchError((err) => this.handleError(err)),
  );

  // getProduct(id: number): Observable<Product> {
  //   const productUrl = this.productsUrl + '/' + id;
  //   return this.http.get<Product>(productUrl)
  //     .pipe(
  //       tap(() => console.log('htp.get by id pipe')),
  //       switchMap((product) => this.getProductWithReviews(product)),
  //       catchError((err) => this.handleError(err)),
  //     );
  // }

  productSelected(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
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
