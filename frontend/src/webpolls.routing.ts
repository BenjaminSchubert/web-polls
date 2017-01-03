import { Routes, RouterModule } from "@angular/router";


const routes: Routes = [
    {path: "", pathMatch: "full", redirectTo: "/rooms"},
    {path: "**", redirectTo: "/rooms"},
];


export const routing = RouterModule.forRoot(routes);
