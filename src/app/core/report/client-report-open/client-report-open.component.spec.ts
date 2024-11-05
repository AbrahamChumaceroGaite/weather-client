import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReportOpenComponent } from './client-report-open.component';

describe('ClientReportOpenComponent', () => {
  let component: ClientReportOpenComponent;
  let fixture: ComponentFixture<ClientReportOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientReportOpenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReportOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
