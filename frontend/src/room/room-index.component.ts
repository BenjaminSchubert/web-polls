import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { RoomService } from "./room.service";
import { TError } from "../base/base";


@Component({
    templateUrl: "./room-index.html",
})
export class RoomIndexComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;

    constructor(private rooms: RoomService, private builder: FormBuilder) {
        super();

        this.form = this.builder.group({
            code: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.form.reset();
    }

    public submit() {
        this.rooms.join(this.form.value, (err: TError) => this.handleError(err, this.form));
    }
}
