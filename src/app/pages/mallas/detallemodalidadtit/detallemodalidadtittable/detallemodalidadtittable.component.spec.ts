import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemodalidadtittableComponent } from './detallemodalidadtittable.component';

describe('DetallemodalidadtittableComponent', () => {
  let component: DetallemodalidadtittableComponent;
  let fixture: ComponentFixture<DetallemodalidadtittableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallemodalidadtittableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemodalidadtittableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
