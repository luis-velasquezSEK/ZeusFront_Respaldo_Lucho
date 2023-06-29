import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriacompartidaComponent } from './materiacompartida.component';

describe('MateriacompartidaComponent', () => {
  let component: MateriacompartidaComponent;
  let fixture: ComponentFixture<MateriacompartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriacompartidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriacompartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
