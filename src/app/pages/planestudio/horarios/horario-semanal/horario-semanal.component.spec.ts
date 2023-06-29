import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioSemanalComponent } from './horario-semanal.component';

describe('HorarioSemanalComponent', () => {
  let component: HorarioSemanalComponent;
  let fixture: ComponentFixture<HorarioSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioSemanalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
