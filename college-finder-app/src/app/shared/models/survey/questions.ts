import { Injectable, NgZone } from '@angular/core';
import { RecommendationHandler, SurveyForm } from './survey';

@Injectable({
    providedIn: 'root'
  })
export class SurveyQuestionHandler {

    question1: SurveyQuestion = {
        question: "What region do you prefer?",
        answerChoices: ["New England", "Mid East", "Great Lakes", "Plains", "Southeast", "Southwest", "Rocky Mountains", "Far West", "Outlying Areas (AS, FM, GU, MH, MP, PR, PW, VI)"],
        questionType: QuestionType.Checkbox
    }

    question2: SurveyQuestion = {
        question: "What degrees of urbanization would you like the college to be in?",
        answerChoices: ["City", "Suburb", "Town", "Rural"],
        questionType: QuestionType.Checkbox
    }

    question3: SurveyQuestion = {
        question: "What size college are you interested in?",
        answerChoices: ["Small (Less than 5,000)", "Medium (Between 5,000 and 15,000)", "Large (Greater than 15,000)"],
        questionType: QuestionType.Checkbox
    }
    
    question4: SurveyQuestion = {
        question: "What was your SAT score? (Leave blank if you don't have one)",
        questionType: QuestionType.Number
    }

    question5: SurveyQuestion = {
        question: "What was your ACT score? (Leave blank if you don't have one)",
        questionType: QuestionType.Number
    }

    question6: SurveyQuestion = {
        question: "What state are you located in? (Used for in-state tuition calculation)",
        questionType: QuestionType.Dropdown
    }

    question7: SurveyQuestion = {
        question: "What is the maximum cost you are you willing to pay per year? (In USD)",
        questionType: QuestionType.Number
    }

    question8: SurveyQuestion = {
        question: "What type of college are you looking for?",
        answerChoices: ["", "Co-ed", "Men Only", "Women Only"],
        questionType: QuestionType.Dropdown
    }

    question9: SurveyQuestion = {
        question: "What major are you interested in?",
        answerChoices: ["", "Other", "Engineering", "Education", "Legal", "Business_marketing", "Social Science", "Physical Science", "Agriculture", "Architecture"],
        questionType: QuestionType.Dropdown
    }

    question10: SurveyQuestion = {
        question: "What type of degree are you looking for?",
        answerChoices: ["", "Non-degree Granting", "Certificate Degree", "Associate Degree", "Bachelor's Degree", "Graduate Degree"],
        questionType: QuestionType.Dropdown
    }

    question11: SurveyQuestion = {
        question: "Would you like a Public or Private college?",
        answerChoices: ["", "Public", "Private", "Either"],
        questionType: QuestionType.Dropdown
    }

    allQuestions: SurveyQuestion[] = [this.question1, this.question2, this.question3, this.question4, this.question5, this.question6, this.question7, this.question8, this.question9, this.question10, this.question11];


    public getRecommendationHandler(surveyData: SurveyForm): RecommendationHandler {
        let recs: RecommendationHandler = null;

        return recs;
    }
}

export interface SurveyQuestion {
    question: String
    answerChoices?: String[];
    questionType: QuestionType
}

export enum QuestionType {
    Dropdown,
    Checkbox,
    Number
}