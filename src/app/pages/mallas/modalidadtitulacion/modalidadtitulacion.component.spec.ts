import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadtitulacionComponent } from './modalidadtitulacion.component';

describe('ModalidadtitulacionComponent', () => {
  let component: ModalidadtitulacionComponent;
  let fixture: ComponentFixture<ModalidadtitulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadtitulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadtitulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
