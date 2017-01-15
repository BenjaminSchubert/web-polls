import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CreationComponent } from "../base/creation.component";
import { INewPoll, IPoll } from "./stubs";
import { PollService } from "./poll.service";
import { ActivatedRoute } from "@angular/router";


@Component({
    templateUrl: "poll-creation.html",
})
export class PollCreationComponent extends CreationComponent<IPoll, INewPoll> implements OnInit {
    constructor(service: PollService, builder: FormBuilder, private route: ActivatedRoute) {
        super(service, builder);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.form.get("room_id").setValue(this.route.snapshot.params["room"]);
    }

    protected buildForm() {
        return this.builder.group({
            description: [""],
            name: ["", Validators.required],
            room_id: [""],
        });
    }
}
