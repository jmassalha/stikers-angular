import { Component, Input, OnInit } from "@angular/core";
@Component({
    selector: "tree-item",
    templateUrl: "./tree-item.component.html"   
})
export class TreeItemComponent implements OnInit {
    @Input()
    public data: any = {};
    ngOnInit(): void {
        console.log(this.data);
        //debugger;
    }
}
