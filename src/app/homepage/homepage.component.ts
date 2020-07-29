import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
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
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  // formgroup
  commentForm: FormGroup;
  postForm: FormGroup;
  searchForm: FormGroup;

  // variable declaration
  id: string;
  username: string;
  url: any;
  user_id: any;
  user: any;
  UserPosts: any;
  allUsers: any;
  vuser: any;
  allPosts = null;
  profile: any;
  follow: any;
  commentlength: any;
  token: any;
  selectedFile = null;
  format: any;
  data: any;
  Psts: any;
  next: '';
  search = '';
  searchList = null;
  isMineLike = false;
  isFound = false;

  prev_page = null;
  next_page = null;

  first_page_url = null;
  last_page_url = null;
  next_page_url = null;
  prev_page_url = null;

  isLoading = false;
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

  // Post Data
  postData = {
    caption: '',
    file: this.selectedFile,
    location: 'Unknown',
    user_id: localStorage.getItem('userID'),
    file_type: this.format,
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

  slideConfig = { slidesToShow: 4, slidesToScroll: 4 };

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user_id = localStorage.getItem('userID');
    this.getUsers();
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    this.getpost();

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null],
    });

    // post data form
    this.postForm = this.formBuilder.group({
      caption: [null],
      file: [null],
      file_type: [null],
    });

    // search form
    this.searchForm = this.formBuilder.group({
      search: [null],
    });
  }
  // set comment data
  setCommentData() {
    this.commentDetails.user_id = this.commentForm.controls['user_id'].value;
    this.commentDetails.message = this.commentForm.controls['message'].value;
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

    // console.log(list['follows']);

    this.isFollow = list['follows'].filter((follow) => {
      return follow.follower_id == this.user_id;
    });

    console.log(this.isFollow);
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
          this.getpost();
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
          this.getpost();
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
          this.getpost();
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
          this.getpost();
          this.getfollowers(id);
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
          this.alert.error('Post cant be unliked try again later');
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
            this.getpost();
            this.getfollowers(id);
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
            this.alert.error('Post cant be unliked try again later');
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
    this.modalService.open(longContent, {centered: true, size: 'sm' });
  }

  openpost(postModal) {
    this.modalService.open(postModal, {centered: true, size: 'sm' });
  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {centered: true, size: 'sm' });
  }

  openUserContent(usermodal) {
    this.modalService.open(usermodal, { size: 'lg' });
  }
  openSContent(singlepost) {
    this.modalService.open(singlepost, { size: 'lg' });
  }
  getpost() {
    this.isLoading = true;
    this.auth.get('posts').subscribe(
      (response) => {
        console.log(response['data']['data']);
        this.allPosts = response['data']['data'];
        this.first_page_url = response['data']['first_page_url'];
        this.last_page_url = response['data']['last_page_url'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert.error('Error loading user Data');
        // console.log(error);
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
          // console.log(this.allUsers);
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

  getUserpost(id) {
    this.spinner.show();
    this.auth.show('user_posts', id).subscribe(
      (response) => {
        console.log(response);
        this.UserPosts = response['data'];
        console.log(this.UserPosts);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alert.error('Error loading post');
        // console.log(error);
      }
    );
  }

  getfollowers(id) {
    this.spinner.show();
    this.auth.show('get_profile_count', id).subscribe(
      (response) => {
        console.log(response);
        this.follow = response;
        console.log(this.follow);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alert.error('Error loading post');
        // console.log(error);
      }
    );
  }

  viewuser(id) {
    this.spinner.show();
    this.auth.show('user', id).subscribe(
      (response) => {
        console.log(response);
        this.spinner.hide();
        this.vuser = response['data'];
        console.log(this.vuser);
      },
      (error) => {
        this.spinner.hide();
        // console.log(error);
        this.alert.warning('Could not get requested data');
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
    console.log(id);
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
    this.spinner.show();

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
          this.spinner.hide();
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            this.alert.success('Post added successfully');
            this.getpost();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('Error sending data');
        }
      );
  }

  v() {
    this.url = ['next_page_url'];
  }
  view(ev) {
    this.auth.show('post', ev).subscribe(
      (response) => {
        console.log(response['data']);
        this.Psts = response['data'];
        console.log(this.Psts);
      },
      (error) => {
        console.log(error);
        this.alert.error('Getting data unsuccessful. Please try again');
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

      // console.log(search);

      this.auth.update('search_user',localStorage.getItem('userID'), search).subscribe(
        (response) => {
          console.log(response);
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

  nextPage() {
    console.log(this.next_page_url);
    this.auth.paginate(this.next_page_url).subscribe(
      (response) => {
        this.allPosts = response['data']['data'];
        this.first_page_url = response['data']['first_page_url'];
        this.last_page_url = response['data']['last_page_url'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
      },
      (error) => {
        console.log(error);
        this.alert.error('Could not get more data...');
      }
    );
  }

  prevPage() {
    console.log(this.prev_page_url);
    this.auth.paginate(this.prev_page_url).subscribe(
      (response) => {
        this.allPosts = response['data']['data'];
        this.first_page_url = response['data']['first_page_url'];
        this.last_page_url = response['data']['last_page_url'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
      },
      (error) => {
        console.log(error);
        this.alert.error('Could not get more data...');
      }
    );
  }

  firstPage() {
    // console.log(this.prev_page_url);
    this.auth.paginate(this.first_page_url).subscribe(
      (response) => {
        this.allPosts = response['data']['data'];
        this.first_page_url = response['data']['first_page_url'];
        this.last_page_url = response['data']['last_page_url'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
      },
      (error) => {
        console.log(error);
        this.alert.error('Could not get more data...');
      }
    );
  }

  lastPage() {
    // console.log(this.prev_page_url);
    this.auth.paginate(this.last_page_url).subscribe(
      (response) => {
        this.allPosts = response['data']['data'];
        this.first_page_url = response['data']['first_page_url'];
        this.last_page_url = response['data']['last_page_url'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
      },
      (error) => {
        console.log(error);
        this.alert.error('Could not get more data...');
      }
    );
  }

  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }

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
  fell(id) {
    this.router.navigate(['/user/',id]);
  }
}
