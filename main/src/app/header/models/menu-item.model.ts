export class MenuItem {

    /**
     * Menu name
     */
    public name: string;

    /**
     * Menu link
     */
    public  link: string;

    /**
     * Css class for font awesome icon
     */
    public  awesomeIcon: string;

    constructor(name?: string, link?: string, awesomeIcon?: string) {
        this.name = name;
        this.link = link;
        this.awesomeIcon = awesomeIcon;
    }

}
