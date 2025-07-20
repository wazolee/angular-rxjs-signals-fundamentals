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

  // ngOnInit(): void {
  //   // this.sub = this.productService.getProducts()
  //   this.sub = this.products$.subscribe({
  //     next: products => {
  //       this.products = products;
  //       console.log(this.products);
  //     },
  //     // error: err => this.errorMessage = err,
  //   });
  // }
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';

  // Products
  // products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
