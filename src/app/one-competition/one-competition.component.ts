import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-one-competition',
  templateUrl: './one-competition.component.html',
  styleUrls: ['./one-competition.component.css']
})
export class OneCompetitionComponent implements OnInit {
  public isMenuCollapsed = true;
  craftcommentForm: FormGroup;
  isShow = false;
  viewcompetition:any;
  competition:any;
  allCraft:any;
  isData: any;

  // comment variable declaration
  craftcommentDetails = {
    user_id: '',
    craft_id: '',
    message: '',
  };

  slides = [
    { img: 'assets/img/170.png' },
    { img: '/assets/img/171.png' },
    { img: '/assets/img/169.png' },
    { img: '/assets/img/172.png' },
    { img: '/assets/img/114.png' },
    { img: '/assets/img/115.png' },
    { img: '/assets/img/113.png' },
    { img: '/assets/img/112.png' },
    { img: '/assets/img/114.png' },
    { img: '/assets/img/172.png' },

  ];

  slideConfig = {"slidesToShow": 4, "slidesToScroll": 4,};
  slideConfi = {"slidesToShow": 1.9, "slidesToScroll": 1,

};

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  id:any;
  craftID: any;
  clientID: number;
  voteForm: FormGroup;
  craftForm: FormGroup;
  selectedFile = null;
  crafts:any;
  compID:any;
  user_id: any;
  // id:string;
  format: any;
  participants: any;
  comData: any;
  craft: any;
  isLoading = false;
  isMineCompetition = false;
  isPart = true;
  amount: any;

  craftData = {
    caption: '',
    file: this.selectedFile,
    craft_type: 'Unknown',
    user_id: localStorage.getItem('userID'),
    file_type: this.format
  }


  voteDetails = {
    user_id: '',
    craft_id: '',
    num_of_votes: '',
    // item_type: 'vote for content',
    msisdn: '',
    momo_network: '',
    amount: null,
    // client_request_id: null
  };

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
    this.voteForm = formBuilder.group({
      user_id: [null],
      num_of_votes: [null, Validators.compose([Validators.required])],
      momo_network: [null, Validators.compose([Validators.required])],
      momo_code: [null, Validators.compose([Validators.required])],
      momo_number: [null, Validators.compose([Validators.required])],
      // item_type: [null, Validators.compose([Validators.required])],
      msisdn: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      // client_request_id: [null, Validators.compose([Validators.required])],
    });

    // Generating random numbers for client request id
    // this.clientID = Math.floor(
    //   10000000000000000000 + Math.random() * 90000000000000000000
    // ),toString();


    this.craftcommentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });
  }

  ngOnInit(): void {
    // this.craftID = this.allCraft.id;
    this.compID = this.route.snapshot.paramMap.get("id");
    this.user_id = localStorage.getItem('userID');
    this.v(this.compID);
    this.getCraft();
    this.userCompStatus();
    // post data form
  this.craftForm = this.formBuilder.group({
  caption: [null],
  file: [null],
  file_type: [null],
});
// building comment form
this.craftcommentForm = this.formBuilder.group({
  user_id: [null],
  message: [null,Validators.required],
});
  }
  trackLikes(cra) {
    this.isData = cra['likes'].filter((like) => {
      return like.user_id == this.user_id;
    });
    console.log(this.isData);
  }
  likep(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    console.log(data);
    this.auth.update('like_craft', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Post liked');
          this.viewcraft(id);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('Internal Server Error');
        } else {
          this.spinner.hide();
          this.alert.error('Post liked not successful try again later');
        }
      }
    );
  }

  unlike(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    console.log(data);
    this.auth.update('unlike_craft', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Post unliked');
          this.viewcraft(id);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('Internal Server Error');
        } else {
          this.spinner.hide();
          this.alert.error('Post cant be unliked try again later');
        }
      }
    );
  }
   // set comment data
   setCommentData() {
    this.craftcommentDetails.user_id = this.craftcommentForm.controls['user_id'].value;
    this.craftcommentDetails.message = this.craftcommentForm.controls['message'].value;
  }

  addComment(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
      message: this.craftcommentForm.controls['message'].value,
    };
    console.log(data);
    this.auth.update('craft_comment', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Comment posted successfully');
          this.viewcraft(id);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('Internal Server Error');
        } else {
          this.spinner.hide();
          this.alert.error('Comment not posted Try again later');
        }
      }
    );
  }
  // Get all craft
getCraft() {
  this.isLoading = true;
  this.auth.get('crafts').subscribe(
    response => {
      // console.log(response);
      if (response['data']['data'].length > 0) {
        this.allCraft = response['data']['data'];
        console.log(this.allCraft);
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.alert.info('No Data available yet');
      }
    },
    error => {
      this.spinner.hide();
      this.alert.error(error['message']);
    }
  );
}


