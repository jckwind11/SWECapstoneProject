import { SchoolSearchResults } from './SchoolSearchResults';

export interface SearchResults {
    metadata: {
        page: number,
        total: number,
        per_page: number,
    };
    results: SchoolSearchResults[];
}