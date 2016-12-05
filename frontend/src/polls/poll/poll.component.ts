import { Component, Input } from "@angular/core";
import { Poll } from "../stub";


@Component({
    selector: "wp-poll",
    templateUrl: "poll.html",
})
export class PollComponent {
    @Input() public poll: Poll;
    @Input() public room: number;
}
