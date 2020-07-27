import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 // formBuild
 postForm: FormGroup;
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

 isLoading = false;

 toggleDisplay() {
   this.isShow = !this.isShow;
 }
 // all_users: any;
 user: any;
 allPosts: any;
 profile: any;
 follow: any;
 Posts:any;
 postlength: any;
 token: any;
 viewPost: any;
 post:any;

 profileEditDetails = {
   title:"",
   username: "",
   fullname: "",
   personal_message:"",
   email: "",
   phone: "",
 };
 // Post Data
 postData = {
   caption: '',
   file: this.selectedFile,
   location: 'Unknown',
   user_id: localStorage.getItem('userID'),
   file_type: this.format
 }

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.imageForm = formBuilder.group({
      profile_image: [null, Validators.compose([Validators.required, Validators.email])],
    });
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user);
  // this.profile = JSON.parse(localStorage.getItem("user_profile"));
  this.token = localStorage.getItem('token');
  this.getfollowers();
  this.username = localStorage.getItem("fullname");
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
    username: [""],
    fullname: [""],
    title:[""],
    personal_message: [""],
    phone: [""],
    email: [""],
  });
  this.prepareEditForm();
  this.isLoading=false;
  }
  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('profile-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
}
openScrollableContent(longContent) {
  this.modalService.open(longContent, { scrollable: true,  size: 'sm' });
}
openpost(postModal) {
  this.modalService.open(postModal, { scrollable: true, size: 'sm' });
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
    }
  }
}


cancel() {
  this.selectedFile = null;
}


buildData() {
  this.postData.caption = this.postForm.controls['caption'].value;
}
createPost() {
  this.isLoading=true;

  const formData = new FormData();

  formData.append('caption', this.postForm.get('caption').value);
  formData.append('file', this.postForm.get('file').value);
  formData.append('location', 'Sent from Web');
  // formData.append('user_id', localStorage.getItem('userID'));
  formData.append('file_type', this.postForm.get('file_type').value);

  console.log(formData);

  this.auth.update("post", localStorage.getItem('userID'), formData).subscribe(
    response => {
      console.log(response);
      this.isLoading=false;
      if (response['success'] === false) {
        this.alert.warning(response['message']);
      } else {
        this.alert.success('Post added successfully');
        this.getUserpost();
        this.getfollowers();
      }
    },
    error => {
      console.log(error);
      this.alert.warning('Error sending data');
    }
  );
}



getUserpost(){
  this.isLoading=true;
this.auth.show('user_posts', this.user.id).subscribe(
  response => {
    this.allPosts = response['data'];
    this.postlength = response['data'].length;
    this.isLoading=false;
  },
  error => {
    this.isLoading=false;
    this.alert.error('Error loading post');
  }
);
}
getfollowers(){
  this.isLoading=true;
  this.auth.show('get_profile_count', this.user.id).subscribe(
    response => {
      this.follow = response;
      this.isLoading=false;
    },
    error => {
      this.isLoading=false;
      this.alert.error('Error loading post');
      // console.log(error);
    }
  );
}

openContent(logoutModal) {
  this.modalService.open(logoutModal, {   size: 'sm' });
}
opentContent(eitModal) {
  this.modalService.open(eitModal, {  size: 'md' });
}
onLogout() {
  localStorage.clear();
  this.modalService.dismissAll();
      this.router.navigate(['login']);

}
no(){
  this.modalService.dismissAll();
}
// Get user
getUser() {
this.isLoading=true;
this.auth.show('users', this.user.id).subscribe(
  response => {
    this.prepareEditForm();
    this.isLoading=false;
  },
  error => {
    this.isLoading=false;
    this.alert.error('Error loading user Data');
  }
);
}
viewpost(id){
this.isLoading=true;
this.auth.show("user_posts",id).subscribe(
  response => {
    this.isLoading=false;
    this.viewPost = response["data"];
    console.log(this.viewPost);
},
error => {
this.isLoading=false;
this.alert.warning("Could not get requested data");
}
);

}
prepareEditForm() {
  this.profileEditForm.get("title").setValue(this.user.title);
  this.profileEditForm.get("username").setValue(this.user.username);
  this.profileEditForm.get("fullname").setValue(this.user.fullname);
  this.profileEditForm.get("personal_message").setValue(this.user.personal_message);
  this.profileEditForm.get("email").setValue(this.user.email);
  this.profileEditForm.get("phone").setValue(this.user.phone);
  // this.profileEditForm.get("user_type").setValue(this.user.user_type);
}
setEditData() {
  this.profileEditDetails.username = this.profileEditForm.controls[
    "username"
  ].value;
  this.profileEditDetails.fullname = this.profileEditForm.controls["fullname"].value;
  this.profileEditDetails.title = this.profileEditForm.controls["title"].value;
  this.profileEditDetails.personal_message = this.profileEditForm.controls["personal_message"].value;
  this.profileEditDetails.email = this.profileEditForm.controls[
    "email"
  ].value;
  this.profileEditDetails.phone = this.profileEditForm.controls["phone"].value;
}
editUser() {
  this.isLoading=true;
  this.setEditData();
  // console.log(this.profileEditDetails);
  this.auth
    .update("update_user_web", this.user.id, this.profileEditDetails)
    .subscribe(
      response => {
        this.isLoading=false;
        if (response !== null || response !== undefined) {
          this.alert.success("User message Updated successfully");
          this.getUser();
        }
      },
      error => {
        console.log(error);
        this.isLoading=false;
        if (error.status === 500) {
          this.alert.warning(
            "Can not update the information, please check the data"
          );
        } else {
          this.alert.error("User update failed, try again later.");
        }
      }
    );
}
view(ev) {
  this.auth.show('post', ev).subscribe(
    (response) => {
      this.Posts = response['data'];
    },
    (error) => {
      console.log(error);
      this.alert.error('Getting data unsuccessful. Please try again');
    }
  );
}
openSContent(singlepost) {
  this.modalService.open(singlepost, {  size: 'lg' });
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
    }
  }

  this.updateImage();
}


cancelProfile() {
  this.profileImage = null;
}


updateImage() {
  this.isLoading=true;
  const imageData = new FormData();

  imageData.append('profile_image', this.imageForm.get('profile_image').value);
  imageData.append('user_id', localStorage.getItem('userID'));

  this.auth.update("profile_photo", localStorage.getItem('userID'), imageData).subscribe(
    response => {
      this.isLoading=false;
      if (response['success'] === false) {
        this.alert.warning(response['message']);
      } else {
        this.alert.success('Profile image update successful');
      }
    },
    error => {
      this.alert.warning('Error sending data');
    }
  );
}


removeProfile() {
  this.auth.show("remove_profile_photo", localStorage.getItem('userID')).subscribe(
    response => {
      this.isLoading=false;
      if (response['success'] === false) {
        this.alert.warning(response['message']);
      } else {
        this.alert.success('Profile image update successful');
      }
    },
    error => {
      console.log(error);
      this.alert.warning('Error sending data');
    }
  );
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
}
