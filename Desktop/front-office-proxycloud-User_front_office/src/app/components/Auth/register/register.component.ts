import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/serviceUser/user.service';

interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  availableRoles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      ]],
      passwordRepeat: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[245793][0-9]{7}$/)]],
      address: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      birthday: ['', [Validators.required, this.ageValidator]],
      enabled: [true],
      accountLocked: [false],
      role: [2]
    }, {
      validators: this.passwordsMatchValidator
    });

    this.loadRoles();
  }

  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const passwordRepeat = form.get('passwordRepeat')?.value;
    return password === passwordRepeat ? null : { passwordsMismatch: true };
  }

  ageValidator(control: AbstractControl) {
    const birthDate = new Date(control.value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 12 ? null : { ageTooYoung: true };
  }

  loadRoles() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Aucun token trouvé");
      return;
    }

    const decodedToken = this.decodeJwt(token);
    const userId = decodedToken?.id;

    if (!userId) {
      console.error("❌ ID utilisateur introuvable");
      return;
    }

    this.userService.getRoles(userId).subscribe(
      (roles: Role[]) => {
        this.availableRoles = roles;
        if (!this.registerForm.value.role) {
          this.registerForm.patchValue({ role: this.availableRoles[0]?.id });
        }
      },
      error => {
        console.error("❌ Erreur chargement rôles", error);
      }
    );
  }

  decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("❌ Erreur décodage token", error);
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const userData = {
        ...formValue,
        role: { id: formValue.role }
      };

      this.userService.register(userData).subscribe(
        response => {
          console.log('✅ Inscription réussie', response);
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('❌ Erreur inscription', error);
          alert(error.error?.error || "Une erreur est survenue. Veuillez réessayer.");
        }
      );
    }
  }

  onPhoneInput(event: any): void {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, '');
  }
}
