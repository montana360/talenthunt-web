import { Component, OnInit } from '@angular/core';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
@Component({
  selector: 'app-join-competition',
  templateUrl: './join-competition.component.html',
  styleUrls: ['./join-competition.component.css'],
})
export class JoinCompetitionComponent implements OnInit {
  public isMenuCollapsed = true;
  isDisabled = true;
  viewcompetition: any;
  competition: any;
  joinComForm: FormGroup;
  compID: any;

  selectedFile = null;
  clientID: any;
  amount: any;

  // join competition variable declaration
  JoinComDetails = {
    id_file: '',
    user_id: '',
    competition_id: '',
    age: '',
    gender: '',
    first_name: '',
    last_name: '',
    town: '',
    telephone: '',
    email: '',
    bio: '',
    momo_number: '',
    network: '',
    momo_code: '',
    msisdn: '',
    amount: '',
  };

  // // payment details
  // paymentDetails = {
  //   msisdn: '',
  //   network: '',
  //   amount: '',
  //   CallBackUrl: 'https://talenthunt.vokacom.net/api/v1/update_payment',
  //   ClientRequestDescription: 'Registration',
  //   ClientRequestId: '',
  //   FeesOnCustomer: false
  // };

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.joinComForm = formBuilder.group({
      id_file: [null, Validators.compose([Validators.required])],
      competition_id: [null, Validators.compose([Validators.required])],
      age: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      first_name: [null, Validators.compose([Validators.required])],
      last_name: [null, Validators.compose([Validators.required])],
      town: [null, Validators.compose([Validators.required])],
      telephone: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      bio: [null, Validators.compose([Validators.required])],
      momo_number: [null, Validators.compose([Validators.required])],
      network: [null, Validators.compose([Validators.required])],
      momo_code: [null, Validators.compose([Validators.required])],
      // item_type: [null, Validators.compose([Validators.required])],
      msisdn: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      // client_request_id: [null, Validators.compose([Validators.required])],
    });

    // this.clientID = Math.floor(
    //   10000000000000000000 + Math.random() * 90000000000000000000
    // ).toString();
  }

  ngOnInit(): void {
    this.compID = this.route.snapshot.paramMap.get('id');
    this.v(this.compID);
  }

  // view single competition
  v(id) {
    this.auth.show('competition', id).subscribe(
      (response) => {
        this.viewcompetition = response['data'][0];
        console.log(this.viewcompetition);
        this.amount = this.viewcompetition.service_fees;
      },
      (error) => {
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
  }

  // Getting File
  onFileChanged(event) {
    const size = event.target.files[0].size;
    const fileSize = size / 1024;

    if (fileSize > 10240) {
      this.alert.info('File size cannot be larger than 10mb');
      return;
    }

    const file = event.target.files && event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        this.selectedFile = event.target.result;
        this.joinComForm.get('id_file').setValue(file);
      };
    }
  }
  cancel() {
    this.selectedFile = null;
  }

  JoinComp() {
    this.spinner.show();

    const formData = new FormData();

    formData.append('id_file', this.joinComForm.get('id_file').value);
    formData.append('age', this.joinComForm.get('age').value);
    formData.append('user_id', localStorage.getItem('userID'));
    formData.append('competition_id', this.compID);
    formData.append('gender', this.joinComForm.get('gender').value);
    formData.append('first_name', this.joinComForm.get('first_name').value);
    formData.append('last_name', this.joinComForm.get('last_name').value);
    formData.append('town', this.joinComForm.get('town').value);
    formData.append('telephone', this.joinComForm.get('telephone').value);
    formData.append('email', this.joinComForm.get('email').value);
    formData.append('bio', this.joinComForm.get('bio').value);
    formData.append('momo_number', this.joinComForm.get('momo_number').value);
    formData.append('network', this.joinComForm.get('network').value);
    console.log(this.joinComForm.get('network').value)
    formData.append('momo_code', this.joinComForm.get('momo_code').value);
    // formData.append('item_type', 'Value Biaa');

    const msisdn = "233" +
      this.joinComForm.get('momo_number').value;
    formData.append('msisdn', msisdn);
    console.log(msisdn);

    formData.append('amount', this.amount);
    // formData.append('client_request_id', this.clientID);

    console.log(formData);

    // this.makePayment();

    this.auth
      .update('registration', localStorage.getItem('userID'), formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.spinner.hide();
          if (response['success'] === false) {
            this.alert.warning(response['message']);
            this.selectedFile = null;
          } else {
            this.alert.success('Welcome, competition application successful.');
            // this.makePayment();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
        }
      );
  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {centered: true, size: 'sm' });
  }

  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['login']);
  }

  no() {
    this.modalService.dismissAll();
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

  contact() {
    this.router.navigate(['/contact/']);
  }


  // buildPay() {
  //   const msisdn = this.joinComForm.get('momo_code').value + this.joinComForm.get('momo_number').value;
  //   this.paymentDetails.msisdn = msisdn;
  //   this.paymentDetails.amount = this.amount.toString();
  //   this.paymentDetails.ClientRequestId = this.clientID;
  //   this.paymentDetails.network = this.joinComForm.get('momo_network').value;
  // }


  // makePayment() {
  //   this.buildPay();
  //   // console.log(this.paymentDetails);
  //   this.auth.pay(this.paymentDetails).subscribe(response => {
  //     console.log(response);
  //           // this.router.navigate(['/one/:id']);
  //   }, error => {
  //     console.log(error);
  //   });
  // }

}
