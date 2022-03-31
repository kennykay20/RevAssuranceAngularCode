export class InstrumentForm {
        
        itbId: 0;
        serviceId: number;
        origDeptId: string;//  [string; Validators.compose([Validators.required])];
        referenceNo: string;
        acctType: string = '';
        userProcessingDept: string;
        acctNo: string = '';//[string; Validators.compose([Validators.required])];
        acctName: string = '';//[string; Validators.compose([Validators.required])];
        ccyCode: string = '';//[string; Validators.compose([Validators.required])];
        availBal: string = null;//[string; Validators.compose([Validators.required])];
        acctSic: string = '';//[string; Validators.compose([Validators.required])];
        acctStatus: string = null;//[string; Validators.compose([Validators.required])];
        branchNo: string;//[string; Validators.compose([Validators.required])];
        branchName: string;
        acctProductCode: string;
        acctCustNo: string;
        processingDeptId: number;
        effectiveDate: string = null;
        tenor: string = null;//[string; Validators.compose([Validators.required])];
        tenorPeriod: string = null;//[string; Validators.compose([Validators.required])];
        expiryDate: string = null;//[string; Validators.compose([Validators.required])];
        amount: string = '';//[string; Validators.compose([Validators.required])];
        cardNo: string;
        instrumentCcy: string = '';//[string; Validators.compose([Validators.required])];
        rsmId: number;  //[string; Validators.compose([Validators.required])];
        contractNo: string = '';
        contractDate: string = null;
        beneficiary: string = '';
        purpose: string = null;
        adresseeName: string = '';//[string; Validators.compose([Validators.required])];
        addressLine1: string = '';
        addressLine2: string = '';
        addressLine3: string;
        addressLine4: string;
        templateContent: string;
        templateContentIds: string;
        insured: string = null;
        insuranceCoyName: string;
        insuranceCoverTypeId: string = '';
        insuranceEffectiveDate: string = null;
        insuranceExpiryDate: string = null;
        insurancePolicyNo: string = '';
        insuranceSumAssured: string = null;
        insurancePremiumPayable: string;
        insuranceCurrency: string = '';
        insuranceLocationOfProperty: string = '';
        contDrAcctType: string;
        contDrAcctNo: string;
        contDrAcctName: string;
        contDrCcyCode: string;
        contDrAvailBal: string;
        contDrAcctStatus: string;
        contCrAcctType: string;
        contCrAcctNo: string;
        contCrAcctName: string;
        contCrCcyCode: string;
        contCrAvailBal: string;
        contCrAcctStatus: string;
        ammendmentReason: string;
        ammendmentDate: string;
        ammendedBy: string;
        returnDate: string;
        returnUserId: string;
        rePrintingReason: string;
        rePrintdate: string;
        rePrintBy: string;
        rejected: string;
        rejectionReason: string;
        rejectedBy: string;
        rejectedDate: string;
        parentId: string;
        instrumentStatus: string;
        transactionDate: string;
        valueDate: string;
        status: string;
        dateCreated: string;
        userId: string;
        supervisorId: string;
        taxRate: string;
        taxRate2: string;
        taxCurrency2: string;
        contDrAcctNarration: string;
        contCrAcctNarration: string;
        approvedBy: string;
        approvedDate: string;
        originatingBranchId: string;
        amortDate: string;
        rePrintCount: string;
        ammendCount: string;
        rejectedIds: string;
        ammendmentReasonIds: string;
        rePrintReasonIds: string;
        dismissedBy: string;
        dismissedDate: string;
        rejectionIds: string;
        rejectionDate: string;
        createdBy: string;
        serialNo: string;
        wkfId: string;
        recordDate: string;
        serviceStatus: string;
        availBalString: string;
        sProductCode: string
        sCustomerId: string
        select: boolean;
        serviceDescription: string;
        userName: string;
        deptName: string;
        origBranchName: string;
        originBranch: string;
        ammendOrRepreintReasonId: number = null
        noOfCharges: number

}


export class CollateralForm {



        itbId: number;
        serviceId: number;
        serviceItbId: number;
        collTypeId: number;
        collDescription: string;
        acctNo: string = '';
        acctType: string = '';
        availBal: string;
        acctName: string;
        acctStatus: string;
        acctCCy: string;
        holdId: string;
        lienAmount: string = null;
        collStatus: string;
        forcedSaleValue: string;
        effectiveDate: string;
        expiryDate: string;
        location: string;
        ccyCode: string;
        valuer: string;
        verifiedBy: string;
        verificationDate: string;
        marketValue: string;

      
        insCoyName: string;
        insured: string;
        insCoverTypeId: string;
        policyNo: string;
        sumAssured: string;
        premiumPayable: string;

        collMortgageNo: string;
        userId: string;
        status: string;
        dateCreated: string;
        placeHoldBoolean: boolean = false;
        placeHold: string;
        selected: boolean;
        collateralName: string

}

export class CollateralType {
        collTypeId: number;
        collateralName: string;
        selectedCollateral: string;
}

export class CollateralCheckList {
        collTypeId: number;
        collateralName: string
}


export class ChargeForm {

        itbId: 0;
        serviceId: number;
        serviceItbId: number;
        chgAcctNo: string;
        chgAcctType: string;
        chgAcctName: string;
        chgAvailBal: string;
        chgAcctCcy: string;
        chgAcctStatus: string;
        chargeCode: string;
        chargeRate: string;
        origChgAmount: string;
        origChgCCy: string;
        exchangeRate: string;
        equivChgAmount: string;
        equivChgCcy: string;
        chgNarration: string;
        taxAcctNo: string;
        taxAcctType: string;
        taxRate: string;
        taxAmount: string;
        taxNarration: string;
        incBranch: string;
        incAcctNo: string;
        incAcctType: string;
        incAcctName: string;
        incAcctBalance: string;
        incAcctStatus: string;
        incAcctNarr: string;
        seqNo: number;
        status: string;
        dateCreated: string;
        transactionDate: string;
        valueDate: string;
        nTaxRate: string;
        sTaxNarration: string;
        sTaxAcctNo: string;
        sChgCurrency: string;
        sTaxAcctType: string;
        templateId: number;


}


