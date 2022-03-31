

export class DocRetrieval  {  

itbId					 : 0;
serviceId				 : number;

origDeptId		  : string;
referenceNo		  : string;
branchNo			  : string;
acctNo			  : string = '';
acctType			  : string;
acctName			  : string;
availBal			  : string;
originBranch      : string;
userProcessingDept  : string;
pinDescription   : string;
acctSic			  : string;
acctStatus		  : string;
ccyCode			  : string;
productCode		  : string;
rsmId				  : number;
serviceStatus		  : string;
status			  : string;
pinIds            : string;
originatingBranchId : string;
processingDeptId	  : string;
transactionDate	  : string;
valueDate			  : string;
dateCreated		  : string;
userId			  : string;
supervisorId		  : string;
dismissedBy		  : string;
dismissedDate		  : string;
rejectedBy		  : string;
rejected			  : string;
rejectionIds		  : string;
rejectionDate		  : string;
printCount		  : string;
userName: string;
branchName: string;
select: boolean
 }
 
export class admDocumentChg  {
itbId : number;
documentId     : number;
serviceId: string;
description: string;
chgMetrix: string;
chgBasis: string;
periodStart: string;
periodEnd: string;
chgAmount: string;
ccyCode: string;
status: string;
userId: string;
dateCreated: string;
qty: number
total: string;
chargeRate: number;
totalCharge: number;
}

