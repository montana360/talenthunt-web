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

import { ClipboardService } from 'ngx-clipboard'



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
  craftcommentForm: FormGroup;
  voteForm: FormGroup;
  reportForm: FormGroup;


  public isMenuCollapsed = true;

  // variable declaration
  Judges: any;
  craftID: any;
  amount: any;
  COMPID:any;
  id: string;
  username: string;
  url: any;
  craft: any;
  user_id: any;
  user: any;
  viewcompetition:any;
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
  isPart = true;
  numVotes = 0;
  next: '';
  search = '';
  searchList = null;
  isMineLike = false;
  isFound = false;
  isNoti = false;
  allCraft: any;

  prev_page = null;
  next_page = null;

  first_page_url = null;
  last_page_url = null;
  next_page_url = null;
  prev_page_url = null;

  notEmptyPost = true;
  notscrolly = true;

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
  // comment variable declaration
  craftcommentDetails = {
    user_id: '',
    craft_id: '',
    message: '',
  };
  reportDetails = {
    user_id: '',
    content_id: '',
    complaint: '',
  };


  // Post Data
  postData = {
    caption: '',
    file: this.selectedFile,
    location: 'Unknown',
    user_id: localStorage.getItem('userID'),
    file_type: this.format,
  };
// notifications
unread:any;
Allnoti:any;

