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

  isLoader = false;

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
  usersIFollow: any;

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
    conTabfig: NgbTabsetConfig
  ) {
    this.imageForm = formBuilder.group({
      profile_image: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
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
      caption: [null],
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
    this.isLoader = false;
    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null, Validators.required],
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
    console.log(data);
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
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true, size: 'lg' });
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
          console.log(response);
          this.isLoader = false;
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            this.alert.success('Post added successfully');
            this.getUserpost();
            this.getfollowers();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
        }
      );
  }

  getUserpost() {
    this.isLoader = true;
    this.auth.show('user_posts', localStorage.getItem('userID')).subscribe(
      (response) => {
        this.allPosts = response['data'];
        this.postlength = response['data'].length;
        this.isLoader = false;
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.error('Error loading post');
      }
    );
  }

  getfollowers() {
    this.isLoader = true;
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
          this.alert.error('Error loading post');
          console.log(error);
        }
      );
  }

  // Tracking all followers of user
  trackUserFollowers(id) {
    this.auth.show('user', id).subscribe(
      (response) => {
        console.log(response['data']);
        this.usersIFollow = response['data']['followers'].filter((follow) => {
          return follow.follower_id == this.user_id;
        });
        console.log(this.usersIFollow);
      },
      (error) => {
        this.alert.error('Getting data unsuccessful. Please try again');
      }
    );

  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, { size: 'sm', centered: true });
  }

  opentContent(eitModal) {
    this.modalService.open(eitModal, { size: 'md', centered: true });
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
    this.isLoader = true;
    this.auth.show('user', localStorage.getItem('userID')).subscribe(
      (response) => {
        // console.log(response['data']);
        this.user = response['data'];
        this.prepareEditForm();
        this.isLoader = false;
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.error('Error loading user Data');
      }
    );
  }


  viewpost(id) {
    this.isLoader = true;
    this.auth.show('user_posts', id).subscribe(
      (response) => {
        this.isLoader = false;
        this.viewPost = response['data'];
        console.log(this.viewPost);
      },
      (error) => {
        console.log(error);
        this.isLoader = false;
        this.alert.warning('Could not get requested data');
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
            this.alert.success('User message Updated successfully');
            this.getUser();
          }
        },
        (error) => {
          console.log(error);
          this.isLoader = false;
          if (error.status === 500) {
            this.alert.warning(
              'Can not update the information, please check the data'
            );
          } else {
            this.alert.error('User update failed, try again later.');
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

      reader.onload = (event) => {
        this.selectedFile = event.target.result;
        this.imageForm.get('profile_image').setValue(file);
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

    this.auth
      .update('profile_photo', localStorage.getItem('userID'), imageData)
      .subscribe(
        (response) => {
          this.isLoader = false;
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            this.alert.success('Profile image update successful');
            this.getUser();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
        }
      );
  }

  removeProfile() {
    this.auth
      .show('remove_profile_photo', localStorage.getItem('userID'))
      .subscribe(
        (response) => {
          this.isLoader = false;
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            this.alert.success('Profile image update successful');
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
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

  // Checking if you follow searched user
  trackFollows(user) {
    this.isFollow = user['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });
    console.log(this.isFollow);
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
            this.alert.warning('Internal Server Error');
          } else {
            this.spinner.hide();
            this.alert.error('can not unfollow user');
          }
        }
      );
  }


  getUsers() {
    this.spinner.show();
    this.auth.get('users').subscribe(
      (response) => {
        // console.log(response);
        if (response['data']['data'].length > 0) {
          this.allUsers = response['data']['data'];
          console.log(this.allUsers);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.alert.info('No Data available yet');
        }
      },
      (error) => {
        this.spinner.hide();
        this.alert.error(error['message']);
      }
    );
  }
}
