import { ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewRoomComponent } from "./new_room.component";
import { LoginGuard } from "../auth/guards/login.guard";


const roomRoutes = [
    {
        canActivate: [LoginGuard],
        children: [
            {
                component: NewRoomComponent,
                path: "new",
            },
        ],
        path: "rooms",
    },
];


export const roomRouting: ModuleWithProviders = RouterModule.forChild(roomRoutes);
