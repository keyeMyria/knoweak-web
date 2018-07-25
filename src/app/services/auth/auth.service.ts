import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as auth0 from 'auth0-js';
import { JwtHelperService } from '@auth0/angular-jwt';

(window as any).global = window;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: environment.auth0.clientID,
    domain: environment.auth0.domain,
    audience: 'knoweak-api-localhost',
    responseType: 'token id_token',
    redirectUri: environment.auth0.redirectUri,
    scope: 'openid profile'
  });

  jwt = new JwtHelperService();

  constructor(public router: Router) { }

  public login() {
    // Request login page (Universal Lock screen)
    this.auth0.authorize();
  }

  public registerCallback(): void {
    // Register callback to parse hash returned in URL
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/dashboard']);
      }
      else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);

    // Get info from ID token
    let idToken = this.jwt.decodeToken(authResult.idToken);
    localStorage.setItem('name', idToken.name);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getUTCMilliseconds() < expiresAt;
  }
}
