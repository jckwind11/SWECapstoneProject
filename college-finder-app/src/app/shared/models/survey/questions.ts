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
        // RegionIds
        let regionIds: number[] = [];
        if (surveyData.question1_0) regionIds.push(1);
        if (surveyData.question1_1) regionIds.push(2);
        if (surveyData.question1_2) regionIds.push(3);
        if (surveyData.question1_3) regionIds.push(4);
        if (surveyData.question1_4) regionIds.push(5);
        if (surveyData.question1_5) regionIds.push(6);
        if (surveyData.question1_6) regionIds.push(7);
        if (surveyData.question1_7) regionIds.push(8);

        // LocaleIds
        let localeIds: number[] = [];
        if (surveyData.question2_0) localeIds = [...localeIds, 11, 12, 13];
        if (surveyData.question2_1) localeIds = [...localeIds, 21, 22, 23];
        if (surveyData.question2_2) localeIds = [...localeIds, 31, 32, 33];
        if (surveyData.question2_3) localeIds = [...localeIds, 41, 42, 43];
        
        // Cost Range
        const costRange = `..${surveyData.question7}`;

        // Student Size Range
        let min = 0;
        let max = null;
        if (surveyData.question3_0 && surveyData.question3_1 && surveyData.question3_2) {
            // Do nothing
        }
        else if (surveyData.question3_0 && surveyData.question3_1) {
            max = 15000;
        }
        else if (surveyData.question3_1 && surveyData.question3_2) {
            min = 5000;
        }
        else if (surveyData.question3_0 && surveyData.question3_2) {
            // Going to need to filter after query
            min = null;
            max = null;
        }
        else if (surveyData.question3_0) {
            max = 5000;
        }
        else if (surveyData.question3_1) {
            min = 5000;
            max = 15000;
        }
        else {
            min = 15000;
        }

        let sizeRange: string = '';
        if (min != null && max != null) {
            sizeRange = `${min}..${max}`;
        }
        else if (max == null) {
            sizeRange = `${min}..`;
        }
        else {
            sizeRange = 'FILTER'
        }


        // Men/Women only
        let menOnly = 0;
        let womenOnly = 0;
        if (surveyData.question8 == '2') {
            menOnly = 1;
        }
        else if (surveyData.question8 == '3') {
            womenOnly = 1;
        }

        // Ownership Ids
        let ownerShipIds: number[] = [];
        if (surveyData.question11 == '3') ownerShipIds = [...ownerShipIds, 1, 2, 3];
        else if (surveyData.question11 == '2') ownerShipIds = [...ownerShipIds, 2, 3];
        else if (surveyData.question11 == '1') ownerShipIds = [...ownerShipIds, 1];

        // Degree Ids
        let degreeIds: number[] = [];
        if (surveyData.question10 == '5') degreeIds = [...degreeIds, 4, 3];
        else if (surveyData.question10 == '4') degreeIds = [...degreeIds, 3, 2];
        else if (surveyData.question10 == '3') degreeIds = [...degreeIds, 2];
        else if (surveyData.question10 == '2') degreeIds = [...degreeIds, 1];
        else if (surveyData.question10 == '1') degreeIds = [...degreeIds, 0];

        // SAT/ACT Scores
        let sat = null;
        let act = null;
        if (surveyData.question4 != null) {
            sat = `..${surveyData.question4 + 200}`;
        }
        if (surveyData.question5 != null) {
            act = `..${surveyData.question5 + 4}`;
        } 

        const recs: RecommendationHandler = {
            regionIds: regionIds,
            localeIds: localeIds,
            costRange: costRange,
            studentSizeRange: sizeRange,
            menOnly: menOnly,
            womenOnly: womenOnly,
            ownershipIds: ownerShipIds,
            degreeIds: degreeIds,
            satScoreRange: sat,
            actScoreRange: act
        }
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