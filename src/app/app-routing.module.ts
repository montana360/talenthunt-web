import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth guard
import { AuthGuard } from './guards/auth.guard';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CompetitionComponent } from './competition/competition.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { TermsComponent } from './terms/terms.component';
import { JoinCompetitionComponent } from './join-competition/join-competition.component';
import { OneCompetitionComponent } from './one-competition/one-competition.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ForgetpassComponent } from './forgetpass/forgetpass.component';
import { ResetpassComponent } from './resetpass/resetpass.component';
import { PinComponent } from './pin/pin.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },

  { path: 'landing', component: LandingComponent},
  { path: 'login' , component: LoginComponent},
  { path: 'forgetpass', component: ForgetpassComponent},
  { path: 'resetpass', component: ResetpassComponent},
  { path: 'pin', component: PinComponent},
  { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard]},
  { path: 'profile', component:  ProfileComponent, canActivate: [AuthGuard]},
  { path: 'competition', component: CompetitionComponent},
  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'terms', component: TermsComponent, canActivate: [AuthGuard]},
  { path: 'join/:id', component: JoinCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'one/:id', component: OneCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: '**', component: LandingComponent },

];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
