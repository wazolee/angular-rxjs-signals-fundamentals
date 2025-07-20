import { Injectable } from '@angular/core';
import { catchError, concatMap, EMPTY, map, mergeMap, Observable, of, switchMap, tap, throwError } from 'rxjs';
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

  // private http = inject(HttpClient);

  constructor(private http: HttpClient,
    private reviewService: ReviewService,
    private errorService: HttpErrorService) { }

  readonly products$ = this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('htp.get pipe')),
        catchError(err => this.handleError(err)),
      );

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log('htp.get by id pipe')),
        switchMap((product) => this.getProductWithReviews(product)),
        catchError((err) => this.handleError(err)),
      );
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
