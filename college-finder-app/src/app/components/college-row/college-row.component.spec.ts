import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeRowComponent } from './college-row.component';

describe('CollegeRowComponent', () => {
  let component: CollegeRowComponent;
  let fixture: ComponentFixture<CollegeRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
