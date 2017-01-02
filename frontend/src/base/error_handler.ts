// tslint:disable:no-any
import { FormGroup } from "@angular/forms";
import { Response } from "@angular/http";


export class ErrorHandler {
    protected errorMessages: {[key: string]: (err: {} | string) => string } = {
        match: (err: {message: string, valid: boolean}) => err.message,
        pattern: (err: any) => "This is not a valid entry",
        required: (err: any) => "This field is required",
        serverError: (err: {message: string, code: string}) => err.message,
    };

    public display_error(errors: any): string[] {
        // tslint:disable-next-line: triple-equals
        if (errors == null) {
            return;
        }

        let messages: string[] = [];

        for (let entry in errors) {
            if (this.errorMessages[entry] !== undefined) {
                messages.push(this.errorMessages[entry](errors[entry]));
            }
        }
        if (!messages.length) {
            this.signalUndefinedError(errors);
            return ["Undefined error"];
        }
        return messages;
    }

    protected handleError(error: Response, ctrl: FormGroup) {
        let data = error.json();

        for (let entry in data) {
            if (ctrl.get(entry) !== null) {
                ctrl.get(entry).setErrors({"serverError": data[entry]});
            } else {
                ctrl.setErrors({"serverError": data[entry]});
            }
        }
    }

    protected signalUndefinedError(error: any) {
        // FIXME we should send data back to the server
        console.log("Undefined error message for ", error);
    }

}
