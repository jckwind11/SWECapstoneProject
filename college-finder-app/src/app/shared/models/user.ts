import { UserData } from './userData';

export interface User {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    data: UserData;
}
