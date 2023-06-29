import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioModularComponent } from './horario-modular.component';

describe('HorarioModularComponent', () => {
  let component: HorarioModularComponent;
  let fixture: ComponentFixture<HorarioModularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorarioModularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioModularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
