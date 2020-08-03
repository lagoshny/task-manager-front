export class CommonSelectItem<T> {

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

  public static getTypeByName<T>(type: { new(): T }, name: any): T {
    for (const key in type) {
      if (this[key] instanceof type) {
        if (this[key].name === name) {
          return this[key];
        }
      }
    }
  }

  protected static getAllByType<T>(type: { new(): T }): Array<T> {
    const items = [];
    for (const key in type) {
      if (this[key] instanceof type) {
        items.push(this[key]);
      }
    }

    return items;
  }

  protected static getTypeByCode<T>(type: { new(): T }, code: any): T {
    for (const key in type) {
      if (this[key] instanceof type) {
        if (this[key].code === code) {
          return this[key];
        }
      }
    }
  }

}
