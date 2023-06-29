import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucioneducativatableComponent } from './institucioneducativatable.component';

describe('InstitucioneducativatableComponent', () => {
  let component: InstitucioneducativatableComponent;
  let fixture: ComponentFixture<InstitucioneducativatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitucioneducativatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucioneducativatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
