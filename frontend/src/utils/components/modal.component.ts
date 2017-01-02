import { Component, EventEmitter, Output, HostBinding, ChangeDetectionStrategy, Input } from "@angular/core";


/**
 * ModalComponent component
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "wp-modal",
    styleUrls: ["./modal.css"],
    templateUrl: "./modal.html",
})
export class ModalComponent {
    /**
     * Event fired when the modal must be closed
     */
    @Output() public onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() public set size(size: string) {
        this.documentClasses = this.documentClasses + " " + size;
    }

    @HostBinding("class") public classes = "modal in";

    public documentClasses = "modal-dialog";
}
