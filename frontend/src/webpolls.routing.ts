import { Routes, RouterModule } from "@angular/router";
import { LoginGuard } from "./auth/guards/login.guard";
import { RoomCreationComponent } from "./room/room-creation.component";
import { RoomComponent } from "./room/room-details.component";
import { RoomIndexComponent } from "./room/room-index.component";
import { PollCreationComponent } from "./poll/poll-creation.component";
import { RoomContainerComponent } from "./room/room-container.component";
import { PollComponent } from "./poll/poll-details.component";
import { QuestionCreationComponent } from "./question/question-creation.component";
import { QuestionComponent } from "./question/question-details.component";
import { RoomGuard } from "./room/room.guard";
import { PollGuard } from "./poll/poll.guard";
import { QuestionGuard } from "./question/question.guard";


const routes: Routes = [
    {
        children: [
            {
                canActivate: [LoginGuard],
                component: RoomCreationComponent,
                path: "new",
            },
            {
                children: [
                    {
                        component: PollCreationComponent,
                        path: "new",
                    },
                    {
                        children: [
                            {
                                component: QuestionCreationComponent,
                                path: "new",
                            },
                            {
                                canActivate: [QuestionGuard],
                                component: QuestionComponent,
                                path: ":question",
                            },
                            {
                                component: PollComponent,
                                path: "",
                            },
                        ],
                        canActivate: [PollGuard],
                        path: ":poll",
                    },
                    {
                        component: RoomComponent,
                        path: "",
                    },
                ],
                canActivate: [RoomGuard],
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
