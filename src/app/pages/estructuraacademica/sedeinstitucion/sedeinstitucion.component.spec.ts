import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeinstitucionComponent } from './sedeinstitucion.component';

describe('SedeinstitucionComponent', () => {
  let component: SedeinstitucionComponent;
  let fixture: ComponentFixture<SedeinstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeinstitucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SedeinstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
