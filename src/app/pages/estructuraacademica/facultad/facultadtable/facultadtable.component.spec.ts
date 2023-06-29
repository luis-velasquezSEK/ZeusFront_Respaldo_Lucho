import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultadtableComponent } from './facultadtable.component';

describe('FacultadtableComponent', () => {
  let component: FacultadtableComponent;
  let fixture: ComponentFixture<FacultadtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultadtableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultadtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
