import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadopertableComponent } from './estadopertable.component';

describe('EstadopertableComponent', () => {
  let component: EstadopertableComponent;
  let fixture: ComponentFixture<EstadopertableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadopertableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadopertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
