import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadomodalidadmallatableComponent } from './estadomodalidadmallatable.component';

describe('EstadomodalidadmallatableComponent', () => {
  let component: EstadomodalidadmallatableComponent;
  let fixture: ComponentFixture<EstadomodalidadmallatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadomodalidadmallatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadomodalidadmallatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
