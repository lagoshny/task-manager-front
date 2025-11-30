import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { of, throwError } from 'rxjs';
import {
  FontIconListDialogComponent
} from '../../../core/components/font-icon-list-dialog/font-icon-list-dialog.component';
import { CoreModule } from '../../../core/core.module';
import { TaskCategory } from '../../../core/models/task-category.model';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './category-form.component';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('CategoryFormComponent', () => {
  let routerSpy: any;
  let categoryServiceSpy: any;
  let activatedRouteStub: ActivatedRouteStub;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let comp: CategoryFormComponent;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    categoryServiceSpy = {
      getByPrefix: jasmine.createSpy('getByPrefix'),
      createResource: jasmine.createSpy('createResource'),
      patchResource: jasmine.createSpy('patchResource')
    };
    activatedRouteStub = new ActivatedRouteStub({});

    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        LoggerTestingModule,
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
        {provide: CategoryService, useValue: categoryServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryFormComponent);
        comp = fixture.componentInstance;
      });
  }));

  afterEach(() => {
    activatedRouteStub.setParamMap({});
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should be button with caption "Create" when create new category', () => {
    fixture.detectChanges();

    expect(comp.buttonName).toBe('Create');
  });

  it('should be button with caption "Save" when edit existing category', () => {
    activatedRouteStub.setParamMap({
      prefix: 'TEST-1'
    });
    categoryServiceSpy.getByPrefix.and.returnValue(of(new TaskCategory()));

    fixture.detectChanges();

    expect(comp.buttonName).toBe('Save');
  });

  it('should be header text "New category" when create new category', () => {
    fixture.detectChanges();

    expect(comp.formHeader).toBe('New category');
  });

  it('should be header text "Edit category" when edit existing category', () => {
    activatedRouteStub.setParamMap({
      prefix: 'TEST-1'
    });
    categoryServiceSpy.getByPrefix.and.returnValue(of(new TaskCategory()));

    fixture.detectChanges();

    expect(comp.formHeader).toBe('Edit category');
  });

  it('should get category by id when edit category', () => {
    activatedRouteStub.setParamMap({
      prefix: 'TEST-1'
    });
    const expectedCategory = new TaskCategory();
    expectedCategory.name = 'Test';
    expectedCategory.prefix = 'Prefix';
    expectedCategory.description = 'Description';

    categoryServiceSpy.getByPrefix.and.returnValue(of(expectedCategory));

    fixture.detectChanges();

    const resultCategory = comp.categoryForm.getRawValue() as TaskCategory;
    expect(resultCategory.name).toBe(expectedCategory.name);
    expect(resultCategory.prefix).toBe(expectedCategory.prefix);
    expect(resultCategory.description).toBe(expectedCategory.description);
  });

  it('should be forward to home page when during get category was error', () => {
    activatedRouteStub.setParamMap({
      prefix: 'TEST-1'
    });
    routerSpy.navigate.and.returnValue(Promise.resolve());
    categoryServiceSpy.getByPrefix.and.returnValue(throwError('Test error'));

    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should be forward to home page when create category success', () => {
    fixture.detectChanges();
    const newCategory = new TaskCategory();
    newCategory.name = 'New category';
    newCategory.prefix = 'Prefix';
    newCategory.description = 'Description';
    comp.categoryForm.patchValue(newCategory);

    routerSpy.navigate.and.returnValue(Promise.resolve());
    categoryServiceSpy.createResource.and.returnValue(of(newCategory));

    comp.sendForm();

    expect(categoryServiceSpy.createResource).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should be forward to home page when edit category success', () => {
    activatedRouteStub.setParamMap({
      prefix: 'TEST-1'
    });
    const existingCategory = new TaskCategory();
    existingCategory.name = 'Test';
    existingCategory.prefix = 'Prefix';
    existingCategory.description = 'Description';
    categoryServiceSpy.getByPrefix.and.returnValue(of(existingCategory));

    fixture.detectChanges();

    routerSpy.navigate.and.returnValue(Promise.resolve());
    categoryServiceSpy.patchResource.and.returnValue(of(existingCategory));

    comp.sendForm();

    expect(categoryServiceSpy.patchResource).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should open icon list dialog', () => {
    fixture.detectChanges();

    const dialogComp = fixture.debugElement.injector.get(MatDialog);
    const spyDialog = spyOn(dialogComp, 'open').and.callThrough();
    comp.onShowIconList();

    expect(spyDialog).toHaveBeenCalled();
    expect(spyDialog).toHaveBeenCalledWith(FontIconListDialogComponent);
  });

  it('should get selected icon from list dialog', () => {
    fixture.detectChanges();

    const afterClose = jasmine.createSpyObj({afterClosed: of('fa-tree'), close: null});
    const dialogComp = fixture.debugElement.injector.get(MatDialog);
    spyOn(dialogComp, 'open').and.returnValue(afterClose);

    comp.onShowIconList();

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(comp.categoryForm.getRawValue().icon).toBe('fa-tree');
  });

});
