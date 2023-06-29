import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoplanComponent } from './tipoplan.component';

describe('TipoplanComponent', () => {
  let component: TipoplanComponent;
  let fixture: ComponentFixture<TipoplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
