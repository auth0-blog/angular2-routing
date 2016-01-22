import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from 'angular2/router';
import {FORM_PROVIDERS, FORM_DIRECTIVES, Control} from 'angular2/common';
import {Http} from 'angular2/http';

import {Users} from './Users';
import {Home} from './Home';

@Component({
  selector: 'app',
  providers: [ FORM_PROVIDERS ],
  directives: [ ROUTER_DIRECTIVES, FORM_DIRECTIVES ],
  pipes: [],
  template: `    
    <div id="sidebar" class="col-sm-3">
      <div class="search">
        <input [ngFormControl]="searchTerm" class="form-control" placeholder='Seach for users' />
        <button class="btn btn-primary" (click)="getUsers()">Get Users</button>
      </div>
      <div class="list-group">
        <p class="no-users" *ngIf="users.total_count == 0">No users found</p>
        <a 
          class="users list-group-item"
          *ngFor="#user of users.items"
          [routerLink]="['Users', { userLogin: user.login }]"
        >
          <img class="img-circle" src="{{user.avatar_url}}"  />
          <strong>{{user.login}}</strong>          
        </a>
      </div>
    </div>
    <div id="main" class="col-sm-9">
      <button class="btn btn-primary" (click)="goHome()">Go Home</button>
      <router-outlet></router-outlet>
    </div>
    
  `,
  styles: [`
      #main { margin: 10px 0 }
      #main button { margin-bottom: 5px }
      .search * { margin: 10px 0; }
      .no-users { color: red; }
      .container { width: 100% }
      img { max-width: 50px; }
  `]
})
// Routing is set up with the RouteConfig decorator
@RouteConfig([
  { path: '/home', component: Home, name: 'Home' },
  { path: '/users/:userLogin/...', component: Users, name: 'Users' },
  { path: '/**', redirectTo: ['Home'] }
])
export class App {
  users: Array<Object> = [];
  searchTerm: Control = new Control();

  // We want an instance of router so we can route manually
  constructor(public http: Http, private _router: Router) {}

  getUsers() {
    this.http.get(`https://api.github.com/search/users?q=${this.searchTerm.value}`)
    .map(response => response.json())
    .subscribe(
      data => this.users = data,
      error => console.log(error)
    );
  }

  goHome() {
    // Example of manual routing
    this._router.navigate(['Home']);
  }
}
