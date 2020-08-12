import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Login } from '../interfaces/login';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  status: any;
    isLoading = false;

    loginForm: FormGroup;
    credentials: Login;
    token: any;
    allPosts:any;
    sentCode: boolean;

    // Login Data
    loginData = {
      email: '',
      password: '',
      client_id: '2',
      client_secret: 'O4Mz7TE1SEKmw7s2GTvp3s5zQL5Y1jYaJSSEfevn',
      scope: '*'
  };


  constructor(
    private formBuilder: FormBuilder,
        private alert: AlertService,
        private auth: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
  ) {
    {
      this.loginForm = formBuilder.group({
          email: [
              null,
              Validators.compose([Validators.required, Validators.email])
          ],
          password: [
              null,
              Validators.compose([Validators.required, Validators.minLength(5)])
          ]
      });
  }
   }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
        body.classList.add('login');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    // navbar.classList.remove('navbar-transparent');
}
// this is the final data required for authentication
setCredentials() {
    (this.loginData.email = this.loginForm.controls['email'].value),
        (this.loginData.password = this.loginForm.controls['password'].value);
}
// function for logging in
signIn() {
    this.isLoading = true;
    this.setCredentials();
    this.auth.authenticate(this.loginData).subscribe(
        response => {
           setTimeout(() => {
                // console.log(response["token"]['token']);
            if (response !== null || response !== undefined) {
                localStorage.setItem("token", response["token"]['token']);
                // console.log(response['token']);
                localStorage.setItem('username', response['data']['username']);
                localStorage.setItem('userID', response['data']['id']);
                localStorage.setItem('user', JSON.stringify(response['data']));
                localStorage.setItem('user_profile', JSON.stringify(response['data']['profile']));
                localStorage.setItem('follows', JSON.stringify(response['data']['follows']));
                this.router.navigateByUrl('/homepage');
                this.getpost();
                this.alert.success('Welcome ' + localStorage.getItem('username'));
            } else {
                localStorage.clear();
                this.isLoading = false;
                this.alert.info('Users Only');
                this.router.navigate(['/login/']);
            }
           }, 10000);
        },
        error => {
            if (error.status === 500) {
                this.isLoading = false;
                this.alert.info("Oops something went wrong, please try again later");
            } else if (error.status === 0) {
                this.isLoading = false;
                this.alert.warning("Network Error. Please check your connectivity.");
            } else if (error.status === 401) {
                this.isLoading = false;
                this.alert.warning(
                    "Username or Password Incorrect. Please check and enter again."
                );
            } else {
                this.isLoading = false;
                this.alert.info("Wrong credentials");
                // console.log(error);
            }
        }
    );
}
landingpage(){
    this.router.navigate(['/landing/']);
  }
  getpost() {
    // this.isLoading = true;
    this.auth.get('posts').subscribe(
      (response) => {
        // console.log(response['data']['data']);
        this.allPosts = response['data']['data'];
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('Error loading user Data');
        // console.log(error);
      }
    );
  }
}
