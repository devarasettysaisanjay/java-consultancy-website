import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSupportComponent } from './interview-support.component';

describe('InterviewSupportComponent', () => {
  let component: InterviewSupportComponent;
  let fixture: ComponentFixture<InterviewSupportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewSupportComponent]
    });
    fixture = TestBed.createComponent(InterviewSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
