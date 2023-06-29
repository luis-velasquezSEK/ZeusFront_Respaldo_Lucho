import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampustableComponent } from './campustable.component';

describe('CampustableComponent', () => {
  let component: CampustableComponent;
  let fixture: ComponentFixture<CampustableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampustableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampustableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
