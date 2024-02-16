import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportComponent } from './customersupport.component';

describe('CustomersupportComponent', () => {
  let component: CustomerSupportComponent;
  let fixture: ComponentFixture<CustomerSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
