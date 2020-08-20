import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CompetitionComponent } from './competition/competition.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { TermsComponent } from './terms/terms.component';
import { JoinCompetitionComponent } from './join-competition/join-competition.component';
import { OneCompetitionComponent } from './one-competition/one-competition.component';
import { AboutComponent } from './about/about.component';

// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ContactComponent } from './contact/contact.component';
// import { UserFollowersPipe } from './pipes/user-followers.pipe';
import { ResponsiveModule } from 'ngx-responsive';
import { ClipboardModule } from 'ngx-clipboard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { ForgetpassComponent } from './forgetpass/forgetpass.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { PinComponent } from './pin/pin.component';
// import { ScrollingModule} from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { User2Component } from './user2/user2.component';

const config = {
  breakPoints: {
      xs: {max: 600},
      sm: {min: 601, max: 959},
      md: {min: 960, max: 1279},
      lg: {min: 1280, max: 1919},
      xl: {min: 1920}
  },
  debounceTime: 100
};

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    HomepageComponent,
    CompetitionComponent,
    ProfileComponent,
    UserComponent,
    TermsComponent,
    JoinCompetitionComponent,
    OneCompetitionComponent,
    AboutComponent,
    ContactComponent,
    // UserFollowersPipe,
    ForgetpassComponent,
    ResetpassComponent,
    PinComponent,
    DateAgoPipe,
    User2Component
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ResponsiveModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added,
    HttpClientModule,
    NgxSpinnerModule,
    CarouselModule,
    // Specify your library as an import
    SlickCarouselModule,
    ClipboardModule,
    InfiniteScrollModule
    // ScrollingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faFilm);
  }
 }
