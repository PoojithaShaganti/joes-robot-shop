import { Component } from '@angular/core';
import { Iproduct } from './product.model';
import { CartService } from '../cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
selector: 'bot-catalog',
templateUrl: './catalog.component.html',
styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
products: Iproduct[] =[];
filter: string ='';

constructor(
  private cartSVC: CartService,
  private router: Router,
  private route: ActivatedRoute,
  private http: HttpClient
) {}

ngOnInit() {
 // Fetch products from the backend
 this.http.get<Iproduct[]>('http://localhost:3000/api/products').subscribe({
  next: (products) => (this.products = products),
  error: (err) => console.error('Failed to fetch products:', err),
});

// Handle query parameters for filtering
this.route.queryParams.subscribe((params) => {
  this.filter = params['filter'] ?? '';
});
}

/*addToCart(product: Iproduct) {
  this.cartSVC.add(product);
  this.router.navigate(['/cart']);
}*/

/*getDiscountedClasses(product : Iproduct) {
  if (product.discount > 0)
  return ['strikethrough'];
  else return [];
}*/

// Handle the "Buy" action
buyProduct(productId: number) {
  console.log('Product ID received in CatalogComponent:', productId);
  this.cartSVC.buyProduct(productId).subscribe({
    next: (response) => {
      console.log('Product added to cart:', response);
      this.cartSVC.add(response.cartItem); // Add the product to the cart
      this.router.navigate(['/cart']);
    },
    error: (err) => {
      console.error('Failed to add product to cart:', err);
      alert(`Failed to add product to cart: ${err.error?.error || err.message}`);
    },
  });
}

getFilteredProducts() {
  return this.filter === '' 
  ? this.products
  : this.products.filter((product) => product.category === this.filter);
}
}
