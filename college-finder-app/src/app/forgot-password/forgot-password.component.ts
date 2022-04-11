import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
  })
  }

  ngOnInit(): void {
  }

  resetPassword() {
    if (this.form.invalid) {
      window.alert("The information you provided is invalid");
      return;
    }

    this.authService.resetPassword(this.form.controls.email.value);
  }

}
