import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadmallatableComponent } from './modalidadmallatable.component';

describe('ModalidadmallatableComponent', () => {
  let component: ModalidadmallatableComponent;
  let fixture: ComponentFixture<ModalidadmallatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadmallatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadmallatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
