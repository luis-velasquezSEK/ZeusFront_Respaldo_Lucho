import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroempleadotableComponent } from './registroempleadotable.component';

describe('RegistroempleadotableComponent', () => {
  let component: RegistroempleadotableComponent;
  let fixture: ComponentFixture<RegistroempleadotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroempleadotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroempleadotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
