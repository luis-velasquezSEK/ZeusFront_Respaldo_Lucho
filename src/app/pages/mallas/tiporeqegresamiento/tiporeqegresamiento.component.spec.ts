import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiporeqegresamientoComponent } from './tiporeqegresamiento.component';

describe('TiporeqegresamientoComponent', () => {
  let component: TiporeqegresamientoComponent;
  let fixture: ComponentFixture<TiporeqegresamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiporeqegresamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiporeqegresamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
