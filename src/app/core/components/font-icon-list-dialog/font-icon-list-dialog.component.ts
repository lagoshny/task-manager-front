import { Component, OnInit } from '@angular/core';
import { FontIcon } from '../../models/interfaces/font-icon.interace';
import { FontIconService } from '../../services/font-icon.service';
import { MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tm-icon-list',
  templateUrl: './font-icon-list-dialog.component.html',
  styleUrls: ['./font-icon-list-dialog.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ]
})
export class FontIconListDialogComponent implements OnInit {

  public icons: Array<FontIcon> = [];

  constructor(private dialogRef: MatDialogRef<FontIconListDialogComponent>,
              private fontIconService: FontIconService) {
  }

  public ngOnInit(): void {
    this.fontIconService.getAllIconClasses().subscribe((loadedIcons: Array<FontIcon>) => {
      this.icons = loadedIcons;
    });
  }

  public onClickIcon(selectedIcon: string): void {
    this.dialogRef.close(selectedIcon);
  }

}
