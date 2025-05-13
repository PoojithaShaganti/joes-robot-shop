import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { SignInComponent } from './user/sign-in/sign-in.component';

const routes: Routes = [
  {path:'home', component: HomeComponent, title: 'Home - poojitha robot shop'},
  {path:'catalog', component: CatalogComponent, title: 'catalog - poojitha robot shop'},
  {path:'cart', component: CartComponent, title: 'cart - poojitha robot shop'},
  {path:'sign-in', component: SignInComponent, title: 'sign-in - poojitha robot shop'},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
