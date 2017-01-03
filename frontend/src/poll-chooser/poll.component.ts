import { Component, Input } from "@angular/core";
import { Poll } from "../polls/stub";


@Component({
    selector: "wp-poll",
    styleUrls: ["poll.css"],
    templateUrl: "poll.html",
})
export class PollComponent {
    @Input() public poll: Poll;
    @Input() public room: number;
}
