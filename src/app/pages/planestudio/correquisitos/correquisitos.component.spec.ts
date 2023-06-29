import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrequisitosComponent } from './correquisitos.component';

describe('CorrequisitosComponent', () => {
  let component: CorrequisitosComponent;
  let fixture: ComponentFixture<CorrequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrequisitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
