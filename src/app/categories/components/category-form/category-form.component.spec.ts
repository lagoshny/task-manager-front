import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './category-form.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';
import { MatDialog } from '@angular/material/dialog';
import {
  FontIconListDialogComponent
} from '../../../core/components/font-icon-list-dialog/font-icon-list-dialog.component';
import { TemplateHelper } from '../../../utils/template.helper';
import { Mocked } from 'vitest';

describe('CategoryFormComponent', () => {
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let categoryServiceSpy: Mocked<Pick<CategoryService, 'getByPrefix' | 'createResource' | 'patchResource'>>;
  let activatedRouteStub: ActivatedRouteStub;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let comp: CategoryFormComponent;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: vi.fn()
    };
    categoryServiceSpy = {
      getByPrefix: vi.fn(),
      createResource: vi.fn(),
      patchResource: vi.fn()
    };
    activatedRouteStub = new ActivatedRouteStub({});

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        CategoryFormComponent,
      ],
      providers: [
        provideNgxValidationMessages({
          messages: {}
        }),
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: CategoryService, useValue: categoryServiceSpy},
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
    categoryServiceSpy.getByPrefix.mockReturnValue(of(new TaskCategory()));

    fixture = TestBed.createComponent(CategoryFormComponent);
    comp = fixture.componentInstance;

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
    categoryServiceSpy.getByPrefix.mockReturnValue(of(new TaskCategory()));

    fixture = TestBed.createComponent(CategoryFormComponent);
    comp = fixture.componentInstance;

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

    categoryServiceSpy.getByPrefix.mockReturnValue(of(expectedCategory));

    fixture = TestBed.createComponent(CategoryFormComponent);
    comp = fixture.componentInstance;

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
    routerSpy.navigate.mockReturnValue(Promise.resolve(true));
    categoryServiceSpy.getByPrefix.mockReturnValue(throwError(() => 'Test error'));

    fixture = TestBed.createComponent(CategoryFormComponent);
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

    routerSpy.navigate.mockReturnValue(Promise.resolve(true));
    categoryServiceSpy.createResource.mockReturnValue(of(newCategory));

    comp.sendForm();

    expect(categoryServiceSpy.createResource).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should be forward to home page when edit category success', () => {
    activatedRouteStub.setParamMap({prefix: 'TEST-1'});
    const existingCategory = new TaskCategory();
    existingCategory.name = 'Test';
    existingCategory.prefix = 'Prefix';
    existingCategory.description = 'Description';
    categoryServiceSpy.getByPrefix.mockReturnValue(of(existingCategory));

    fixture = TestBed.createComponent(CategoryFormComponent);
    comp = fixture.componentInstance;

    routerSpy.navigate.mockReturnValue(Promise.resolve(true));
    categoryServiceSpy.patchResource.mockReturnValue(of(existingCategory));

    fixture.detectChanges();

    comp.sendForm();

    expect(categoryServiceSpy.getByPrefix).toHaveBeenCalledWith('TEST-1');
    expect(categoryServiceSpy.patchResource).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should open icon list dialog', () => {
    fixture.detectChanges();

    const dialogComp = fixture.debugElement.injector.get(MatDialog);
    const spyDialog = vi.spyOn(dialogComp, 'open');
    comp.onShowIconList();

    expect(spyDialog).toHaveBeenCalled();
    expect(spyDialog).toHaveBeenCalledWith(FontIconListDialogComponent);
  });

  it('should get selected icon from list dialog', () => {
    fixture.detectChanges();

    const afterClose = { afterClosed: vi.fn().mockReturnValue(of('fa-tree')), close: vi.fn() };
    const dialogComp = fixture.debugElement.injector.get(MatDialog);
    vi.spyOn(dialogComp, 'open').mockReturnValue(afterClose as any);

    const templateHelper = new TemplateHelper(fixture);
    const showIconListButton = templateHelper
      .query<HTMLElement>('.category-form_show_icon_list_button');
    showIconListButton.click();

    fixture.detectChanges();

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(comp.categoryForm.getRawValue().icon).toBe('fa-tree');
  });

});
