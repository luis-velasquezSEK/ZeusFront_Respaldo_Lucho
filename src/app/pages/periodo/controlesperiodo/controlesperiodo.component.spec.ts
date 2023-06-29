import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlesperiodoComponent } from './controlesperiodo.component';

describe('ControlesperiodoComponent', () => {
  let component: ControlesperiodoComponent;
  let fixture: ComponentFixture<ControlesperiodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlesperiodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlesperiodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