// view single competition
v(id) {
  this.isLoading = true;
  this.auth.show('competition', id).subscribe(
    (response) => {
      this.isLoading = false;
      this.viewcompetition = response['data'][0];
      console.log(this.viewcompetition);
      this.amount = this.viewcompetition.vote_fees;
      console.log(this.amount);
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
join(id) {
  this.router.navigate(['/join/',id]);
}
openpost(postModal) {
  this.modalService.open(postModal, {  size: 'sm',centered:true });
}
close(votepost) {
  this.modalService.dismissAll(votepost);
}
voteContent(votepost) {
  this.modalService.open(votepost, {  size: 'sm',centered:true });
}

onFileChanged(event) {
  const size = event.target.files[0].size;
  const fileSize = size / 1024;

  // console.log(fileSize);

  if (fileSize > 10240) {
    this.alert.info('File size cannot be larger than 10mb');
    return;
  }

  const file = event.target.files && event.target.files[0];

  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    if (file.type.indexOf('image') > -1) {
      this.format = 'IMAGE';
    } else if (file.type.indexOf('video') > -1) {
      this.format = 'VIDEO';
    }
    reader.onload = (event) => {
      this.selectedFile = event.target.result;
      this.craftForm.get('file').setValue(file);
      this.craftForm.get('file_type').setValue(this.format);
    }
  }

}


cancel() {
  this.selectedFile = null;
}


builData() {
  this.craftData.caption = this.craftForm.controls['caption'].value;
}

createPost() {
  this.isLoading = true;

  const formData = new FormData();

  formData.append('caption', this.craftForm.get('caption').value);
  formData.append('file', this.craftForm.get('file').value);
  formData.append('location', 'Sent from Web');
  formData.append('user_id', localStorage.getItem('userID'));
  formData.append('competition_id', this.compID);
  formData.append('file_type', this.craftForm.get('file_type').value);

  console.log(formData);

  this.auth.update("craft", localStorage.getItem('userID'), formData).subscribe(
    response => {
      console.log(response);
      this.isLoading = false;
      if (response['success'] === false) {
        this.alert.warning(response['message']);
      } else {
        this.alert.success('Post added successfully');
        this.getCraft();

      }
    },
    error => {
      console.log(error);
      this.alert.warning('Error sending data');
    }
  );
}
view(ev) {
  this.auth.show('craft', ev).subscribe(
    (response) => {
      this.crafts = response['data'];
      console.log(this.crafts);
    },
    (error) => {
      console.log(error);
      this.alert.error('Getting data unsuccessful. Please try again');
    }
  );
}
openContent(logoutModal) {
  this.modalService.open(logoutModal, {   size: 'sm',centered:true });
}
openCraft(singleCraft) {
  this.modalService.open(singleCraft, {   size: 'lg' });
}

  // addSlide() {
  //   this.slides.push({img: "http://placehold.it/350x150/777777"})
  // }
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
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

  contact() {
    this.router.navigate(['/contact/']);
  }

  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
        this.router.navigate(['login']);

  }
  no(){
    this.modalService.dismissAll();
  }

  // building vote data
  buildData() {
    this.voteDetails.amount = this.amount * this.voteForm.controls['num_of_votes'].value;
    // this.voteDetails.client_request_id = this.clientID;
    this.voteDetails.craft_id = this.craftID;
    this.voteDetails.momo_network =  this.voteForm.controls['momo_network'].value;
    this.voteDetails.num_of_votes = this.voteForm.controls['num_of_votes'].value;
    this.voteDetails.user_id = localStorage.getItem('userID');

    const msisdn = this.voteForm.controls['momo_code'].value + this.voteForm.controls['momo_number'].value;
    this.voteDetails.msisdn = msisdn;

    // const msisdn = this.joinComForm.get('momo_code').value + this.joinComForm.get('momo_number').value;
    // this.paymentDetails.msisdn = msisdn;
    // this.paymentDetails.amount = this.amount.toString();
    // this.paymentDetails.ClientRequestId = this.clientID;
    // this.paymentDetails.network = this.joinComForm.get('momo_network').value;
  }

  vote(id) {
    // this.buildData();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
      msisdn: parseInt(this.voteForm.controls['momo_code'].value + this.voteForm.controls['momo_number'].value),
      num_of_votes: this.voteForm.controls['num_of_votes'].value,
      amount: this.amount * this.voteForm.controls['num_of_votes'].value,
      momo_network: this.voteForm.controls['momo_network'].value,

    };
    console.log(data);
     this.auth.update('vote', localStorage.getItem('userID'), data).subscribe(
        (response) => {
          console.log(response);
          this.spinner.hide();
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            this.alert.success('Thanks for voting');
            this.router.navigate(['/one/:id']);
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
        }
      );
  }

  viewcraft(ev) {
    this.auth.show('craft', ev).subscribe(
      (response) => {
        console.log(response);
        this.craft = response['data'];
        console.log(this.craft);
        this.craftID = this.craft.id;
        console.log(this.craftID);
      },
      (error) => {
        console.log(error);
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
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
