import { NgModule } from "@angular/core";
import { ScrollableListComponent } from "./scrollable-list.component";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "./modal.component";


@NgModule({
    declarations: [ModalComponent, ScrollableListComponent],
    exports: [ModalComponent, ScrollableListComponent],
    imports: [CommonModule],
})
export class ComponentsModule {}
