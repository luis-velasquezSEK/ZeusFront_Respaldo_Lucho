import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoplantableComponent } from './estadoplantable.component';

describe('EstadoplantableComponent', () => {
  let component: EstadoplantableComponent;
  let fixture: ComponentFixture<EstadoplantableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoplantableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoplantableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
