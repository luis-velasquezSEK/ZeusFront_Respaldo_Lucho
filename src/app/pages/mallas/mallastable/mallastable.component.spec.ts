import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallastableComponent } from './mallastable.component';

describe('MallastableComponent', () => {
  let component: MallastableComponent;
  let fixture: ComponentFixture<MallastableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallastableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MallastableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
