import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { ComponentsModule } from "./components/components.module";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "./directives/directives.module";
import { ExtendedFormsModule } from "./forms/forms.module";


@NgModule({
    exports: [
        CommonModule,
        HttpModule,
        ExtendedFormsModule,
        RouterModule,
        ComponentsModule,
        DirectivesModule,
    ],
})
export class UtilsModule {}
