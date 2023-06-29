import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaprincipalComponent } from './materiaprincipal.component';

describe('MateriaprincipalComponent', () => {
  let component: MateriaprincipalComponent;
  let fixture: ComponentFixture<MateriaprincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriaprincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