slides = [


];

  slideConfig = { slidesToShow: 4, slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          // dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ] };
  slideConfi = {slidesToShow: 3, slidesToScroll: 1,autoplay:true,
  autoplaySpeed:3000,arrows:true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        // dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]};


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

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
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
    this.loadNextPost();
    this.getnotifications();
    this.getAllnotifications();
    // console.log(this.router.url);
    // console.log(window.location.href);

    this.isLoading = true;
    this.user_id = localStorage.getItem('userID');
    this.getUsers();
    this.getcompetition();
    // this.vi(this.compID);
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    this.getpost();
    this.getCraft();
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    // building comment form
    this.commentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });

    // post data form
    this.postForm = this.formBuilder.group({
      caption: [null,Validators.required],
      file: [null],
      file_type: [null],
    });

    // search form
    this.searchForm = this.formBuilder.group({
      search: [null],
    });

    this.craftcommentForm = this.formBuilder.group({
      user_id: [null],
      message: [null,Validators.required],
    });

    this.reportForm = this.formBuilder.group({
      user_id: [null],
      complaint: [null,Validators.required],
    });

    // this.callPostsAgain();
  }

  callPostsAgain() {
    setTimeout(() => {
      this.getpost();
      console.log('Posts called again');
    }, 10000);
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
 // set craftcomment data
   setCraftCommentData() {
    this.craftcommentDetails.user_id = this.craftcommentForm.controls['user_id'].value;
    this.craftcommentDetails.message = this.craftcommentForm.controls['message'].value;
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
          // this.alert.success('Thank for you for reporting this post');
          this.getpost();
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
          // this.alert.success('Comment posted successfully');
          this.getpost();
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
          // this.alert.error('Post liked not successful try again later');
        }
      }
    );
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
          // this.alert.error('Post cant be unliked try again later');
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
          this.getpost()
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
          this.getpost()
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
          console.log(error);
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
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, {centered: true, size: 'sm' });
  }
  openReportContent(report) {
    this.modalService.open(report, {centered: true, size: 'sm' });
  }

  openpost(postModal) {
    this.modalService.open(postModal, {centered: true, size: 'sm' });
  }

  openContent(logoutModal) {
    this.modalService.open(logoutModal, {centered: true, size: 'sm' });
  }
  opensms(sms) {
    this.modalService.open(sms, {centered: true, size: 'sm' });
  }

  openUserContent(usermodal) {
    this.modalService.open(usermodal, { size: 'lg' });
  }
  openCompContent(competition) {
    this.modalService.open(competition, { size: 'md' });
  }
  openSContent(singlepost) {
    this.modalService.open(singlepost, { size: 'lg' });
  }


  getpost() {
    // this.isLoading = true;
    this.auth.get('posts').subscribe(
      (response) => {
        this.allPosts = response['data']['data'];
        this.next_page_url = response['data']['next_page_url'];
        this.prev_page_url = response['data']['prev_page_url'];
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.alert.warning('connect to the internet and try again');
        // console.log(error);
      }
    );
  }
  onScroll(){
    console.log("Scrolled");
    if(this.notscrolly && this.notEmptyPost){
      this.spinner.show();
      this.notscrolly = false;
      this.loadNextPost();
    }
  }



  loadNextPost(){
    console.log(this.next_page_url);

        this.auth.paginate(this.next_page_url)
        .subscribe((response) =>{
          console.log(response['data']);
          this.next_page_url = null;
          const newPost = response['data']['data'];
          this.next_page_url = response['data']['next_page_url'];
          console.log(this.next_page_url);
          this.prev_page_url = response['data']['prev_page_url'];
          if(this.next_page_url == null) {
            this.notEmptyPost = false;
          }

          // console.log(newPost);
          this.spinner.hide();
          this.allPosts = this.allPosts.concat(newPost);
          this.notscrolly = true;
        });
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
        this.isLoading = false;
        // this.alert.success("Comment deleted successfully");
        this.getAllnotifications();
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.alert.warning('connect to the internet and try again');
      }
    );
  }

  getUsers() {
    this.spinner.show();
    this.auth.get('users').subscribe(
      (response) => {
        if (response['data']['user_type'] = 'JD') {
          this.allUsers = response['data']['data'];
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

  getUserpost(id) {
    this.spinner.show();
    this.auth.show('user_posts', id).subscribe(
      (response) => {
        this.UserPosts = response['data'];
        // console.log(this.UserPosts);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alert.error('connect to the internet and try again');
        // console.log(error);
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

  viewuser(id) {
    this.spinner.show();
    this.auth.show('user', id).subscribe(
      (response) => {
        this.spinner.hide();
        this.vuser = response['data'];
      },
      (error) => {
        this.spinner.hide();
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

  getPostID(id) {
    this.commentDetails.post_id = id;
    // console.log(id);
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
          this.spinner.hide();
          if (response['success'] === false) {
            this.alert.warning(response['message']);
          } else {
            // this.alert.success('Post added successfully');
            this.getpost();
          }
        },
        (error) => {
          console.log(error);
          this.alert.warning('connect to the internet and try again');
        }
      );
  }

  view(ev) {
    this.isShow = !this.isShow;
    this.auth.show('post', ev).subscribe(
      (response) => {
        this.Psts = response['data'];
        console.log(this.Psts)
      },
      (error) => {
        // console.log(error);
        this.alert.error('Getting data unsuccessful. Please connect to the internet and try again');
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



  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    // console.log('slick initialized');
  }

  breakpoint(e) {
    // console.log('breakpoint');
  }

  afterChange(e) {
    // console.log('afterChange');
  }

  beforeChange(e) {
    // console.log('beforeChange');
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
  notif(id) {
    this.router.navigate(['/notepost/',id]);
  }
  vc(id) {
    this.router.navigate(['/single/',id]);
  }
  join(id) {
    this.router.navigate(['/join/',id]);
  }

  one(id) {
    console.log(id);
    this.router.navigate(['/one/',id]);
  }
  userCompStatus() {
    const data = {
      user_id: localStorage.getItem('userID'),
      competition_id: this.COMPID
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
   // Get all craft
getCraft() {
  // this.isLoading = true;
  this.auth.get('crafts').subscribe(
    response => {
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
      // this.alert.error(error['message']);
    }
  );
}
openCraft(singleCraft) {
  this.modalService.open(singleCraft, {   size: 'lg' });
}
close(votepost) {
  this.modalService.dismissAll(votepost);
}
viewcraft(ev) {
  this.auth.show('craft', ev).subscribe(
    (response) => {
      this.craft = response['data'];
    },
    (error) => {
      console.log(error);
      this.alert.warning('Getting data unsuccessful. Please connect to the internet and try again');
    }
  );
}
voteContent(votepost) {
  this.modalService.open(votepost, {  size: 'sm',centered:true });
}
viewcraf(ev) {
  this.auth.show('craft', ev).subscribe(
    (response) => {
      this.craft = response['data'][0];
      this.craftID = this.craft.id;
    },
    (error) => {
      console.log(error);
      this.alert.warning('Getting data unsuccessful. Please connect to the internet and try again');
    }
  );
}
 // building vote data
 buildVData() {
  this.voteDetails.amount = this.amount * this.voteForm.controls['num_of_votes'].value;
  // this.voteDetails.client_request_id = this.clientID;
  this.voteDetails.craft_id = this.craftID;
  this.voteDetails.network =  this.voteForm.controls['network'].value;
  this.voteDetails.num_of_votes = this.voteForm.controls['num_of_votes'].value;
  this.voteDetails.user_id = localStorage.getItem('userID');

  const msisdn = this.voteForm.controls['momo_code'].value + this.voteForm.controls['momo_number'].value;
  this.voteDetails.msisdn = msisdn;
}

vote() {
  // this.buildData();
  const data = {
    craft_id: this.craftID,
    user_id: parseInt(localStorage.getItem('userID'), 10),
    msisdn: parseInt('233' + this.voteForm.controls['momo_number'].value),
    num_of_votes: this.voteForm.controls['num_of_votes'].value,
    amount: this.amount * this.voteForm.controls['num_of_votes'].value,
    network: this.voteForm.controls['network'].value,

  };
  console.log(data);
   this.auth.update('vote', localStorage.getItem('userID'), data).subscribe(
      (response) => {
        this.spinner.hide();
        if (response['success'] === false) {
          this.alert.warning(response['message']);
        } else {
          this.alert.success('Thanks for voting');
          this.getCraft();
        }
      },
      error => {
        if (error.status === 500) {
        this.isLoading = false;
        this.alert.info(
          "Please Make sure you fill all fields."
        );
      }
       else if (error.status === 0) {
        this.isLoading = false;
        this.alert.info("Network error. No internet connectivity.");
      }
       else {
        this.isLoading = false;
        this.alert.info('Please check your internet connection and try again');
      }
      // console.log(error);
    }
    );
}
getcompetition() {
  this.isLoading = true;
  this.auth.get('competitions').subscribe(
    (response) => {
      this.isLoading = false;
      this.viewcompetition = response['data'][0];
      this.amount = this.viewcompetition.vote_fees;
      this.COMPID = this.viewcompetition.id;
      console.log(this.viewcompetition)
    },
    (error) => {
      this.isLoading = false;
      this.alert.error('Getting data unsuccessful. Please connect to the internet and try again');
    }
  );
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
      this.getpost();
    },
    error => {
      // console.log(error);
      this.isLoading = false;
      this.alert.warning('connect to the internet and try again');
    }
  );
}
voteC(cra) {
  this.numVotes = cra['votes'].reduce((accum,item) => accum + item.num_of_votes, 0)
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
  console.log(data);
  this.auth.destroy('remove_post',localStorage.getItem('userID'), data).subscribe(
    response => {
      console.log(this.id);
      this.isLoading = false;
      // this.alert.success('Post deleted successfully');
      this.getpost();
    },
    error => {
      console.log(error);
      this.isLoading = false;
      this.alert.info('Deleting Post Unsuccessful connect to the internet and try again later');
    }
  );
}
}
