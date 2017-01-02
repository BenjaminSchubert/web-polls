import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { UtilsModule } from "../utils/utils.module";


@NgModule({
    declarations: [LoginComponent],
    exports: [LoginComponent],
    imports: [UtilsModule],
})
export class AuthModule {}
