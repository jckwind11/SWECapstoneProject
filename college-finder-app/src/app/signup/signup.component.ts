import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get formValues() { return this.form.controls; }

  ngOnInit(): void {
  }

  createAccount() {
    if (this.form.invalid) {
      window.alert("The information you provided is invalid");
      return;
    }
    this.authService.signUp(
      this.form.controls.firstName.value, 
      this.form.controls.lastName.value, 
      this.form.controls.email.value, 
      this.form.controls.password.value);
  }

}
