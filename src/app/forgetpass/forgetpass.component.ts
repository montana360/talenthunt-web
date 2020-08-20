import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Login } from '../interfaces/login';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.component.html',
  styleUrls: ['./forgetpass.component.css']
})
export class ForgetpassComponent implements OnInit {
  ResetForm: FormGroup;
  PinForm: FormGroup;
  isloading= false;
  re_pin: any;
  pin: any;
  pinnum:any;

  // pin data
pinData = {
  pin:'',
  re_pin: ''
}

   // reset Data
   ResetData = {
    email: '',
};
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
        private alert: AlertService,
        private auth: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
  ) {
    this.ResetForm = formBuilder.group({
      email: [
          null,
          Validators.compose([Validators.required, Validators.email])
      ],
  });
  this.PinForm = formBuilder.group({
    pin: [null, Validators.required],
    re_pin: [null, Validators.required],
},
{

}
);
   }

  ngOnInit(): void {

  }
  resetPass() {
    this.isloading = true;
    const data = {
      email: this.ResetForm.controls['email'].value,
    };
    // console.log(data);
    this.auth.restore('forgot_password', data).subscribe(
      (response) => {
        // console.log(response);
        this.isloading = false;
        if (response !== null || response !== undefined) {
          this.pin = response['data'];
          // console.log(this.pin);
          // this.router.navigate(['/pin/']);
        }
      },
      (error) => {
        // console.log(error);
        this.isloading = false;
        if (error.status === 500) {
           this.isloading = false;
          this.alert.warning('connect to the internet and try again');
        } else {
          this.spinner.hide();
          this.alert.info('Email does not exist in application or not valid');
        }
      }
    );
  }
   log(){
    this.router.navigate(['/login/']);
   }
   openReportContent(pin) {
    this.modalService.open(pin, {centered: true, size: 'sm' });
  }
  openverifyContent(pinnum) {
    this.modalService.open(pinnum, {centered: true, size: 'sm' });
  }
  close(pin) {
    this.modalService.dismissAll(pin);
  }
  compare(pin) {
    if(pin == this.pin) {
      this.router.navigate(['/resetpass/']);
    }else{
      this.alert.warning('pin do not match please check your mail and try again');
    }
  }
ress(){
  this.router.navigate(['/resetpass/']);
}
}
