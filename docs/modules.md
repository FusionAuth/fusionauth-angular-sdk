## FusionAuthModule

| Name    | Type                                           | Description                                                                                                                | Example                                                                                                                        |
|---------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| forRoot | `(fusionAuthConfig: FusionAuthConfig) => void` | The forRoot call takes a `FusionAuthConfig` which will be passed to the [FusionAuthService](services.md#fusionauthservice) | `{clientId: 'e9fdb985-9173-4e01-9d73-ac2d60d1dc8e', serverUrl: 'http://localhost:9000',redirectUri: 'http://localhost:3000',}` |

## FusionAuthConfig
| Name                           | Type              | Description                                                                                                                                | Example                                |
|--------------------------------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| serverUrl                      | string            | The base url for the backend that hosts the authentication endpoints for this application                                                  | `http://localhost:9011`                |
| clientId                       | string            | The clientId of the application as configured in FusionAuth.                                                                               | `e9fdb985-9173-4e01-9d73-ac2d60d1dc8e` |
| redirectUri                    | string (optional) | The url that will be redirected to after the authentication flow finishes.                                                                 | `http://localhost:3000/auth-callback`  |
| autoRefreshSecondsBeforeExpiry | number (optional) | If initAutoRefresh has been called how many seconds before the token expiration time should a token refresh be attempted. Defaults to `10` | `20`                                   |
| loginPath                      | string (optional) | The path on the `serverUrl` of the login endpoint. Defaults to `/app/login`.                                                               | `/app/login`                           |
| logoutPath                     | string (optional) | The path on the `serverUrl` of the logout endpoint. Defaults to `/app/logout`.                                                             | `/app/logout`                          |
| registerPath                   | string (optional) | The path on the `serverUrl` of the register endpoint. Defaults to `/app/register`.                                                         | `/app/register`                        |
| tokenRefreshPath               | string (optional) | The path on the `serverUrl` of the refresh endpoint. Defaults to `/app/refresh`.                                                           | `/app/refresh`                         |
| mePath                         | string (optional) | The path on the `serverUrl` of the user info endpoint. Defaults to `/app/me`                                                               | `/app/login`                           |

