import { Component } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  showHeaderAndFooter: boolean = false;

  ngOnInit() {
    //this.showHeaderAndFooter = false;
    //debugger
  }

  constructor(private router: Router) {
  // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if(localStorage.getItem('loginState') != "true" || localStorage.getItem('loginUserName') == ""){
          this.showHeaderAndFooter = false;
        } else {
          this.showHeaderAndFooter = true;
        }
      }
    });
  }
}
