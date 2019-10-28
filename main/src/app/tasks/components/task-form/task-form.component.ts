import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'tm-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

    public taskForm: FormGroup;

    public formHeader = 'Create task';

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.buildForm();
        const taskID = this.activatedRoute.snapshot.paramMap.get('taskID');
        if (taskID) {
            this.formHeader = 'Edit task';
        }
    }

    public sendForm(): void {
    }

    private buildForm(): void {
        this.taskForm = this.formBuilder.group({
        });
    }

}
