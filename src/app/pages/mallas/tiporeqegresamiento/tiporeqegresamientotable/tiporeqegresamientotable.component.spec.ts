import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiporeqegresamientotableComponent } from './tiporeqegresamientotable.component';

describe('TiporeqegresamientotableComponent', () => {
  let component: TiporeqegresamientotableComponent;
  let fixture: ComponentFixture<TiporeqegresamientotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiporeqegresamientotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiporeqegresamientotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
