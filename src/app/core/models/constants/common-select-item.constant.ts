export class CommonSelectItem {

  public name: string;

  public code: string;

  public className: string;

  public icon: string;

  public color: string;

  constructor(name?: string, code?: string, className?: string, color?: string, icon?: string) {
    this.name = name;
    this.code = code;
    this.className = className;
    this.color = color;
    this.icon = icon;
  }

  public static getTypeByName<T extends CommonSelectItem>(type: new() => T, name: any): T {
    for (const key in type) {
      if (this[key] instanceof type) {
        if (this[key].name === name) {
          return this[key];
        }
      }
    }
    throw Error('Can\'t find selected item by name: ' + name);
  }

  protected static getAllByType<T extends CommonSelectItem>(type: new() => T): Array<T> {
    const items = [];
    for (const key in type) {
      if (this[key] instanceof type) {
        items.push(this[key]);
      }
    }

    return items;
  }

  protected static getTypeByCode<T extends CommonSelectItem>(type: new() => T, code: any): T {
    for (const key in type) {
      if (this[key] instanceof type) {
        if (this[key].code === code) {
          return this[key];
        }
      }
    }
    throw Error('Can\'t find selected item by code: ' + code);
  }

}
