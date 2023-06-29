import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallemodalidadtitComponent } from './detallemodalidadtit.component';

describe('DetallemodalidadtitComponent', () => {
  let component: DetallemodalidadtitComponent;
  let fixture: ComponentFixture<DetallemodalidadtitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallemodalidadtitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallemodalidadtitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
