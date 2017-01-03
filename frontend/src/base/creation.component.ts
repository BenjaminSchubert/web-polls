import { OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ErrorHandler } from "./error_handler";
import { noop } from "./miscellaneous";
import { Response } from "@angular/http";
import { RestService } from "./rest.service";


export abstract class CreationComponent<T> extends ErrorHandler implements OnInit {
    public form: FormGroup;

    protected abstract buildForm(): FormGroup;

    constructor(private service: RestService<T>) {
        super();
        this.form = this.buildForm();
    }

    public ngOnInit() {
        this.form.reset();
    }

    public submit() {
        this.service.create(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }
}
