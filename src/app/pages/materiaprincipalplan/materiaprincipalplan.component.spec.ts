import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaprincipalplanComponent } from './materiaprincipalplan.component';

describe('MateriaprincipalplanComponent', () => {
  let component: MateriaprincipalplanComponent;
  let fixture: ComponentFixture<MateriaprincipalplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MateriaprincipalplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaprincipalplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
