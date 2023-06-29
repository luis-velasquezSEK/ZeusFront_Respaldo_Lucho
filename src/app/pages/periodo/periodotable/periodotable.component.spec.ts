import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodotableComponent } from './periodotable.component';

describe('PeriodotableComponent', () => {
  let component: PeriodotableComponent;
  let fixture: ComponentFixture<PeriodotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
