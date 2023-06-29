import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoperiodoComponent } from './estadoperiodo.component';

describe('EstadoperiodoComponent', () => {
  let component: EstadoperiodoComponent;
  let fixture: ComponentFixture<EstadoperiodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoperiodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoperiodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
