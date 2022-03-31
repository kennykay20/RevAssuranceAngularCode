import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
    import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { 
            AppLoaderComponentComponent 
        } from '../../pages/app-loader-component/app-loader-component.component';

@Injectable()
export class WaitingDialog {
    dialogRef: MatDialogRef<AppLoaderComponentComponent>;
    constructor(private snackBar: MatSnackBar,
                private dialog: MatDialog) {}
    public open(title: string = 'Please wait'): Observable<boolean>
    {
        this.dialogRef = this.dialog.open(AppLoaderComponentComponent, {disableClose: true});
        this.dialogRef.updateSize('200px');
        this.dialogRef.componentInstance.title = title;
        return this.dialogRef.afterClosed();
    }

    public close() 
    {
        if(this.dialogRef)
        this.dialogRef.close();
    }

    returndisplayMsg(msg)
    {
        let self = this;
        self.snackBar.open(msg, 'close', { duration: 3000 }); 
    }

}
