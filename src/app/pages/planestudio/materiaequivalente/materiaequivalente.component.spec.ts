import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaequivalenteComponent } from './materiaequivalente.component';

describe('MateriaequivalenteComponent', () => {
  let component: MateriaequivalenteComponent;
  let fixture: ComponentFixture<MateriaequivalenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriaequivalenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaequivalenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
