import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadtableComponent } from './modalidadtable.component';

describe('ModalidadtableComponent', () => {
  let component: ModalidadtableComponent;
  let fixture: ComponentFixture<ModalidadtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadtableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
