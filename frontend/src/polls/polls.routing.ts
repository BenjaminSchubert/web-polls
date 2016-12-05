import { ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PollsComponent } from "./polls.component";


const pollsRoutes = [
    {
        component: PollsComponent,
        path: "",
    },
];


export const pollsRouting: ModuleWithProviders = RouterModule.forChild(pollsRoutes);
