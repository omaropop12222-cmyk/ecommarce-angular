import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [ReactiveFormsModule, RouterLink],
  template: `
  <form class="form panel" [formGroup]="f" (ngSubmit)="submit()">
    <h1>Welcome Back</h1><p class="muted">Sign in to continue shopping</p>
    @if (error) { <div class="alert">{{ error }}</div> }
    <label>Email</label><input type="email" formControlName="email" placeholder="you@example.com">
    @if (f.get('email')?.touched && f.get('email')?.invalid) { <div class="err">Enter a valid email</div> }
    <label>Password</label><input type="password" formControlName="password" placeholder="••••••••">
    @if (f.get('password')?.touched && f.get('password')?.invalid) { <div class="err">Password is required</div> }
    <div style="text-align:right;margin-top:8px"><a routerLink="/forgot-password" style="color:var(--g);font-size:13px">Forgot password?</a></div>
    <button class="btn" [disabled]="f.invalid || busy">{{ busy ? 'Signing in...' : 'Sign In' }}</button>
    <p class="muted" style="text-align:center">New here? <a routerLink="/register" style="color:var(--g)">Create account</a></p>
  </form>`,
})
export class LoginComponent {
  api = inject(ApiService); router = inject(Router); fb = inject(FormBuilder); error = ''; busy = false;
  f = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  submit() {
    this.busy = true; this.error = '';
    this.api.signin(this.f.value).subscribe({
      next: (r: any) => { this.api.setToken(r.token); this.router.navigate(['/']); },
      error: e => { this.busy = false; this.error = e.error?.message || 'Login failed'; },
    });
  }
}
