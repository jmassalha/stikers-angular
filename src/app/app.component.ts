import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, EventEmitter, NgZone, Output } from "@angular/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Router, NavigationStart } from "@angular/router";
import { Observable, Observer, fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";
import { MenuPerm } from "./menu-perm";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "my-app";
    showHeaderAndFooter: boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = "center";
    verticalPosition: MatSnackBarVerticalPosition = "top";

    ngOnInit(): void {}
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
    constructor(
        private zone: NgZone,
        private router: Router,
        
        private mMenuPerm: MenuPerm,
        private _snackBar: MatSnackBar
    ) {
        mMenuPerm.setUserName(localStorage.getItem("loginUserName"));
        // on route change to '/login', set the variable showHead to false
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                if (
                    localStorage.getItem("loginState") != "true" ||
                    localStorage.getItem("loginUserName") == ""
                ) {
                    this.showHeaderAndFooter = false;
                } else {
                    this.showHeaderAndFooter = true;
                }
                this.createOnline$().subscribe((isOnline) => {
                    if (!isOnline) {
                        this.noInternetSnackBar(
                            "!אין חיבור לאינטרנט, נא להתחבר לפני ביצוע פעולות"
                        );
                    }
                });
            }
        });
    }

    createOnline$() {
        return merge<boolean>(
            fromEvent(window, "offline").pipe(map(() => false)),
            fromEvent(window, "online").pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            })
        );
    }

    noInternetSnackBar(message) {
        this._snackBar.open(message, "X", {
            duration: 15000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ["red-snackbar"],
        });
    }
    connectingSnackBar(message) {
        this._snackBar.open(message, "X", {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ["green-snackbar"],
        });
    }
}
