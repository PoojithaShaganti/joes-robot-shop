import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Iproduct } from '../catalog/product.model';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'bot-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
 @Input() product!: Iproduct;
 @Output() buy = new EventEmitter<number>(); // Emit the product ID when "Buy" is clicked

 constructor(private cartService: CartService) {}

 buyButtonClicked() {
  console.log('Product ID being emitted:', this.product.id);
  this.buy.emit(this.product.id); // Emit the product ID to the parent component
}
}
