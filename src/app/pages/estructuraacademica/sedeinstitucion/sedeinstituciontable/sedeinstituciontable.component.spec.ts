import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeinstituciontableComponent } from './sedeinstituciontable.component';

describe('SedeinstituciontableComponent', () => {
  let component: SedeinstituciontableComponent;
  let fixture: ComponentFixture<SedeinstituciontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeinstituciontableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SedeinstituciontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
