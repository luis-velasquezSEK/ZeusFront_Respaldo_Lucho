import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrequisitostableComponent } from './correquisitostable.component';

describe('CorrequisitostableComponent', () => {
  let component: CorrequisitostableComponent;
  let fixture: ComponentFixture<CorrequisitostableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrequisitostableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrequisitostableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
