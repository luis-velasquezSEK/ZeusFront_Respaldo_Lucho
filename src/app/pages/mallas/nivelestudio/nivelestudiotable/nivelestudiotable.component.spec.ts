import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelestudiotableComponent } from './nivelestudiotable.component';

describe('NivelestudiotableComponent', () => {
  let component: NivelestudiotableComponent;
  let fixture: ComponentFixture<NivelestudiotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelestudiotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelestudiotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
