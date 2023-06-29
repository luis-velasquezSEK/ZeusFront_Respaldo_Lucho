import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentetableComponent } from './componentetable.component';

describe('ComponentetableComponent', () => {
  let component: ComponentetableComponent;
  let fixture: ComponentFixture<ComponentetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentetableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
