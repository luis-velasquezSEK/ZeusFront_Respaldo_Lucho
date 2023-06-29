import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucioneducativaComponent } from './institucioneducativa.component';

describe('InstitucioneducativaComponent', () => {
  let component: InstitucioneducativaComponent;
  let fixture: ComponentFixture<InstitucioneducativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitucioneducativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucioneducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
