import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RoomService } from "./room.service";
import { CreationComponent } from "../base/creation.component";
import { INewRoom, IRoom } from "./stubs";


@Component({
    templateUrl: "room-creation.html",
})
export class RoomCreationComponent extends CreationComponent<IRoom, INewRoom> {
    constructor(service: RoomService, builder: FormBuilder) {
        super(service, builder);
    }

    protected buildForm() {
        return this.builder.group({
            name: ["", Validators.required],
        });
    }
}
