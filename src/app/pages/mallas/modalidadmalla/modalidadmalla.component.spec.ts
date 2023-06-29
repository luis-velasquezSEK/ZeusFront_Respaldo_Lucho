import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadmallaComponent } from './modalidadmalla.component';

describe('ModalidadmallaComponent', () => {
  let component: ModalidadmallaComponent;
  let fixture: ComponentFixture<ModalidadmallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadmallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadmallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
