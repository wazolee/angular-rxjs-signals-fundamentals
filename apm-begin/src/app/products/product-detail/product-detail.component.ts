import { Component, computed, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  strProductId: string = 'productId';
  errorMessage = this.productService.productError;
  cartServiceError = this.cartService.error;

  product = this.productService.product;

  pageTitle = computed(() => this.product
    ? `Detail: ${this.product()?.productName}`
    : 'Detail'
  );

  cartItems = this.cartService.cartItems;
  constructor(private productService: ProductService,
    private cartService: CartService,
  ) { }

  productSelected$ = this.productService.selectedProductId;

  addToCart = (product: Product) => this.cartService.addToCart(product);
}
