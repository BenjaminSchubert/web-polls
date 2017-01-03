import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RoomService } from "./room.service";
import { CreationComponent } from "../base/creation.component";
import { INewRoom } from "./stubs";


@Component({
    templateUrl: "./new_room.html",
})
export class NewRoomComponent extends CreationComponent<INewRoom> {
    constructor(service: RoomService, private builder: FormBuilder) {
        super(service);
    }

    protected buildForm() {
        return this.builder.group({
            name: ["", Validators.required],
        });
    }
}
