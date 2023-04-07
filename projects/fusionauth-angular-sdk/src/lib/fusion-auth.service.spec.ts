import { TestBed } from '@angular/core/testing';

import { FusionAuthService } from './fusion-auth.service';

describe('FusionAuthService', () => {
  let service: FusionAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new FusionAuthService({
      clientId: 'e9fdb985-9173-4e01-9d73-ac2d60d1dc8e',
      serverUrl: 'http://localhost:9011'
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
