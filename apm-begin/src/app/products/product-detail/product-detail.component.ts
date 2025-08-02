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
export class ProductDetailComponent
// implements OnChanges, OnDestroy 
{
  // Just enough here for the template to compile
  // @Input() productId: number = 0;
  strProductId: string = 'productId';
  errorMessage = this.productService.productError;
  cartServiceError = this.cartService.error;

  // Product to display
  // product: Product | null = null;
  // readonly product$ = this.productService.product$.pipe(
  //         tap(() => console.log('productdetail pipe')),
  //         catchError((err) => {
  //           this.errorMessage = err;
  //           return EMPTY;
  //         })
  //       );

  product = this.productService.product;
  
  // Set the page title
  pageTitle = computed(() => this.product 
    ? `Detail: ${this.product()?.productName}` 
    : 'Detail'
  );

  cartItems = this.cartService.cartItems;
  // sub!: Subscription;
  constructor(private productService: ProductService,
    private cartService: CartService,
  ) { }

  productSelected$ = this.productService.selectedProductId;

  // ngOnChanges(changes: SimpleChanges): void {
  //   const id = changes[this.strProductId].currentValue;
  //   if (id) {
  //     this.productService.productSelected(id);
  //     this.sub = this.product$
  //       .pipe(
  //         tap(() => console.log('productdetail pipe')),
  //         catchError((err) => {
  //           this.errorMessage = err;
  //           return EMPTY;
  //         })
  //       ).subscribe(
  //         (product => this.product = product)
  //       );
  //   }
  // }
  // ngOnDestroy(): void {
  //   if (this.sub) { this.sub.unsubscribe(); }
  // }

  // addToCart(product: Product) {
  //   this.cartService.addToCart(product);
  // }
  addToCart = (product: Product) => this.cartService.addToCart(product);
}
