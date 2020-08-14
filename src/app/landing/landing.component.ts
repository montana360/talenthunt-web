import { Component, OnInit,ElementRef } from '@angular/core';
// import * as Rellax from 'rellax';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { signup } from '../interfaces/signup';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public isMenuCollapsed = true;

  isRegistering = false;
  credentials: signup;
  registerForm: FormGroup;

  // Signup Data
  registerData = {
    email:"",
    fullname:"",
    phone:"",
    password:"",
    platform: "web"
  };

  private toggleButton: any;
    private sidebarVisible: boolean;

  constructor(
    private element : ElementRef,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) {
    this.sidebarVisible = false;
    this.registerForm = formBuilder.group(
      {
        email: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            )
          ])
        ],
        fullname:[null,Validators.required],
        phone:[null,Validators.required],
        platform:["web",Validators.required],
        password: [
          null,
          Validators.compose([Validators.required, Validators.minLength(5)])
        ],
      })
   }

  ngOnInit(): void {
    const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    setTimeout(function(){
        toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible = true;
};
sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
};
sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
        this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
};
setData() {
  (this.registerData.email = this.registerForm.controls['email'].value),
    (this.registerData.fullname = this.registerForm.controls[
      'fullname'
    ].value),
    (this.registerData.phone = this.registerForm.controls[
      'phone'
    ].value),
    (this.registerData.password = this.registerForm.controls['password'].value);
    // (this.registerData.platform = this.registerForm.controls[this.platformo]

}
registration() {
  this.isRegistering = true;
  this.setData();
  console.log(this.registerData);
  setTimeout(() => {
    this.auth.createUser("register", this.registerData).subscribe(
      response => {
        console.log(response['data']);
        this.isRegistering = false;
        this.alert.success("Hooray... Welcome to Talent Hunt Platform");
        this.router.navigate(["login"]);
      },
      error => {
        if (error.status === 500) {
          this.isRegistering = false;
          this.alert.info(
            "Please check the form data and fill correctly especially the domain name."
          );
        }else if(error.status === 401){
          this.isRegistering = false;
          this.alert.info(
            "email is already in used"
          );
        }
         else if (error.status === 0) {
          this.isRegistering = false;
          this.alert.info("Network error. No internet connectivity.");
        } else {
          this.isRegistering = false;
          this.alert.info('Please check your internet connection and try again');
        }
        // console.log(error);
      }
    );
  }, 10000);
}
loginpage(){
  this.router.navigate(['/login/']);
}
landingpage(){
  this.router.navigate(['/landing/']);
}
aboutpage(){
  this.router.navigate(['/about/']);
}
contact(){
  this.router.navigate(['/contact/']);
}

}
