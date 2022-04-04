import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  username = "Jack.Windham";
  form: FormGroup;

  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder) {
      this.username = this.authService.username;
      this.form = this.formBuilder.group({
        placeholder: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  publishUserProfile() {

  }

}
