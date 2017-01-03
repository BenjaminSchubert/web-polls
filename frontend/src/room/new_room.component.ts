import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { RoomService } from "../room-chooser/room.service";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";


@Component({
    templateUrl: "./new_room.html",
})
export class NewRoomComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;

    constructor(private rooms: RoomService, private builder: FormBuilder) {
        super();

        this.form = this.builder.group({
            name: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.form.reset();
    }

    public submit() {
        this.rooms.post(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }
}
