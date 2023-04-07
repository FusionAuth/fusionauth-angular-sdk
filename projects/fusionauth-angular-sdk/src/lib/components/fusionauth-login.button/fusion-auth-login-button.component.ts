import { Component, Input } from '@angular/core';
import { FusionAuthService } from '../../fusion-auth.service';

@Component({
  selector: 'fa-login',
  templateUrl: './fusion-auth-login-button.component.html',
  styleUrls: ['./fusion-auth-login-button.component.scss']
})
export class FusionAuthLoginButtonComponent {
  @Input() state: string | undefined;

  constructor(private fusionAuth: FusionAuthService) {}

  async login() {
    if (!this.state) {
      await this.fusionAuth.startLogin();
    } else {
      await this.fusionAuth.startLogin(this.state);
    }

  }
}
