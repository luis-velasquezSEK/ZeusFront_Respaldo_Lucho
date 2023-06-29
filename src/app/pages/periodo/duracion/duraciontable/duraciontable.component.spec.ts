import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuraciontableComponent } from './duraciontable.component';

describe('DuraciontableComponent', () => {
  let component: DuraciontableComponent;
  let fixture: ComponentFixture<DuraciontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuraciontableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuraciontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
