export class CounterChequeForm  {  

itbId					 : 0;
serviceId				 : number;
origDeptId				 : string;
referenceNo				 : string;
branchNo				 : string;
acctNo					 : string;
acctType				 : string = '';
acctName				 : string;
availBal				 : string;
acctSic					 : string;
acctStatus				 : string;
ccyCode					 : string = '';
productCode				 : string;
rsmId					 : number;
serviceStatus			 : string;
status					 : string = '';
originatingBranchId		 : string;
processingDeptId		 : string = '';
userProcessingDept       : string;
originBranch             : string;
transactionDate			 : string;
valueDate				 : string;
dateCreated				 : string;
userId					 : string;
supervisorId			 : string;
dismissedBy				 : string;
dismissedDate			 : string;
rejectedBy				 : string;
rejected				 : string;
rejectionIds			 : string;
rejectionDate			 : string;
printCount				 : string;
branchName	 : string;
select:  boolean;
userName: string;
chqWidrawalAmount:string;
beneficiaryName: string;
transAmout: 0;
cheqNo: string;
reqReason: 0;
ammendOrRepreintReasonId: number = null
} 


export class StopChequeForm  { 
    
	itbId			       : 0;
    serviceId			   : number;
    branchNo			   : string;
    chgAcctNo			   : string;
    chgAcctType			   : string;
    referenceNo			   : string;
    acctNo				   : string;
    acctType			   : string;
    acctName			   : string;
    hitOption			   : string;
    chqNoFrom			   : string;
    chqNoTo				   : string;
    chqAmt				   : string = '';
    chqDate				   : string;
    beneficiary			   : string;
    reason				   : string;
    transactionDate		   : string;
    valueDate			   : string;
    industrySector		   : string;
    ccyCode				   : string;
    status				   : string;
    errorMsg			   : string;
    dismissedBy			   : string;
    dismissedDate		   : string;
    dateCreated			   : string;
    userId				   : string;
    supervisorId		   : string;
    approvedBy			   : string;
    rejected			   : string;
    rejectionIds		   : string;
    rejectionDate		   : string;
    rejectedBy			   : string;
    serviceStatus		   : string;
    availBal			   : string;
    acctStatus			   : string;
    originatingBranchId	   : string;
    processingDeptId	   : string;
    rsmId				   : number;
    origDeptId			   : string;
    userName: string
    branchName: string;
    acctSic: string;
    productCode: string;
    userProcessingDept: string;
    originBranchName: string;
 }



