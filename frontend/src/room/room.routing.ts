import { ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginGuard } from "../auth/guards/login.guard";
import { NewRoomComponent } from "./new_room.component";
import { RoomIndexComponent } from "./room-index.component";


const roomRoutes = [
    {
        children: [
            {
                canActivate: [LoginGuard],
                component: NewRoomComponent,
                path: "new",
            },
            {
                component: RoomIndexComponent,
                path: "",
            },
        ],
        path: "rooms",
    },
];


export const roomRouting: ModuleWithProviders = RouterModule.forChild(roomRoutes);
