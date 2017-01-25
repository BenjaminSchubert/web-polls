import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { RoomService } from "./room.service";
import { Router } from "@angular/router";
import { Response } from "@angular/http";


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
        this.rooms.join(this.form.value).subscribe(
            (data: Response) => this.router.navigate([data.json().id]).then(),
            (data: Response) => this.handleError(data.json(), this.form),
        );
    }
}
