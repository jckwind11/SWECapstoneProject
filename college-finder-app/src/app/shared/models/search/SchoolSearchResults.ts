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
    "latest.school.degree_urbanization"? : number;
    "latest.school.ownership"?: number;
    "latest.school.degrees_awarded.predominant"?: number;
    "latest.school.degrees_awarded.highest"?: number;
    "latest.student.size": number;
    "latest.student.demographics.men": number;
    "latest.student.demographics.women": number;
    "latest.cost.avg_net_price.overall": number;

}