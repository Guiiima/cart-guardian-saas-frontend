import { TestBed } from '@angular/core/testing';
import { ShopifyAuthService } from '@core/services/shopifyAuth';

describe('Sessiontoken', () => {
  let service: ShopifyAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopifyAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
