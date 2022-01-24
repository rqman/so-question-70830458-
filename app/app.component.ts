import { Component, Inject } from '@angular/core';
import {
  VERSION,
  MatDialogRef,
  MatDialog,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { ConfirmationDialog } from './confirmation-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { Observable, interval, take } from 'rxjs';
import { map, share, startWith, tap } from 'rxjs/operators';
import { OnInit } from '@angular/core/src/metadata';

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  version = VERSION;
  observableData: any = 'Hello';

  private serverSendEvents: Observable<string>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.serverSendEvents = interval(1500).pipe(
      tap((serverData) =>
        console.log(`Server send piece of data: ${serverData}`)
      ),
      map(
        (serverData) =>
          `I am data stream coming from some API maybe: ${serverData}`
      ),
      startWith('Value that already come from API before dialog was opened'),
      take(10),
      share()
    );
  }

  openDialog() {
    const obs = this.serverSendEvents.subscribe({
      next: (serverSendEvent) => (this.observableData = serverSendEvent),
    });

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: this.observableData,
        buttonText: {
          ok: 'Save',
          cancel: 'No',
        },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => obs.unsubscribe());
  }
}

/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// var dates = []

//     var now = moment().startOf('day').hour(10).minute(30).seconds(0)
//     var deadline = moment().hour(19).minute(0).seconds(0)
//     //dates.push(now.format('HH:mm A'))
//     while (now.diff(deadline) < 0) {
//       if (now >= moment(now).hour(10)) {
//         dates.push(now.format('hh:mm A'))
//       }
//       now.add(12, 'minutes');
//     }
