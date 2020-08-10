import { Component, OnInit } from '@angular/core';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
  NgbTabsetConfig,
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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  public isMenuCollapsed = true;

  isShow = false;
  commentForm: FormGroup;
  isLoading = false;
  viewuser= null;
  allPosts= null;
  viewPost= null;
  Posts= null;
  follow= null;
  ID= null;
  user_id= null;
  isFollow= null;
  isData= null;

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  // comment variable declaration
  commentDetails = {
    user_id: '',
    post_id: '',
    message: '',
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
    conTabfig: NgbTabsetConfig
  ) {
    // customize default values of tabsets used by this component tree
    conTabfig.justify = 'center';
    conTabfig.type = 'pills';
    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.isLoading =true
    this.ID = this.route.snapshot.paramMap.get('id');
    this.user_id = localStorage.getItem('userID');
    this.v(this.ID);
    this.getfollowers
    (this.ID);
    this.getUserpost(this.ID);

    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null, Validators.required],
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
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
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    console.log(data);
    this.auth.update('like', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Post liked');
          this.view(id);
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
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
    };
    console.log(data);
    this.auth.update('unlike', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Post unliked');
          this.view(id);
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
    this.commentDetails.user_id = this.commentForm.controls['user_id'].value;
    this.commentDetails.message = this.commentForm.controls['message'].value;
  }

  addComment(id) {
    this.spinner.show();
    const data = {
      post_id: id,
      user_id: parseInt(localStorage.getItem('userID'), 10),
      message: this.commentForm.controls['message'].value,
    };
    // console.log(data);
    this.auth.update('comment', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('Comment posted successfully');
          this.view(id);
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

  view(ev) {
    this.auth.show('post', ev).subscribe(
      (response) => {
        this.Posts = response['data'];
        console.log(this.Posts);
      },
      (error) => {
        console.log(error);
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
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


  homePage() {
    this.router.navigate(['/homepage/']);
  }


  profilePage() {
    this.router.navigate(['/profile/']);
  }


  aboutpage() {
    this.router.navigate(['/about/']);
  }

  contact() {
    this.router.navigate(['/contact/']);
  }

  compage() {
    this.router.navigate(['/terms/']);
  }


  v(id) {
    this.auth.show('user', id).subscribe(
      (response) => {
        console.log(response);
        this.viewuser = response['data'];
        this.trackFollows();
        // console.log(this.viewuser['follows']);
      },
      (error) => {
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );
  }


  // Checking if you follow searched user
  trackFollows() {
    this.isFollow = this.viewuser['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });
  }

  getfollowers(id) {
    this.isLoading = true;
    this.auth.show('get_profile_count', id).subscribe(
      (response) => {
        console.log(response);
        this.follow = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('Error loading post');
        console.log(error);
      }
    );
  }


  getUserpost(id) {
    console.log(id);
    this.isLoading = true;
    this.auth.show('user_posts', id).subscribe(
      (response) => {
        this.allPosts = response['data'];
        console.log(this.allPosts);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        this.alert.error('Error loading post');
      }
    );
  }


  openScrollableContent(longContent) {
    this.modalService.open(longContent, { size: 'lg' });
  }

  followuser(id) {
    this.spinner.show();
    const data = {
      follower_id: parseInt(localStorage.getItem('userID'), 10),
      user_id: id,
    };
    console.log(data);
    this.auth.update('follow', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          this.alert.success('following successful');
          this.v(this.ID);
          this.getfollowers(id);
          this.isFollow = null;
          // this.searchList = null;
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        if (error.status === 500) {
          this.spinner.hide();
          this.alert.warning('Internal Server Error');
        } else {
          this.spinner.hide();
          this.alert.error('can not follow user');
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
    console.log(data);
    this.auth
      .update('un_follow', localStorage.getItem('userID'), data)
      .subscribe(
        (response) => {
          console.log(response);
          this.spinner.hide();
          if (response !== null || response !== undefined) {
            this.alert.success('Unfollow successful');
            this.v(this.ID);
            this.getfollowers(id);
            this.isFollow = null;
            // this.searchList = null;
          }
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          if (error.status === 500) {
            this.spinner.hide();
            this.alert.warning('Internal Server Error');
          } else {
            this.spinner.hide();
            this.alert.error('can not unfollow user');
          }
        }
      );
  }


  fell(id) {
    this.isLoading = true;
    this.clear();
    this.router.navigate(['/user/', id]);
    this.v(this.ID);
    this.getfollowers(this.ID);
    this.getUserpost(this.ID);
    this.isLoading = false;
  }


  clear() {
    this.isLoading = false;
    // this.viewuser= null;
    this.allPosts= null;
    // this.viewPost= null;
    // this.Posts= null;
    this.follow= null;
    this.ID;
    this.isFollow= null;
    this.isData= null;
  }

  openfollowers(followers) {
    this.modalService.open(followers, { centered: true, scrollable: true });
  }

  openfollowing(following) {
    this.modalService.open(following, { centered: true, scrollable: true });
  }
}
