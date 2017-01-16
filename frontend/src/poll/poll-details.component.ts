import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IPoll } from "./stubs";
import { PollService } from "./poll.service";


@Component({
    templateUrl: "poll-details.html",
})
export class PollComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public poll: IPoll;
    public editing: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private service: PollService,
        private builder: FormBuilder,
        private router: Router,
    ) {
        super();

        this.form = this.builder.group({
            name: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.service.get(+params["poll"]))
            .subscribe((poll: IPoll) => this.poll = poll);
    }

    public submit() {
        this.service.create(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }

    public delete() {
        this.service.delete(this.poll).subscribe(
            () => this.router.navigate([".."]),
        );
    }
}
