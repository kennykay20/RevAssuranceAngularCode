import { Menu } from './menu.model';

 export const verticalMenuItems = [ 

  //Dashboard

  new Menu (1, 'Dashboard', '/dashboard', null, 'dashboard', null, false, 0), 
  
  //Management Users

  new Menu (2, 'Admin', null, null, 'line_weight', null, true, 0),  // Parent 

  new Menu (10000, 'External App. Conn.', '/adm/bankServiceSetUp/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (20000, 'Client Profile', '/adm/ClientProfile/mid=1', null, 'drag_indicator', null, false, 2), 
  new Menu (3, 'Manage Account Type', '/adm/acctType/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (4, 'Manage Branch', '/adm/branch/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (5, 'Manage Charge', '/adm/charge/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (6, 'Manage Currency', '/adm/currency/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (7, 'Manage Department', '/adm/department/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (8, 'Manage Roles', '/adm/role/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (9, 'Manage Window SVC', '/adm/manageWindowSvc/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (10, 'User Set Up', '/adm/userSetUp/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (11, 'Change Password', '/adm/changePassword/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (13422, 'Manage Service', '/adm/manageService/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (130000, 'Manage Rejection Reason', '/adm/rejection/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (144, 'Manage Batch Control', '/adm/batchControl/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (15, 'Manage Batch Counter', '/adm/batchCounter/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (16, 'Manage User', '/adm/users/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (17, 'Trans. Conf', '/adm/transConfig/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (18, 'Manage Chq. Product', '/adm/checkProduct/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (19, 'Downlaod Log Files', '/adm/downloadLogFiles/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (20, 'Execute Scripts', '/adm/executeScripts/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (21, 'Statement Set Up', '/adm/statementSetUp/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (22, 'Select to Excel', '/adm/selectToExcel/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (23, 'Template SetUp', '/adm/templateSetUp/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (24, 'License History', '/adm/licenseHistory/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (25, 'BroadCast Message', '/adm/broadcastMessage/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (26, 'Service Reference', '/adm/serviceRef/mid=1', null, 'drag_indicator', null, false, 2),
  new Menu (27, 'Role Assignment', '/adm/role-ass/mid=1', null, 'drag_indicator', null, false, 2),
  
  //Operation

    new Menu (3, 'Operation', null, null, 'account_balance_wallet', null, true, 0),  // Parent 
    
    new Menu (100, 'Token Requisition', '/prc/token/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (200, 'Salary Processing', '/prc/salaryProccessing/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (300, 'Cheque Book Request', '/prc/chqBookReq/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (600, 'Card Request', '/prc/cardReq/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (601, 'APG Payment Guarantee', '/prc/apg/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (602, 'Performance Bond', '/prc/perfBond/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (603, 'Bid Bond', '/prc/bidPer/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (603, 'Bank Guarantee', '/prc/bnkGua/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (604, 'Counter Cheque', '/prc/counterChqReq/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (605, 'Stop Cheque Request', '/prc/StopChq/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (606, 'Business Search', '/prc/businessSearch/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (606, 'Approve Services', '/prc/apprSer/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (606, 'Post Transaction', '/prc/postTrans/mid=1', null, 'drag_indicator', null, false, 3),
    new Menu (607, 'Authorize Trans', '/prc/authList/mid=1', null, 'drag_indicator', null, false, 3),

  // new Menu (5, 'Un-approve User', '/user/UnapproveUser', null, 'drag_indicator', null, false, 2), 
  // new Menu (6, 'Approve User', '/user/approveuser', null, 'drag_indicator', null, false, 2), 
  // new Menu (7, 'Deactivate User', '/user/deactivateuser', null, 'drag_indicator', null, false, 2), 
  // new Menu (8, 'Declined User', '/user/declineuser', null, 'drag_indicator', null, false, 2) ,
  /*
 //Charges 

  new Menu (9, 'Charges', null, null, 'payment', null, true, 0),  // Parent 
  new Menu (10, 'Add Fines', '/chg/all', null, 'drag_indicator', null, false, 9),
  new Menu (1000, 'My fines', '/chg/my-fine', null, 'drag_indicator', null, false, 9),

  new Menu (1000, 'All-fine', '/chg/all-fine', null, 'drag_indicator', null, false, 9),
  new Menu (1002, 'Pending-Waiver', '/chg/pending-waiver', null, 'drag_indicator', null, false, 9),
  new Menu (1003, 'Approve-Waiver', '/chg/approve-waiver', null, 'drag_indicator', null, false, 9),
  new Menu (1004, 'All Fine Waiver', '/chg/all-fine-waiver', null, 'drag_indicator', null, false, 9),


  // { path: '', component: AllFineComponent, data: { breadcrumb: 'All Fines' } },
  //   { path: '', component: ApplyWaiverComponent, data: { breadcrumb: 'Apply Waiver' } },
  //   { path: '', component: PendingWaiverComponent, data: { breadcrumb: 'Pending Waiver' } },
  //   { path: '', component: ApproveWaiverComponent, data: { breadcrumb: 'Approve Waiver' } },
  //   { path: '', component: AllFineWaiversComponent, data: { breadcrumb: 'All Fine Waivers' } },






 
  // Roles & Permissions

  new Menu (11, 'Roles & Permissions', null, null, 'people_outline', null, true, 0),  // Parent 
  new Menu (12, 'Roles', '/Roles/Roles', null, 'drag_indicator', null, false, 11) ,
  new Menu (13, 'Permissions', '/Roles/Permission', null, 'drag_indicator', null, false, 11) ,
  new Menu (14, 'Assign Role', '/Roles/assignrole', null, 'drag_indicator', null, false, 11) ,
  
  // Visitors
  new Menu (14, 'Visitors', null, null, 'how_to_reg', null, true, 0),  // Parent 
  new Menu (15, 'Create Visitor', '/vis/vis', null, 'drag_indicator', null, false, 14),
  new Menu (16, 'Validate Visitor', '/vis/valvisitorcode', null, 'drag_indicator', null, false, 14),
  new Menu (17, 'My Visitors', '/vis/myvisitors', null, 'drag_indicator', null, false, 14),
  new Menu (17, 'All Visitors', '/vis/allvis', null, 'drag_indicator', null, false, 14),
    
  // Complaints
  new Menu (18, 'Complaints', null, null, 'add_alert', null, true, 0),  // Parent 
  new Menu (19, 'Lodge Complaint', '/com/com', null, 'drag_indicator', null, false, 18) ,
  new Menu (20, 'My Complaints', '/com/mycomplaints', null, 'drag_indicator', null, false, 18) ,
  new Menu (21, 'All Complaints', '/com/allcomplaints', null, 'drag_indicator', null, false, 18) ,

  // Payments
  new Menu (22, 'Payments', null, null, 'payment', null, true, 0),  // Parent 
  new Menu (23, 'Make Payments', '/pay/pay', null, 'drag_indicator', null, false, 22) ,
  new Menu (24, 'All Payments', '/pay/allPayment', null, 'drag_indicator', null, false, 22) ,
  new Menu (25, 'My Payment History', '/pay/paymenthis', null, 'drag_indicator', null, false, 22) ,
  new Menu (2588, 'My Token', '/pay/my-tok', null, 'drag_indicator', null, false, 22) ,
  // Manage Polls
  new Menu (26, 'Polls', null, null, 'line_style', null, true, 0),  // Parent 
  new Menu (27, 'Create Poll', '/pol/pol', null, 'drag_indicator', null, false, 26) ,
  new Menu (28, 'Cast Vote', '/pol/viewVotePoll', null, 'drag_indicator', null, false, 26) ,
  new Menu (29, 'Polls Hsitory', '/pol/AllPoll', null, 'drag_indicator', null, false, 26) ,
  new Menu (30, 'My Poll', '/pol/myPoll', null, 'drag_indicator', null, false, 26) ,

  //Announcement
  new Menu (31, 'Announcements', null, null, 'notification_important', null, true, 0),  // Parent 
  new Menu (32, 'Create Announcement', '/ano/ano', null, 'drag_indicator', null, false, 31) ,
  new Menu (33, 'All Announcements', '/ano/all', null, 'drag_indicator', null, false, 31),
  new Menu (34, 'Inbox Announcements', '/ano/inboxann', null, 'drag_indicator', null, false, 31),
  new Menu (35, 'Published Announcements', '/ano/allPubAnn', null, 'drag_indicator', null, false, 31),
  new Menu (36, 'Pending Announcements', '/ano/pendingAnn', null, 'drag_indicator', null, false, 31),
 
   */
];

export const horizontalMenuItems = [ 
    new Menu (1, 'Dashboard', '/', null, 'dashboard', null, false, 0),
    new Menu (2, 'Users', '/users', null, 'supervisor_account', null, false, 0), 
    new Menu (3, 'UI Features', null, null, 'computer', null, true, 0),   
    new Menu (4, 'Buttons', '/ui/buttons', null, 'keyboard', null, false, 3),  
    new Menu (5, 'Cards', '/ui/cards', null, 'card_membership', null, false, 3), 
    new Menu (6, 'Lists', '/ui/lists', null, 'list', null, false, 3), 
    new Menu (7, 'Grids', '/ui/grids', null, 'grid_on', null, false, 3), 
    new Menu (8, 'Tabs', '/ui/tabs', null, 'tab', null, false, 3), 
    new Menu (9, 'Expansion Panel', '/ui/expansion-panel', null, 'dns', null, false, 3), 
    new Menu (10, 'Chips', '/ui/chips', null, 'label', null, false, 3),
    new Menu (11, 'Progress', '/ui/progress', null, 'data_usage', null, false, 3), 
    new Menu (12, 'Dialog', '/ui/dialog', null, 'open_in_new', null, false, 3), 
    new Menu (13, 'Tooltip', '/ui/tooltip', null, 'chat_bubble', null, false, 3), 
    new Menu (14, 'Snackbar', '/ui/snack-bar', null, 'sms', null, false, 3),
    new Menu (16, 'Mailbox', '/mailbox', null, 'email', null, false, 40), 
    new Menu (17, 'Chat', '/chat', null, 'chat', null, false, 40), 
    new Menu (20, 'Form Controls', null, null, 'dvr', null, true, 0), 
    new Menu (21, 'Autocomplete', '/form-controls/autocomplete', null, 'short_text', null, false, 20), 
    new Menu (22, 'Checkbox', '/form-controls/checkbox', null, 'check_box', null, false, 20), 
    new Menu (23, 'Datepicker', '/form-controls/datepicker', null, 'today', null, false, 20), 
    new Menu (24, 'Form field', '/form-controls/form-field', null, 'view_stream', null, false, 20), 
    new Menu (25, 'Input', '/form-controls/input', null, 'input', null, false, 20), 
    new Menu (26, 'Radio button', '/form-controls/radio-button', null, 'radio_button_checked', null, false, 20), 
    new Menu (27, 'Select', '/form-controls/select', null, 'playlist_add_check', null, false, 20), 
    new Menu (28, 'Slider', '/form-controls/slider', null, 'tune', null, false, 20), 
    new Menu (29, 'Slide toggle', '/form-controls/slide-toggle', null, 'star_half', null, false, 20),    
    new Menu (30, 'Tables', null, null, 'view_module', null, true, 0),
    new Menu (31, 'Basic', '/tables/basic', null, 'view_column', null, false, 30), 
    new Menu (32, 'Paging', '/tables/paging', null, 'last_page', null, false, 30), 
    new Menu (33, 'Sorting', '/tables/sorting', null, 'sort', null, false, 30),
    new Menu (34, 'Filtering', '/tables/filtering', null, 'format_line_spacing', null, false, 30),
    new Menu (35, 'NGX DataTable', '/tables/ngx-table', null, 'view_array', null, false, 30),  
    new Menu (70, 'Charts', null, null, 'multiline_chart', null, true, 0),
    new Menu (71, 'Bar Charts', '/charts/bar', null, 'insert_chart', null, false, 70),
    new Menu (72, 'Pie Charts', '/charts/pie', null, 'pie_chart', null, false, 70),
    new Menu (73, 'Line Charts', '/charts/line', null, 'show_chart', null, false, 70),
    new Menu (74, 'Bubble Charts', '/charts/bubble', null, 'bubble_chart', null, false, 70), 
    new Menu (66, 'Maps', null, null, 'map', null, true, 70),
    new Menu (67, 'Google Maps', '/maps/googlemaps', null, 'location_on', null, false, 66),
    new Menu (68, 'Leaflet Maps', '/maps/leafletmaps', null, 'my_location', null, false, 66),
    new Menu (81, 'Drag & Drop', '/drag-drop', null, 'mouse', null, false, 3), 
    new Menu (85, 'Material Icons', '/icons', null, 'insert_emoticon', null, false, 3),
    new Menu (40, 'Pages', null, null, 'library_books', null, true, 0),
    new Menu (43, 'Login', '/login', null, 'exit_to_app', null, false, 40),    
    new Menu (44, 'Register', '/register', null, 'person_add', null, false, 40),
    new Menu (45, 'Blank', '/blank', null, 'check_box_outline_blank', null, false, 40),
    new Menu (46, 'Page Not Found', '/pagenotfound', null, 'error_outline', null, false, 40),
    new Menu (47, 'Error', '/error', null, 'warning', null, false, 40),
    new Menu (48, 'Landing', '/landing', null, 'filter', null, false, 40),
    new Menu (50, 'Schedule', '/schedule', null, 'event', null, false, 40),
    new Menu (200, 'External Link', null, 'http://themeseason.com', 'open_in_new', '_blank', false, 40)
]