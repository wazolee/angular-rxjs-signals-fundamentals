import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent {
  constructor(private productService: ProductService,
    private cartService: CartService
  ) { }

  products = this.productService.products;
  errorMessage = this.productService.productsError;

  pageTitle = 'Products';

  selectedProductId = this.productService.selectedProductId;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
    this.cartService.error.set('');
  }
}
