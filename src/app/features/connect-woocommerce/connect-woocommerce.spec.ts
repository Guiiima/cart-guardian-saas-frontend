import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWoocommerce } from './connect-woocommerce';

describe('ConnectWoocommerce', () => {
  let component: ConnectWoocommerce;
  let fixture: ComponentFixture<ConnectWoocommerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectWoocommerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectWoocommerce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
