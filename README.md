An SDK for using FusionAuth in Angular applications.

# Table of Contents

-   [Overview](#overview)

-   [Getting Started](#getting-started)

  -   [Installation](#installation)

  -   [Server Code Requirements](#server-code-requirements)

-   [Usage](#usage)

  -   [Pre-built buttons](#pre-built-buttons)

  -   [Service usage](#service-usage)

  -   [Known issues](#known-issues)

-   [Example App](#example-app)

-   [Documentation](#documentation)

-   [Releases](#releases)

<!--
this tag, and the corresponding end tag, are used to delineate what is pulled into the FusionAuth docs site (the client libraries pages). Don't remove unless you also change the docs site.

Please also use ``` instead of indenting for code blocks. The backticks are translated correctly to adoc format.
-->

<!--
tag::forDocSite[]
-->

# Overview

This SDK allows you to add login, logout, and registration buttons to
your Angular application. You can do this via pre-built buttons, or with 
the FusionAuthService in your own components.

Your users will be sent to FusionAuth’s themeable hosted login pages and
then log in. After that, they are sent back to your Angular application.

Once authentication succeeds, the following secure, HTTP-only cookies
will be set:

-   `app.at` - an OAuth [Access
    Token](https://fusionauth.io/docs/v1/tech/oauth/tokens#access-token)

-   `app.rt` - a [Refresh
    Token](https://fusionauth.io/docs/v1/tech/oauth/tokens#refresh-token)
    used to obtain a new `app.at`. This cookie will only be set if
    refresh tokens are enabled on your FusionAuth instance.

The access token can be presented to APIs to authorize the request and
the refresh token can be used to get a new access token.

Note that this SDK requires you to have a server that performs the OAuth
token exchange. See [Server Code
Requirements](#server-code-requirements) for more details.

You can use this library against any version of FusionAuth or any OIDC
compliant identity server.

# Getting Started

## Installation

NPM:

```bash
npm install @fusionauth/angular-sdk
```

Yarn:

```bash
yarn add @fusionauth/angular-sdk
```

## Configuring FusionAuthModule

To configure the SDK, wrap your app with `FusionAuthProvider`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FusionAuthModule } from '@fusionauth/angular-sdk';

@NgModule({
  declarations: [],
  imports: [
    FusionAuthModule.forRoot({
      clientId: '', // Your FusionAuth client ID
      serverUrl: '', // The base URL of your server for the token exchange
      redirectUri: '', // The URI that the user is directed to after the login/register/logout action
    }),
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
```

## Server Code Requirements

Authenticating with FusionAuth requires you to set up a server that will
be used to perform the OAuth token exchange. This server must have the
following endpoints:

### `GET /app/login`

This endpoint must:

1.  Generate PKCE code.
    a. The code verifier should be saved in a secure HTTP-only cookie.
    b. The code challenge is passed along
2.  Encode and save `redirect_url` from angular app to `state`.
3.  Redirect browser to `/oauth2/authorize` with a `redirect_uri` to `/app/token-exchange`

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/login.js)

### `GET /app/callback`

This endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#complete-the-authorization-code-grant-request)
    to complete the Authorization Code Grant request. The `code` comes from the request query parameter and
    `code_verifier` should be available in the secure HTTP-only cookie, while
    the rest of the parameters should be set/configured on the server
    side.

2.  Once the token exchange succeeds, read the `app.at` from the
    response body and set it as a secure, HTTP-only cookie with the same
    name.

3.  If you wish to support refresh tokens, repeat step 2 for the
    `app.rt` cookie.

4.  Save the expiration time in a readable `app.at_exp` cookie.  And save the `app.idt` id token in a readable cookie.

5.  Redirect browser back to encoded url saved in `state`.

4.  Call
    [/oauth2/userinfo](https://fusionauth.io/docs/v1/tech/oauth/endpoints#userinfo)
    to retrieve the user info object and respond back to the client with
    this object.

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/callback.js)

### `GET /app/register`

This endpoint is similar to `/login`.  It must:

1.  Generate PKCE code.
    a. The code verifier should be saved in a secure HTTP-only cookie.
    b. The code challenge is passed along
2.  Encode and save `redirect_url` from angular app to `state`.
3.  Redirect browser to `/oauth2/register` with a `redirect_uri` to `/app/callback`

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/register.js)

### `GET /app/me`

This endpoint must:

1.  Use `app.at` from cookie and use as the Bearer token to call `/oauth2/userinfo`
2.  Return json data

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/me.js)

### `GET /app/logout`

This endpoint must:

1.  Clear the `app.at` and `app.rt` secure, HTTP-only
    cookies.
2.  Clear the `app.at_exp` and `app.idt` secure cookies.
3.  Redirect to `/oauth2/logout`

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/logout.js)

### `POST /app/refresh` (optional)

This endpoint is necessary if you wish to use refresh tokens. This
endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#refresh-token-grant-request)
    to get a new `app.at` and `app.rt`.

2.  Update the `app.at`, `app.at_exp`, `app.idt`, and `app.rt` cookies from the
    response.

[Example
implementation](https://github.com/FusionAuth/fusionauth-example-angular-sdk/blob/main/server/routes/token-refresh.js)

# Usage

## Pre-built buttons

There are three pre-styled buttons that are configured to perform
login/logout/registration. They can be placed anywhere in your app as
is.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `<fa-login></fa-login>`,
  styleUrls: []
})
export class LoginComponent {}

@Component({
  selector: 'app-logout',
  template: `<fa-logout></fa-logout>`,
  styleUrls: []
})
export class LogoutComponent {}

@Component({
  selector: 'app-register',
  template: `<fa-register></fa-register>`,
  styleUrls: []
})
export class RegisterComponent {}
```

## Service usage

Alternatively, you may interact with the SDK Service by injecting the FusionAuthService into any component or service.

```typescript
import { Component, OnInit } from '@angular/core';
import { FusionAuthService, UserInfo } from '@fusionauth/angular-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userInfo: UserInfo;

  constructor(
    private fusionAuth: FusionAuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.fusionAuth.initAutoRefresh();
  }
  
  login() {
    this.fusionAuth.startLogin();
  }
  
  register() {
    this.fusionAuth.startRegistration();
  }
  
  logout() {
    this.fusionAuth.logout();
  }
  
  refreshToken() {
    this.fusionAuth.refreshToken();
  }
  
  async getUserInfo() {
    this.userInfo = await this.fusionAuth.getUserInfo();
  }
  
  isLoggedIn(): boolean {
    return this.fusionAuth.isLoggedIn();
  }
}
```

### State parameter

The `startLogin` and `startRegistration` functions both accept an optional string
parameter called `state`. The login and register components can also be passed the 
state as an input. The state that is passed in to the function call will be echoed
back in the state query parameter of the callback uri specified in `redirectUri` on
the `FusionAuthConfig` used to initialize the `FusionAuthModule`. Though you may 
pass any value you would like for the state parameter, it is often used to indicate 
which page the user was on before redirecting to login or registration, so that the
user can be returned to that location after a successful authentication.

## Known Issues

# Example App

See the [FusionAuth Angular SDK
Example](https://github.com/FusionAuth/fusionauth-example-angular-sdk) for
functional example of a Angular client that utilizes the SDK as well as an
Express server that performs the token exchange.

# Documentation

[Full library
documentation](https://github.com/FusionAuth/fusionauth-angular-sdk/blob/main/docs/documentation.md)

<!--
end::forDocSite[]
-->

Use backticks for code in this readme. This readme gets turned into asciidoc and included on the fusionauth website, and backticks show the code in the best light there.

# Releases

To perform a release:

-   Pull the code to your local machine

-   Bump the version in [package.json](./projects/fusionauth-angular-sdk/package.json)

-   Run `npm run build-sdk`

-   Run `cd dist/fusionauth-angular-sdk`

-   Run `npm publish`

You may have to set up your machine to be able to publish, which will
involve updating your .npmrc file.

There’s information [here that you can
use](https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe)
to do that (look for the `.npmrc` section).

