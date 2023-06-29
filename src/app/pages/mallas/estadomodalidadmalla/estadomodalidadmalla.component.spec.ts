import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadomodalidadmallaComponent } from './estadomodalidadmalla.component';

describe('EstadomodalidadmallaComponent', () => {
  let component: EstadomodalidadmallaComponent;
  let fixture: ComponentFixture<EstadomodalidadmallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadomodalidadmallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadomodalidadmallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
