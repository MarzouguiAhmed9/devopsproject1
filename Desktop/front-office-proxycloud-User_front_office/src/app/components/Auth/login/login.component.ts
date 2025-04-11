import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/serviceUser/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = ''; // Reset error message
  
    const credentials = this.loginForm.value;
  
    this.authService.login(credentials).subscribe(
      (response) => {
        this.isLoading = false;
  
        console.log('Réponse de l\'API:', response);  // Ajoutez cette ligne pour vérifier la réponse
  
        if (response.token) {
          // Store the token securely
          this.authService.storeToken(response.token);
          console.log('Token stored:', response.token);
  
          const user = this.authService.getUserDetails();
          console.log('User details:', user);
  
          const roles = this.authService.getUserRole();
          console.log('User roles:', roles);
  
          // Redirect based on role
          if (roles && roles.includes('ROLE_ADMIN')) {
            window.location.href = 'http://localhost:4200/dashboard';
          } else {
            this.router.navigate(['']);
          }
        } else {
          console.error('No token found in response');
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Login error', error);
  
        // Display the error message in the UI
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
  
}