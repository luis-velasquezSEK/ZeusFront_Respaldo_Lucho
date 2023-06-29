import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoplantableComponent } from './tipoplantable.component';

describe('TipoplantableComponent', () => {
  let component: TipoplantableComponent;
  let fixture: ComponentFixture<TipoplantableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoplantableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoplantableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
