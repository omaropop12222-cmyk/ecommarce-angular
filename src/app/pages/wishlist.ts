import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [RouterLink, CurrencyPipe],
  template: `
  <div class="page-head"><div class="container"><h1>My Wishlist</h1><p>{{ items.length }} items saved</p></div></div>
  <div class="container">
    @if (loading) { <div class="center">Loading...</div> }
    @else if (!items.length) { <div class="center"><h2>Your wishlist is empty</h2><a routerLink="/products" class="btn">Browse Products</a></div> }
    <div class="grid">@for (p of items; track p.id) {
      <div class="card"><a [routerLink]="['/products', p.id]" class="imgwrap"><img [src]="p.imageCover" [alt]="p.title"></a>
        <div class="body"><h3>{{ p.title }}</h3><b>{{ p.price | currency:'EGP ':'symbol':'1.0-0' }}</b>
          <div class="row" style="margin-top:10px"><button class="btn sm" (click)="api.addToCart(p.id)">Add to Cart</button><button class="btn sm red" (click)="remove(p.id)">Remove</button></div></div></div>
    }</div>
  </div>`,
})
export class WishlistComponent implements OnInit {
  api = inject(ApiService); items: any[] = []; loading = true;
  ngOnInit() { this.api.getWishlist().subscribe({ next: (r: any) => { this.items = r.data; this.loading = false; }, error: () => this.loading = false }); }
  remove(id: string) {
    this.api.removeFromWishlist(id).subscribe((r: any) => {
      this.api.wishIds.set(r.data); this.items = this.items.filter(p => p.id !== id); this.api.toast('Removed from wishlist');
    });
  }
}
