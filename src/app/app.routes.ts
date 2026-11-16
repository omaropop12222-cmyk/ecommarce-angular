import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './shared/api.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./pages/products').then(m => m.ProductsComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-details').then(m => m.ProductDetailsComponent) },
  { path: 'brands', loadComponent: () => import('./pages/brands').then(m => m.BrandsComponent) },
  { path: 'brands/:id', loadComponent: () => import('./pages/brand-details').then(m => m.BrandDetailsComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories').then(m => m.CategoriesComponent) },
  { path: 'categories/:id', loadComponent: () => import('./pages/category-details').then(m => m.CategoryDetailsComponent) },
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./pages/cart').then(m => m.CartComponent) },
  { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./pages/wishlist').then(m => m.WishlistComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout').then(m => m.CheckoutComponent) },
  { path: 'allorders', canActivate: [authGuard], loadComponent: () => import('./pages/orders').then(m => m.OrdersComponent) },
  { path: 'profile/orders', redirectTo: 'allorders' },
  { path: 'change-password', canActivate: [authGuard], loadComponent: () => import('./pages/change-password').then(m => m.ChangePasswordComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/register').then(m => m.RegisterComponent) },
  { path: 'forgot-password', canActivate: [guestGuard], loadComponent: () => import('./pages/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: '**', redirectTo: '' },
];
