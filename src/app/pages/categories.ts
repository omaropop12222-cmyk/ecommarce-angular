import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <div class="page-head"><div class="container"><div class="crumb"><a routerLink="/">Home</a> / Categories</div><h1>All Categories</h1><p>Browse our wide range of product categories</p></div></div>
  <div class="container">
    @if (!cats.length) { <div class="center">Loading categories...</div> }
    <div class="grid sm">@for (c of cats; track c._id) { <a class="tile" [routerLink]="['/categories', c._id]"><img [src]="c.image" [alt]="c.name"><b>{{ c.name }}</b></a> }</div>
  </div>`,
})
export class CategoriesComponent implements OnInit {
  api = inject(ApiService); cats: any[] = [];
  ngOnInit() { this.api.categories().subscribe((r: any) => this.cats = r.data); }
}
