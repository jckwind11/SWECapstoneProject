import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userData: any;

  constructor(public authService: AuthService) { 
    this.userData = JSON.parse(localStorage.getItem('userData') || '');
  }

  ngOnInit(): void {
  }

}
