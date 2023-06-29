import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioFechaComponent } from './horario-fecha.component';

describe('HorarioFechaComponent', () => {
  let component: HorarioFechaComponent;
  let fixture: ComponentFixture<HorarioFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioFechaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
