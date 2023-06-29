import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadomallaComponent } from './estadomalla.component';

describe('EstadomallaComponent', () => {
  let component: EstadomallaComponent;
  let fixture: ComponentFixture<EstadomallaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadomallaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadomallaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
