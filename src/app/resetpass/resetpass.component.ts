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
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit {
  isloading = false;

  passForm: FormGroup;
  // password data
  passData = {
    email:'',
    new_password:'',
    user_new_password:''
  }
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
        private alert: AlertService,
        private auth: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
  ) {
    this.passForm = formBuilder.group({
      email: [
          null,
          Validators.compose([Validators.required, Validators.email])
      ],
      new_password: [
          null,
          Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      user_new_password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(5)])
    ]
  },
  {
    validator: this.isMatching // your validation method
  }
  );
   }
   isMatching(group: FormGroup) {
    const firstPassword = group.controls['new_password'].value;
    const secondPassword = group.controls['user_new_password'].value;
    if (firstPassword !== secondPassword) {
      return { pw_mismatch: true };
    } else {
      return null;
    }
  }

  ngOnInit(): void {
  }
  setData(){

      (this.passData.email = this.passForm.controls['email'].value),
      (this.passData.new_password = this.passForm.controls['new_password'].value);
  }
  resetPass() {
    this.isloading = true;
    this.setData();
    // console.log(this.passData);
    this.auth.restore('reset_password', this.passData).subscribe(
      (response) => {
        // console.log(response);
        this.isloading = false;
        if (response !== null || response !== undefined) {
          this.router.navigate(['/login/']);
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
          this.alert.info('password do not match');
        }
      }
    );
  }
}
