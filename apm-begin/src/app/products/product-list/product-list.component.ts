import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  constructor(private productService: ProductService) { }

  // sub!: Subscription;
  readonly products$ = this.productService.products$
    .pipe(
      tap(() => console.log("producttlist pipe")),
      catchError(err => { //best practise errorhandling
        this.errorMessage = err;
        return EMPTY;
      })
    );

  pageTitle = 'Products';
  errorMessage = '';

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
