import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { dropDownAnimation } from '../../../core/animations/common.animation';
import { FontIconListDialogComponent } from '../../../core/components/font-icon-list-dialog/font-icon-list-dialog.component';

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

    constructor(private formBuilder: FormBuilder,
                private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.categoryForm = this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            name: '',
            prefix: '',
            description: '',
            icon: 'fa-certificate'
        })
    }

    public sendForm(): void {
    }

    public onShowIconList(): void {
        this.dialog.open(FontIconListDialogComponent).afterClosed().subscribe((selectedIcon: string) => {
            if (selectedIcon) {
                this.categoryForm.patchValue({
                    icon: selectedIcon
                })
            }
        });
    }

}
