import { Component, OnInit } from '@angular/core';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
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
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [NgbTabsetConfig], // add NgbTabsetConfig to the component providers
})
export class ProfileComponent implements OnInit {
  public isMenuCollapsed = true;
  // formBuild
  postForm: FormGroup;
  commentForm: FormGroup;
  searchForm: FormGroup;

  id: string;
  username: string;
  profileEditForm: FormGroup;
  editProfile: any;
  url: any;
  selectedFile = null;
  format: any;
  isShow = false;
  imageForm: FormGroup;
  profileImage = null;
  isFound = false;
  searchList = null;
  isLoader = false;
  followers: any;
  following: any;
  search = '';
  isNoti = false;
  Allnoti: any;
  unread:any;

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  // all_users: any;
  user: any;
  allPosts: any;
  profile: any;
  follow: any;
  Posts: any;
  postlength: any;
  token: any;
  viewPost: any;
  post: any;
  allUsers: any;
  user_id: any;
  isData: any;
  isFollow: any;
  isFollowData: any;


  // comment variable declaration
  commentDetails = {
    user_id: '',
    post_id: '',
    message: '',
  };



  profileEditDetails = {
    title: '',
    username: '',
    fullname: '',
    personal_message: '',
    email: '',
    phone: '',
  };
  // Post Data
  postData = {
    caption: '',
    file: this.selectedFile,
    location: 'Unknown',
    user_id: localStorage.getItem('userID'),
    file_type: this.format,
  };

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    conTabfig: NgbTabsetConfig,
    private clipboardService: ClipboardService
  ) {
    this.imageForm = formBuilder.group({
      profile_image: [null]
    });
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null, Validators.required],
    });


    // customize default values of tabsets used by this component tree
    conTabfig.justify = 'center';
    conTabfig.type = 'pills';
  }

  ngOnInit(): void {
    this.isLoader = true;

    this.user_id = localStorage.getItem('userID');

    this.getUser();
    this.getUsers();
    this.getnotifications();
    this.getAllnotifications();


    this.token = localStorage.getItem('token');
    this.getfollowers();
    this.getUserpost();
    // var rellaxHeader = new Rellax('.rellax-header');

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    // post data form
    this.postForm = this.formBuilder.group({
      caption: [null,Validators.required],
      file: [null],
      file_type: [null],
    });
    // initializing edit form for user
    this.profileEditForm = this.formBuilder.group({
      username: [''],
      fullname: [''],
      title: [''],
      personal_message: [''],
      phone: [''],
      email: [''],
    });
    // this.prepareEditForm();
    // this.isLoader = false;
    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null, Validators.required],
    });

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


  trackLikes(cra) {
    this.isData = cra['likes'].filter((like) => {
      return like.user_id == this.user_id;
    });
    // console.log(this.isData);
  }
  trackLike(post) {
    this.isData = post['likes'].filter((like) => {
      return like.user_id == this.user_id;
    });
    // console.log(this.isData);
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
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post liked');
          this.view(id);
          this.getUserpost();
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
    console.log(data);
    this.auth.update('unlike', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Post unliked');
          this.view(id);
          this.getUserpost();

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
    console.log(data);
    this.auth.update('comment', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        // console.log(response);
        this.spinner.hide();
        if (response !== null || response !== undefined) {
          // this.alert.success('Comment posted successfully');
          this.view(id);
          this.getUserpost();
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


  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, {  size: 'lg'});
  }
  openProfile(profile) {
    this.modalService.open(profile, { centered: true, size: 'sm' });
  }

  openpost(postModal) {
    this.modalService.open(postModal, { centered: true, size: 'sm' });
  }
  openfollowers(followers) {
    this.modalService.open(followers, { centered: true, scrollable: true });
  }

  openfollowing(following) {
    this.modalService.open(following, { centered: true, scrollable: true });
  }


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
      if (file.type.indexOf('image') > -1) {
        this.format = 'IMAGE';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'VIDEO';
      }
      reader.onload = (event) => {
        this.selectedFile = event.target.result;
        this.postForm.get('file').setValue(file);
        this.postForm.get('file_type').setValue(this.format);
      };
    }
  }

  cancel() {
    this.selectedFile = null;
  }

  buildData() {
    this.postData.caption = this.postForm.controls['caption'].value;
  }

  createPost() {
    this.isLoader = true;

    const formData = new FormData();

    formData.append('caption', this.postForm.get('caption').value);
    formData.append('file', this.postForm.get('file').value);
    formData.append('location', 'Sent from Web');
    // formData.append('user_id', localStorage.getItem('userID'));
    formData.append('file_type', this.postForm.get('file_type').value);

    console.log(formData);

    this.auth
      .update('post', localStorage.getItem('userID'), formData)
      .subscribe(
        (response) => {
          // console.log(response);
          this.isLoader = false;
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            // this.alert.success('Post added successfully');
            this.getUserpost();
            this.getfollowers();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('connect to the internet and try again');
        }
      );
  }

  getUserpost() {
    // this.isLoader = true;
    this.auth.show('user_posts', localStorage.getItem('userID')).subscribe(
      (response) => {
        // console.log(response);
        this.allPosts = response['data'];
        this.postlength = response['data'].length;
        this.isLoader = false;
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }

  getfollowers() {
    // this.isLoader = true;
    this.auth
      .show('get_profile_count', localStorage.getItem('userID'))
      .subscribe(
        (response) => {
          // console.log(response);
          this.follow = response;
          this.isLoader = false;
        },
        (error) => {
          this.isLoader = false;
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
    console.log(this.isFollowData);
  }
   // Checking if you follow searched user
   trackFollows(user) {
    this.isFollow = user['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });
    // console.log(this.isFollow);
  }


  openContent(logoutModal) {
    this.modalService.open(logoutModal, { size: 'sm', centered: true });
  }

  opentContent(eitModal) {
    this.modalService.open(eitModal, { size: 'md', centered: true });
  }
  openReportContent(report) {
    this.modalService.open(report, {centered: true, size: 'sm' });
  }
  opendeleteContent(del) {
    this.modalService.open(del, {centered: true, size: 'sm' });
  }
  openProfileContent(profile) {
    this.modalService.open(profile, {centered: true, size: 'sm' });
  }



  onLogout() {
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['login']);
  }

  no() {
    this.modalService.dismissAll();
  }


  // Get user
  getUser() {
    // this.isLoader = true;
    this.auth.show('user', localStorage.getItem('userID')).subscribe(
      (response) => {
        this.user = null;
        // console.log(response['data']);
        this.user = response['data'];
        this.prepareEditForm();
        this.isLoader = false;
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }


  viewpost(id) {
    // this.isLoader = true;
    this.auth.show('user_posts', id).subscribe(
      (response) => {
        this.isLoader = false;
        this.viewPost = response['data'];
        // console.log(this.viewPost);
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }


  prepareEditForm() {
    this.profileEditForm.get('title').setValue(this.user.title);
    this.profileEditForm.get('username').setValue(this.user.username);
    this.profileEditForm.get('fullname').setValue(this.user.fullname);
    this.profileEditForm
      .get('personal_message')
      .setValue(this.user.personal_message);
    this.profileEditForm.get('email').setValue(this.user.email);
    this.profileEditForm.get('phone').setValue(this.user.phone);
    // this.profileEditForm.get("user_type").setValue(this.user.user_type);
  }


  setEditData() {
    this.profileEditDetails.username = this.profileEditForm.controls[
      'username'
    ].value;
    this.profileEditDetails.fullname = this.profileEditForm.controls[
      'fullname'
    ].value;
    this.profileEditDetails.title = this.profileEditForm.controls[
      'title'
    ].value;
    this.profileEditDetails.personal_message = this.profileEditForm.controls[
      'personal_message'
    ].value;
    this.profileEditDetails.email = this.profileEditForm.controls[
      'email'
    ].value;
    this.profileEditDetails.phone = this.profileEditForm.controls[
      'phone'
    ].value;
  }


  editUser() {
    this.isLoader = true;
    this.setEditData();
    // console.log(this.profileEditDetails);
    this.auth
      .update(
        'update_user_web',
        localStorage.getItem('userID'),
        this.profileEditDetails
      )
      .subscribe(
        (response) => {
          this.isLoader = false;
          if (response !== null || response !== undefined) {
            // this.alert.success('User Profile Updated successfully');
            this.getUser();
          }
        },
        (error) => {
          console.log(error);
          this.isLoader = false;
          if (error.status === 500) {
            this.alert.warning(
              'connect to the internet and try again'
            );
          } else {
            // this.alert.error('User update failed, try again later.');
          }
        }
      );
  }


  view(ev) {
    // this.isLoader = true;
    this.auth.show('post', ev).subscribe(
      (response) => {
        // this.isLoader = false;
        this.Posts = response['data'];
        console.log(this.Posts);
      },
      (error) => {
        // console.log(error);
        this.alert.warning('Getting data unsuccessful. Please connect to the internet and try again');
      }
    );
  }


  openSContent(singlepost) {
    this.modalService.open(singlepost, { size: 'lg' });
  }


  fell(id) {
    this.router.navigate(['/user/', id]);
  }

  // Getting image functionality
  onImageChanged(event) {
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
      if (file.type.indexOf('image') > -1) {
        this.format = 'IMAGE';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'VIDEO';
        this.alert.info('Videos not allowed');
        return false;
      }
      reader.onload = (event) => {
        this.selectedFile = event.target.result;
        this.imageForm.get('profile_image').setValue(file);

        // this.postForm.get('file_type').setValue(this.format);
      };
    }

    this.updateImage();
  }

  cancelProfile() {
    this.profileImage = null;
  }

  updateImage() {
    this.isLoader = true;
    const imageData = new FormData();

    imageData.append(
      'profile_image',
      this.imageForm.get('profile_image').value
    );

    imageData.append('user_id', localStorage.getItem('userID'));

    // console.log(imageData);

    this.auth
      .update('profile_photo', localStorage.getItem('userID'), imageData)
      .subscribe(
        (response) => {
          this.isLoader = false;
          if (response['success'] === false) {
            // this.alert.warning(response['message']);
          } else {
            // this.alert.success('Profile image update successful');
            this.getUser();
          }
        },
        (error) => {
          // console.log(error);
          this.isLoader = false;
          this.alert.warning('connect to the internet and try again');
        }
      );
  }

  removeProfile() {
    this.auth
      .update('remove_profile_photo',localStorage.getItem('userID'),localStorage.getItem('userID'))
      .subscribe(
        (response) => {
          this.isLoader = false;
          if (response['success'] === false) {
            // this.alert.warning(response['message']);
          } else {
            // this.alert.success('Profile image update successful');
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('connect to the internet and try again');
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

  contact() {
    this.router.navigate(['/contact/']);
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
        console.log(error);
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


  getUsers() {
    // this.isLoader = true;
    this.auth.get('users').subscribe(
      (response) => {
        // console.log(response);
        if (response['data']['data'].length > 0) {
          this.allUsers = response['data']['data'];
          // console.log(this.allUsers);
          this.isLoader = false;
        } else {
          this.isLoader = false;
          // this.alert.info('No Data available yet');
        }
      },
      (error) => {
        this.isLoader = false;
        // this.alert.error(error['message']);
      }
    );
  }
  copy(text){
    this.clipboardService.copyFromContent(text);
    this.alert.info('Post link copied');
    // this.alert.success(text);
  }


  // Delete post function
  deletePost(id) {
    // this.isLoader = true;
     // this.isLoader = true;
     const data = {
      id: id,
    };
    console.log(data);
    this.auth.destroy('remove_post',localStorage.getItem('userID'), data).subscribe(
      response => {
        // console.log(this.id);
        this.isLoader = false;
        // this.alert.success('Post deleted successfully');
        this.getUserpost();
      },
      error => {
        // console.log(error);
        this.isLoader = false;
        this.alert.info('Deleting Post Unsuccessful connect to the internet and try again later');
      }
    );
  }
  // Delete post function
  deleteComment(id) {
    // this.isLoader = true;
    const data = {
      id: id,
    };
    // console.log(data);
    this.auth.destroy('remove_comment',localStorage.getItem('userID'), data).subscribe(
      response => {
        this.isLoader = false;
        // this.alert.success("Comment deleted successfully");
        this.getUserpost();
      },
      error => {
        console.log(error);
        this.isLoader = false;
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
          console.log(this.Allnoti);
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
        this.isLoader = false;
        // this.alert.success("Comment deleted successfully");
        this.getAllnotifications();
      },
      error => {
        console.log(error);
        this.isLoader = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }
  notif(id) {
    this.router.navigate(['/notepost/',id]);
  }
}
