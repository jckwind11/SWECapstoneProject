import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { SurveyQuestion, SurveyQuestionHandler, QuestionType } from 'src/app/shared/models/survey/questions';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  allQuestions: SurveyQuestion[];
  QuestionType = QuestionType;
  errorMessage: string = '';
  updateSuccess: boolean = false;

  // Question 1: Region
  question1_0 = '';
  question1_1 = '';
  question1_2 = '';
  question1_3 = '';
  question1_4 = '';
  question1_5 = '';
  question1_6 = '';
  question1_7 = '';
  question1_8 = '';

  // Question 2: Urbanization
  question2_0 = '';
  question2_1 = '';
  question2_2 = '';
  question2_3 = '';

  // Question 3: Size 
  question3_0 = '';
  question3_1 = '';
  question3_2 = '';

  // Question 4: SAT
  question4 = null;

  // Question 5:  ACT
  question5 = null;

  // Question 6: State
  question6 = '';

  // Question 7: Max Cost
  question7 = 0;

  // Question 8: College type (Co-ed, etc.)
  question8 = 0;

  // Question 9:  Major
  question9 = 0;

  // Question 10: Degree
  question10 = 0;

  // Question 11: Public or private
  question11 = 0;

  constructor(
    public authService: AuthService, 
    public questionHandler: SurveyQuestionHandler
  ) { 

    this.allQuestions = questionHandler.allQuestions;
  }

  ngOnInit(): void {
  }

  saveSurvey(f: NgForm) {
    console.log(f.value);
    if (!this.validate(f)) {
      console.log('form not valid')
      return
    }

    console.log('form IS valid')
    // Handle form submission
  }

  validate(f: NgForm): boolean {
    this.errorMessage = '';

    console.log(f.value.question1_0);
    // Question 1: Make sure at least 1 is checked
    if (f.value.question1_0 == '' && f.value.question1_1 == '' && f.value.question1_2 == '' && f.value.question1_3 == '' && f.value.question1_4 == '') {
      if(f.value.question1_5 == '' && f.value.question1_6 == '' && f.value.question1_7 == '' && f.value.question1_8 == '') {
        this.errorMessage = "Please select at least one region";
        return false;
      }
    }

    // Question 2: Make sure at least one is checked
    if (f.value.question2_0 == '' && f.value.question2_1 == '' && f.value.question2_2 == '' && f.value.question2_3 == '') {
      this.errorMessage = "Please select at least one degree of urbanization";
      return false;
    }

    // Question 3: Select at least one
    if (f.value.question3_0 == '' && f.value.question3_1 == '' && f.value.question3_2 == '') {
      this.errorMessage = "Please select at least one college size";
      return false;
    }

    // Question 4: SAT score range 400-1600
    if (f.value.question4 != '' && f.value.question4 !== null && f.value.question4 < 400 || f.value.question4 > 1600) {
      this.errorMessage = "Invalid SAT Score";
      return false;
    }

    // Question 5: ACT score range 1-36
    if (f.value.question5 != '' && f.value.question5 !== null && f.value.question5 < 1 || f.value.question5 > 36) {
      this.errorMessage = "Invalid ACT Score";
      return false;
    }

    // Question 6: State
    if (f.value.question6 == '') {
      this.errorMessage = "Please select a state";
      return false;
    }

    // Question 7: Max Cost
    if (f.value.question7 == '' || f.value.question7 == null) {
      this.errorMessage = "Please enter a max cost";
      return false;
    }

    // Question 8: College type
    if (f.value.question8 == '' || f.value.question8 == '0') {
      this.errorMessage = "Please enter a college type";
      return false;
    }

    // Question 9: Major
    if (f.value.question9 == '' || f.value.question9 == '0') {
      this.errorMessage = "Please enter a major";
      return false;
    }

    // Question 10: degree
    if (f.value.question10 == '' || f.value.question10 == '0') {
      this.errorMessage = "Please enter a degree type";
      return false;
    }

    // Question 11: Public/Private
    if (f.value.question11 == '' || f.value.question11 == '0') {
      this.errorMessage = "Please answer question 11";
      return false;
    }

    return true;
  }
}
