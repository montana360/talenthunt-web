import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  compID: any;
  user_id: any;
  isLoading: any;
  viewcompetition: any;
  participants: any;
  comData: any;
  isMineCompetition = false;
  isPart = true;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route:ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.getAllCompetitions();
    // this.compID = this.route.snapshot.paramMap.get("id");
    this.compID = 2;
    this.user_id = localStorage.getItem('userID');
    this.v(this.compID);
    this.userCompStatus();
  }

  getAllCompetitions() {
    this.spinner.show();
    this.auth.get("competitions").subscribe(
      response => {
        console.log(response);
        this.spinner.hide();
        if (response["data"] !== null || response["data"] !== undefined) {
          // this.competition = response["data"];
        } else {
          this.alert.info("No Competition Available.");
        }
      },
      error => {
        this.spinner.hide();
        this.alert.error("Error loading Competition Data please check your network");
        // console.log(error);
      }
    );
  }

  v(id) {
    this.isLoading = true;
    this.auth.show('competition', id).subscribe(
      (response) => {
        this.isLoading = false;
        this.viewcompetition = response['data'][0];
        this.participants = this.viewcompetition.participants;

        this.comData = this.participants.filter((part) => {
          if(part.user_id == this.user_id) {
            this.isMineCompetition = true;
          } else {
            this.isMineCompetition = false;
          }
        });
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
  }

  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['examples/login']);
  }

  no(){
    this.modalService.dismissAll();
  }

  join(id) {
    this.router.navigate(['/join/',id]);
  }
  one(id) {
    this.router.navigate(['/one/',id]);
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

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {   size: 'sm' });
  }

  userCompStatus() {
    const data = {
      user_id: localStorage.getItem('userID'),
      competition_id: this.compID
    };

    this.auth.update('check_registration_state', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        if (response['data'].length > 0){
          this.isPart = false;
        }
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
  }
}
