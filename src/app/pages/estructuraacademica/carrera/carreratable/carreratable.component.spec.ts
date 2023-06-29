import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreratableComponent } from './carreratable.component';

describe('CarreratableComponent', () => {
  let component: CarreratableComponent;
  let fixture: ComponentFixture<CarreratableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarreratableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreratableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
