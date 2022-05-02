import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SurveyQuestion, SurveyQuestionHandler, QuestionType } from 'src/app/shared/models/survey/questions';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SurveyForm } from '../../shared/models/survey/survey';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  @ViewChild('f', { static: true }) f: NgForm;
  
  survey: FormGroup;
  allQuestions: SurveyQuestion[];
  QuestionType = QuestionType;
  errorMessage: string = '';
  updateSuccess: boolean = false;

  constructor(
    public authService: AuthService, 
    public questionHandler: SurveyQuestionHandler,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) { 

    this.allQuestions = questionHandler.allQuestions;
    this.createSurvey();
    this.fillInSurvey();
  }

  ngOnInit(): void {
  }

  createSurvey() {
    this.survey = this.formBuilder.group({
      // Question 1
      question1_0: [''],
      question1_1: [''],
      question1_2: [''],
      question1_3: [''],
      question1_4: [''],
      question1_5: [''],
      question1_6: [''],
      question1_7: [''],
      question1_8: [''],

      // Question 2
      question2_0: [''],
      question2_1: [''],
      question2_2: [''],
      question2_3: [''],

      // Question 3
      question3_0: [''],
      question3_1: [''],
      question3_2: [''],

      // Question 4
      question4: [''],

      // Question 5
      question5: [''],

      // Question 6
      question6: [''],

      // Question 7
      question7: [''],

      // Question 8
      question8: [''],

      // Question 9
      question9: [''],

      // Question 10
      question10: [''],

      // Question 11
      question11: [''],
    })
  }

  saveSurvey() {
    console.log(this.survey.value);
    if (!this.validate()) {
      console.log('form not valid')
      return
    }

    console.log('form IS valid')
    // Handle form submission
    const surveyData = {
      question1_0: this.survey.value.question1_0 == '' ? false : this.survey.value.question1_0,
      question1_1: this.survey.value.question1_1 == '' ? false : this.survey.value.question1_1,
      question1_2: this.survey.value.question1_2 == '' ? false : this.survey.value.question1_2,
      question1_3: this.survey.value.question1_3 == '' ? false : this.survey.value.question1_3,
      question1_4: this.survey.value.question1_4 == '' ? false : this.survey.value.question1_4,
      question1_5: this.survey.value.question1_5 == '' ? false : this.survey.value.question1_5,
      question1_6: this.survey.value.question1_6 == '' ? false : this.survey.value.question1_6,
      question1_7: this.survey.value.question1_7 == '' ? false : this.survey.value.question1_7,
      question1_8: this.survey.value.question1_8 == '' ? false : this.survey.value.question1_8,

      question2_0: this.survey.value.question2_0 == '' ? false : this.survey.value.question2_0,
      question2_1: this.survey.value.question2_1 == '' ? false : this.survey.value.question2_1,
      question2_2: this.survey.value.question2_2 == '' ? false : this.survey.value.question2_2,
      question2_3: this.survey.value.question2_3 == '' ? false : this.survey.value.question2_3,

      question3_0: this.survey.value.question3_0 == '' ? false : this.survey.value.question3_0,
      question3_1: this.survey.value.question3_1 == '' ? false : this.survey.value.question3_1,
      question3_2: this.survey.value.question3_2 == '' ? false : this.survey.value.question3_2,

      question4: this.survey.value.question4,
      question5: this.survey.value.question5,
      question6: this.survey.value.question6,
      question7: this.survey.value.question7,
      question8: this.survey.value.question8,
      question9: this.survey.value.question9,
      question10: this.survey.value.question10,
      question11: this.survey.value.question11
    }

    const doc = this.firestore.doc<any>('surveys/' + this.auth.currentUserValue.uid);
    doc.set(surveyData, { merge: false });

    this.updateSuccess = true;
  }

  validate(): boolean {
    this.errorMessage = '';

    // Question 1: Make sure at least 1 is checked
    if (this.survey.value.question1_0 == '' && this.survey.value.question1_1 == '' && this.survey.value.question1_2 == '' && this.survey.value.question1_3 == '' && this.survey.value.question1_4 == '') {
      if(this.survey.value.question1_5 == '' && this.survey.value.question1_6 == '' && this.survey.value.question1_7 == '' && this.survey.value.question1_8 == '') {
        this.errorMessage = "Please select at least one region";
        return false;
      }
    }

    // Question 2: Make sure at least one is checked
    if (this.survey.value.question2_0 == '' && this.survey.value.question2_1 == '' && this.survey.value.question2_2 == '' && this.survey.value.question2_3 == '') {
      this.errorMessage = "Please select at least one degree of urbanization";
      return false;
    }

    // Question 3: Select at least one
    if (this.survey.value.question3_0 == '' && this.survey.value.question3_1 == '' && this.survey.value.question3_2 == '') {
      this.errorMessage = "Please select at least one college size";
      return false;
    }

    // Question 4: SAT score range 400-1600
    if (this.survey.value.question4 != '' && this.survey.value.question4 !== null && this.survey.value.question4 < 400 || this.survey.value.question4 > 1600) {
      this.errorMessage = "Invalid SAT Score";
      return false;
    }

    // Question 5: ACT score range 1-36
    if (this.survey.value.question5 != '' && this.survey.value.question5 !== null && this.survey.value.question5 < 1 || this.survey.value.question5 > 36) {
      this.errorMessage = "Invalid ACT Score";
      return false;
    }

    // Question 6: State
    if (this.survey.value.question6 == '') {
      this.errorMessage = "Please select a state";
      return false;
    }

    // Question 7: Max Cost
    if (this.survey.value.question7 == '' || this.survey.value.question7 == null) {
      this.errorMessage = "Please enter a max cost";
      return false;
    }

    // Question 8: College type
    if (this.survey.value.question8 == '' || this.survey.value.question8 == '0') {
      this.errorMessage = "Please enter a college type";
      return false;
    }

    // Question 9: Major
    if (this.survey.value.question9 == '' || this.survey.value.question9 == '0') {
      this.errorMessage = "Please enter a major";
      return false;
    }

    // Question 10: degree
    if (this.survey.value.question10 == '' || this.survey.value.question10 == '0') {
      this.errorMessage = "Please enter a degree type";
      return false;
    }

    // Question 11: Public/Private
    if (this.survey.value.question11 == '' || this.survey.value.question11 == '0') {
      this.errorMessage = "Please answer question 11";
      return false;
    }

    return true;
  }

  fillInSurvey() {

    const doc = this.firestore.doc<any>('surveys/' + this.auth.currentUserValue.uid);
    doc.valueChanges().subscribe( data => {
      if (data != null) {
        const formData: SurveyForm = data;
        this.survey.setValue({
          question1_0: formData.question1_0,
          question1_1: formData.question1_1,
          question1_2: formData.question1_2,
          question1_3: formData.question1_3,
          question1_4: formData.question1_4,
          question1_5: formData.question1_5,
          question1_6: formData.question1_6,
          question1_7: formData.question1_7,
          question1_8: formData.question1_8,
    
          question2_0: formData.question2_0,
          question2_1: formData.question2_1,
          question2_2: formData.question2_2,
          question2_3: formData.question2_3,
    
          question3_0: formData.question3_0,
          question3_1: formData.question3_1,
          question3_2: formData.question3_2,
    
          question4: formData.question4,
          question5: formData.question5,
          question6: formData.question6,
          question7: formData.question7,
          question8: formData.question8,
          question9: formData.question9,
          question10: formData.question10,
          question11: formData.question11,
        });
      }
    })
  }

}
