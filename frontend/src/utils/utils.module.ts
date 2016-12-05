import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { ComponentsModule } from "./components/components.module";
import { RouterModule } from "@angular/router";


@NgModule({
    exports: [
        CommonModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
    ],
})
export class UtilsModule {}
