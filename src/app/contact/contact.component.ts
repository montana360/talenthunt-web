import { Component, OnInit } from '@angular/core';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
  NgbCarouselConfig,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }
  homePage() {
    this.router.navigate(['/homepage/']);
  }
  profilePage() {
    this.router.navigate(['/profile/']);
  }
  aboutpage() {
    this.router.navigate(['/about/']);
  }
  compage() {
    this.router.navigate(['/terms/']);
  }
}
