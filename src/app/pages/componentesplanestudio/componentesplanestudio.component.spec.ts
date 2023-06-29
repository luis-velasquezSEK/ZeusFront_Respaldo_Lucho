import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentesplanestudioComponent } from './componentesplanestudio.component';

describe('ComponentesplanestudioComponent', () => {
  let component: ComponentesplanestudioComponent;
  let fixture: ComponentFixture<ComponentesplanestudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentesplanestudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentesplanestudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
