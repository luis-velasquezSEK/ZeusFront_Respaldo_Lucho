import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadtittableComponent } from './modalidadtittable.component';

describe('ModalidadtittableComponent', () => {
  let component: ModalidadtittableComponent;
  let fixture: ComponentFixture<ModalidadtittableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadtittableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadtittableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
