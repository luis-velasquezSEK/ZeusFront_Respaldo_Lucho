import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoperiodotableComponent } from './tipoperiodotable.component';

describe('TipoperiodotableComponent', () => {
  let component: TipoperiodotableComponent;
  let fixture: ComponentFixture<TipoperiodotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoperiodotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoperiodotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
