import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployFormComponent } from './deploy-form.component';

describe('DeployFormComponent', () => {
  let component: DeployFormComponent;
  let fixture: ComponentFixture<DeployFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
