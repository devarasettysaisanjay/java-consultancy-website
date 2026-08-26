import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatagentComponent } from './chatagent.component';

describe('ChatagentComponent', () => {
  let component: ChatagentComponent;
  let fixture: ComponentFixture<ChatagentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatagentComponent]
    });
    fixture = TestBed.createComponent(ChatagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
