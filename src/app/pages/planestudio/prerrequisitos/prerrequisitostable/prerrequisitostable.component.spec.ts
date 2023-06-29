import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerrequisitostableComponent } from './prerrequisitostable.component';

describe('PrerrequisitostableComponent', () => {
  let component: PrerrequisitostableComponent;
  let fixture: ComponentFixture<PrerrequisitostableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrerrequisitostableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrerrequisitostableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
