import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtipomodalidadtitComponent } from './subtipomodalidadtit.component';

describe('SubtipomodalidadtitComponent', () => {
  let component: SubtipomodalidadtitComponent;
  let fixture: ComponentFixture<SubtipomodalidadtitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtipomodalidadtitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtipomodalidadtitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
