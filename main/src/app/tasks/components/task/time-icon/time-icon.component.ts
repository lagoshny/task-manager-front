import { Component, Input, OnInit } from '@angular/core';
import { TaskStatus } from '../../../../core/models/constants/task-status.items';

@Component({
    selector: 'tm-time-icon',
    templateUrl: './time-icon.component.html',
    styleUrls: ['./time-icon.component.scss']
})
export class TimeIconComponent implements OnInit {

    @Input()
    set leftTime(value: number) {
        this._leftTime = value;
        if (this.iconClassName) {
            this.calculateLeftTime();
        }
    }

    @Input()
    public totalTime: number;

    @Input()
    public status: string;

    public iconClassName: string;

    public colorClassName: string;

    private _leftTime: number;

    public ngOnInit(): void {
        this.calculateLeftTime();
    }

    public calculateLeftTime(): void {
        if (TaskStatus.isNew(this.status)) {
            this.iconClassName = 'fa-question-circle-o';
            this.colorClassName = 'time_icon__color_blue';

            return;
        }
        if (TaskStatus.isCompleted(this.status)) {
            this.iconClassName = 'fa-check-circle-o';
            this.colorClassName = 'time_icon__color_green';

            return;
        }
        const leftHours = Math.ceil(this._leftTime);

        if (this.totalTime >= leftHours && this.totalTime * leftHours / 100 < 20) {
            // 20 percents time left
            this.iconClassName = 'fa-hourglass';
            this.colorClassName = 'time_icon__color_green';
        } else if (this.totalTime * leftHours / 100 >= 20 && this.totalTime * leftHours / 100 < 50) {
            // 50 percents time left
            this.iconClassName = 'fa-hourglass-start';
            this.colorClassName = 'time_icon__color_green';
        } else if (this.totalTime * leftHours / 100 >= 50 && this.totalTime * leftHours / 100 < 70) {
            // 70 percents time left
            this.iconClassName = 'fa-hourglass-half';
            this.colorClassName = 'time_icon__color_orange';
        } else if (this.totalTime * leftHours / 100 >= 70 && leftHours > 0) {
            this.iconClassName = 'fa-hourglass-end';
            this.colorClassName = 'time_icon__color_red';
        } else if (leftHours === 0 && this._leftTime <= 60) {
            // full time is left
            this.iconClassName = 'fa-hourglass-o';
            this.colorClassName = 'time_icon__color_red';
        } else {
            // time left is unknown
            this.iconClassName = 'fa-ban';
            this.colorClassName = 'time_icon__color_red';
        }
    }

}
