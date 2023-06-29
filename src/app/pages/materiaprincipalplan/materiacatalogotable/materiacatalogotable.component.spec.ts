import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriacatalogotableComponent } from './materiacatalogotable.component';

describe('MateriacatalogotableComponent', () => {
  let component: MateriacatalogotableComponent;
  let fixture: ComponentFixture<MateriacatalogotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriacatalogotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriacatalogotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
