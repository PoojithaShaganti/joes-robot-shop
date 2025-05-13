import { Component, OnInit } from '@angular/core';
import { Iproduct } from '../catalog/product.model';
import { CartService } from './cart.service';

@Component({
  selector: 'bot-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private cart: Iproduct[] = [];
  constructor(private cartService: CartService) { }

  ngOnInit() {
    /*this.cartService.getCart().subscribe({
      next: (cart) => (this.cart = cart),
    });*/
    // Subscribe to the cart data
    this.cartService.getCart().subscribe((cart) => {
      this.cart = cart;
      console.log('Cart updated:', this.cart);
    });
  }

  get cartItems() {
    return this.cart;
  }

  get cartTotal() {
    return this.cart.reduce((prev, next) => {
      let discount = next.discount && next.discount > 0 ? 1 - next.discount : 1;
      return prev + next.price * discount * (next.quantity || 1);
    }, 0);
  }

  removeFromCart(product: Iproduct) {
    this.cartService.remove(product);
    this.cart = this.cart.filter((p) => p !== product);
    /*this.cart.forEach((product) => this.cartService.add(product)); // Update the backend*/
     // Notify the CartService about the updated cart
  this.cartService.updateCart(this.cart).subscribe({
    next: () => console.log('Cart updated successfully'),
    error: (err) => console.error('Failed to update cart:', err),
  });
  }

  getImageUrl(product: Iproduct) {
    if (!product) return '';
    return '/assets/images/robot-parts/' + product.imageName;
  }
}
