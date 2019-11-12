export interface SimpleDialogData {
    type?: DialogType;
    title?: string;
    content?: string;
    acceptButtonTitle?: string;
    cancelButtonTitle?: string;
}

export enum DialogType {
    WARNING = 'WARNING'
}