import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelespaoComponent } from './nivelespao.component';

describe('NivelespaoComponent', () => {
  let component: NivelespaoComponent;
  let fixture: ComponentFixture<NivelespaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelespaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelespaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
