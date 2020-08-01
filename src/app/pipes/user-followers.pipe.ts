import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'userFollowers'
})
export class UserFollowersPipe implements PipeTransform {

  constructor(
    private auth: AuthService,
  ) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.trackUserFollowers(value);
  }

  trackUserFollowers(id) {
    this.auth.show('user', id).subscribe(
      (response) => {
        return response['data']['follows'];
      },
      (error) => {
        // this.alert.error('Getting data unsuccessful. Please try again');
        return error;
      }
    );
    // this.usersIFollow = followers['followers'].filter((follow) => {
    //   return follow.follower_id == this.user_id;
    // });
    // console.log(this.isFollow);
  }

}
