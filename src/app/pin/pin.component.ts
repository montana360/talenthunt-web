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
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
        private alert: AlertService,
        private auth: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
  ) {
   
  }

  ngOnInit(): void {
  }

}
