import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationpostComponent } from './notificationpost.component';

describe('NotificationpostComponent', () => {
  let component: NotificationpostComponent;
  let fixture: ComponentFixture<NotificationpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
