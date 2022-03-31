import { GeneralService } from './../../../services/genservice.service';
import { GenModel } from './../../../model/gen.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { disk_space } from '../dashboard.data';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-disk-space',
  templateUrl: './disk-space.component.html'
})
export class DiskSpaceComponent implements OnInit {
  public data: any[]; 
  public showLegend = false;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B']
  }; 
  public showLabels = false;
  public explodeSlices = false;
  public doughnut = false; 
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 

  ////////////


   // @ViewChild(DatatableComponent) table: DatatableComponent;

   @ViewChild('dataTable') table: ElementRef;
  
   dataTable: any;
 
   editing = {};
   rows: any;
   temp = [];
   count = 20;
   selected = [];
   loadingIndicator: boolean = true;
   reorderable: boolean = true;
   columns = [
     { prop: 'name' },
     { name: 'Gender' },
     { name: 'Company' }
   ];
   dialogRef: any;
  // public settings: Settings;
   dataRes: any;
   token = GenModel.tokenName;
   loadPage = true;
   addedworkflowList: any[] = [];
 
   selectedRec: any[] = [];
 
   btnActionApprove = 'Approve';
   displayloader = false;
   lblProcess = '';
   retryService: number =  GenModel.retryService;
   retryMessage: any;
   retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
   internetConMsg = GenModel.internetConMsg;
 
  
  constructor( private _localStorageService: LocalStorageService,
               private _GeneralService: GeneralService) { }

  ngOnInit(){
    this.data = disk_space; 
    
  //  this.load();
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/complaint-statistics?token=')
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

            return retryCount;
        }
        else 
        {
          this.retryMessage = 'Problem Loading Page. Kindly contact System Administrator';
           throw(err);
        }
      }, 0).delay(this.retryDelayServiceInterval); 
    }).subscribe(
      (data: any) => {




        this.loadPage = false;
        this.rows = data.data;
       // this.temp = data.data;

      

         

          // for (let i = 0; i < data.data.length; i++) {

          //   // this.addedworkflowList = this.addedworkflowList || [];
 
          //          this.addedworkflowList.push({ 
          //            id: data.data[i].id,
          //            first_name: data.data[i].first_name,
          //            last_name: data.data[i].last_name,
          //            email: data.data[i].email,
          //            phone_number: data.data[i].phone_number,
          //            meter_number: data.data[i].meter_number,
          //            status: data.data[i].status,
          //           created_at:  this._GeneralService.dateconvertion(data.data[i].created_at)
          //           // roleId: data.data[i].roleId,
          //           // createdBy: data.data[i].createdBy,
          //          // productname: this.productNameBind,
          //          //  permissionActionName: data[i].permissionActionName, 
          //            // permissionActionOrder: data[i].priority,
          //          // assignMsg:'',
          //          // created:  this._GeneralService.dateconvertion(data.data[i].created_at),
          //            // last: data[i].last,
          //      });
 
          //  }

        

      },
      (error: any) => {
        
        console.log('error:', error) 
      
      }

    );
 
   }
  
  public onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      setTimeout(() => this.data = [...disk_space] );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}