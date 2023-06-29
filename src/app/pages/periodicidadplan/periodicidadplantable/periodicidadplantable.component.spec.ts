import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicidadplantableComponent } from './periodicidadplantable.component';

describe('PeriodicidadplantableComponent', () => {
  let component: PeriodicidadplantableComponent;
  let fixture: ComponentFixture<PeriodicidadplantableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicidadplantableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicidadplantableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
