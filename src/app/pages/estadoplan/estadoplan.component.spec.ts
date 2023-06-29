import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoplanComponent } from './estadoplan.component';

describe('EstadoplanComponent', () => {
  let component: EstadoplanComponent;
  let fixture: ComponentFixture<EstadoplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
