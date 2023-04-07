import { Component, Input } from '@angular/core';
import { FusionAuthService } from "../../fusion-auth.service";

@Component({
  selector: 'fa-register',
  templateUrl: './fusion-auth-register-button.component.html',
  styleUrls: ['./fusion-auth-register-button.component.scss']
})
export class FusionAuthRegisterButtonComponent {
  @Input() state: string | undefined;
  constructor(
    private fusionAuth: FusionAuthService,
  ) {}

  register() {
    if (!this.state) {
      this.fusionAuth.startRegistration();
    } else {
      this.fusionAuth.startRegistration(this.state);
    }
  }
}
