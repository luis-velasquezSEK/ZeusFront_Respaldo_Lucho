import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadpertableComponent } from './modalidadpertable.component';

describe('ModalidadpertableComponent', () => {
  let component: ModalidadpertableComponent;
  let fixture: ComponentFixture<ModalidadpertableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadpertableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadpertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
