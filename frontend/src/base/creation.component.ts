import { OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ErrorHandler } from "./error_handler";
import { Response } from "@angular/http";
import { RestService } from "./rest.service";
import { IIdentifiable } from "./stubs";


export abstract class CreationComponent<T extends IIdentifiable, TNew>
extends ErrorHandler implements OnInit {
    public form: FormGroup;

    protected abstract buildForm(): FormGroup;

    constructor(protected service: RestService<T, TNew>, protected builder: FormBuilder) {
        super();
        this.form = this.buildForm();
    }

    public ngOnInit() {
        this.form.reset();
    }

    public submit() {
        this.service.create(this.form.value).subscribe(
            (res: Response) => this.onSuccess(res.json()),
            (err: Response) => this.handleError(err.json(), this.form),
        );
    }

    // tslint:disable-next-line:no-empty
    protected onSuccess(res: T) {
    }

}
