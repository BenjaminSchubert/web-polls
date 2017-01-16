import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CreationComponent } from "../base/creation.component";
import { INewPoll, IPoll } from "./stubs";
import { PollService } from "./poll.service";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
    templateUrl: "poll-creation.html",
})
export class PollCreationComponent extends CreationComponent<IPoll, INewPoll> implements OnInit {
    private room: number;

    constructor(service: PollService, builder: FormBuilder, private route: ActivatedRoute, private router: Router) {
        super(service, builder);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.room = this.route.snapshot.parent.params["room"];
        this.form.get("room_id").setValue(this.room);
    }

    protected buildForm() {
        return this.builder.group({
            description: [""],
            name: ["", Validators.required],
            room_id: [""],
        });
    }

    protected onSuccess(poll: IPoll) {
        this.router.navigate([this.room, poll.id]).then();
    }
}
