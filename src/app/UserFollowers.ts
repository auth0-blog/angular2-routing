import {Component, Injector} from 'angular2/core';
import {Http} from 'angular2/http';
import {RouteParams, OnActivate, ComponentInstruction} from 'angular2/router';

@Component({
  template: `
    <ul class="list-group">
      <h3>Followers</h3>
      <li class="list-group-item" *ngFor="#follower of followers">{{follower.login}}</li>
    </ul>
  `
})
export class UserFollowers implements OnActivate {
  userLogin: string;
  followers: Array<Object> = [];

  constructor(public http: Http, injector: Injector, params: RouteParams) {
    // This is one way to get params but is ugly
    // this.params = injector.parent.parent.parent.parent.get(RouteParams);
    this.userLogin = params.get('userLogin');
  }

  routerOnActivate(to: ComponentInstruction, from: ComponentInstruction) {
    return new Promise((resolve) => {
      this.http.get(`https://api.github.com/users/${this.userLogin}/followers`)
        .map(response => response.json())
        .subscribe(
          data => {
            this.followers = data;
            resolve(true);
          },
          error => console.log(error)
        );
    });
  }
}
