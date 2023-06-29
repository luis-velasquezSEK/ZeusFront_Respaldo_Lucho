import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqegresamientotableComponent } from './reqegresamientotable.component';

describe('ReqegresamientotableComponent', () => {
  let component: ReqegresamientotableComponent;
  let fixture: ComponentFixture<ReqegresamientotableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqegresamientotableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqegresamientotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
