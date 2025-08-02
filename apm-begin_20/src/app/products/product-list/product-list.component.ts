import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  constructor(private productService: ProductService,
    private cartService:CartService
  ) { }

  // sub!: Subscription;
  readonly products$ = this.productService.products$
    .pipe(
      catchError(err => { //best practise errorhandling
        this.errorMessage = err;
        return EMPTY;
      })
    );

  pageTitle = 'Products';
  errorMessage = '';
  
  // Selected product id to highlight the entry
  // selectedProductId: number = 0;
  readonly selectedProductId$ = this.productService.productSelected$;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
    this.cartService.error.set('');
    // this.selectedProductId = productId;
  }
}
