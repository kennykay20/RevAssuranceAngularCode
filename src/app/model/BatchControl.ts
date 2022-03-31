
export class BatchControl {

      batchNo: number;
      description: string;
      serviceId: number;
      ccyCode: string;
      postedTransCount: string;
      recordCount: string;
      totalDrCount: string;
      totalCrCount: string;
      totalDr: number;
      totalCr: number;
      totalChargeAmount: number;
      tDifference: string;
      loadedBy: string;
      loadedUser:string;
      dept: string;
      originBranchNo: number;
      originBranch: string;
      isBalanced: string;
      verifiedBy: string;
      approvedBy: string;
      postedDrCount: string;
      postedCrCount: string;
      isManual: string;
      status: string;
      filename: string;
      dateCreated: string;
      dateVerified: string;
      dateApproved: string;
      processingDept: string;
      userProcessingDept: string;
      rejected: string;
      rejectedBy: string;
      rejectionReason: string;
      rejectionDate: string;
      closedBy: string;
      dateClosed: string;
      postingDate: string;
      select: boolean = false;
      defaultNar: string;
      createdBy: string;
      approvedDate: string;
      transStatus: string;
      verifiedDate: string;
      itemCount: string
}

export class BatchItem {

      itbId				: number; 
      serviceId			: number; 
      batchNo				: number; 
      branchNo			: string; 
      acctNo				: string; 
      acctType			: string; 
      acctName			: string; 
      acctBalance			: string; 
      acctStatus			: string; 
      cbsTC				: string; 
      chequeNo			: string; 
      ccyCode				: string; 
      amount				: string; 
      drCr				: string; 
      narration			: string; 
      chargeCode			: string; 
      chargeAmount		: string; 
      chgNarration		: string; 
      taxAcctNo			: string; 
      taxAcctType			: string; 
      taxRate				: string; 
      taxAmount			: string; 
      taxNarration		: string; 
      incBranch			: string; 
      incAcctNo			: string; 
      incAcctType			: string; 
      incAcctName			: string; 
      incAcctBalance		: string; 
      incAcctStatus		: string; 
      incAcctNarr			: string; 
      classCode			: string; 
      openingDate			: string; 
      indusSector			: string; 
      custType			: string; 
      custNo				: string; 
      rsmId				: string; 
      cashBalance			: string; 
      cashAmt				: string; 
      city				: string; 
      valUserId			: string; 
      valErrorCode		: string; 
      valErrorMsg			: string; 
      transactionDate		: string; 
      valueDate			: string; 
      dateCreated			: string; 
      serviceStatus		: string; 
      status				: string; 
      deptId				: string; 
      processingDept		: string; 
      batchSeqNo			: string; 
      userId				: string; 
      supervisorId		: string; 
      direction			: string; 
      originatingBranchId : string; 
      dismissedBy			: string; 
      dismissedDate		: string; 
      rejected			: string; 
      rejectionIds		: string; 
      rejectionDate		: string; 
      referenceNo: string;
      postingErrorCode: string;
      postingErrorDescr: string;
 
}



