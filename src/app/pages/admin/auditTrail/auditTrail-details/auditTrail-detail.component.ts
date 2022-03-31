import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import swal from 'sweetalert2';
import { GenModel } from "../../../../model/gen.model";
import { GeneralService } from "../../../../services/genservice.service";

@Component({
    selector: 'app-audit',
    templateUrl: './auditTrail-detail.component.html',
    styleUrls: ['./auditTrail-detail.component.scss']
})

export class auditTrailDetailComponent implements OnInit
{

    loadPage = true;
    rows = [];
    pageLmit = GenModel.pageLmit;
    pageListVal = '';
    temp = [];
    current_page = 1;
    ItemsPerPage: any;
    reloadLoad: any;
    displayloader = false;
    retryService: number =  GenModel.retryService;
    retryMessage: any;
    retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
    internetConMsg = GenModel.internetConMsg;
    RetryAttmMsg = GenModel.RetryAttmMsg;
    errorOccur = GenModel.errorOccur;
    apiIsDown = GenModel.apiIsDown;



    constructor(public _GeneralService: GeneralService, 
        public dialogRef: MatDialogRef<auditTrailDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        
        
    }

    ngOnInit()
    {
        this.ItemsPerPage = this._GeneralService.ItemsPerPage;
        console.log('data ', this.data);
        this.load(this.data.record);
    }


    load(tableName): void
    {
        console.log('tableName ', tableName);
        let tabls = tableName;
        this.loadPage = true;

        let track = 0;
        let url = 'Reports/GetAuditTrailByTableName';

        let val = {
            tableName: tableName
        };

        console.log("Vals ", val);

        this._GeneralService.homePage(val, url)
        .retryWhen((err) => {

            return err.scan((retryCount) =>  {

            retryCount  += 1;
            track = retryCount;
            if (retryCount < this.retryService) {

                this.retryMessage = this.RetryAttmMsg; 

                return retryCount;
            }
            else 
            {
                this.retryMessage = this.errorOccur;
                throw(err);
            }
           }, 0).delay(this.retryDelayServiceInterval); 
        })
        .subscribe(
            (data: any) => 
            {
                console.log('Users data: ', data);
                this.loadPage = false;
                this.temp = data;
                //this.rows = data._response;
                console.log('this.temp test - ', this.temp);
                
                
                if(data.length > 0)
                {

                    //console.log('greater')
                    
                    //this.tableName = data.tableName;
                    this.rows = data.slice(0, this.pageLmit);
                    console.log('this.rows ', this.rows)
                    this.changePage(this.current_page); 
                
                }  
            },
            (error: any) => 
            {
                if(track === this.retryService)
                {
                    swal('', this.apiIsDown, 'error');
                }
                else
                {
                    swal('', this.errorOccur, 'error');

                }
        });
    }
    public onOptionsSelected(event) 
    {
     // console.log('onOptionsSelected', event);
      this.pageLmit = event.target.value;
      console.log('pageLimit: ', this.pageLmit);
  
      this.rows =  this.temp.slice(0, this.pageLmit);
      
      console.log('allRow: ', this.rows);
  
  
      this.changePage(this.current_page);    
   }

    updateFilter(event, value: any) {
    
        console.log('updateFilter:', value);
    
        
    
        if (value === 1) {
        //   const val = event.target.value.toLowerCase();
        
        //   const temp = this.temp.filter(function(d) {
        //     return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
        //   });
    
        //   this.rows = temp;
        
         
         // this.table.offset = 0;
        }
        
        if (value === 'FullName') {
            const val = event.target.value.toLowerCase();
          
            const temp = this.temp.filter(function(d) {
              return d.userFullName.toLowerCase().indexOf(val) !== -1 || !val;
            });
      
            this.rows = temp;
          
        }
        if (value === 'EventType') {
            const val = event.target.value.toLowerCase();
          
            if(val.includes("modified"))
            {
                const temp = this.temp.filter(function(d) {
                    return d.eventtype.toLowerCase().indexOf(val) !== -1 || !val;
                });
            
                this.rows = temp;
            }
            else{
                
                this.rows = [];
            }
          
        }
        if (value === 'ColumnName') {

            const val = event.target.value.toLowerCase();
            console.log("vals ", val);
            
            if(val !== null)
            {
                const temp = this.temp.filter(function(d) {
                    console.log("d.column", d.columnName)
                    return d.columnName.toLowerCase().indexOf(val) !== -1 || !val;
                });

                this.rows = temp;
                
            }
          
        }

        if (value === 'OriginalValue') {
            const val = event.target.value.toLowerCase();
          
            const temp = this.temp.filter(function(d) {
              return d.originalvalue.toLowerCase().indexOf(val) !== -1 || !val;
            });
      
            this.rows = temp;
          
        }
        if (value === 'NewValue') {
            const val = event.target.value.toLowerCase();
          
            
            const temp = this.temp.filter(function(d) {
              return d.newvalue.toLowerCase().indexOf(val) !== -1 || !val;
            });
      
            this.rows = temp;
          
        }
    
    }

    prevPage()
    {
      
        if (this.current_page > 1) {
            this.current_page--;
            this.changePage(this.current_page);
        }
    }
  
    nextPage()
    {
      
        if (this.current_page < this.numPages()) {
          this.current_page++;
            this.changePage(this.current_page);
        }
    }
  
    changePage(page)
    {
        let btn_next = document.getElementById("btn_next");
        let btn_prev = document.getElementById("btn_prev");
      // let listing_table = document.getElementById("listingTable");
    
      let page_span =  document.getElementById("page");
  
      console.log('page55:', page);
       // console.log('page_span222 .innerHTML', page_span.innerHTML);
        // Validate page
        if (page < 1) 
            page = 1;
  
        if (page > this.numPages()) page = this.numPages();
  
        let tem = []; 
  
        for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
        {
            tem.push(this.temp[i]);
        }
  
        this.rows = tem;
  
        
        //console.log('page_span111', page_span);
        //console.log('page_span.innerHTML', page_span.innerHTML)
        console.log('this.numPages()', this.numPages());
        //let div = page + "/" + this.numPages();
        //console.log('div: ', div);
        //page_span.innerHTML = page + "/" + this.numPages();
        this.pageListVal = page + "/" + this.numPages();
  
    }
  
    numPages()
    {
        return Math.ceil(this.temp.length / this.pageLmit);
    }
  
    onload = function() {
      this.changePage(1);
    };

    close(): void {

        this.dialogRef.close(this.reloadLoad);
    }
  
}