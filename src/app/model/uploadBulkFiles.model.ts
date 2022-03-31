
export class UploadBulkFiles 
{
   
    itbId: number;
    serviceId : number;
    batchNo    :number
    branchNo:string
    acctNo:string
    acctType:string
    acctName: string;
    cbsTC:string
    narration:string              
    amount:number;
    Amount: number;
    drCr:string
    chargeCode:string
    ChargeCode: string;
    chargeAmount :number
    ChargeAmount :number
    ChargeNarration:string
    chgNarration :string
    transactionDate :string
    valueDate:string;
    dateCreated:string
    serviceStatus :string
    deptId:string
    processingDept :string
    batchSeqNo:string
    userId:string
    direction:string
    originatingBranchId:string
    chequeNo: string
    ccyCode: string;
    'A/C No': string;
    'A/C Type ': string;
    'DR/CR': string;
    'Currency': string;
    'Narration': string;
    'Chq No': string;
    'TranCode': string;
    'Value Date': string;
    'ReferenceNo': string;
    Ccy: string;
    ChgNarration: string;
    valErrorMessage: string

}

export class UploadBulkFilesValidator 
{
    acctNo:string
    acctType:string
    cbsTC:string
    narration:string              
    amount:string;
    drCr:string
    chargeCode:string
    chargeAmount :string
    chgNarration :string
    valueDate:string
    chequeNo: string
    ccyCode: string;
    valErrorMessage: string;
    dontSave: boolean
}