import { NgModule } from "@angular/core";
import { ScrollableListComponent } from "./scrollable-list.component";
import { CommonModule } from "@angular/common";


@NgModule({
    declarations: [ScrollableListComponent],
    exports: [ScrollableListComponent],
    imports: [CommonModule],
})
export class ComponentsModule {}
