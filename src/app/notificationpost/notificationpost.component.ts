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
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-notificationpost',
  templateUrl: './notificationpost.component.html',
  styleUrls: ['./notificationpost.component.css']
})
export class NotificationpostComponent implements OnInit {

  commentForm: FormGroup;
  searchForm: FormGroup;
  reportForm: FormGroup;

  public isMenuCollapsed = true;

  isFound = false;
  isLoading = false;
  ID= null;
  id: string;
  user_id= null;
  Psts:any;
  allPosts:any;
  allUsers:any;
  search = '';
  searchList = null;
  follow:any;
  // boolean
  isMine = false;
  isShow = false;
  isData: any;
  isFollow: any;
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  isLiked = false;
  likedisplay() {
    this.isLiked = !this.isLiked;
  }
  // comment variable declaration
  commentDetails = {
    user_id: '',
    post_id: '',
    message: '',
  };
  reportDetails = {
    user_id: '',
    content_id: '',
    complaint: '',
  };


  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private clipboardService: ClipboardService
  ) {
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });

    this.reportForm = this.formBuilder.group({
      user_id: [null],
      complaint: [null,Validators.required],
    });
   }

  ngOnInit(): void {
    this.isLoading =true;
    this.ID = this.route.snapshot.paramMap.get('id');
    this.user_id = localStorage.getItem('userID');
    this.v(this.ID);

    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });

    // search form
    this.searchForm = this.formBuilder.group({
      search: [null],
    });

    this.reportForm = this.formBuilder.group({
      user_id: [null],
      complaint: [null,Validators.required],
    });
  }

  copy(text){
    this.clipboardService.copyFromContent(text);
    this.alert.info('Post link copied');
    // this.alert.success(text);
  }

  // set report data
setReportData(){
  this.reportDetails.user_id = this.reportForm.controls['user_id'].value;
  this.reportDetails.complaint = this.reportForm.controls['complaint'].value;
}

  // set comment data
  setCommentData() {
    this.commentDetails.user_id = this.commentForm.controls['user_id'].value;
    this.commentDetails.message = this.commentForm.controls['message'].value;
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
          this.v(this.ID);
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

  // Checked if you liked a post
  trackLikes(post) {
    this.isData = post['likes'].filter((like) => {
      return like.user_id == this.user_id;
    });
  }

  // Checking if you follow searched user
  trackFollows(list) {
    this.isFollow = list['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });
  }

  addComment(id) {
    this.spinner.show();
    const data = {
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
      message: this.commentForm.controls['message'].value,
    };
    this.auth.update('comment', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.v(this.ID);
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
  likep(id) {
    this.spinner.show();
    const data = {
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    this.auth.update('like', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post liked');
          this.v(this.ID);
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

  unlike(id) {
    this.spinner.show();
    const data = {
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    this.auth.update('unlike', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post unliked');
          this.v(this.ID);
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
  openReportContent(report) {
    this.modalService.open(report, {centered: true, size: 'sm' });
  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {centered: true, size: 'sm' });
  }

  getUsers() {
    this.spinner.show();
    this.auth.get('users').subscribe(
      (response) => {
        if (response['data']['data'].length > 0) {
          this.allUsers = response['data']['data'];
          // console.log(this.allUsers);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.alert.info('No Data available yet');
        }
      },
      (error) => {
        this.spinner.hide();
        // this.alert.error(error['message']);
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

  getPostID(id) {
    this.commentDetails.post_id = id;
    // console.log(id);
  }
  deleteComment(id) {
    // this.isLoader = true;
    const data = {
      id: id,
    };
    console.log(data);
    this.auth.destroy('remove_comment',localStorage.getItem('userID'), data).subscribe(
      response => {
        this.isLoading = false;
        // this.alert.success("Comment deleted successfully");
        this.v(this.ID);
      },
      error => {
        // console.log(error);
        this.isLoading = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }
  opendeleteContent(del) {
    this.modalService.open(del, {centered: true, size: 'sm' });
  }
  deletePost(id) {
    // this.isLoader = true;
     // this.isLoader = true;
     const data = {
      id: id,
    };
    // console.log(data);
    this.auth.destroy('remove_post',localStorage.getItem('userID'), data).subscribe(
      response => {
        // console.log(this.id);
        this.isLoading = false;
        // this.alert.success('Post deleted successfully');
        this.router.navigate(['/homepage/']);
      },
      error => {
        // console.log(error);
        this.isLoading = false;
        this.alert.info('Deleting Post Unsuccessful connect to the internet and try again later');
      }
    );
  }
  v(id) {
    this.auth.show('post', id).subscribe(
      (response) => {
        // console.log(response);
        this.allPosts = response['data'];
        // this.trackFollows();
        // console.log(this.viewuser['follows']);
        this.isLoading =false;
      },
      (error) => {
        this.alert.info('Getting data unsuccessful. Please connect to the internet and try again');
      }
    );
  }
  view(ev) {
    this.isShow = !this.isShow;
    this.auth.show('post', ev).subscribe(
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
  fell(id) {
    this.router.navigate(['/user/',id]);
  }
}
