import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of, throwError } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { TaskCategory } from '../../../core/models/task-category.model';
import { ActivatedRouteStub } from '../../../test/activated-route-stub';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './category-form.component';

describe('CategoryFormComponent', () => {
    let routerSpy: any;
    let categoryServiceSpy: any;
    let activatedRouteStub: ActivatedRouteStub;

    let fixture: ComponentFixture<CategoryFormComponent>;
    let comp: CategoryFormComponent;

    beforeEach(async(() => {
        routerSpy = {
            navigate: jasmine.createSpy('navigate')
        };
        categoryServiceSpy = {
            getByPrefix: jasmine.createSpy('getByPrefix')
        };
        activatedRouteStub = new ActivatedRouteStub({});

        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                NgxValidationMessagesModule.forRoot({
                    messages: {}
                })
            ],
            declarations: [
                CategoryFormComponent
            ],
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: NGXLogger, useClass: NGXLoggerMock},
                {provide: CategoryService, useValue: categoryServiceSpy}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(CategoryFormComponent);
                comp = fixture.componentInstance;
            })
    }));

    afterEach(() => {
        activatedRouteStub.setParamMap({});
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    it('should be button with caption "Create" when create new category', () => {
        fixture.detectChanges();

        expect(comp.buttonName).toBe("Create");
    });

    it('should be button with caption "Save" when edit existing category', () => {
        activatedRouteStub.setParamMap({
            prefix: '5'
        });
        categoryServiceSpy.getByPrefix.and.returnValue(of(new TaskCategory()));

        fixture.detectChanges();

        expect(comp.buttonName).toBe("Save");
    });

    it('should be header text "New category" when create new category', () => {
        fixture.detectChanges();

        expect(comp.formHeader).toBe("New category");
    });

    it('should be header text "Edit category" when edit existing category', () => {
        activatedRouteStub.setParamMap({
            prefix: '5'
        });
        categoryServiceSpy.getByPrefix.and.returnValue(of(new TaskCategory()));

        fixture.detectChanges();

        expect(comp.formHeader).toBe("Edit category");
    });

    it('should get category by id when edit category', () => {
        activatedRouteStub.setParamMap({
            prefix: '5'
        });
        let expectedCategory = new TaskCategory();
        expectedCategory.name = 'Test';
        expectedCategory.prefix = 'Prefix';
        expectedCategory.description = 'Description';

        categoryServiceSpy.getByPrefix.and.returnValue(of(expectedCategory));

        fixture.detectChanges();

        let resultCategory = comp.categoryForm.getRawValue() as TaskCategory;
        expect(resultCategory.name).toBe(expectedCategory.name);
        expect(resultCategory.prefix).toBe(expectedCategory.prefix);
        expect(resultCategory.description).toBe(expectedCategory.description);
    });

    it('should be forward to home page when during get category was error',() => {
        activatedRouteStub.setParamMap({
            prefix: '5'
        });
        routerSpy.navigate.and.returnValue(Promise.resolve());
        categoryServiceSpy.getByPrefix.and.returnValue(throwError('Test error'));

        fixture.detectChanges();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    });

    // it('should create new category', () => {
    // });
    //
    // it('should be forward to home page when during create category error occurs', () => {
    // });
    //
    // it('should edit category', () => {
    // });
    //
    // it('should be forward to home page when during edit category error occurs', () => {
    // });
    //
    // it('should open icon list dialog', () => {
    // });
    //
    // it('should get selected icon from list dialog', () => {
    // });

});