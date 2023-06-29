import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelestudioComponent } from './nivelestudio.component';

describe('NivelestudioComponent', () => {
  let component: NivelestudioComponent;
  let fixture: ComponentFixture<NivelestudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelestudioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelestudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
