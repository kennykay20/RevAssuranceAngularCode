/*Implemented for search */
export class RoleAssignDTO {

    menuId: number;
    menuName: string;
    canAdd: boolean;
    canAuth: boolean;
    canDelete: boolean;
    canEdit: boolean;
    canView: boolean;
    isGlobalSupervisor: boolean;
    canAuthorise: boolean;
    roleId: string;
    userId: string;
    parentId: number;
    childParentId: number;
    routerLink: string;
    icon: string;
    grandParentMenuName: string;
};


