import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";
import { reduce } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  error = signal('');

  cartCount = computed(() => this.cartItems().reduce((accQt, item) => accQt + item.quantity, 0));

  eLength = effect(() => console.log(this.cartItems()));

  subTotal = computed(() => this.cartItems()
    .reduce((accTotal, item) => accTotal + (item.quantity * item.product.price), 0));

  deliveryFee = computed(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed<number>(() => Math.round(this.subTotal() * this.taxPercent / 100));
  taxPercent = 10.75;

  totalPrice = computed(() => this.deliveryFee() + this.subTotal() + this.tax());

  addToCart(product: Product): void {    
    if(this.cartItems().find(i => i.product.id === product.id)){
      this.error.set("Product already added");
      return;
    }
    this.cartItems.update(items => [...items, { product, quantity: 1 }]);    
  }

  removeFromCart(cartItem:CartItem):void{
    this.cartItems.update(items => items.filter(item => item.product.id !== cartItem.product.id));
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === cartItem.product.id ? { ...item, quantity: quantity } : item
      )
    );
  }
}
