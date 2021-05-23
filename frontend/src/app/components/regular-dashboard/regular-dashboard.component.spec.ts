import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularDashboardComponent } from './regular-dashboard.component';

describe('RegularDashboardComponent', () => {
  let component: RegularDashboardComponent;
  let fixture: ComponentFixture<RegularDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
