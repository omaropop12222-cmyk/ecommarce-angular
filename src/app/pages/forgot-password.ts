import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  standalone: true, imports: [FormsModule, RouterLink],
  template: `
  <div class="form panel">
    <h1>Forgot Password</h1>
    @if (error) { <div class="alert">{{ error }}</div> } @if (info) { <div class="okmsg">{{ info }}</div> }
    @if (step === 1) {
      <p class="muted">Enter your email to receive a reset code</p>
      <label>Email</label><input type="email" [(ngModel)]="email" name="email">
      <button class="btn" [disabled]="!email || busy" (click)="send()">Send Reset Code</button>
    } @else if (step === 2) {
      <p class="muted">Enter the code sent to your email</p>
      <label>Reset Code</label><input [(ngModel)]="code" name="code">
      <button class="btn" [disabled]="!code || busy" (click)="verify()">Verify Code</button>
    } @else {
      <label>New Password</label><input type="password" [(ngModel)]="pass" name="pass">
      <button class="btn" [disabled]="pass.length < 6 || busy" (click)="reset()">Reset Password</button>
    }
    <p style="text-align:center"><a routerLink="/login" style="color:var(--g)">Back to sign in</a></p>
  </div>`,
})
export class ForgotPasswordComponent {
  api = inject(ApiService); router = inject(Router);
  step = 1; email = ''; code = ''; pass = ''; error = ''; info = ''; busy = false;
  private run(obs: any, ok: (r: any) => void) {
    this.busy = true; this.error = ''; this.info = '';
    obs.subscribe({ next: (r: any) => { this.busy = false; ok(r); }, error: (e: any) => { this.busy = false; this.error = e.error?.message || 'Something went wrong'; } });
  }
  send() { this.run(this.api.forgotPassword(this.email), r => { this.info = r.message; this.step = 2; }); }
  verify() { this.run(this.api.verifyCode(this.code), () => { this.step = 3; }); }
  reset() { this.run(this.api.resetPassword(this.email, this.pass), r => { this.api.setToken(r.token); this.router.navigate(['/']); }); }
}
