import { Injectable, NgZone } from '@angular/core';
import { AuthError } from 'firebase/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(public snackBar: MatSnackBar,
        private zone: NgZone) { }

    public showNotif(error: any, action = 'error', duration = 4000): void {
        // consider not using zone. However, the snackbar is know not to work outside it.
        // zone is a built in service that allows running async tasks that don't require UI updates.
        const err: AuthError = error;
        const message = this.convertMessage(err.code);
        this.zone.run(() => {
            this.snackBar.open(message, action, { duration });
        });
    }

    private convertMessage(code: string): string {
        switch (code) {
            case "auth/account-exists-with-different-credential":
            case "auth/email-already-in-use":
                return "Email already used. Go to login page";
            case "auth/wrong-password":
                return "Wrong email or password";
            case "auth/user-not-found":
                return "No user found with this email";
            case "auth/user-disabled":
                return "User disabled";
            case "auth/too-many-requests":
                return "Too many requests to log into this account";
            case "auth/operation-not-allowed":
                return "Server error, please try again later";
            case "auth/invalid-email":
                return "Email address is invalid";
            case "auth/network-request-failed":
                return "There was a connection issue"
            default:
                return "Login failed. Please try again";
        }
    }
}