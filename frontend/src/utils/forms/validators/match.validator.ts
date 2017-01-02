import { FormControl, NG_VALIDATORS, Validator, ValidatorFn } from "@angular/forms";
import { Directive } from "@angular/core";


@Directive({
    providers: [
        {multi: true, provide: NG_VALIDATORS, useExisting: MatchDirective},
    ],
    selector: "[wpMatch][ngModel],[wpMatch][formControl],[wpMatch][formControlName]",
})
export class MatchDirective implements Validator {
    public validator: ValidatorFn;

    constructor(first: string, second: string, message: string) {
        this.validator = (c: FormControl) => {
            if (c.get(first).value !== c.get(second).value) {
                return {match: {valid: false, message: message}};
            }

            return null;
        };
    }

    public validate(c: FormControl) {
        return this.validator(c);
    }
}
