import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryService } from '../../services/category.service';
import { CategoryListComponent } from './category-list.component';

@Component({
  selector: 'tm-category',
  template: '',
  standalone: true
})
class CategoryStubComponent {
  @Input() category: TaskCategory;
}

describe('CategoryListComponent', () => {
  let fixture: ComponentFixture<CategoryListComponent>;
  let comp: CategoryListComponent;

  let routerSpy: jasmine.SpyObj<Router>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let taskCategoryService: TaskCategoryService;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getAllByUser',
      'deleteResource'
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CategoryListComponent,
        CategoryStubComponent,
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: CategoryService, useValue: categoryServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        TaskCategoryService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([]));
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    fixture = TestBed.createComponent(CategoryListComponent);
    comp = fixture.componentInstance;
    taskCategoryService = TestBed.inject(TaskCategoryService);
  });

  it('should create the comp', () => {
    expect(comp).toBeTruthy();
  });

  it('should load categories', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(
      of([new TaskCategory(), new TaskCategory()])
    );

    fixture.detectChanges();

    expect(comp.categories.length).toBe(2);
  });

  it('should hide category list when minimize #click', () => {
    comp.minimizeCategories = false;
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const categoryHideIcon = templateHelper.query<HTMLElement>('.category-list__minimize_button__icon');
    categoryHideIcon.click();
    fixture.detectChanges();

    expect(templateHelper.query('tm-category')).toBeNull();
    expect(templateHelper.query('.category-list__minimize_button__icon.fa-eye-slash')).toBeTruthy();
  });

  it('should show category list when maximize #click', () => {
    comp.minimizeCategories = true;
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const categoryHideIcon = templateHelper.query<HTMLElement>('.category-list__minimize_button__icon');
    categoryHideIcon.click();
    fixture.detectChanges();

    expect(templateHelper.query('tm-category')).toBeTruthy();
    expect(templateHelper.query('.category-list__minimize_button__icon.fa-eye')).toBeTruthy();
  });

  it('should navigate to add category url', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    comp.onAddCategory();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/new']);
  });

  it('should navigate to edit category url', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    const categoryToEdit = new TaskCategory();
    categoryToEdit.prefix = 'TEST';

    comp.onCategoryEdit(categoryToEdit);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/edit', 'test']);
  });

  it('should open dialog to delete category', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    comp.onCategoryDelete(new TaskCategory());

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should delete category after deletion dialog confirm', () => {
    const afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    dialogSpy.open.and.returnValue(afterClose);

    categoryServiceSpy.deleteResource.and.returnValue(of());

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).toHaveBeenCalled();
  });

  it('should NOT delete category after deletion dialog reject', () => {
    const afterClose = jasmine.createSpyObj({afterClosed: of(false), close: null});
    dialogSpy.open.and.returnValue(afterClose);

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).not.toHaveBeenCalled();
  });

  it('should update category list after delete category', () => {
    const afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    dialogSpy.open.and.returnValue(afterClose);

    categoryServiceSpy.deleteResource.and.returnValue(of(new TaskCategory()));
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));

    fixture.detectChanges();

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).toHaveBeenCalled();
    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalled();
  });

  it('should refresh task list after delete category', () => {
    const afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    dialogSpy.open.and.returnValue(afterClose);
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    categoryServiceSpy.deleteResource.and.returnValue(of(new TaskCategory()));
    const spyRefreshTasks = spyOn(taskCategoryService, 'refreshTasks');

    comp.onCategoryDelete(new TaskCategory());

    expect(spyRefreshTasks.calls.count()).toBe(1);
  });

  it('should refresh category list by taskCategoryService category change event', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalledTimes(1);

    taskCategoryService.refreshCategories();

    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalledTimes(2);
  });

  it('should be 2 selected categories when double CategoryClick', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const spyUpdateCategoriesByFilter = spyOn(taskCategoryService, 'updateCategoriesByFilter');

    const firstCategory = new TaskCategory();
    firstCategory.id = 1;

    const secondCategory = new TaskCategory();
    secondCategory.id = 2;
    comp.onCategoryClick(firstCategory);
    comp.onCategoryClick(secondCategory);

    expect(spyUpdateCategoriesByFilter.calls.mostRecent().args[0].length).toBe(2);
  });

  it('should fire updateCategoriesByFilter when click by category', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const spyUpdateCategoriesByFilter = spyOn(taskCategoryService, 'updateCategoriesByFilter');

    comp.onCategoryClick(new TaskCategory());

    expect(spyUpdateCategoriesByFilter.calls.count()).toBe(1);
  });

});
