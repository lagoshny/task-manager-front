import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogType, SimpleDialogData } from '../../models/simple-dialog-data.model';

@Component({
  selector: 'tm-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss']
})
export class SimpleDialogComponent implements OnInit {

  public defaultData: SimpleDialogData = {
    type: DialogType.WARNING,
    title: 'Dialog',
    content: 'Is it ok?',
    acceptButtonTitle: 'Yes',
    cancelButtonTitle: 'No'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: SimpleDialogData) {
  }

  public ngOnInit(): void {
    this.data.type = this.data.type || this.defaultData.type;
    this.data.title = this.data.title || this.defaultData.title;
    this.data.content = this.data.content || this.defaultData.content;
    this.data.acceptButtonTitle = this.data.acceptButtonTitle || this.defaultData.acceptButtonTitle;
    this.data.cancelButtonTitle = this.data.cancelButtonTitle || this.defaultData.cancelButtonTitle;
  }

}
