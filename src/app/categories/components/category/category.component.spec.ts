import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCategory } from '../../../core/models/task-category.model';
import { StringUtils } from '../../../core/utils/string.utils';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryComponent } from './category.component';

@Pipe({
  name: 'amountCharacters'
})
class AmountCharactersPipeStub implements PipeTransform {
  public transform(value: any, ...args: any[]): any {
    return value;
  }
}

describe('CategoryComponent', () => {

  let fixture: ComponentFixture<CategoryComponent>;
  let comp: CategoryComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryComponent,
        AmountCharactersPipeStub
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CategoryComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the comp', () => {
    expect(comp).toBeTruthy();
  });

  it('#onChangeCategoryMenuOpacity should change opacity', () => {
    comp.onChangeCategoryMenuOpacity(1);
    expect(comp.categoryMenuOpacity).toBe(1);
  });

  it('#categoryEdit event should pass clicked category', () => {
    const taskCategory = new TaskCategory();
    comp.category = taskCategory;
    comp.categoryEdit.subscribe((categoryToEdit: TaskCategory) => {
      expect(categoryToEdit).toBe(taskCategory);
    });
    comp.categoryEdit.emit(taskCategory);
  });

  it('#categoryDelete event should pass clicked category', () => {
    const taskCategory = new TaskCategory();
    comp.category = taskCategory;
    comp.categoryDelete.subscribe((categoryToDelete: TaskCategory) => {
      expect(categoryToDelete).toBe(taskCategory);
    });
    comp.categoryDelete.emit(taskCategory);
  });

  it('when category without icon should be used default one', () => {
    const taskCategory = new TaskCategory();
    taskCategory.icon = StringUtils.EMPTY;
    comp.category = taskCategory;
    fixture.detectChanges();

    const defaultIconCssClass = '.fa-certificate';
    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query(defaultIconCssClass)).toBeDefined();
  });

  it('when category has icon should be used this one', () => {
    const defaultIconCssClass = '.fa-certificate';
    const customIconClass = 'fa-example';
    const taskCategory = new TaskCategory();
    taskCategory.icon = customIconClass;
    comp.category = taskCategory;
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query(`.${ customIconClass }`)).not.toBeNull();
    expect(templateHelper.query(defaultIconCssClass)).toBeNull();
  });

  it('when mouseenter event on category then menu opacity should be 1', () => {
    comp.category = new TaskCategory();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const categoryEl = templateHelper.query<HTMLElement>('.category');
    categoryEl.dispatchEvent(new MouseEvent('mouseenter'));

    fixture.detectChanges();
    const categoryMenuEl = templateHelper.query<HTMLElement>('.category_menu');
    expect(categoryMenuEl.style.opacity).toBe('1');
  });

  it('when mouseleave event on category then menu opacity should be 0', () => {
    comp.category = new TaskCategory();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const categoryEl = templateHelper.query<HTMLElement>('.category');
    categoryEl.dispatchEvent(new MouseEvent('mouseleave'));

    fixture.detectChanges();
    const categoryMenuEl = templateHelper.query<HTMLElement>('.category_menu');
    expect(categoryMenuEl.style.opacity).toBe('0');
  });

  it('should set active category when click by inactive category', () => {
    comp.category = new TaskCategory();
    comp.isCategoryActive = false;
    fixture.detectChanges();

    comp.onCategoryClick();

    expect(comp.isCategoryActive).toBe(true);
  });

  it('should set inactive category when click by active category', () => {
    comp.category = new TaskCategory();
    comp.isCategoryActive = true;
    fixture.detectChanges();

    comp.onCategoryClick();

    expect(comp.isCategoryActive).toBe(false);
  });

  it('should fire category click event with category when click by category', () => {
    const taskCategory = new TaskCategory();
    comp.category = taskCategory;
    fixture.detectChanges();

    comp.categoryClick.subscribe((categoryToEdit: TaskCategory) => {
      expect(categoryToEdit).toBe(taskCategory);
    });

    comp.onCategoryClick();
  });

});
