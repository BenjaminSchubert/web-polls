import { Component, Input } from "@angular/core";
import { IPoll } from "./stubs";


@Component({
    selector: "wp-poll-item",
    templateUrl: "poll-item.html",
})
export class PollItemComponent {
    @Input() public poll: IPoll;
    @Input() public room: number;
}
