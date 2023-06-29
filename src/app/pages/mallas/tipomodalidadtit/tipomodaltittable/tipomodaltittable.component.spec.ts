import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomodaltittableComponent } from './tipomodaltittable.component';

describe('TipomodaltittableComponent', () => {
  let component: TipomodaltittableComponent;
  let fixture: ComponentFixture<TipomodaltittableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipomodaltittableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomodaltittableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
