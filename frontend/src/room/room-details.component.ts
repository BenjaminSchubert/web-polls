import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { RoomService } from "./room.service";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";
import { ActivatedRoute, Params } from "@angular/router";
import { IRoom } from "./stubs";


@Component({
    templateUrl: "room-details.html",
})
export class RoomComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public room: IRoom;
    public editing: boolean = false;

    constructor(private route: ActivatedRoute, private service: RoomService, private builder: FormBuilder) {
        super();

        this.form = this.builder.group({
            name: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.service.get(+params["id"]))
            .subscribe((room: IRoom) => this.room = room);
    }

    public submit() {
        this.service.create(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }
}
