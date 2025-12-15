import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryService } from '../../services/category.service';
import { CategoryListComponent } from './category-list.component';
import { Mocked } from 'vitest';

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

  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let categoryServiceSpy: Mocked<Pick<CategoryService, 'getAllByUser' | 'deleteResource'>>;
  let dialogSpy: Mocked<Pick<MatDialog, 'open'>>;
  let taskCategoryService: TaskCategoryService;

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };
    categoryServiceSpy = {
      getAllByUser: vi.fn(),
      deleteResource: vi.fn(),
    };

    dialogSpy = { open: vi.fn() };

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CategoryListComponent,
        CategoryStubComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        TaskCategoryService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    categoryServiceSpy.getAllByUser.mockReturnValue(of([]));
    dialogSpy.open.mockReturnValue({
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
    categoryServiceSpy.getAllByUser.mockReturnValue(
      of([new TaskCategory(), new TaskCategory()])
    );

    fixture.detectChanges();

    expect(comp.categories.length).toBe(2);
  });

  it('should hide category list when minimize #click', () => {
    comp.minimizeCategories = false;
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
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
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const categoryHideIcon = templateHelper.query<HTMLElement>('.category-list__minimize_button__icon');
    categoryHideIcon.click();
    fixture.detectChanges();

    expect(templateHelper.query('tm-category')).toBeTruthy();
    expect(templateHelper.query('.category-list__minimize_button__icon.fa-eye')).toBeTruthy();
  });

  it('should navigate to add category url', () => {
    routerSpy.navigate.mockResolvedValue(true);

    comp.onAddCategory();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/new']);
  });

  it('should navigate to edit category url', () => {
    routerSpy.navigate.mockResolvedValue(true);
    const categoryToEdit = new TaskCategory();
    categoryToEdit.prefix = 'TEST';

    comp.onCategoryEdit(categoryToEdit);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['categories/edit', 'test']);
  });

  it('should open dialog to delete category', () => {
    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(false)
    } as any);

    comp.onCategoryDelete(new TaskCategory());

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should delete category after deletion dialog confirm', () => {
    const afterClose = {
      afterClosed: vi.fn().mockReturnValue(of(true)),
      close: vi.fn(),
    };
    dialogSpy.open.mockReturnValue(afterClose as any);

    categoryServiceSpy.deleteResource.mockReturnValue(of());

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).toHaveBeenCalled();
  });

  it('should NOT delete category after deletion dialog reject', () => {
    const afterClose = {
      afterClosed: vi.fn().mockReturnValue(of(false)),
      close: vi.fn(),
    };
    dialogSpy.open.mockReturnValue(afterClose as any);

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).not.toHaveBeenCalled();
  });

  it('should update category list after delete category', () => {
    const afterClose = {
      afterClosed: vi.fn().mockReturnValue(of(true)),
      close: vi.fn(),
    };
    dialogSpy.open.mockReturnValue(afterClose as any);

    categoryServiceSpy.deleteResource.mockReturnValue(of(new TaskCategory()));
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));

    fixture.detectChanges();

    comp.onCategoryDelete(new TaskCategory());

    expect(afterClose.afterClosed).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteResource).toHaveBeenCalled();
    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalled();
  });

  it('should refresh task list after delete category', () => {
    const afterClose = {
      afterClosed: vi.fn().mockReturnValue(of(true)),
      close: vi.fn(),
    };
    dialogSpy.open.mockReturnValue(afterClose as any);
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
    categoryServiceSpy.deleteResource.mockReturnValue(of(new TaskCategory()));
    const spyRefreshTasks = vi.spyOn(taskCategoryService, 'refreshTasks');

    comp.onCategoryDelete(new TaskCategory());

    expect(spyRefreshTasks).toHaveBeenCalledTimes(1);
  });

  it('should refresh category list by taskCategoryService category change event', () => {
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalledTimes(1);

    taskCategoryService.refreshCategories();

    expect(categoryServiceSpy.getAllByUser).toHaveBeenCalledTimes(2);
  });

  it('should be 2 selected categories when double CategoryClick', () => {
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const spyUpdateCategoriesByFilter = vi.spyOn(taskCategoryService, 'updateCategoriesByFilter');

    const firstCategory = new TaskCategory();
    firstCategory.id = 1;

    const secondCategory = new TaskCategory();
    secondCategory.id = 2;
    comp.onCategoryClick(firstCategory);
    comp.onCategoryClick(secondCategory);

    const calls = spyUpdateCategoriesByFilter.mock.calls;
    const lastCallArgs = calls[calls.length - 1];
    expect(lastCallArgs[0].length).toBe(2);
  });

  it('should fire updateCategoriesByFilter when click by category', () => {
    categoryServiceSpy.getAllByUser.mockReturnValue(of([new TaskCategory()]));
    fixture.detectChanges();

    const spyUpdateCategoriesByFilter = vi.spyOn(taskCategoryService, 'updateCategoriesByFilter');

    comp.onCategoryClick(new TaskCategory());

    expect(spyUpdateCategoriesByFilter).toHaveBeenCalledOnce();
  });

});
