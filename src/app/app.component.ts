import { Component, NgZone } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  showHeaderAndFooter: boolean = false;
  localIp = localStorage.getItem('LOCAL_IP');
  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  ngOnInit() {
    this.determineLocalIp();
  }

  private determineLocalIp() {
    window.RTCPeerConnection = this.getRTCPeerConnection();

    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(pc.setLocalDescription.bind(pc));

    pc.onicecandidate = (ice) => {
      this.zone.run(() => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return;
        }
        console.log('localip 1: '+this.localIp);
        this.localIp = this.ipRegex.exec(ice.candidate.candidate)[1];
        sessionStorage.setItem('LOCAL_IP', this.localIp);
        localStorage.setItem('LOCAL_IP', this.localIp);

        pc.onicecandidate = () => {};
        pc.close();
      });
    };
  }

  private getRTCPeerConnection() {
    return window.RTCPeerConnection ;
  }

  constructor(private zone: NgZone,private router: Router) {
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
