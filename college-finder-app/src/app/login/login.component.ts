import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
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

  loginAccount() {
    if (this.form.invalid) {
      window.alert("The information you provided is invalid");
      return;
    }

    this.authService.signIn(this.form.controls.email.value,
      this.form.controls.password.value);
  }

}
