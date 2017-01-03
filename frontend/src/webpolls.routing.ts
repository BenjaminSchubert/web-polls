import { Routes, RouterModule } from "@angular/router";
import { LoginGuard } from "./auth/guards/login.guard";
import { RoomCreationComponent } from "./room/room-creation.component";
import { RoomComponent } from "./room/room-details.component";
import { RoomIndexComponent } from "./room/room-index.component";


const routes: Routes = [
    {
        children: [
            {
                canActivate: [LoginGuard],
                component: RoomCreationComponent,
                path: "new",
            },
            {
                component: RoomComponent,
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
