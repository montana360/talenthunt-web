import {
  Component,
  OnInit,
} from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
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

import { ClipboardService } from 'ngx-clipboard'

@Component({
  selector: 'app-singlecraft',
  templateUrl: './singlecraft.component.html',
  styleUrls: ['./singlecraft.component.css']
})
export class SinglecraftComponent implements OnInit {
  craftcommentForm: FormGroup;
  voteForm: FormGroup;
  reportForm: FormGroup;
  searchForm: FormGroup;

  public isMenuCollapsed = true;

  craftID: any;
  viewcompetition:any;
  amount: any;
  COMPID:any;
  numVotes = 0;
  isShow = false;
  // isData: any;
  isMineLike = false;
  isLoading = false;
  isFollow= null;
  isData= null;
  isFound = false;
  follow: any;
  searchList = null;
  search = '';
  isNoti = false;
  Psts: any
  Allnoti: any;
  unread:any;
  ID= null;
  user_id= null;
  craft:any;
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  isLiked = false;
  likedisplay() {
    this.isLiked = !this.isLiked;
  }
   // comment variable declaration
   craftcommentDetails = {
    user_id: '',
    craft_id: '',
    message: '',
  };
  voteDetails = {
    user_id: '',
    craft_id: '',
    num_of_votes: '',
    // item_type: 'vote for content',
    msisdn: '',
    network: '',
    amount: null,
    // client_request_id: null
  };
  reportDetails = {
    user_id: '',
    content_id: '',
    complaint: '',
  };

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    // conTabfig: NgbTabsetConfig,
    private clipboardService: ClipboardService
  ) {
    this.voteForm = formBuilder.group({
      num_of_votes: [null,Validators.required],
      network: [null,Validators.required],
      momo_number: [null,Validators.required],
      msisdn: [null,Validators.required],
      amount: [null,Validators.required],
    });

    this.craftcommentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });
    this.reportForm = this.formBuilder.group({
      user_id: [null],
      complaint: [null,Validators.required],
    });

     // search form
     this.searchForm = this.formBuilder.group({
      search: [null],
    });

   }

  ngOnInit(): void {
    this.isLoading =true
    this.ID = this.route.snapshot.paramMap.get('id');
    this.user_id = localStorage.getItem('userID');
    this.viewcraft(this.ID);
    this.getcompetition();

    this.voteForm = this.formBuilder.group({
      num_of_votes:[null,Validators.required],
      network: [null,Validators.required],
      momo_number: [null,Validators.required],
      // msisdn: [null, Validators.compose([Validators.required])],
      // amount: [null, Validators.compose([Validators.required])],
    });
  }
  // set craftcomment data
  setCraftCommentData() {
    this.craftcommentDetails.user_id = this.craftcommentForm.controls['user_id'].value;
    this.craftcommentDetails.message = this.craftcommentForm.controls['message'].value;
  }

  addCraftComment(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
      message: this.craftcommentForm.controls['message'].value,
    };
    // console.log(data);
    this.auth.update('craft_comment', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Comment posted successfully');
          this.viewcraft(id);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('connect to the internet and try again');
        } else {
          this.spinner.hide();
          // this.alert.error('Comment not posted Try again later');
        }
      }
    );
  }
  // Checked if you liked a post
  trackLikes(post) {
    this.isData = post['likes'].filter((like) => {
      return like.user_id == this.user_id;
    });

    // console.log(this.isData);
  }

  // Checking if you follow searched user
  trackFollows(list) {
    this.isFollow = list['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });
    // console.log(this.isFollow);
  }
  // Search functionality
  searchEverything(data) {
    if (this.search === '') {
      this.clearSearch();
    } else if (data === '' || data === null) {
      this.clearSearch();
      return;
    } else {

      const search = {
        data: data,
      };

      console.log(search);

      this.auth.update('search_user',localStorage.getItem('userID'), search).subscribe(
        (response) => {
          if (response['success'] === true) {
            this.isFound = true;
            this.searchList = response['data']['data'];
          } else {
            this.searchList = null;
            this.isFound = false;
          }
        },
        (error) => {
          // console.log(error);
          this.searchList = null;
        }
      );
    }
  }

  clearSearch() {
    this.searchList = null;
    this.isFound = false;
  }

  likecp(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    this.auth.update('like_craft', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post liked');
          this.viewcraft(this.ID);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('connect to the internet and try again');
        } else {
          this.spinner.hide();
          // this.alert.error('Post liked not successful try again later');
        }
      }
    );
  }
  fell(id) {
    this.router.navigate(['/user/',id]);
  }
  copy(text){
    this.clipboardService.copyFromContent(text);
    this.alert.info('Post link copied');
    // this.alert.success(text);
  }

  unclike(id) {
    this.spinner.show();
    const data = {
      craft_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    this.auth.update('unlike_craft', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post unliked');
          this.viewcraft(this.ID);
        }
      },
      (error) => {
        // console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('connect to the internet and try again');
        } else {
          this.spinner.hide();
          // this.alert.error('Post cant be unliked try again later');
        }
      }
    );
  }
  followuser(id) {
    this.spinner.show();
    const data = {
      follower_id: parseInt(localStorage.getItem('userID'), 10),
      user_id: id,
    };
    this.auth.update('follow', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('following successful');
          this.getfollowers(id);
          this.isFollow = null;
          this.searchList = null;
        }
      },
      (error) => {
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('connect to the internet and try again');
        } else {
          this.spinner.hide();
          // this.alert.error('can not follow user');
        }
      }
    );
  }

  unfollowuser(id) {
    this.spinner.show();
    const data = {
      user_id: id,
      follower_id: parseInt(localStorage.getItem('userID'), 10),
    };
    this.auth
      .update('un_follow', localStorage.getItem('userID'), data)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response !== null || response !== undefined) {
            this.alert.success('Unfollow successful');
            this.getfollowers(id);
            this.isFollow = null;
          this.searchList = null;
          }
        },
        (error) => {
          // console.log(error);
          this.spinner.hide();
          if (error.status === 500) {
            this.spinner.hide();
            this.alert.warning('connect to the internet and try again');
          } else {
            this.spinner.hide();
            // this.alert.error('can not unfollow user');
          }
        }
      );
  }
  getfollowers(id) {
    this.spinner.show();
    this.auth.show('get_profile_count', id).subscribe(
      (response) => {
        this.follow = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alert.error('connect to the internet and try again');
      }
    );
  }
  // notifications
  getnotifications() {
    this.auth.show('unread_notifications', localStorage.getItem('userID')).subscribe(
      (response) => {
         this.unread = response['data'];
         this.spinner.hide();
       },
       (error) => {
         this.spinner.hide();
         this.alert.error('connect to the internet and try again');
         // console.log(error);
       }
     );
  }


  getAllnotifications() {
    this.auth.show('notifications', localStorage.getItem('userID')).subscribe(
      (response) => {
        //  console.log(response);
         if (response['success'] === true) {
          this.isNoti = true;
          this.Allnoti = response['data']['data'];
          // console.log(this.Allnoti);
        } else {
          this.Allnoti = null;
          this.isNoti = false;
        }
      },
       (error) => {
         this.spinner.hide();
         this.alert.error('try again');
         // console.log(error);
       }
     );
  }

  deleteNotivication(id) {
    // this.isLoader = true;
    const data = {
      id: id,
    };
    // console.log(data);
    this.auth.destroy('remove_notification',localStorage.getItem('userID'), data).subscribe(
      response => {
        this.isLoading = false;
        // this.alert.success("Comment deleted successfully");
        this.getAllnotifications();
      },
      error => {
        // console.log(error);
        this.isLoading = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }
  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['login']);
  }

  no() {
    this.modalService.dismissAll();
  }
  openReportContent(report) {
    this.modalService.open(report, {centered: true, size: 'sm' });
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
  contact(){
    this.router.navigate(['/contact/']);
  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {centered: true, size: 'sm' });
  }
  view(ev) {
    this.isShow = !this.isShow;
    this.auth.show('craft', ev).subscribe(
      (response) => {
        this.Psts = response['data'];
        // console.log(this.Psts)
      },
      (error) => {
        // console.log(error);
        this.alert.error('Getting data unsuccessful. Please connect to the internet and try again');
      }
    );
  }
  opensms(sms) {
    this.modalService.open(sms, {centered: true, size: 'sm' });
  }
  close(votepost) {
    this.modalService.dismissAll(votepost);
  }
  viewcraft(ev) {
    this.auth.show('craft', ev).subscribe(
      (response) => {
        this.craft = response['data'];
        // console.log(this.craft);
        this.isLoading = false;
      },
      (error) => {
        // console.log(error);
        this.alert.warning('Getting data unsuccessful. Please connect to the internet and try again');
      }
    );
  }
  voteContent(votepost) {
    this.modalService.open(votepost, {  size: 'sm',centered:true });
  }
   // building vote data
 buildVData() {
  this.voteDetails.amount = this.amount * this.voteForm.controls['num_of_votes'].value;
  // this.voteDetails.client_request_id = this.clientID;
  this.voteDetails.craft_id = this.ID;
  this.voteDetails.network =  this.voteForm.controls['network'].value;
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

vote() {
  // this.buildData();
  const data = {
    craft_id: this.ID,
    user_id: parseInt(localStorage.getItem('userID'), 10),
    msisdn: parseInt('233' + this.voteForm.controls['momo_number'].value),
    num_of_votes: this.voteForm.controls['num_of_votes'].value,
    amount: this.amount * this.voteForm.controls['num_of_votes'].value,
    network: this.voteForm.controls['network'].value,

  };
  // console.log(data);
   this.auth.update('vote', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['success'] === false) {
          this.alert.warning(response['message']);
        } else {
          this.alert.success('Thanks for voting');
          this.viewcraft(this.ID);
        }
      },
      (error) => {
        // console.log(error);
        this.alert.warning('connect to the internet and try again');
      }
    );
}
reportpost(id){
  const data = {
    content_id: id,
    user_id: parseInt(localStorage.getItem('userID'), 10),
    complaint: this.reportForm.controls['complaint'].value
  };
  // console.log(data);
  this.auth.update('complaint', localStorage.getItem('userID'), data).subscribe(
    (response) => {
      // console.log(response);
      this.spinner.hide();
      if (response !== null || response !== undefined) {
        this.viewcraft(this.ID);
      }
    },
    (error) => {
      // console.log(error);
      this.spinner.hide();
      if (error.status === 500) {
        this.spinner.hide();
        this.alert.warning('connect to the internet and try again');
      } else {
        this.spinner.hide();
        // this.alert.error('Report did not go through try again later');
      }
    }
  );
}
voteCount(post) {
  this.numVotes = post['votes'].reduce((accum,item) => accum + item.num_of_votes, 0)
}

getcompetition() {
  this.isLoading = true;
  this.auth.get('competitions').subscribe(
    (response) => {
      this.isLoading = false;
      this.viewcompetition = response['data'][0];
      this.amount = this.viewcompetition.vote_fees;
      console.log(this.amount);
      this.COMPID = this.viewcompetition.id;
      console.log(this.viewcompetition)
    },
    (error) => {
      this.isLoading = false;
      this.alert.error('Getting data unsuccessful. Please connect to the internet and try again');
    }
  );
}

}
