import { Component, computed, inject, input, Input, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  cartItem = input.required<CartItem>();
  // @Input({ required: true }) cartItem!: CartItem;
  
  private cartService = inject(CartService);
  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  // item = signal<CartItem>(undefined!);

  qtyArr = [...Array(8).keys()].map(x => x + 1);

  // Calculate the extended price
  exPrice = computed(() => this.cartItem().quantity * this.cartItem().product.price);

  onQuantitySelected(quantity: number): void {
    this.cartService.updateQuantity(this.cartItem(), Number(quantity));
  }

  removeFromCart(): void {
    this.cartService.removeFromCart(this.cartItem());
  }
}
