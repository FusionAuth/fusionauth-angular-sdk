import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionAuthLoginButtonComponent } from './fusion-auth-login-button.component';
import { FusionAuthService } from '../../fusion-auth.service';

describe('FusionauthLoginButtonComponent', () => {
  let component: FusionAuthLoginButtonComponent;
  let fixture: ComponentFixture<FusionAuthLoginButtonComponent>;
  let mockService = jasmine.createSpyObj('FusionAuthService', ['startLogin'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FusionAuthLoginButtonComponent ],
      providers: [
        { provide: FusionAuthService, useValue: mockService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FusionAuthLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.login();
    expect(mockService.startLogin).toHaveBeenCalled();
  });
});
