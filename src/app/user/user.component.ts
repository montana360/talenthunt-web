import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isShow = false;
  imageForm: FormGroup;
  profileImage = null;

  isLoading = false;

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }
  
  openContent(logoutModal) {
    this.modalService.open(logoutModal, { size: 'sm', centered: true });
  }
  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['login']);
  }

  no() {
    this.modalService.dismissAll();
  }
  homePage(){
    this.router.navigate(['/homepage/']);
  }
  profilePage(){
    this.router.navigate(['/profile/']);
  }
  aboutpage(){
    this.router.navigate(['/about/']);
  }
  compage(){
    this.router.navigate(['/terms/']);
  }
}
