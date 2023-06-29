import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadomallatableComponent } from './estadomallatable.component';

describe('EstadomallatableComponent', () => {
  let component: EstadomallatableComponent;
  let fixture: ComponentFixture<EstadomallatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadomallatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadomallatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
