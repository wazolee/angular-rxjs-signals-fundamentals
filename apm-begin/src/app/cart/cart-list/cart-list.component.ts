import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-list',
  standalone: true,
  imports: [CartItemComponent, NgFor, NgIf],
  templateUrl: 'cart-list.component.html'
})
export class CartListComponent {

  pageTitle = 'Cart';

  cartItems = this.cartService.cartItems;

  constructor(private cartService:CartService){}
}
