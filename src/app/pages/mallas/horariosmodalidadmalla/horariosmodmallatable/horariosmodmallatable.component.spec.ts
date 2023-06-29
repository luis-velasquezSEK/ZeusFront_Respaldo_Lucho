import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosmodmallatableComponent } from './horariosmodmallatable.component';

describe('HorariosmodmallatableComponent', () => {
  let component: HorariosmodmallatableComponent;
  let fixture: ComponentFixture<HorariosmodmallatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosmodmallatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosmodmallatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
