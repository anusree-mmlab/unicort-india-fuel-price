import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLayoutComponent } from './pre-layout.component';

describe('PreLayoutComponent', () => {
  let component: PreLayoutComponent;
  let fixture: ComponentFixture<PreLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
