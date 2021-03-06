import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) {
      this.form = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    })
  }

  get formValues() { return this.form.controls; }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }

  async createAccount() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await this.authService.signUp(
        this.form.controls.firstName.value, 
        this.form.controls.lastName.value, 
        this.form.controls.email.value, 
        this.form.controls.password.value);
    } catch (error) {
      this.notificationService.showNotif(error, "okay");
    }
  }

}

function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
