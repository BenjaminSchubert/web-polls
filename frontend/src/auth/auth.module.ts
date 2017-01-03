import { NgModule, ModuleWithProviders } from "@angular/core";
import { LoginComponent } from "./login.component";
import { UtilsModule } from "../utils/utils.module";
import { AccountService } from "./account.service";
import { LoginGuard } from "./guards/login.guard";


@NgModule({
    declarations: [LoginComponent],
    exports: [LoginComponent],
    imports: [UtilsModule],
})
export class AuthModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                AccountService, LoginGuard,
            ],
        };
    }
}
