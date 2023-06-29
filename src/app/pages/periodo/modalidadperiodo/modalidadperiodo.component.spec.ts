import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadperiodoComponent } from './modalidadperiodo.component';

describe('ModalidadperiodoComponent', () => {
  let component: ModalidadperiodoComponent;
  let fixture: ComponentFixture<ModalidadperiodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadperiodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadperiodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
