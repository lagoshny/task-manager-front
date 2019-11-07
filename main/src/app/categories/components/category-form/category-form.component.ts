import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dropDownAnimation } from '../../../core/animations/common.animation';

@Component({
    selector: 'tm-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    animations: [
        dropDownAnimation
    ]
})
export class CategoryFormComponent implements OnInit {

    public categoryForm: FormGroup;

    public formHeader = 'New category';

    public buttonName = 'Create';

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.categoryForm = this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            name: '',
            prefix: '',
            description: '',
            icon: ''
        })
    }

    public sendForm(): void {
    }
}
