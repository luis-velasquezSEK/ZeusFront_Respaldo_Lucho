import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoperiodoComponent } from './tipoperiodo.component';

describe('TipoperiodoComponent', () => {
  let component: TipoperiodoComponent;
  let fixture: ComponentFixture<TipoperiodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoperiodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoperiodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
