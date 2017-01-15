import { Routes, RouterModule } from "@angular/router";
import { LoginGuard } from "./auth/guards/login.guard";
import { RoomCreationComponent } from "./room/room-creation.component";
import { RoomComponent } from "./room/room-details.component";
import { RoomIndexComponent } from "./room/room-index.component";
import { PollCreationComponent } from "./poll/poll-creation.component";
import { RoomContainerComponent } from "./room/room-container.component";


const routes: Routes = [
    {
        children: [
            {
                canActivate: [LoginGuard],
                component: RoomCreationComponent,
                path: "new",
            },
            {
                component: PollCreationComponent,
                path: ":room/new",
            },
            {
                children: [
                    {
                        component: RoomComponent,
                        path: "",
                    },
                ],
                component: RoomContainerComponent,
                path: ":room",
            },
            {
                component: RoomIndexComponent,
                path: "",
            },
        ],
        path: "",
    },
    {path: "**", redirectTo: ""},
];


export const routing = RouterModule.forRoot(routes);
