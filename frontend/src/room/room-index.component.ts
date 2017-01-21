import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { RoomService } from "./room.service";
import { Router } from "@angular/router";


@Component({
    templateUrl: "./room-index.html",
})
export class RoomIndexComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;

    constructor(private rooms: RoomService, private builder: FormBuilder, private router: Router) {
        super();

        this.form = this.builder.group({
            code: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.form.reset();
    }

    public submit() {
        this.rooms.join(this.form.value, (data: any) => {
            if (data.id !== undefined) {
                this.router.navigate([data.id]).then();
            } else {
                this.handleError(data, this.form);
            }
        });
    }
}
