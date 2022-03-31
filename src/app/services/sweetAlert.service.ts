import { Injectable } from '@angular/core';
//import swal from 'sweetalert2';

import Swal from 'sweetalert2';
import { GenModel } from '../model/gen.model';

const myWindow: any = typeof window !== 'undefined' && window || {};

@Injectable()
export class SweetAlertService {
  btnConfirm = GenModel.btnConfirm;
  

  constructor() { // nothing to do in here :)
  }

  confirm(alerTitle: string, alerText: string, btnYes: string, Cancel: string,
    okCallback: () => any) {
    Swal({

      title: alerTitle,
      text: alerText,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: btnYes,
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: Cancel,
      allowEscapeKey: false,
      allowOutsideClick: false

    }).then((result) => {

      console.log("confirm ", result);

      if (result.value) {

        okCallback();
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

  }

  errorAlert(alertTitle: string) {

    Swal('', alertTitle, 'error');
  }

  snackBar() {
    // Get the snackbar DIV

    var x = document.getElementById("snackbar");
    console.log('snackBar x', x);

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout( () => {
       x.className = x.className.replace("show", ""); 
      }, 900000);
  }

  snackBar2() { 
    alert(2)
  }


  /*
  deleteConfirmOkCancelFunction(alerTitle: string, alerText: string, alertIcon, okCallback: () => any, cancelCallBack: () => any) {
  this.swalWithBootstrapButtons.fire({
  title: alerTitle,
  text: alerText,
  icon: alertIcon,
  showCancelButton: true,
  confirmButtonText: 'Ok, delete it!',
  cancelButtonText: 'No, cancel!',
  reverseButtons: true
  }).then((result) => {
  if (result.value) {
  okCallback();
  } else if (
  / Read more about handling dismissals below /
  result.dismiss === swal.DismissReason.cancel
  ) {
  cancelCallBack();
  }
  });
  }
  
  successAlert(alertTitle: string) {
  swal.fire({
  position: 'center',
  icon: 'success',
  title: alertTitle,
  showConfirmButton: false,
  timer: 1500
  });
  }
  
  errorAlert(alertTitle: string) {
  swal.fire({
  position: 'center',
  icon: 'error',
  title: alertTitle,
  showConfirmButton: false,
  timer: 1500
  });
  }
  
  infoAlert(alertTitle: string) {
  swal.fire({
  position: 'center',
  icon: 'info',
  title: alertTitle,
  showConfirmButton: false,
  timer: 1500
  });
  }
  
  warningAlert(alertTitle: string) {
  swal.fire({
  position: 'center',
  icon: 'warning',
  title: alertTitle,
  showConfirmButton: false,
  timer: 1500
  });
  }
  
  
  */

}