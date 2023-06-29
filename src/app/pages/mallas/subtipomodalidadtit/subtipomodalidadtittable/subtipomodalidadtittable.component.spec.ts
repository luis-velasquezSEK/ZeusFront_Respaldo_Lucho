import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtipomodalidadtittableComponent } from './subtipomodalidadtittable.component';

describe('SubtipomodalidadtittableComponent', () => {
  let component: SubtipomodalidadtittableComponent;
  let fixture: ComponentFixture<SubtipomodalidadtittableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtipomodalidadtittableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtipomodalidadtittableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
