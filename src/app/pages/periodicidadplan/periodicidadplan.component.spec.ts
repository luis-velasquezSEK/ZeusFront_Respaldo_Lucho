import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicidadplanComponent } from './periodicidadplan.component';

describe('PeriodicidadplanComponent', () => {
  let component: PeriodicidadplanComponent;
  let fixture: ComponentFixture<PeriodicidadplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicidadplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicidadplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
