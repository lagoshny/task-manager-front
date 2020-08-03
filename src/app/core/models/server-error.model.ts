/**
 * Defining a common format to represent server API errors.
 */
export class ServerError {

    /**
     * Http status.
     */
    public status: string;

    /**
     * Time when an error occurred.
     */
    public timestamp: Date;

    /**
     * Url path where an error occurred.
     */
    public path: string;

    /**
     * List of error messages to display.
     */
    public messages: Array<string>;

}
