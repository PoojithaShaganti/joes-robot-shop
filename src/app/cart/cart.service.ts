import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs';
import { Iproduct } from '../catalog/product.model';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: BehaviorSubject<Iproduct[]> = new BehaviorSubject<Iproduct[]>([]);
  private apiUrl = 'http://localhost:3000/api'; // Base URL for the backend API

  constructor(private http: HttpClient) {
    // Use the full URL for the backend API
    this.http.get<Iproduct[]>(`${this.apiUrl}/cart`).subscribe({
      next: (cart) => this.cart.next(cart),
      error: (err) => console.error('Failed to fetch cart:', err),
    });
  }

  getCart(): Observable<Iproduct[]> {
    return this.cart.asObservable();
  }

updateCart(cart: Iproduct[]): Observable<void> {
  // Update the local cart
  this.cart.next(cart);

  // Send the updated cart to the backend
  return this.http.post<void>(`${this.apiUrl}/cart`, cart);
}

  /*add(product: Iproduct) {
    const newCart = [...this.cart.getValue(), product];
    this.cart.next(newCart);
    console.log('Sending cart data to backend:', newCart); // Debugging log
    this.http.post('http://localhost:3000/api/cart', newCart).subscribe({
      next: () => console.log('Cart updated successfully'),
      error: (err) => console.error('Failed to update cart:', err), // Debugging log
    });
  }*/
  add(product: Iproduct) {
  const currentCart = this.cart.getValue();
  const existingProduct = currentCart.find((p) => p.id === product.id);

  if (existingProduct) {
    // Update the quantity of the existing product
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    // Add the new product with an initial quantity of 1
    currentCart.push({ ...product, quantity: 1 });
  }

  // Notify subscribers of the updated cart
  this.cart.next([...currentCart]);

  // Send the updated cart to the backend
  this.http.post(`${this.apiUrl}/cart`, currentCart).subscribe({
    next: () => console.log('Cart updated successfully'),
    error: (err) => console.error('Failed to update cart:', err),
  });
}

 remove(product: Iproduct) {
  this.http.post(`${this.apiUrl}/remove/${product.id}`, {}).subscribe({
    next: (response: any) => {
      console.log('Product removed or quantity reduced:', response);

      // Fetch the updated cart from the backend
      this.getCartFromBackend();
    },
    error: (err) => console.error('Failed to remove product from cart:', err),
  });
}

// Fetch the updated cart from the backend
getCartFromBackend() {
  this.http.get<Iproduct[]>(`${this.apiUrl}/cart`).subscribe({
    next: (cart) => {
      this.cart.next(cart); // Notify subscribers of the updated cart
      console.log('Updated cart fetched from backend:', cart);
    },
    error: (err) => console.error('Failed to fetch updated cart:', err),
  });
}

  // Method to "buy" a product and add it to the cart
  buyProduct(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy/${productId}`, {});
  }
}


