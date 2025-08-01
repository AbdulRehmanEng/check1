import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false

})
export class LoginComponent {
  loginForm: FormGroup; // Reactive form for login
  loading: boolean = false; // To show a loading spinner
  errorMessage: string = ''; // To show error messages from API

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _loginService:LoginService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]], // Username is required
      password: ['', [Validators.required, Validators.minLength(5)]] // Password is required and must be at least 6 characters
    });
  }

  // Handle the login action
  onLogin() {
    if (this.loginForm.invalid) {
      return; // Stop if the form is invalid
    }

    this.loading = true;
    this.errorMessage = '';

    const loginData = this.loginForm.value;
    

    // Use the AuthService to call the API
    this._loginService.login(loginData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
          this.loginForm.reset();
           this.authService.login();
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while logging in. Please try again.';
        console.error(error);
      }
    );
  }
}