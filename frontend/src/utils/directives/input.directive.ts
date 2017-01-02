import { Directive, ElementRef, Renderer } from "@angular/core";


/**
 * Directive to style inputs
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: `
        input[type=text],
        input[type=password],
        input[type=number]
        input[type=date],
        input[type=email],
        textarea, select,
    `,
})
export class InputDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        renderer.setElementClass(el.nativeElement, "form-control", true);
    }
}
