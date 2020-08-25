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
  public isMenuCollapsed = true;
  searchForm:FormGroup;
  compID: any;
  COMPID: any;
  user_id: any;
  isLoading = false;
  viewcompetition: any;
  participants: any;
  competition:any;
  comData: any;
  isMineCompetition = false;
  isPart = true;
  isFound = false;
  searchList = null;
  followers: any;
  following: any;
  search = '';
  isNoti = false;
  Allnoti: any;
  unread:any;
  isFollow: any;
  isFollowData: any;
  follow:any;


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
    this.isLoading = true;
    this.getAllCompetitions();
    // this.compID = this.route.snapshot.paramMap.get("id");
    this.compID = 3;
    this.user_id = localStorage.getItem('userID');
    this.v(this.compID);
    this.userCompStatus();
    this.getAllCompetitions();
    this.getnotifications();
    this.getAllnotifications();
    this.getfollowers();


     // search form
     this.searchForm = this.formBuilder.group({
      search: [null],
    });
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

    // console.log(search);

    this.auth.update('search_user',localStorage.getItem('userID'), search).subscribe(
      (response) => {
        // console.log(response);
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

getfollowers() {
  // this.isLoader = true;
  this.auth
    .show('get_profile_count', localStorage.getItem('userID'))
    .subscribe(
      (response) => {
        // console.log(response);
        this.follow = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('connect to the internet and try again');
        // console.log(error);
      }
    );
}

// Tracking all followers of user
trackFollowing(user) {
  // console.log(data['follower']);
  this.isFollowData = user['follower']['follows'].filter((follow) => {
    return follow.follower_id == this.user_id;
  });
  // console.log(this.isFollowData);
}
 // Checking if you follow searched user
 trackFollows(user) {
  this.isFollow = user['follows'].filter((follow) => {
    return follow.follower_id == this.user_id;
  });
  // console.log(this.isFollow);
}
followuser(id) {
  this.spinner.show();
  const data = {
    follower_id: parseInt(localStorage.getItem('userID'), 10),
    user_id: id,
  };
  // console.log(data);
  this.auth.update('follow', localStorage.getItem('userID'), data).subscribe(
    (response) => {
      // console.log(response);
      this.spinner.hide();
      if (response !== null || response !== undefined) {
        // this.alert.success('following successful');
        // this.v(this.ID);
        this.getfollowers();
        this.isFollow = null;
        // this.searchList = null;
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
  // console.log(data);
  this.auth
    .update('un_follow', localStorage.getItem('userID'), data)
    .subscribe(
      (response) => {
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Unfollow successful');
          // this.v(this.ID);
          this.getfollowers();
          this.isFollow = null;
          // this.searchList = null;
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

fell(id) {
  this.router.navigate(['/user/', id]);
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
notif(id) {
  this.router.navigate(['/notepost/',id]);
}

  getAllCompetitions() {
    this.isLoading = true;
    this.auth.get("competitions").subscribe(
      response => {
        // console.log(response);
        this.isLoading = false;
        if (response["data"] !== null || response["data"] !== undefined) {
          this.competition = response["data"][0];
          this.COMPID = this.competition.id;
          // console.log(this.COMPID);
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
    // console.log(id);
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

  contact() {
    this.router.navigate(['/contact/']);
  }


  openContent(logoutModal) {
    this.modalService.open(logoutModal, {   size: 'sm' });
  }
  openServices(terms) {
    this.modalService.open(terms, { centered: true, scrollable:true });
  }

  userCompStatus() {
    const data = {
      user_id: localStorage.getItem('userID'),
      competition_id: this.compID
    };

    this.auth.update('check_registration_state', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        // console.log(response);
        if (response['data'].length > 0){
          this.isPart = false;
        }
      },
      (error) => {
        this.isLoading = false;
        this.alert.info('Getting data unsuccessful. Please try again');
      }
    );
  }
}
