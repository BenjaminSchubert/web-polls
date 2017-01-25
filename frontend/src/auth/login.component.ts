import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AccountService } from "./account.service";
import { ErrorHandler } from "../base/error_handler";
import { Response } from "@angular/http";
import { MatchDirective } from "../utils/forms/validators/match.validator";
import { noop } from "../base/miscellaneous";


@Component({
    selector: "wp-login",
    templateUrl: "./login.html",
})
export class LoginComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public showRegistrationForm$: Observable<Boolean>;

    private _registering = false;

    public get registering() {
        return this._registering;
    }

    public set registering(value: boolean) {
        this._showRegistrationForm$.next(value);
    }

    private _showRegistrationForm$: BehaviorSubject<boolean>;

    constructor(public account: AccountService, private builder: FormBuilder) {
        super();
        this._showRegistrationForm$ = new BehaviorSubject(false);
        this.showRegistrationForm$ = this._showRegistrationForm$.asObservable();

        this.form = this.builder.group({
            password: ["", Validators.required],
            username: ["", Validators.required],
        });
    }

    public ngOnInit() {
        let repeatPasswordField = "repeat_password";

        this.subscriptions = [
            this.showRegistrationForm$.subscribe((show: boolean) => {
                this._registering = show;

                if (show && !this.form.contains(repeatPasswordField)) {
                    this.form.addControl(repeatPasswordField, new FormControl(null, Validators.required));
                    this.form.addControl("email", new FormControl("", [
                        Validators.required,
                        Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$"),
                    ]));

                    this.form.setValidators(
                        new MatchDirective("password", repeatPasswordField, "Passwords do not match").validator,
                    );
                } else if (!show && this.form.contains(repeatPasswordField)) {
                    this.form.clearValidators();
                    this.form.removeControl(repeatPasswordField);
                    this.form.removeControl("email");
                }
            }),
            this.account.loginIsRequested$.subscribe(() => {
                this.form.reset();
                this.registering = false;
            }),
        ];

        this.registering = false;
    }

    public hideLoginForm() {
        this.account.cancelLoginRequest();
    }

    public showRegistrationForm() {
        this.registering = true;
    }

    public hideRegistrationForm() {
        this.registering = false;
    }

    public login() {
        let ret: Observable<Response>;

        if (this.registering) {
            ret = this.account.register(this.form.value);
        } else {
            ret = this.account.login(this.form.value);
        }

        ret.subscribe(
            noop,
            (err: Response) => this.handleError(err.json(), this.form),
        );
    }

}
