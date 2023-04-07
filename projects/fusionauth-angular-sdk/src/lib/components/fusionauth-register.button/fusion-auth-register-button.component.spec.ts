import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionAuthRegisterButtonComponent } from './fusion-auth-register-button.component';
import { FusionAuthService } from '../../fusion-auth.service';

describe('FusionauthRegisterButtonComponent', () => {
  let component: FusionAuthRegisterButtonComponent;
  let fixture: ComponentFixture<FusionAuthRegisterButtonComponent>;
  let mockService = jasmine.createSpyObj('FusionAuthService', ['startRegistration'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FusionAuthRegisterButtonComponent ],
      providers: [
        { provide: FusionAuthService, useValue: mockService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FusionAuthRegisterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.register();
    expect(mockService.startRegistration).toHaveBeenCalled();
  });
});
