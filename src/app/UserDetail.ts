import {Component, Injector} from 'angular2/core';
import {Http} from 'angular2/http';
import {ROUTER_DIRECTIVES, Router, RouteParams, RouteConfig} from 'angular2/router';
import {UserFollowers} from './UserFollowers';

@Component({
  directives: [ROUTER_DIRECTIVES],
  template: `
    <div class="col-sm-3">
      <img class="img-circle" src="{{userData.avatar_url}}" />
      <p *ngIf="userData.name">
        <i class="glyphicon glyphicon-user"></i> 
        {{userData.name}}
      </p>
      <p *ngIf="userData.company">
        <i class="glyphicon glyphicon-briefcase"></i> 
        {{userData.company}}
      </p>
      <p *ngIf="userData.location">
        <i class="glyphicon glyphicon-globe"></i> 
        {{userData.location}}
      </p>
    </div>
    <div class="col-sm-9">
      <button class="btn btn-primary" (click)="getFollowers()">Load Followers</button>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    img { width: 100px; margin-bottom: 10px; }
  `]
})
@RouteConfig([
  { path: '/followers', component: UserFollowers, name: 'UserFollowers' }
])
export class UserDetail {
  params: RouteParams;
  userLogin: string;
  userData: Object = {};

  constructor(public http: Http, params: RouteParams, injector: Injector, private _router: Router) {
    this.params = injector.parent.parent.get(RouteParams);
    this.userLogin = this.params.get('userLogin');
  }

  ngOnInit() {
    this.http.get(`http://api.github.com/users/${this.userLogin}`)
      .map(response => response.json())
      .subscribe(
        data => this.userData = data,
        err => console.log(err)
      );
  }

  getFollowers() {
    this._router.navigate(['UserFollowers', { userLogin: this.userLogin }]);
  }
}
