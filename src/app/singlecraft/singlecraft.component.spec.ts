import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecraftComponent } from './singlecraft.component';

describe('SinglecraftComponent', () => {
  let component: SinglecraftComponent;
  let fixture: ComponentFixture<SinglecraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglecraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglecraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
