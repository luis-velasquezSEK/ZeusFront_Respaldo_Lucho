import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqegresamientoComponent } from './reqegresamiento.component';

describe('ReqegresamientoComponent', () => {
  let component: ReqegresamientoComponent;
  let fixture: ComponentFixture<ReqegresamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqegresamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqegresamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
