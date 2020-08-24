import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { TaskCategory } from '../../../core/models/task-category.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryService } from '../../services/category.service';
import { CategoryListComponent } from './category-list.component';

@Component({
  selector: 'tm-category', template: ''
})
class CategoryStubComponent {
  @Input()
  public category: TaskCategory;
}

describe('CategoryListComponent', () => {
  let fixture: ComponentFixture<CategoryListComponent>;
  let comp: CategoryListComponent;
  let routerSpy: any;
  let categoryServiceSpy: any;

  beforeEach(async(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    categoryServiceSpy = {
      getAllByUser: jasmine.createSpy('getAllByUser'),
      delete: jasmine.createSpy('delete')
    };

    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CategoryListComponent,
        CategoryStubComponent
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: NGXLogger, useClass: NGXLoggerMock},
        {provide: CategoryService, useValue: categoryServiceSpy},
        TaskCategoryService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryListComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the comp', () => {
    expect(comp).toBeTruthy();
  });

  it('should load categories', () => {
    const categories: Array<TaskCategory> = [];
    categories.push(new TaskCategory());
    categories.push(new TaskCategory());
    categoryServiceSpy.getAllByUser.and.returnValue(of(categories));

    fixture.detectChanges();

    expect(comp.categories.length).toBe(2);
  });

  it('should hide category list when minimize #click', () => {
    comp.minimizeCategories = false;
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));

    comp.onMinimizeCategories();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-category')).toBeNull();
    expect(templateHelper.query('.category-list__minimize_button__icon.fa-eye-slash')).toBeTruthy();
  });

  it('should show category list when maximize #click', () => {
    comp.minimizeCategories = true;
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));

    comp.onMinimizeCategories();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-category')).toBeTruthy();
    expect(templateHelper.query('.category-list__minimize_button__icon.fa-eye')).toBeTruthy();
  });

  it('should navigate to add category url', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.onAddCategory();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/new']);
  });

  it('should navigate to edit category url', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve());
    const categoryToEdit = new TaskCategory();
    categoryToEdit.prefix = 'TEST';

    comp.onCategoryEdit(categoryToEdit);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/edit', 'test']);
  });

  it('should open dialog to delete category', () => {
    let dialogComp = TestBed.get(MatDialog);
    let spyDialog = spyOn(dialogComp, 'open').and.callThrough();
    comp.onCategoryDelete(new TaskCategory());

    expect(spyDialog).toHaveBeenCalled();
  });

  it('should delete category after deletion dialog confirm', () => {
    let afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    let dialogComp = TestBed.get(MatDialog);
    spyOn(dialogComp, 'open').and.returnValue(afterClose);
    categoryServiceSpy.delete.and.returnValue(of());

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.delete).toHaveBeenCalled();
  });

  it('should NOT delete category after deletion dialog reject', () => {
    let afterClose = jasmine.createSpyObj({afterClosed: of(false), close: null});
    let dialogComp = TestBed.get(MatDialog);
    spyOn(dialogComp, 'open').and.returnValue(afterClose);
    categoryServiceSpy.delete.and.returnValue(of());

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.delete).toHaveBeenCalledTimes(0);
  });


  it('should update category list after delete category', () => {
    let afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    let dialogComp = TestBed.get(MatDialog);
    spyOn(dialogComp, 'open').and.returnValue(afterClose);
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    categoryServiceSpy.delete.and.returnValue(of(new TaskCategory()));

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.delete).toHaveBeenCalled();
    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalled();
  });

  it('should refresh task list after delete category', () => {
    let afterClose = jasmine.createSpyObj({afterClosed: of(true), close: null});
    let dialogComp = TestBed.get(MatDialog);
    spyOn(dialogComp, 'open').and.returnValue(afterClose);
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    categoryServiceSpy.delete.and.returnValue(of(new TaskCategory()));
    const taskCategoryService = TestBed.get(TaskCategoryService);
    const spyRefreshTasks = spyOn(taskCategoryService, 'refreshTasks');

    comp.onCategoryDelete(new TaskCategory());

    expect(spyRefreshTasks.calls.count()).toBe(1);
  });

  it('should refresh category list by taskCategoryService category change event', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    expect(categoryServiceSpy.getAllByUser.calls.count()).toBe(1);

    const taskCategoryService: TaskCategoryService = TestBed.get(TaskCategoryService);
    taskCategoryService.refreshCategories();

    expect(categoryServiceSpy.getAllByUser.calls.count()).toBe(2);
  });

  it('should be 2 selected categories when double CategoryClick', () => {
    categoryServiceSpy.getAllByUser.and.returnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const taskCategoryService: TaskCategoryService = TestBed.get(TaskCategoryService);
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

    const taskCategoryService: TaskCategoryService = TestBed.get(TaskCategoryService);
    const spyUpdateCategoriesByFilter = spyOn(taskCategoryService, 'updateCategoriesByFilter');

    comp.onCategoryClick(new TaskCategory());

    expect(spyUpdateCategoriesByFilter.calls.count()).toBe(1);
  });

});
