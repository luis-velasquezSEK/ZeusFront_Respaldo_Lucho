import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomodalidadtitComponent } from './tipomodalidadtit.component';

describe('TipomodalidadtitComponent', () => {
  let component: TipomodalidadtitComponent;
  let fixture: ComponentFixture<TipomodalidadtitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipomodalidadtitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomodalidadtitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
