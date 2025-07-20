import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  strProductId: string = 'productId';
  errorMessage = '';

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  sub!: Subscription;
  constructor(private productService: ProductService) { }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes[this.strProductId].currentValue;
    if (id) {
      this.sub = this.productService.getProduct(this.productId)
        .pipe(
          tap(() => console.log('productdetail pipe')),
          catchError((err) => {
            this.errorMessage = err;
            return EMPTY;
          })
        ).subscribe(
          (product => this.product = product)
        );
    }
  }
  ngOnDestroy(): void {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  addToCart(product: Product) {
  }
}
