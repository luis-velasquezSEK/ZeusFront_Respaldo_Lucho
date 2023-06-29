import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallacurrilularComponent } from './mallacurrilular.component';

describe('MallacurrilularComponent', () => {
  let component: MallacurrilularComponent;
  let fixture: ComponentFixture<MallacurrilularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallacurrilularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MallacurrilularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
