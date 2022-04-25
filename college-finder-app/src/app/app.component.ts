import { Component } from '@angular/core';
import { User } from './shared/models/user';
import { AuthService } from "./shared/services/auth.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'College Finder';
  currentUser: User;


  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    this.authService.signOut()
  }
}
