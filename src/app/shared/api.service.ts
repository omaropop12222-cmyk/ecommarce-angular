import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const B = 'https://ecommerce.routemisr.com/api/v1';

export const toastSignal = signal('');
let toastTimer: any;
export function showToast(m: string, ms = 2500) {
  toastSignal.set(m); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastSignal.set(''), ms);
}
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const t = localStorage.getItem('token');
  return next(t && req.url.startsWith(B) ? req.clone({ setHeaders: { token: t } }) : req).pipe(
    catchError(e => {
      if (req.url.startsWith(B)) showToast(`Request failed (${e.status || 'network error'}): ${e.error?.message || e.statusText || ''} → ${req.url.replace(B, '')}`, 8000);
      return throwError(() => e);
    })
  );
};
export const authGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  if (api.token()) return true;
  return inject(Router).createUrlTree(['/login']);
};
export const guestGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  return api.token() ? inject(Router).createUrlTree(['/']) : true;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  token = signal<string | null>(localStorage.getItem('token'));
  cartCount = signal(0);
  wishIds = signal<string[]>([]);
  toastMsg = toastSignal;

  constructor() { if (this.token()) this.refresh(); }

  get userId(): string | null {
    try { return JSON.parse(atob(this.token()!.split('.')[1])).id; } catch { return null; }
  }
  toast(m: string) { showToast(m); }
  refresh() {
    this.getCart().subscribe({ next: (r: any) => this.cartCount.set(r.numOfCartItems || 0), error: () => this.cartCount.set(0) });
    this.getWishlist().subscribe({ next: (r: any) => this.wishIds.set((r.data || []).map((p: any) => p.id)), error: () => {} });
  }
  setToken(t: string) { localStorage.setItem('token', t); this.token.set(t); this.refresh(); }
  logout() {
    localStorage.removeItem('token'); this.token.set(null);
    this.cartCount.set(0); this.wishIds.set([]); this.router.navigate(['/login']);
  }
  private needLogin(): boolean {
    if (this.token()) return false;
    this.toast('Please sign in first'); this.router.navigate(['/login']); return true;
  }

  // Auth
  signup(d: any) { return this.http.post(`${B}/auth/signup`, d); }
  signin(d: any) { return this.http.post(`${B}/auth/signin`, d); }
  forgotPassword(email: string) { return this.http.post(`${B}/auth/forgotPasswords`, { email }); }
  verifyCode(resetCode: string) { return this.http.post(`${B}/auth/verifyResetCode`, { resetCode }); }
  resetPassword(email: string, newPassword: string) { return this.http.put(`${B}/auth/resetPassword`, { email, newPassword }); }
  changePassword(d: any) { return this.http.put(`${B}/users/changeMyPassword`, d); }

  // Catalog
  products(params: any = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && q.set(k, String(v)));
    return this.http.get(`${B}/products?${q.toString()}`);
  }
  product(id: string) { return this.http.get(`${B}/products/${id}`); }
  categories() { return this.http.get(`${B}/categories`); }
  category(id: string) { return this.http.get(`${B}/categories/${id}`); }
  subcategories(id: string) { return this.http.get(`${B}/categories/${id}/subcategories`); }
  brands() { return this.http.get(`${B}/brands`); }
  brand(id: string) { return this.http.get(`${B}/brands/${id}`); }

  // Cart
  getCart() { return this.http.get(`${B}/cart`); }
  updateCart(id: string, count: number) { return this.http.put(`${B}/cart/${id}`, { count }); }
  removeFromCart(id: string) { return this.http.delete(`${B}/cart/${id}`); }
  clearCart() { return this.http.delete(`${B}/cart`); }
  addToCart(productId: string) {
    if (this.needLogin()) return;
    this.http.post(`${B}/cart`, { productId }).subscribe({
      next: (r: any) => { this.cartCount.set(r.numOfCartItems); this.toast(r.message || 'Added to cart'); },
      error: () => this.toast('Something went wrong'),
    });
  }

  // Wishlist
  getWishlist() { return this.http.get(`${B}/wishlist`); }
  removeFromWishlist(id: string) { return this.http.delete(`${B}/wishlist/${id}`); }
  toggleWish(id: string) {
    if (this.needLogin()) return;
    const has = this.wishIds().includes(id);
    const req = has ? this.removeFromWishlist(id) : this.http.post(`${B}/wishlist`, { productId: id });
    req.subscribe({
      next: (r: any) => { this.wishIds.set(r.data || []); this.toast(has ? 'Removed from wishlist' : 'Added to wishlist'); },
      error: () => this.toast('Something went wrong'),
    });
  }

  // Orders / payment
  cashOrder(cartId: string, shippingAddress: any) { return this.http.post(`${B}/orders/${cartId}`, { shippingAddress }); }
  onlineOrder(cartId: string, shippingAddress: any) {
    return this.http.post(`${B}/orders/checkout-session/${cartId}?url=${encodeURIComponent(location.origin)}`, { shippingAddress });
  }
  userOrders() { return this.http.get(`${B}/orders/user/${this.userId}`); }
}
