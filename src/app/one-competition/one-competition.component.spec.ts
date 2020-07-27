import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCompetitionComponent } from './one-competition.component';

describe('OneCompetitionComponent', () => {
  let component: OneCompetitionComponent;
  let fixture: ComponentFixture<OneCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
