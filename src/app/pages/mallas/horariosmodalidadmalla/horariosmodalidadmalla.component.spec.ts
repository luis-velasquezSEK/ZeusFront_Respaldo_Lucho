import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosmodalidadmallaComponent } from './horariosmodalidadmalla.component';

describe('HorariosmodalidadmallaComponent', () => {
  let component: HorariosmodalidadmallaComponent;
  let fixture: ComponentFixture<HorariosmodalidadmallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosmodalidadmallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosmodalidadmallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
