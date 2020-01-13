import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatus } from '../../../../core/models/constants/task-status.items';
import { TimeIconComponent } from './time-icon.component';

describe('TimeIconComponent', () => {
    let fixture: ComponentFixture<TimeIconComponent>;
    let comp: TimeIconComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TimeIconComponent
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TimeIconComponent);
                comp = fixture.componentInstance;
            })
    }));

    it('should create the comp', () => {
        expect(comp).toBeTruthy();
    });

    it('should be BLUE color for task in new status', () => {
        comp.status = TaskStatus.NEW.name;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_blue')
    });

    it('should be GREEN color for task in completed status', () => {
        comp.status = TaskStatus.COMPLETED.name;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_green')
    });

    it('should be GREEN color for task with total time more than 80 percents', () => {
        comp.totalTime = 100;
        comp.leftTime = 10;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_green')
    });

    it('should be GREEN color for task with total time between 80 and 50 percents', () => {
        comp.totalTime = 100;
        comp.leftTime = 40;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_green')
    });

    it('should be ORANGE color for task with total time between 50 and 30 percents', () => {
        comp.totalTime = 100;
        comp.leftTime = 60;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_orange')
    });

    it('should be RED color for task with total time between 30 and 0 percents', () => {
        comp.totalTime = 100;
        comp.leftTime = 80;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_red')
    });

    it('should be RED color for task with total time is over', () => {
        comp.totalTime = 100;
        comp.leftTime = 100;

        fixture.detectChanges();

        expect(comp.colorClassName).toBe('time_icon__color_red')
    });

});