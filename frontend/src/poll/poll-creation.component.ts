import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CreationComponent } from "../base/creation.component";
import { INewPoll, IPoll } from "./stubs";
import { PollService } from "./poll.service";


@Component({
    templateUrl: "poll-creation.html",
})
export class PollCreationComponent extends CreationComponent<IPoll, INewPoll> {
    constructor(service: PollService, builder: FormBuilder) {
        super(service, builder);
    }

    protected buildForm() {
        return this.builder.group({
            description: [""],
            name: ["", Validators.required],
        });
    }
}
