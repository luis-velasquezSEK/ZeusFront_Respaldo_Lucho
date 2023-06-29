import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelespaotableComponent } from './nivelespaotable.component';

describe('NivelespaotableComponent', () => {
  let component: NivelespaotableComponent;
  let fixture: ComponentFixture<NivelespaotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelespaotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelespaotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
