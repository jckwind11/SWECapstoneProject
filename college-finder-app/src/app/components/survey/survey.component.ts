import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  form: FormGroup

  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder, 
  ) { 

    this.form = this.formBuilder.group({

    })
  }

  ngOnInit(): void {
  }

  updateSurvey() {

  }

}
