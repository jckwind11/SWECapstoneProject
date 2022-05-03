export interface SchoolSearchResults {
    "id": number;
    "latest.admissions.admission_rate.overall"?: number;
    "latest.school.zip": number;
    "latest.school.city": string;
    "latest.school.name": string;
    "latest.school.alias": string;
    "latest.school.state": string;
    "latest.school.school_url": string;
    "latest.school.price_calculator_url"?: string;
    "latest.school.locale"?: number;
    "latest.school.ownership"?: number;
    "latest.student.size"?: number;
    "latest.school.degrees_awarded.predominant"?: number;
    "latest.school.degrees_awarded.highest"?: number;
    "latest.student.enrollment.undergrad_12_month"?: number;
    "latest.student.enrollment.grad_12_month"?: number;
    "latest.student.demographics.men": number;
    "latest.student.demographics.women": number;
    "latest.student.demographics.age_entry"?: number;
    "latest.student.demographics.first_generation"?: number;
    "latest.student.demographics.median_hh_income"?: number;
    "latest.student.demographics.race_ethnicity"?: Object;
    "latest.school.accreditor": string;
    "latest.cost.avg_net_price.overall": number;
    "latest.cost.tuition.in_state"?: number;
    "latest.cost.tuition.out_of_state"?: number;
    "latest.aid.students_with_any_loan"?: number;
    "latest.student.retention_rate.overall.full_time"?: number;
    "latest.aid.loan_principal"?: number;

}