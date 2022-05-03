import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms'
import { ContactService } from 'src/app/contact.service';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  FormData: FormGroup;
  updateSuccess: boolean;

  userEmail = '';
  userName = '';

  constructor(private builder: FormBuilder, private contact: ContactService, private auth: AuthService) {
    this.userEmail = auth.currentUserValue.email;
    this.userName = `${auth.currentUserValue.data.firstName} ${auth.currentUserValue.data.lastName}`;
  }

  ngOnInit() {
    this.updateSuccess = false;
    this.FormData = this.builder.group({
      Fullname: new FormControl(this.userName, [Validators.required]),
      Email: new FormControl(this.userEmail, [Validators.compose([Validators.required, Validators.email])]),
      Comment: new FormControl('', [Validators.required])
    });
  }


  onSubmit(FormData) {
    console.log(FormData)
    this.contact.PostMessage(FormData)
      .subscribe(response => {
        location.href = 'https://mailthis.to/confirm'
        console.log(response)
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      })
    this.FormData.reset();
    this.updateSuccess = true;
  }

}
