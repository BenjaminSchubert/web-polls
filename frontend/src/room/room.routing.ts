import { ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginGuard } from "../auth/guards/login.guard";
import { NewRoomComponent } from "./new_room.component";
import { RoomIndexComponent } from "./room-index.component";
import { RoomComponent } from "./room-details.component";


const roomRoutes = [
    {
        children: [
            {
                canActivate: [LoginGuard],
                component: NewRoomComponent,
                path: "new",
            },
            {
                component: RoomComponent,
                path: ":id",
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
