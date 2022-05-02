import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-college-info',
  templateUrl: './college-info.component.html',
  styleUrls: ['./college-info.component.css']
})
export class CollegeInfoComponent implements OnInit {

  private id: string;

  constructor(private route: ActivatedRoute) { 
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    console.log(this.id);
  }

}
