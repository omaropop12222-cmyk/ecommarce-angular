import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
  <div class="page-head"><div class="container"><h1>My Orders</h1><p>Track and review your orders</p></div></div>
  <div class="container">
    @if (loading) { <div class="center">Loading orders...</div> }
    @else if (!orders.length) { <div class="center"><h2>No orders yet</h2><a routerLink="/products" class="btn">Start Shopping</a></div> }
    @for (o of orders; track o.id) {
      <div class="panel" style="margin-bottom:16px">
        <div class="row" style="flex-wrap:wrap"><b>Order #{{ o.id }}</b><span class="muted">{{ o.createdAt | date:'medium' }}</span></div>
        <div style="margin:8px 0"><span class="chip">{{ o.paymentMethodType }}</span><span class="chip">{{ o.isPaid ? 'Paid' : 'Not paid' }}</span><span class="chip">{{ o.isDelivered ? 'Delivered' : 'Processing' }}</span></div>
        @for (i of o.cartItems; track i._id) {
          <div class="cartrow"><img [src]="i.product.imageCover" [alt]="i.product.title"><div style="flex:1"><b>{{ i.product.title }}</b><div class="muted">Qty {{ i.count }}</div></div><b>{{ i.price | currency:'EGP ':'symbol':'1.0-0' }}</b></div>
        }
        <div class="row" style="margin-top:10px"><span class="muted">Ship to: {{ o.shippingAddress?.details }}, {{ o.shippingAddress?.city }}</span><b>Total: {{ o.totalOrderPrice | currency:'EGP ':'symbol':'1.0-0' }}</b></div>
      </div>
    }
  </div>`,
})
export class OrdersComponent implements OnInit {
  api = inject(ApiService); orders: any[] = []; loading = true;
  ngOnInit() { this.api.userOrders().subscribe({ next: (r: any) => { this.orders = (Array.isArray(r) ? r : r.data || []).reverse(); this.loading = false; }, error: () => this.loading = false }); }
}
