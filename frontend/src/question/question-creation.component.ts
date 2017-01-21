import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { CreationComponent } from "../base/creation.component";
import { INewQuestion, IQuestion } from "./stubs";
import { QuestionService } from "./question.service";
import { ActivatedRoute, Router, Params } from "@angular/router";


@Component({
    templateUrl: "question-creation.html",
})
export class QuestionCreationComponent extends CreationComponent<IQuestion, INewQuestion> implements OnInit {
    public get choices() {
        return this.form.get("choices") as FormArray;
    }

    private room: number;
    private poll: number;

    constructor(service: QuestionService, builder: FormBuilder, private route: ActivatedRoute, private router: Router) {
        super(service, builder);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(
            this.route.parent.params.subscribe((p: Params) => {
                this.poll = +p["poll"];
                this.form.get("poll_id").setValue(this.poll);
            }),
            this.route.parent.parent.params.subscribe((p: Params) => this.room = +p["room"]),
        );
    }

    protected buildForm() {
        let form = this.builder.group({
            choices: this.builder.array([], Validators.compose([Validators.required, Validators.minLength(2)])),
            poll_id: [""],
            title: ["", Validators.required],
            type: ["", Validators.required],
        });

        for (let i = 0; i < 2; i++) {
            (<FormArray> form.get("choices")).push(this.builder.group({text: ["", Validators.required]}));
        }

        return form;
    }

    protected onSuccess(question: IQuestion) {
        this.router.navigate([this.room, this.poll, question.id]).then();
    }

    public addChoice() {
        (<FormArray> this.form.get("choices")).push(this.builder.group({text: ["", Validators.required]}));
    }

    public removeChoice(index: number) {
        let arr = <FormArray> this.form.get("choices");

        if (arr.controls.length <= 2) {
            arr.markAsDirty();
            arr.setErrors({custom: "At least two entries are required"});
        } else {
            (<FormArray> this.form.get("choices")).removeAt(index);
        }
    }

}
