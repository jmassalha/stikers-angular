import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StikersComponent } from "./stikers/stikers.component";

const routes: Routes = [
    { path: "stikers", component: StikersComponent },
    { path: "", component: StikersComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
    declarations: [],
})
export class AppRoutingModule { }
