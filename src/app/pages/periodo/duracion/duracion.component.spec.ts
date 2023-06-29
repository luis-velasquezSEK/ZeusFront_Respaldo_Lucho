import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuracionComponent } from './duracion.component';

describe('DuracionComponent', () => {
  let component: DuracionComponent;
  let fixture: ComponentFixture<DuracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
