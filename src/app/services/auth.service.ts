import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { interval, Subscription } from 'rxjs';

const server = 'talenthunt.vokacom.net/api/v1/';
// const server = 'https://jsonplaceholder.typicode.com/todos/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // setting token as variable
  token = localStorage.getItem('token');
  access_level = localStorage.getItem('user_type');
  private headers;

  // Getting and setting domain
  // fqdn = localStorage.getItem('subdomain');

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    // this.init();
  }
  async init() {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.token,
    });
  }

  /// index of a resource
  get(url) {
    // console.log(this.fqdn);
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.get('https://' + server + url, { headers: this.headers });
  }

  // store a new resource
  store(url, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.post('https://' + server + url, payload, {
      headers: this.headers,
    });
  }

  // show a single resource
  show(url, id) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.get('https://' + server + url + '/' + id, {
      headers: this.headers,
    });
  }

  // show edit details for  a single resource
  edit(url, id) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.get('https://' + server + url + '/' + id, {
      headers: this.headers,
    });
  }

  // update a single resource
  update(url, id, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.post('https://' + server + url + '/' + id, payload, {
      headers: this.headers,
    });
  }

  // show patch details for  a single resource
  restore(url, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    // config.append('Authorization', 'Bearer ' + this.token);
    return this.http.post('https://' + server + url, payload, {
      headers: this.headers,
    });
  }

  // delete a particular resource
  destroy(url, id, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.post('https://' + server + url + '/' + id, payload, {
      headers: this.headers,
    });
  }

  // registration of tenants / clients
  createUser(url, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    return this.http.post('https://' + server + url, payload, {
      headers: this.headers,
    });
  }

  // authentication for user login
  authenticate(payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    return this.http.post('https://' + server + 'login', payload, {
      headers: this.headers,
    });
  }

  // authentication for user login
  domain(url, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    return this.http.post('https://' + server + url, payload, {});
  }

  // send password reset email
  forgetPassword(url, sub, payload) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.post('https://' + sub + '.' + server + url, payload, {
      headers: this.headers,
    });
  }

  // Functions for post paginations
  paginate(url) {
    const config = new HttpHeaders();
    config.append('Accept', 'application/json');
    config.append('Authorization', 'Bearer ' + this.token);
    return this.http.get(url, { headers: this.headers });
  }

  // payment method
  pay(payload) {
    const config = new HttpHeaders({
      'CatchPhrase': 'talenthuntuserAPp-tekgenwRgyshUBGDTiisoo=-hbhsiio',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      "Content-Type": "text/plain"
    });
    const url = 'https://payment.tekhype.com/thirdpartypayments/thirdpaymentapi.ashx';
    return this.http.post(url, payload, { headers: config });
  }


  // get user id
  userID() {
    return localStorage.getItem('userID');
  }

  // getting access token
  getToken() {
    return localStorage.getItem('token');
  }

  // function to check user type (either customer or staff)
  userData() {
    return localStorage.getItem('user');
  }

  // Getting user_type
  user_type() {
    return localStorage.getItem('user_type');
  }

  // check user login
  isLoggedIn() {
    return this.getToken() !== null && this.userData() !== null;
  }

  // logout method
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
