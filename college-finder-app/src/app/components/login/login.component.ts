import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
  })
  }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }


  loginAccount() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.signIn(this.f.email.value,
      this.f.password.value);
  }

}
