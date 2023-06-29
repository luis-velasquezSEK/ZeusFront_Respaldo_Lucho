import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlperiodotableComponent } from './controlperiodotable.component';

describe('ControlperiodotableComponent', () => {
  let component: ControlperiodotableComponent;
  let fixture: ComponentFixture<ControlperiodotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlperiodotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlperiodotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
