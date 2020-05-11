import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { TestConfigService } from './testconfig.service';
import { WizardComponent } from 'angular-archwizard';
import { SelectDropDownModule } from 'ngx-select-dropdown';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatRadioModule } from '@angular/material/radio';
import { MatRadioChange } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import * as moment from 'moment';
import { StringLiteral } from 'babel-types';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
// import { connect } from 'net';

// import * as data from 'D:/TCAT/frontend/src/all_teststore.json';

declare var $: any;

export interface Storevalues {
  store_name: any;
  store_sk: any;
  state_long: any;
  store_type: any;
}

export interface Confirmvalues {
  store_name: any;
  store_sk: any;
  state_long: any;
  store_type: any;
}
export interface UploadStorevalues {
  store_name: any;
  store_sk: any;
  state_long: any;
  store_type: any;
}
export interface Testeditvalues {
  stage_id: string;
  test_name: string;
}
export interface Testmeasurevalues {
  TestStore: string;
  Controlstore: string;
}

export interface TestConfig {
  test_name: string;
  status: string;
  details: string;
  test_window: string;
  Created: string;
  Modified: string;
  Actions: string;
}

export interface TestStore {
  store_no: string;
  store_name: string;
  banner: string;
  segment: string;
  store_segment: string;
  avg_duration: string;
  act_perform: string;
  others: string;
}

const ELEMENT_DATA2: TestConfig[] = [
  {
    test_name: 'Test 1',
    status: 'On - Going',
    details: 'Analyse how new user interface has affected the sales',
    test_window: 'Test Configuration to Test Measurement',
    Created: '29/3/2020',
    Modified: '30/3/2020',
    Actions: ''
  },
  {
    test_name: 'Test 2',
    status: 'Completed',
    details: 'Analyse how new user interface has affected the sales',
    test_window: 'Test Configuration to Test Measurement',
    Created: '29/3/2020',
    Modified: '30/3/2020',
    Actions: ''
  }
];

const ELEMENT_DATA3: TestStore[] = [
  {
    store_no: 'Store No 1',
    store_name: 'Name 1',
    banner: 'Banner 1',
    segment: 'Segemnt 1',
    store_segment: 'Store Segment 1',
    avg_duration: ' Avg Duration 1',
    act_perform: 'Activity 1',
    others: 'Detail 1'
  },
  {
    store_no: 'Store No 2',
    store_name: 'Name 2',
    banner: 'Banner 2',
    segment: 'Segemnt 2',
    store_segment: 'Store Segment 2',
    avg_duration: ' Avg Duration 2',
    act_perform: 'Activity 2',
    others: 'Detail 2'
  },
  {
    store_no: 'Store No 3',
    store_name: 'Name 3',
    banner: 'Banner 3',
    segment: 'Segemnt 3',
    store_segment: 'Store Segment 3',
    avg_duration: ' Avg Duration 3',
    act_perform: 'Activity 3',
    others: 'Detail 3'
  },
  {
    store_no: 'Store No 4',
    store_name: 'Name 4',
    banner: 'Banner 4',
    segment: 'Segemnt 4',
    store_segment: 'Store Segment 4',
    avg_duration: ' Avg Duration 4',
    act_perform: 'Activity 4',
    others: 'Detail 4'
  },
  {
    store_no: 'Store No 5',
    store_name: 'Name 5',
    banner: 'Banner 5',
    segment: 'Segemnt 5',
    store_segment: 'Store Segment 2',
    avg_duration: ' Avg Duration 2',
    act_perform: 'Activity 5',
    others: 'Detail 5'
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './testconfig.component.html',
  styleUrls: ['./testconfig.component.scss']
})
export class TestConfigComponent implements OnInit {
  testvalue: any = '';
  test_mea_name_val: any = '';
  quote: string;
  isLoading: boolean;
  isShow: boolean = false;
  market_id: any;
  get_current_index: any;
  showcnt1: boolean;
  showcnt2: boolean;
  show_testplan_store: boolean = false;
  show_Testmeasurement: boolean = false;
  show_load_store: boolean = false;
  show_teststores: boolean = false;
  show_upld_file_store: boolean = false;
  plantestdrpdown: boolean = false;
  p: any = 1;
  up: any = 1;
  lp: any = 1;
  curp: any = 1;
  show_testplan: boolean = true;
  show_uploadstore: boolean = false;
  show_uploadstoretable: boolean = false;
  show_fileextnerror_testplan: boolean = false;
  show_fileextnerror_testmeasure: boolean = false;
  size: number = 10;
  upsize = 10;
  cnfrmsize = 10;
  loadsize = 10;
  testmeasuresize = 10;
  myFiles1: any = [];
  frmData1: FormData;
  pageIndex = 0;
  page: any = 1;
  Selectedstoredata: any;
  Uploadstoredata: any;
  LoadSavedTestdata: any;
  Confirmstoredata: any;
  TestMeasuredata: any;
  submit_visible: boolean = true;
  submit_visible_test_cntrl = true;
  filenameval_test_cntrl: any = '';
  show_testmeasure_table: boolean = false;
  hide_back: boolean = true;
  stepindex: any;
  CompletedStep: any = false;
  testplan_name_req: any = false;
  testplan_name_unique: any = false;
  testmeaure_name_req: any = false;
  dt: any;
  value: any;
  index: any;
  self: any;
  selectedstate: any = '';
  selectedstoretype: any = '';
  STORE_DATA: Storevalues[] = [];
  uploadForm: FormGroup;
  type_store: any = '1';
  plan_type: any;
  upload_store_checked: any[] = [];
  selectstorechecked: any[] = [];
  UnMatchTeststore: any = [];
  closeResult: string;

  hideselect_store: boolean = true;
  show_confirm_store: boolean = false;
  save_stage: boolean = false;
  upld_stage: boolean;
  confirm_selection: boolean = true;
  itemId: any = [];
  loadperpage: any = '10';
  filenameval1: any;
  filenameval_temp: any;
  myFiles2: any = [];
  measure_excel: any = [];
  loaddatas: boolean = false;
  ConfLevel: any;
  ConfLev: any = 1;
  uncheck: boolean;
  Margin: any = 1;
  TestStore: any = 0;
  // alltestore: any = (data as any).data;//json
  UPLOAD_STORE_DATA: UploadStorevalues[] = [];
  Load_saved_DATA: Testeditvalues[] = [];
  CONFIRM_STORE_DATA: Confirmvalues[] = [];
  Test_measure_DATA: Testmeasurevalues[] = [];
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('identifytestcntrl') identifytestcntrl: ElementRef;
  @ViewChild('content') private content: any;
  TestStoreSelectTable: MatTableDataSource<any>;
  public market: any = [];
  public plantest: any[] = ['Create New Test', 'Create New Test Measurement', 'Load From Saved Test'];
  public typetest: any[] = ['Frequency Test', 'Duration Test', 'Activity Test'];
  public banner: any[] = ['Albert Heijn', 'Jumbo'];
  public segment: any[] = ['Supermarket Large', 'Supermarket Medium', 'Supermarket Small'];
  public territory: any[] = ['01', '03', '06'];
  public storegrid: any[] = [
    'High CSV High Influence',
    'High CSV Medium Influence',
    'High CSV Low Influence',
    'Medium CSV High Influence',
    'Medium CSV Medium Influence',
    'Medium CSV Low Influence',
    'Low CSV High Influence',
    'Low CSV Medium Influence',
    'Low CSV Low Influence'
  ];
  public category: any[] = ['chocolate', 'petcare'];
  public error: any[] = ['Error 1', 'Error 2'];
  tempFilter: any = [];
  filenameval: any = '';
  temp_teststores: any = [];
  Stateval: any = [];
  Storeval: any = [];
  StateSet: any = {};
  StoreSet: any = {};
  pageSize: any;
  MarketId: any = [];
  storeselection = new SelectionModel<TestStore>(true, []);
  displayedColumns: string[] = ['select', 'StoreId', 'StoreName', 'StoreType', 'State'];
  uplddisplayedcolumns: string[] = ['select', 'StoreId', 'StoreName', 'StoreType', 'State'];

  confirmstorecolumns: string[] = ['StoreId', 'StoreName', 'StoreType', 'State'];

  displayedColumnsLoadSaved: string[] = [
    'test_name',
    'status',
    'details',
    'test_window',
    'Created',
    'Modified',
    'Actions'
  ];
  displayedColumnsTestStore: string[] = [
    'select',
    'store_no',
    'store_name',
    'banner',
    'segment',
    'store_segment',
    'avg_duration',
    'act_perform',
    'others'
  ];
  displayedColumnsTestMeasure: string[] = ['select', 'TestStore', 'Controlstore', 'Rank'];
  SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
  UploadDatasrc = new MatTableDataSource<any>(this.UPLOAD_STORE_DATA);
  LoadSavedTestDatasrc = new MatTableDataSource<any>(this.Load_saved_DATA);
  TestmeasureDatasrc = new MatTableDataSource<any>(this.Test_measure_DATA);
  ConfirmStrDatasrc = new MatTableDataSource<any>(this.CONFIRM_STORE_DATA);

  /*------------------SELECT STORE------SELECT ALL---------*/
  selection = new SelectionModel<Storevalues>(true, []);

  createtestshow: boolean;
  nextstepshow: boolean;
  savenextshow: boolean;
  logged_in: string;
  savecontshow: boolean;
  saveandnextshow: boolean;
  step1show: boolean;
  NoofError: any;
  NoofTestStore: any;
  TestStart: any;
  TestEnd: any;
  PreTestStart: any;
  PreTestEnd: any;
  bradhide: boolean;
  nameshow: boolean;
  typeshow: boolean;
  targetshow: boolean;
  bannershow: boolean;
  segmentshow: boolean;
  territoryshow: boolean;
  storegridshow: boolean;
  categoryshow: boolean;
  saveshow: boolean;
  confshow: boolean;
  errorshow: boolean;
  teststoreshow: boolean;
  testperashow: boolean;
  nextshow: boolean;
  model1: any;
  predays: number;
  date_valid: boolean;
  startdt_req: boolean;
  model2: any;
  model3: any;
  postdays1: number;
  date_valid0: boolean;
  enddt_req: boolean;
  postdays: number;
  model4: any;
  date_valid1: boolean;
  startdt1_req: boolean;
  enddt1_req: boolean;
  predateshow: boolean;
  postdateshow: boolean;
  testparashow: boolean;
  testfeatshow: boolean;
  uncheck1: boolean;
  uncheck2: boolean;
  metricshow: boolean;
  convalshow: boolean;
  /*SELECT STORE*/
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.SelectedDatasrc.data.length;
    return numSelected === numRows;
  }
  /*SELECT STORE */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.SelectedDatasrc.data.forEach(row => this.selection.select(row));
  }

  selectedall($event: any, Selectedstoredata: any) {
    if ($event.checked) {
      for (var i = 0; i < this.SelectedDatasrc.data.length; i++) {
        if (this.selectstorechecked.indexOf(this.selectstorechecked[i]) === -1) {
          this.selectstorechecked.push(this.SelectedDatasrc.data[i]);
          //this.Confirmstoredata.push(this.SelectedDatasrc.data[i]);
        }
      }
    } else {
      this.selectstorechecked = [];
    }
  }

  /*SELECT STORE */
  checkboxLabel(row?: Storevalues): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.store_sk + 1}`;
  }

  private selected_Row($event: any, Selectedstoredata: any) {
    if ($event.checked) {
      this.selectstorechecked.push(Selectedstoredata);

      // this.Confirmstoredata.push(Selectedstoredata);
    } else {
      let el = this.selectstorechecked.find(itm => itm.store_id === Selectedstoredata.store_id);
      if (el) {
        this.selectstorechecked.splice(this.selectstorechecked.indexOf(el), 1);
        // this.Confirmstoredata=this.selectstorechecked;
      }
    }
  }
  /*------------------SELECT STORE------SELECT ALL---------*/
  /*------------------UPLOAD STORE------SELECT ALL---------*/
  uploadselection = new SelectionModel<UploadStorevalues>(true, [this.Uploadstoredata]); //to select all
  /*UPLOAD STORE*/
  isAllSelectedUpload() {
    const numSelected = this.uploadselection.selected.length;
    const numRows = this.UploadDatasrc.data.length;
    return numSelected === numRows;
  }

  /*UPLOAD STORE */
  masterToggleUpload() {
    this.isAllSelectedUpload()
      ? this.uploadselection.clear()
      : this.UploadDatasrc.data.forEach(row => this.uploadselection.select(row));
  }

  /*UPLOAD STORE */
  checkboxLabelUpload(row?: UploadStorevalues): string {
    if (!row) {
      return `${this.isAllSelectedUpload() ? 'select' : 'deselect'} all`;
    }
    return `${this.uploadselection.isSelected(row) ? 'deselect' : 'select'} row ${row.store_sk + 1}`;
  }

  selected_upld_all($event: any, Uploadstoredata: any) {
    if ($event.checked) {
      for (var i = 0; i < this.UploadDatasrc.data.length; i++) {
        if (this.upload_store_checked.indexOf(this.upload_store_checked[i]) === -1) {
          this.upload_store_checked.push(this.UploadDatasrc.data[i]);
        }
      }
    } else {
      this.upload_store_checked = [];
    }
    //console.log(this.upload_store_checked);
  }

  private selected_upld_Row($event: any, Uploadstoredata: any) {
    if ($event.checked) {
      this.upload_store_checked.push(Uploadstoredata);
      // console.log(this.upload_store_checked);
    } else {
      let el = this.upload_store_checked.find(itm => itm.store_id === Uploadstoredata.store_id);
      if (el) {
        this.upload_store_checked.splice(this.upload_store_checked.indexOf(el), 1);
        // console.log(this.upload_store_checked);
      }
    }
  }
  /*------------------CONFIRM STORE------SELECT ALL---------*/

  /*------------------CONFIRM STORE------SELECT ALL---------*/
  confirmselection = new SelectionModel<Confirmvalues>(true, []); //to select all
  /*UPLOAD STORE*/
  isAllSelectedConfirm() {
    const numSelected = this.confirmselection.selected.length;
    const numRows = this.ConfirmStrDatasrc.data.length;
    return numSelected === numRows;
  }

  /*UPLOAD STORE */
  masterToggleConfirm() {
    this.isAllSelectedConfirm()
      ? this.confirmselection.clear()
      : this.ConfirmStrDatasrc.data.forEach(row => this.confirmselection.select(row));
  }

  /*UPLOAD STORE */
  checkboxLabelConfirm(row?: Confirmvalues): string {
    if (!row) {
      return `${this.isAllSelectedConfirm() ? 'select' : 'deselect'} all`;
    }
    return `${this.confirmselection.isSelected(row) ? 'deselect' : 'select'} row ${row.store_sk + 1}`;
  }

  /*------------------CONFIRM STORE------SELECT ALL---------*/
  /*------------------TESTMEASURE-------SELECT ALL--------*/
  testmeasureselection = new SelectionModel<Testmeasurevalues>(true, []);
  /*TESTMEASURE*/
  isAllSelectedTestMeasure(row?: Testmeasurevalues) {
    const numSelected = this.testmeasureselection.selected.length;
    const numRows = this.TestmeasureDatasrc.data.length;
    return numSelected === numRows;
  }

  /*TESTMEASURE */
  masterToggleTestMeasure(row?: Testmeasurevalues) {
    this.isAllSelectedTestMeasure()
      ? this.testmeasureselection.clear()
      : this.TestmeasureDatasrc.data.forEach(row => this.testmeasureselection.select(row));
  }
  /*TESTMEASURE */

  checkboxLabelTestMeasure(row?: Testmeasurevalues): string {
    if (!row) {
      return `${this.isAllSelectedTestMeasure() ? 'select' : 'deselect'} all`;
    }
    return `${this.testmeasureselection.isSelected(row) ? 'deselect' : 'select'} row ${row.TestStore + 1}`;
  }

  /*------------------TESTMEASURE-------SELECT ALL--------*/
  /*------------Filter Tables---------------*/
  FilterSelectstores(event: string) {
    const val = event.toLowerCase();
    this.tempFilter = this.STORE_DATA;
    this.Selectedstoredata = [];
    const temp = this.tempFilter.filter(function(d: any) {
      return (
        d.store_sk.toString().indexOf(val) !== -1 ||
        d.store_name.toLowerCase().indexOf(val) !== -1 ||
        d.store_type.toLowerCase().indexOf(val) !== -1 ||
        d.state_long.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.Selectedstoredata = temp;
  }

  FilterUploadstores(event: string) {
    const val = event.toLowerCase();
    this.tempFilter = this.UPLOAD_STORE_DATA;
    const temp = this.tempFilter.filter(function(d: any) {
      return d.store_sk.toString().indexOf(val) !== -1 || d.store_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.Uploadstoredata = temp;
  }

  FilterConfirmstores(event: string) {
    const val = event.toLowerCase();
    this.tempFilter = this.selectstorechecked;
    const temp = this.tempFilter.filter(function(d: any) {
      return d.store_sk.toString().indexOf(val) !== -1 || d.store_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.Confirmstoredata = temp;
  }

  Filtertestmeasure(event: string) {
    const val = event.toLowerCase();
    this.tempFilter = this.Test_measure_DATA;
    const temp = this.tempFilter.filter(function(d: any) {
      return d.TestStore.toLowerCase().indexOf(val) !== -1 || d.Controlstore.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.TestMeasuredata = temp;
  }

  FilterLoadSavedTest(event: string) {
    const val = event.toLowerCase();
    this.tempFilter = this.Load_saved_DATA;
    const temp = this.tempFilter.filter(function(d: any) {
      return d.test_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.LoadSavedTestdata = temp;
  }

  /*------------Filter Tables---------------*/
  /*-------------------------FILE UPLOAD-------------------*/
  // getFileData_testcntrl(file: HTMLInputElement) {
  //     var extension = file.value.split('.').pop();
  //     if (extension == 'csv' || extension == 'xls' || extension == 'xlsx') {
  //         this.filenameval_test_cntrl = file.value;
  //         this.filenameval_test_cntrl = this.filenameval_test_cntrl.replace(/^.*[\\\/]/, '');
  //         this.submit_visible_test_cntrl = false;
  //         this.show_fileextnerror_testmeasure = false;
  //     } else {
  //         //alert("not valid");
  //         this.show_fileextnerror_testmeasure = true;
  //     }
  // }

  getFileData_testcntrl(event: any) {
    this.filenameval1 = event.target.files[0].name;
    this.myFiles2 = [];
    if (this.filenameval1 != '') {
      var excel = event.target.files.length;
      for (let i = 0; i < excel; i++) {
        var reader = new FileReader();
        this.myFiles2.push(event.target.files[i]);
      }
      this.filenameval_test_cntrl = this.filenameval1;
      this.submit_visible_test_cntrl = false;
      this.show_fileextnerror_testmeasure = false;
    }
  }
  TestPlanningForm: FormGroup;
  TestName: any;
  TypeTest: any;
  TargetVariable: any;
  Description: any;
  AddDetails: any;
  Banner: any;
  Segment: any;
  Territory: any;
  StoreGrid: any;
  Category: any;
  /*-------------------------FILE UPLOAD-------------------*/
  constructor(
    private homeservice: TestConfigService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.createForm();
    this.TestPlanningForm = this.formBuilder.group({
      testname: ['', Validators.required],
      typeoftest: ['', Validators.required],
      targetvariable: ['', Validators.required]
    });
  }

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  private createForm() {
    this.TestPlanningForm = this.formBuilder.group({
      testname: ['', Validators.required],
      typeoftest: ['', Validators.required],
      targetvariable: ['', Validators.required],
      remember: true
    });
  }

  ngOnInit() {
    this.uncheck = true;
    this.uncheck1 = true;
    this.uncheck2 = false;
    this.savenextshow = true;
    this.LoadSavedTestdata = new MatTableDataSource(ELEMENT_DATA2);
    this.TestStoreSelectTable = new MatTableDataSource(ELEMENT_DATA3);
    var next1 = localStorage.getItem('savenextshow');
    if (next1 == 'false') {
      setTimeout(() => (this.savecontshow = false));
    }
    var next2 = localStorage.getItem('savecontshow');
    if (next2 == 'true') {
      setTimeout(() => (this.savecontshow = true));
    }
    var next3 = localStorage.getItem('saveandnextshow');
    if (next3 == 'true') {
      this.saveandnextshow = true;
    }
    var next4 = localStorage.getItem('nextstepshow');
    if (next4 == 'false') {
      this.nextstepshow = false;
    }
    var next5 = localStorage.getItem('step1show');
    if (next5 == 'false') {
      this.step1show = false;
    }
    var next6 = localStorage.getItem('createtestshow');
    if (next6 == 'true') {
      this.createtestshow = true;
    }
    var next6 = localStorage.getItem('savenextshow');
    if (next6 == 'false') {
      this.savenextshow = false;
    }
    setTimeout(() => {
      this.SelectedDatasrc.sort = this.sort;
      this.Selectedstoredata = this.STORE_DATA;
      this.UploadDatasrc.sort = this.sort;
      this.Uploadstoredata = this.UPLOAD_STORE_DATA;
      this.ConfirmStrDatasrc.sort = this.sort;
      this.Confirmstoredata = this.CONFIRM_STORE_DATA;
      this.LoadSavedTestDatasrc.sort = this.sort;
      // this.LoadSavedTestdata = this.Load_saved_DATA;
      this.TestmeasureDatasrc.sort = this.sort;
      this.TestMeasuredata = this.Test_measure_DATA;
    });

    localStorage.clear();
    this.market = [];
    //this.itemId=['---Select A Plan---'];
    this.homeservice.GetAllMarkets().subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        for (var i = apiresponse.data.length - 1; i >= 0; i--) {
          this.market.push(apiresponse.data[i]);
        }
      } else {
        //console.log(apiresponse.data)
      }
    });
    if (sessionStorage.getItem('index') == null) {
      //console.log(sessionStorage.getItem('index'));
      this.stepindex = 0;
      // $(document).ready(function() {
      //   $('li#1').removeClass('done');
      // });
    } else {
      var newMyObjectJSON = sessionStorage.getItem('index');
      var newMyObject = JSON.parse(newMyObjectJSON);
      this.stepindex = newMyObject.stepval;
      this.isShow = true;
      this.CompletedStep = true;
      // $(document).ready(function() {
      //   $('li#1').addClass('done');
      // });
    }
    this.StateSet = {
      singleSelection: false,
      idField: 'stid',
      textField: 'sttext',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };
    this.StoreSet = {
      singleSelection: false,
      idField: 'strid',
      textField: 'strtext',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: false,
      allowSearchFilter: false
    };
    this.uploadForm = this.formBuilder.group({
      upldstre: ['']
    });

    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map(results => ({
          params: results[0],
          query: results[1]
        }))
      )
      .subscribe(results => {
        if (results) {
          if (results.query) {
            if (results.query.trial) {
              this.homeservice.LoadSavedTest(results.query.trial).subscribe((apiresponse: any) => {
                if (apiresponse.status == 'ok') {
                  let parseData = JSON.parse(apiresponse.data.records[0].record_value);
                  this.plantestdrpdown = true;
                  this.hide_back = false;
                  this.show_testplan_store = true;
                  this.testvalue = parseData.test_name;
                  this.loaddatas = true;

                  this.homeservice.GetStoresDetails(parseData.select_store).subscribe((apiresponse: any) => {
                    if (apiresponse.status == 'ok') {
                      this.Confirmstoredata = apiresponse.data;
                      this.CONFIRM_STORE_DATA = apiresponse.data;
                      this.selectstorechecked = apiresponse.data;
                    }
                  });
                }
              });
            }
          }
        }
      });
  }

  CreateTest() {
    this.TargetVariable = [];
    this.TypeTest = [];
    this.TestName = [];
    this.createtestshow = true;
    this.savenextshow = false;
    this.step1show = true;
    this.nextshow = false;
  }

  testname() {
    this.nameshow = false;
  }

  TypeShow(event: any) {
    this.typeshow = false;
  }

  Target(event: any) {
    this.targetshow = false;
  }

  BannerShow(event: any) {
    this.bannershow = false;
  }

  SegmentShow(event: any) {
    this.segmentshow = false;
  }

  TerritoryShow(event: any) {
    this.territoryshow = false;
  }

  StoreGridShow(event: any) {
    this.storegridshow = false;
  }

  CategoryShow(event: any) {
    this.categoryshow = false;
  }

  TestStores(event: any) {
    console.log(event);
    if (event == 'E') {
      // this.ConfLev = 0;
    } else if (event == 'F') {
      this.uncheck2 = false;
      this.uncheck1 = true;
      this.uncheck = true;
    }
  }

  ConfLevels(event: any) {
    console.log(event);
    if (event == 'A') {
      // this.Margin = 0;
    } else if (event == 'B') {
      this.uncheck2 = true;
      this.uncheck = false;
      this.uncheck1 = true;
    }
  }

  MarginError(event: any) {
    console.log(event);
    if (event == 'C') {
      // this.TestStore = 0;
    } else if (event == 'D') {
      this.uncheck = true;
      this.uncheck1 = false;
      this.uncheck2 = true;
    }
  }

  NextStep() {
    console.log(this.TestName);
    // if(this.TestName == undefined || this.TestName == ""){
    //   // this.openSnackBar("Please Enter Testname","Close")
    //   this.nameshow = true;
    //   return 0;
    // }
    // if(this.TypeTest == undefined){
    //   // this.openSnackBar("Please Select Type of Test","Close")
    //   this.typeshow = true;
    //   return 0;
    // }
    // if(this.TargetVariable == undefined){
    //   // this.openSnackBar("Please Select Target Variable","Close")
    //   this.targetshow = true;
    //   return 0;
    // }
    // if(this.Banner == undefined){
    //   // this.openSnackBar("Please Select Banner","Close")
    //   this.bannershow = true;
    //   return 0;
    // }
    // if(this.Segment == undefined){
    //   // this.openSnackBar("Please Select Segment","Close")
    //   this.segmentshow = true;
    //   return 0;
    // }
    // if(this.Territory == undefined){
    //   // this.openSnackBar("Please Select Territory","Close")
    //   this.territoryshow = true;
    //   return 0;
    // }
    // if(this.StoreGrid == undefined){
    //   // this.openSnackBar("Please Select Store Grid","Close")
    //   this.storegridshow = true;
    //   return 0;
    // }
    // if(this.Category == undefined){
    //   // this.openSnackBar("Please Select Category","Close")
    //   this.categoryshow = true;
    //   return 0;
    // }
    this.wizard.goToNextStep();
    this.nextstepshow = true;
    this.savenextshow = false;
    this.saveandnextshow = false;
  }

  PreStartDate(date: NgbDate) {
    if (this.model1 && this.model2) {
      this.predays =
        (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
          new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.predays = Math.round(this.predays / 7);

      if (this.predays > 0) {
        this.date_valid = true;
      } else {
        this.date_valid = false;
        this.predays = 0;
      }
    }

    if (this.model1) {
      this.startdt_req = true;
    } else {
      this.startdt_req = false;
    }
  }

  PreEndDate(date: NgbDate) {
    this.predateshow = true;
    if (this.model1 && this.model2) {
      this.predays =
        (new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime() -
          new Date(this.model1.year + '-' + this.model1.month + '-' + this.model1.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.predays = Math.round(this.predays / 7);

      if (this.predays > 0) {
        this.date_valid = true;
      } else {
        this.date_valid = false;
        this.predays = 0;
      }
    }

    if (this.model3 && this.model2) {
      this.postdays1 =
        (new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime() -
          new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.postdays1 = Math.round(this.postdays1 / 7);

      if (this.postdays1 > 0) {
        this.date_valid0 = true;
      } else {
        this.date_valid0 = false;
        this.postdays1 = 0;
      }
    }

    if (this.model2) {
      this.enddt_req = true;
    } else {
      this.enddt_req = false;
    }
  }

  PostStartDate(date: NgbDate) {
    if (this.model3 && this.model4) {
      this.postdays =
        (new Date(this.model4.year + '-' + this.model4.month + '-' + this.model4.day).getTime() -
          new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.postdays = Math.round(this.postdays / 7);

      if (this.postdays > 0) {
        this.date_valid1 = true;
      } else {
        this.date_valid1 = false;
        this.postdays = 0;
      }
    }

    if (this.model3 && this.model2) {
      this.postdays1 =
        (new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime() -
          new Date(this.model2.year + '-' + this.model2.month + '-' + this.model2.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.postdays1 = Math.round(this.postdays1 / 7);

      if (this.postdays1 > 0) {
        this.date_valid0 = true;
      } else {
        this.date_valid0 = false;
        this.postdays1 = 0;
      }
    }

    if (this.model3) {
      this.startdt1_req = true;
    } else {
      this.startdt1_req = false;
    }
  }

  PostEndDate(date: NgbDate) {
    this.postdateshow = true;
    this.testparashow = true;
    this.uncheck2 = false;
    if (this.model3 && this.model4) {
      this.postdays =
        (new Date(this.model4.year + '-' + this.model4.month + '-' + this.model4.day).getTime() -
          new Date(this.model3.year + '-' + this.model3.month + '-' + this.model3.day).getTime()) /
        (24 * 60 * 60 * 1000);
      this.postdays = Math.round(this.postdays / 7);

      if (this.postdays > 0) {
        this.date_valid1 = true;
      } else {
        this.date_valid1 = false;
        this.postdays = 0;
      }
    }

    if (this.model4) {
      this.enddt1_req = true;
    } else {
      this.enddt1_req = false;
    }
  }

  Compute() {
    console.log(this.ConfLev);
    console.log(this.Margin);
    console.log(this.TestStore);
    if (this.ConfLev == 1 && this.Margin == 1 && this.TestStore == 0) {
      this.testfeatshow = true;
      this.metricshow = false;
    } else if (this.ConfLev == 0 && this.Margin == 1 && this.TestStore == true) {
      this.testfeatshow = true;
      this.metricshow = false;
    } else if (this.ConfLev == 0 && this.Margin == 1 && this.TestStore == false) {
      this.metricshow = true;
    } else if (this.ConfLev == true && this.Margin == 0 && this.TestStore == true) {
      this.testfeatshow = true;
      this.metricshow = false;
    } else if (this.ConfLev == true && this.Margin == 0 && this.TestStore == false) {
      this.metricshow = true;
    } else if (this.ConfLev == true && this.Margin == false && this.TestStore == 0) {
      this.metricshow = true;
    } else if (this.ConfLev == 0 && this.Margin == false && this.TestStore == true) {
      this.metricshow = true;
    }
  }

  TestParameter() {
    // this.openSnackBar("Test Parameter Stored Successfully","Close")
    this.testperashow = true;
  }

  ResetTestParameter() {
    this.ConfLevel = [];
    this.NoofError = [];
    this.NoofTestStore = [];
    this.model1 = [];
    this.model2 = [];
    this.model3 = [];
    this.model4 = [];
    this.predateshow = false;
    this.postdateshow = false;
  }

  SaveContinue() {
    // if(this.ConfLevel == undefined || this.ConfLevel == ""){
    //   // this.openSnackBar("Please Enter Confidence Level","Close")
    //   this.confshow = true;
    //   return 0;
    // }
    // if(this.NoofError == undefined || this.NoofError == ""){
    //   // this.openSnackBar("Please No of Error","Close")
    //   this.errorshow = true;
    //   return 0;
    // }
    // if(this.NoofTestStore == undefined || this.NoofTestStore == ""){
    //   // this.openSnackBar("Please No of Test Stores","Close")
    //   this.teststoreshow = true;
    //   return 0;
    // }
    // if(this.TestStart == undefined){
    //   this.openSnackBar("Please Select Start Date","Close")
    //   return 0;
    // }
    // if(this.TestEnd == undefined){
    //   this.openSnackBar("Please Select Start Date","Close")
    //   return 0;
    // }

    this.savecontshow = true;
    this.savenextshow = false;
    this.saveandnextshow = true;
    this.nextstepshow = false;
    this.step1show = false;
    this.wizard.goToNextStep();
  }

  Resetconf() {
    this.ConfLevel = [];
  }

  NestPage() {
    this.router.navigate(['/controlstore']);
  }

  isAllSelectedTestStore() {
    const numSelected = this.storeselection.selected.length;
    const numRows = this.TestStoreSelectTable.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleTestStore() {
    this.isAllSelectedTestStore()
      ? this.storeselection.clear()
      : this.TestStoreSelectTable.data.forEach(row => this.storeselection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelTeststore(row?: TestStore): string {
    if (!row) {
      return `${this.isAllSelectedTestStore() ? 'select' : 'deselect'} all`;
    }
    return `${this.storeselection.isSelected(row) ? 'deselect' : 'select'} row ${row.store_name + 1}`;
  }

  Back() {
    this.savecontshow = false;
    this.nextstepshow = true;
    this.savenextshow = false;
    this.step1show = true;
    this.saveandnextshow = false;
  }

  GoBack() {
    this.wizard.goToPreviousStep();
    this.createtestshow = false;
    this.step1show = false;
    this.savenextshow = true;
  }

  Previous() {
    this.wizard.goToPreviousStep();
    this.nextstepshow = false;
    this.createtestshow = true;
    this.step1show = true;
    this.savecontshow = false;
    this.bradhide = true;
    this.saveandnextshow = false;
  }

  ConfirmValidate() {
    this.convalshow = true;
    // this.openSnackBar("Test Store Selected Successfully","Close")
    //   return 0;
  }

  SavePlanning() {
    console.log(this.TestName);
    // this.openSnackBar("Test Planning Saved Successfully","Close")
    this.saveshow = true;
  }

  ConfShow() {
    this.confshow = false;
  }

  ErrorShow() {
    this.errorshow = false;
  }

  TestStoreShow() {
    this.teststoreshow = false;
  }

  omit_char(event: any) {
    const keyChar = event.key;
    // console.log(keyChar)
    let allowCharacter: boolean;
    if (keyChar === '-' && event.target.selectionStart !== 0) {
      allowCharacter = false;
    } else if (
      keyChar === 'Tab' ||
      keyChar === '+' ||
      keyChar === 'Enter' ||
      keyChar === 'Backspace' ||
      keyChar === 'ArrowLeft' ||
      keyChar === 'ArrowRight' ||
      keyChar === 'Delete'
    ) {
      allowCharacter = true;
    } else {
      allowCharacter = keyChar >= '0' && keyChar <= '9';
    }
    if (!allowCharacter) {
      event.preventDefault();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom'
    });
  }
  dismiss() {
    this._snackBar.dismiss();
  }

  reset() {
    this.router
      .navigateByUrl('/RefrshComponent', {
        skipLocationChange: true
      })
      .then(() => {
        this.router.navigate(['testconfig']);
      });
  }
  Movetowizard2_save() {
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(
        map(results => ({
          params: results[0],
          query: results[1]
        }))
      )
      .subscribe(results => {
        if (results) {
          if (results.query) {
            if (results.query.trial) {
              let navigationExtras = {
                queryParams: {
                  trial: results.query.trial
                }
              };
              this.router.navigate(['./controlstore'], navigationExtras);
            }
          }
        }
      });
  }

  showstoress() {
    this.show_upld_file_store = true;
    this.show_uploadstore = false;
    this.hideselect_store = false;
    this.show_testplan_store = false;
    this.show_teststores = true;
    this.show_confirm_store = true;
  }

  Perpagerefresh() {
    setTimeout(() => {
      this.SelectedDatasrc.sort = this.sort;
      this.Selectedstoredata = this.STORE_DATA;
      this.UploadDatasrc.sort = this.sort;
      this.Uploadstoredata = this.UPLOAD_STORE_DATA;
      this.ConfirmStrDatasrc.sort = this.sort;
      this.Confirmstoredata = this.CONFIRM_STORE_DATA;
      this.LoadSavedTestDatasrc.sort = this.sort;
      this.LoadSavedTestdata = this.Load_saved_DATA;
      this.TestmeasureDatasrc.sort = this.sort;
      this.TestMeasuredata = this.Test_measure_DATA;
    });
  }

  getStoreStateval() {
    let data: any = {
      state: this.selectedstate,
      storetype: this.selectedstoretype
    };

    this.Selectedstoredata = [];
    this.STORE_DATA = [];
    this.selectstorechecked = [];
    // this.selectstorechecked = [];
    this.homeservice.GetAllTestStore(data).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        for (var i = 0; i < apiresponse.data.length; i++) {
          this.STORE_DATA.push(apiresponse.data[i]);
          this.Selectedstoredata = this.STORE_DATA;
          this.SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
          this.selection = new SelectionModel<Storevalues>(true, []);
          //this.selectstorechecked=this.Selectedstoredata;
          this.p = 1;
        }
      } else {
      }
    });
  }

  Resetfilter() {
    this.selectedstate = '';
    this.selectedstoretype = '';
    let data: any = {
      state: this.selectedstate,
      storetype: this.selectedstoretype
    };
    this.Selectedstoredata = [];
    this.STORE_DATA = [];
    this.homeservice.GetAllTestStore(data).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        for (var i = 0; i < apiresponse.data.length; i++) {
          this.STORE_DATA.push(apiresponse.data[i]);
          this.Selectedstoredata = this.STORE_DATA;
          this.size = 10;
          this.SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
          this.selection = new SelectionModel<Storevalues>(true, []);
          this.selectstorechecked.length = 0;
        }
      }
    });
  }

  enterclick($event: any) {
    let inputElement: HTMLElement = this.identifytestcntrl.nativeElement as HTMLElement;
    inputElement.click();
  }
  /*doSelect($event)
      {
      console.log($event);
      }*/
  /*-------------------Pagination------------------------*/
  paginateselectstore(event: any) {
    this.pageIndex = event;
    this.Selectedstoredata = this.STORE_DATA.slice(event * this.size - this.size, event * this.size);
  }

  paginateuploadstore(event: any) {
    this.pageIndex = event;
    this.Uploadstoredata = this.UPLOAD_STORE_DATA.slice(event * this.upsize - this.upsize, event * this.upsize);
  }

  paginateconfirmstore(event: any) {
    this.pageIndex = event;
    this.Confirmstoredata = this.CONFIRM_STORE_DATA.slice(
      event * this.cnfrmsize - this.cnfrmsize,
      event * this.cnfrmsize
    );
  }

  paginateloadsaved(event: any) {
    this.pageIndex = event;
    this.LoadSavedTestdata = this.Load_saved_DATA.slice(event * this.loadsize - this.loadsize, event * this.loadsize);
  }

  paginatetestmeasure(event: any) {
    this.pageIndex = event;
    this.TestMeasuredata = this.Test_measure_DATA.slice(
      event * this.testmeasuresize - this.testmeasuresize,
      event * this.testmeasuresize
    );
  }

  perpageSelectStore(event: any) {
    this.size = event.target.value;
    this.p = 1;
    this.Perpagerefresh();
    //console.log(event.target.value);
  }

  perpageUploadStore(event: any) {
    this.upsize = event.target.value;
    this.up = 1;
    this.Perpagerefresh();
  }

  perpageLoadSaved(event: any) {
    this.loadsize = event.target.value;
    this.lp = 1;
    this.Perpagerefresh();
  }
  perpageConfirm(event: any) {
    this.cnfrmsize = event.target.value;
    this.Perpagerefresh();
    this.curp = 1;
  }

  perpageTestMeasure(event: any) {
    this.testmeasuresize = event.target.value;
  }

  /*-------------------Pagination------------------------*/
  movetostp2() {
    this.wizard.goToNextStep();
    this.isShow = !this.isShow;
    this.CompletedStep = true;
    localStorage.setItem('market_id', this.market[0].market_id); // Set market id in localstorage
    this.show_teststores = false;
    this.show_upld_file_store = false;
    this.show_testplan = true;
    this.show_testmeasure_table = false;
    this.testvalue = '';
    this.show_testplan_store = false;
    this.show_Testmeasurement = false;
    this._snackBar.dismiss();

    //this.itemId=['---Select A Plan---'];
  }

  movetostp1() {
    this.wizard.goToPreviousStep();
    this.isShow = !this.isShow;
    this.CompletedStep = false;
    this.STORE_DATA = [];
    this.Storeval = [];
    this.Stateval = [];
    this.filenameval = '';
    this.submit_visible = true;
    this.show_uploadstoretable = false;
    this.itemId = '';
    this.show_testplan = true;
    this.show_testplan_store = false;
    this.show_teststores = false;
    this.hideselect_store = false;
    this.confirm_selection = false;
    this.show_Testmeasurement = false;
    this.show_testmeasure_table = false;
    this.show_load_store = false;
    this.testplan_name_req = false;
    //this.selectstorechecked=[];
    this._snackBar.dismiss();
  }

  enterStep($event: any) {
    // this.get_current_index = this.wizard.currentStepIndex;
    console.log(this.get_current_index);
    console.log(event);
    if (this.get_current_index == 0) {
      this.showcnt1 = false;
      this.showcnt2 = true;
    } else {
      this.showcnt1 = true;
      this.showcnt2 = false;
    }
  }

  showcontrolstore(value: any) {
    this.nextshow = true;
    if (value == 'Create New Test') {
      this.show_testplan_store = true;
      this.show_Testmeasurement = false;
      this.show_load_store = false;
      this.hide_back = false;
      this.Load_saved_DATA = [];
      this.LoadSavedTestdata = {};
      //this.selectstorechecked=[];
      this.testvalue = '';
      this.test_mea_name_val = '';
      this.filenameval_test_cntrl = '';
      this.filenameval = '';
      this.submit_visible = true;
      this.submit_visible_test_cntrl = true;
    } else if (value == 'Create New Test Measurement') {
      this.show_Testmeasurement = true;
      this.show_load_store = false;
      this.show_testplan_store = false;
      this.hide_back = false;
      this.Load_saved_DATA = [];
      this.LoadSavedTestdata = [];
      this.filenameval = '';
      this.submit_visible = true;
      //this.selectstorechecked=[];
      this.testvalue = '';
      this.test_mea_name_val = '';
      this.filenameval_test_cntrl = '';
      this.submit_visible_test_cntrl = true;
    } else if (value == 'Load From Saved Test') {
      this.show_testplan_store = false;
      this.show_Testmeasurement = false;
      this.show_load_store = true;
      this.hide_back = false;
      this.filenameval = '';
      this.submit_visible = true;
      this.LoadSavedata();
      //this.selectstorechecked=[];
      this.testvalue = '';
      this.test_mea_name_val = '';
      this.filenameval_test_cntrl = '';
      this.submit_visible_test_cntrl = true;
    }
  }

  LoadSavedata() {
    this.homeservice.Load_savedata().subscribe((apiresponse: any) => {
      setTimeout(() => {
        this.LoadSavedTestDatasrc = new MatTableDataSource<any>(this.Load_saved_DATA);
      });

      this.LoadSavedTestdata = [];
      this.Load_saved_DATA = [];
      if (apiresponse.status == 'ok') {
        for (var i = 0; i < apiresponse.data.length; i++) {
          this.Load_saved_DATA.push(apiresponse.data[i]);
          this.LoadSavedTestdata = this.Load_saved_DATA;
          this.loadsize = 10;
        }
      } else {
      }
    });
  }

  format(date: any) {
    if (date != 0 || date == null) {
      var dd = moment(date * 1000).format('DD MMM YYYY');
      var time = moment(date * 1000).format('hh:mm A');
      return dd + ' ' + time;
    } else return '-';
  }

  format1(date: any, date1: any) {
    if (date == null) {
      var dd = moment(date1 * 1000).format('DD MMM YYYY');
      var time = moment(date1 * 1000).format('hh:mm A');
      return dd + ' ' + time;
    } else {
      var dd = moment(date * 1000).format('DD MMM YYYY');
      var time = moment(date * 1000).format('hh:mm A');
      return dd + ' ' + time;
    }
  }

  show_teststr() {
    if (this.testvalue == '') {
      this.testplan_name_req = true;
      this.testplan_name_unique = false;
    } else if (this.testvalue != '') {
      let checks = this.testvalue.trim();

      if (checks.length == 0) {
        this.testplan_name_req = true;
        this.testplan_name_unique = false;
        return;
      }
      /*SELECTED STORE API*/
      let val = {
        state: this.selectedstate,
        storetype: this.selectedstoretype
      };
      //this.market[0].market_id
      let data: any = {
        test_name: this.testvalue.trim(),
        market_id: this.market[0].market_id
        //market_id: 1
      };
      setTimeout(() => {
        this.SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
        this.selection = new SelectionModel<Storevalues>(true, []);
      });

      this.confirm_selection = false;
      this.upld_stage = true;
      this.homeservice.Checktestname(data).subscribe((apiresponse: any) => {
        if (apiresponse.status == 'ok') {
          this.show_teststores = true;
          this.show_upld_file_store = true;
          this.show_testplan = false;
          this.show_uploadstore = true;
          this.testplan_name_req = false;
          this.testplan_name_unique = false;
          this.Getalltesttores();
        } else {
          this.testplan_name_req = false;
          this.testplan_name_unique = true;
          this.selectstorechecked = [];
        }
      });
    }
  }

  Getalltesttores() {
    let val = {
      state: this.selectedstate,
      storetype: this.selectedstoretype
    };
    this.STORE_DATA = [];
    this.Storeval = [];
    this.Stateval = [];
    setTimeout(() => {
      this.SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
      this.selection = new SelectionModel<Storevalues>(true, []);
    });
    this.homeservice.GetAllTestStore(val).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        for (var i = 0; i < apiresponse.data.length; i++) {
          this.STORE_DATA.push(apiresponse.data[i]);
        }
        var l = apiresponse.data.length;
        for (i = 0; i < l; i++) {
          if (apiresponse.data[apiresponse.data[i].store_type]) continue;
          apiresponse.data[apiresponse.data[i].store_type] = true;
          this.Storeval.push(apiresponse.data[i].store_type);
        }
        for (i = 0; i < l; i++) {
          if (apiresponse.data[apiresponse.data[i].state_long]) continue;
          apiresponse.data[apiresponse.data[i].state_long] = true;
          this.Stateval.push(apiresponse.data[i].state_long);
        }
      } else {
      }
    });
  }

  Hideuploadandselectstore() {
    this.show_testplan_store = true;
    this.show_upld_file_store = false;
    this.show_teststores = false;
    this.plantestdrpdown = false;
    this.show_testplan = true;
    this.STORE_DATA = [];
    this.Storeval = [];
    this.Stateval = [];
    this.selectstorechecked = [];
    this.Selectedstoredata = [];
    this.testvalue = '';
    this.filenameval = '';
    this.submit_visible = true;
    this.show_uploadstoretable = false;
    this._snackBar.dismiss();
  }

  HideTestMeasureTable() {
    this.show_testmeasure_table = false;
    this.show_testplan = true;
    this.show_testplan_store = false;
    this.show_Testmeasurement = true;
    this.STORE_DATA = [];
    this.filenameval_test_cntrl = '';
    this.test_mea_name_val = '';
    this.submit_visible_test_cntrl = true;
    this._snackBar.dismiss();
  }

  radioChange($event: MatRadioChange) {
    this._snackBar.dismiss();
    setTimeout(() => {
      this.SelectedDatasrc.sort = this.sort;
      this.Selectedstoredata = this.STORE_DATA;
      this.Uploadstoredata = this.UPLOAD_STORE_DATA;
      this.Confirmstoredata = this.CONFIRM_STORE_DATA;
    });
    if ($event.source.value === '1') {
      this.show_uploadstore = true;
      this.type_store = $event.source.value;
      this.show_confirm_store = false;
      this.confirm_selection = false;
      this.upld_stage = true;
    } else {
      this.show_uploadstore = false;
      this.type_store = $event.source.value;
      this.hideselect_store = true;
      this.confirm_selection = true;
      this.save_stage = false;
      this.upld_stage = false;
    }
  }

  getFileData(event: any) {
    this.filenameval = event.target.files[0].name;
    if (this.filenameval != '') {
      var excel = event.target.files.length;
      this.myFiles1 = [];
      for (let i = 0; i < excel; i++) {
        var reader = new FileReader();
        this.myFiles1.push(event.target.files[i]);
      }
      this.submit_visible = false;
    }
  }

  SubmitFile(event: any) {
    const frmData1 = new FormData();
    for (var i = 0; i < this.myFiles1.length; i++) {
      frmData1.append('match_store', this.myFiles1[i]);
    }
    this.upload_store_checked = [];
    this.UPLOAD_STORE_DATA = [];
    this.UploadDatasrc = new MatTableDataSource<any>(this.UPLOAD_STORE_DATA);
    this.SelectedDatasrc = new MatTableDataSource<any>(this.STORE_DATA);
    this.selection = new SelectionModel<Storevalues>(true, []);
    this.selectstorechecked.length = 0;

    this.homeservice.uploadfile(frmData1).subscribe(
      (temp_data: any) => {
        if (temp_data.status == 'ok') {
          this.UnMatchTeststore = [];
          if (temp_data.data.match_data.length == 0) {
            var action = 'close';
            this._snackBar.open('Invalid store ID uploaded for 0 store(s) - replace file ', action, {
              duration: 10000,
              verticalPosition: 'bottom'
            });
          }
          this.filenameval_temp = temp_data.data.temp_filename;
          for (var i = 0; i < temp_data.data.match_data.length; i++) {
            this.show_uploadstoretable = true;
            this.show_fileextnerror_testplan = false;
            this.UPLOAD_STORE_DATA.push(temp_data.data.match_data[i]);
            this.Uploadstoredata = this.UPLOAD_STORE_DATA;
            this.upsize = 10;
            this.upload_store_checked.push(temp_data.data.match_data[i]);
          }

          if (temp_data.data.unmatch_data != '[]') {
            let temp_val: any = temp_data.data.unmatch_data;
            temp_val = temp_val.replace(/^"(.*)"$/, '$1');
            temp_val = temp_val.slice(1, -1);
            var array = temp_val.split(', ');
            if (array.length > 0) {
              for (var i = array.length - 1; i >= 0; i--) {
                this.UnMatchTeststore.push(array[i]);
              }
              console.log(this.UnMatchTeststore.length);
              this.ValidateUploadstore(this.UnMatchTeststore.length);
              // --modaol call---
            }
          }

          this.uploadselection = new SelectionModel<UploadStorevalues>(true, [...this.UPLOAD_STORE_DATA]); //to select all
        } else {
          var action = 'close';
          this._snackBar.open(temp_data.data, action, {
            duration: 10000,
            verticalPosition: 'bottom'
          });
          this.show_uploadstoretable = false;
          this.show_fileextnerror_testplan = true;
        }
      },
      error => {}
    );
  }
  ValidateUploadstore(UnmatchedStoreid: any) {
    var message = 'Invalid store ID uploaded for ' + UnmatchedStoreid + ' store(s) - replace file or continue';
    var action = 'close';
    this._snackBar.open(message, action, {
      duration: 10000,
      verticalPosition: 'bottom'
    });
  }

  Modalcall(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'ViewconsiderFeat'
      })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  SubmitTestCntrlFile() {
    if (this.test_mea_name_val == '') {
      this.testmeaure_name_req = true;
    } else {
      const frmData1 = new FormData();
      this.market_id = localStorage.getItem('market_id');
      for (var i = 0; i < this.myFiles2.length; i++) {
        frmData1.append('testcontrol_store', this.myFiles2[i]);
        frmData1.append('testname', this.test_mea_name_val);
        frmData1.append('market_id', '1');
      }

      this.homeservice.UploadTestControlStores(frmData1).subscribe((apiresponse: any) => {
        if (apiresponse.status == 'ok') {
          this.testmeaure_name_req = false;
          this.show_testmeasure_table = true;
          this.show_testplan = false;

          const groupBy = (key: any) => (array: any) =>
            array.reduce((objectsByKeyValue: any, obj: any) => {
              const value = obj[key];
              objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
              return objectsByKeyValue;
            }, {});

          const groupByTest = groupBy('teststore_id');
          var results = groupByTest(apiresponse.data.stores);
          this.measure_excel = apiresponse.data.data;
          localStorage.setItem('FromMeasurement', '1');
          localStorage.setItem('Measurementdata', this.measure_excel);
          localStorage.setItem('trial_name', this.test_mea_name_val);

          let temp_mesuredata: any = [];

          var chartkeys: any = Object.keys(results);
          var chartlen = chartkeys.length;
          for (var i = 0; i < chartkeys.length; i++) {
            let temp_control: any = [];
            let temp_rank: any = [];
            for (var j = 0; j < results[chartkeys[i]].length; j++) {
              // temp_control.push({"ControlStore":results[chartkeys[i]][j].controlstore_id +'_'+results[chartkeys[i]][j].controlstore_name,"ControlStore_id":results[chartkeys[i]][j].controlstore_id})
              temp_control.push(
                results[chartkeys[i]][j].controlstore_id + '_' + results[chartkeys[i]][j].controlstore_name
              );
              temp_rank.push(results[chartkeys[i]][j].rank);
            }
            this.temp_teststores.push(results[chartkeys[i]][0].teststore_id);
            temp_mesuredata.push({
              TestStore: results[chartkeys[i]][0].teststore_id + '_' + results[chartkeys[i]][0].teststore_name,
              TestStore_id: results[chartkeys[i]][0].teststore_id,
              Controlstore: temp_control,
              Rank: temp_rank
            });
          }

          this.TestMeasuredata = temp_mesuredata;
          this.Test_measure_DATA = temp_mesuredata;

          // temp_teststores
        } else {
          var action = 'close';
          this._snackBar.open(apiresponse.data, action, {
            duration: 10000,
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  upload_store(event: any) {
    var excel = event.target.files.length;
    for (let i = 0; i < excel; i++) {
      var reader = new FileReader();
      this.myFiles1.push(event.target.files[i]);
    }
    const frmData1 = new FormData();
    if (this.myFiles1.length > 0) {
      for (var i = 0; i < this.myFiles1.length; i++) {
        frmData1.append('match_store', this.myFiles1[i]);
      }
      this.homeservice.uploadfile(frmData1).subscribe(
        (temp_data: any) => {
          if (temp_data.status == 'ok') {
            this.toastr.success('', 'Menu Bulk Imported');
            window.location.reload();
            return;
          } else {
            this.toastr.warning('', temp_data.data);
          }
        },
        error => {}
      );
    }
  }

  /*---------------------Sorting table---------------------*/
  sortDataSelectStore(sort: Sort) {
    const data = this.Selectedstoredata.slice();
    if (!sort.active || sort.direction === '') {
      this.Selectedstoredata = data;
      return;
    }
    this.Selectedstoredata = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'StoreId':
          return compare_select_store(a.store_sk, b.store_sk, isAsc);
        case 'StoreName':
          return compare_select_store(a.store_name, b.store_name, isAsc);
        case 'State':
          return compare_select_store(a.state_long, b.state_long, isAsc);
        case 'StoreType':
          return compare_select_store(a.store_type, b.store_type, isAsc);
        default:
          return 0;
      }
    });
  }

  sortDataUploadStore(sort: Sort) {
    const data = this.Uploadstoredata.slice();
    if (!sort.active || sort.direction === '') {
      this.Uploadstoredata = data;
      return;
    }
    this.Uploadstoredata = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'StoreId':
          return compare_upload_store(a.store_sk, b.store_sk, isAsc);
        case 'StoreName':
          return compare_upload_store(a.store_name, b.store_name, isAsc);
        case 'State':
          return compare_upload_store(a.state_long, b.state_long, isAsc);
        case 'StoreType':
          return compare_upload_store(a.store_type, b.store_type, isAsc);
        default:
          return 0;
      }
    });
  }

  sortDataConfirmStore(sort: Sort) {
    const data = this.Confirmstoredata.slice();
    if (!sort.active || sort.direction === '') {
      this.Confirmstoredata = data;
      return;
    }
    this.Confirmstoredata = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'StoreId':
          return compare_confirm_store(a.store_sk, b.store_sk, isAsc);
        case 'StoreName':
          return compare_confirm_store(a.store_name, b.store_name, isAsc);
        case 'State':
          return compare_confirm_store(a.state_long, b.state_long, isAsc);
        case 'StoreType':
          return compare_confirm_store(a.store_type, b.store_type, isAsc);
        default:
          return 0;
      }
    });
  }

  sortDataLoadSaved(sort: Sort) {
    const data = this.LoadSavedTestdata.slice();
    if (!sort.active || sort.direction === '') {
      this.LoadSavedTestdata = data;
      return;
    }
    this.LoadSavedTestdata = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'stage_id':
          return compare_loadsaved_store(a.stage_id, b.stage_id, isAsc);
        case 'test_name':
          return compare_loadsaved_store(a.test_name, b.test_name, isAsc);
        case 'Created':
          return compare_loadsaved_store(a.Created, b.Created, isAsc);
        case 'Modified':
          return compare_loadsaved_store(a.Modified, b.Modified, isAsc);
        default:
          return 0;
      }
    });
  }

  sortDataTestMeasure(sort: Sort) {
    const data = this.TestMeasuredata.slice();
    if (!sort.active || sort.direction === '') {
      this.TestMeasuredata = data;
      return;
    }
    this.TestMeasuredata = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'TestStore':
          return compare_testmeasure_store(a.TestStore, b.TestStore, isAsc);
        case 'Controlstore':
          return compare_testmeasure_store(a.Controlstore, b.Controlstore, isAsc);
        default:
          return 0;
      }
    });
  }

  ConfirmSelection() {
    if (this.selectstorechecked.length == 0) {
      var action = 'close';
      this._snackBar.open('Select Test store to continue!', action, {
        duration: 10000,
        verticalPosition: 'bottom'
      });
    } else {
      this.show_confirm_store = true;
      this.hideselect_store = false;
      this.save_stage = true;
      this.confirm_selection = false;
      this.Confirmstoredata = this.selectstorechecked;
      this.CONFIRM_STORE_DATA = this.selectstorechecked;
      this.ConfirmStrDatasrc = new MatTableDataSource<any>(this.CONFIRM_STORE_DATA);
      this.confirmselection = new SelectionModel<Confirmvalues>(true, [...this.CONFIRM_STORE_DATA]); //to select all
    }
  }

  GotoselectStore() {
    this.show_confirm_store = false;
    this.hideselect_store = true;
    this.save_stage = false;
    this.confirm_selection = true;
    this._snackBar.dismiss();
    //this.selectstorechecked=[];
  }

  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  Movetowizard2() {
    this._snackBar.dismiss();
    if (this.type_store == '1') {
      this.filenameval = this.filenameval;
      this.selectstorechecked = this.upload_store_checked;
      this.plan_type = 1;
    } else {
      this.filenameval = '';
      this.selectstorechecked = this.Confirmstoredata;
      this.plan_type = 2;
    }

    // this.show_confirm_store=true;
    // this.hideselect_store=false;
    var storeidval = [];
    for (var x in this.selectstorechecked) storeidval.push(this.selectstorechecked[x].store_sk);
    if (storeidval.length == 0) {
      var action = 'close';
      this._snackBar.open('No Valid Test Stores Uploaded ', action, {
        duration: 10000,
        verticalPosition: 'bottom'
      });
      return;
    }
    let data: any = {
      test_name: this.testvalue,
      market_id: this.market[0].market_id,
      file_name: this.filenameval_temp,
      stage_id: 1,
      istestplan: true,
      plan_type: this.plan_type,
      select_store: storeidval
    };

    var stringified_data = JSON.stringify(data);
    let data1: any = {
      test_name: this.testvalue,
      market_id: this.market[0].market_id,
      file_name: this.filenameval_temp,
      stage_id: 1,
      plan_type: this.plan_type,
      istestplan: true,
      select_store: storeidval,
      stringified_data: stringified_data
    };
    localStorage.setItem('teststoreids', JSON.stringify(storeidval));

    // if (data.select_store != '') {
    this.homeservice.SaveStageOne(data1).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        this.toastr.success('Stage saved successfully!', 'Test Configuration');
        this.router.navigate(['./controlstore']);
        var myObject = {
          w2stepval: 0
        };
        var myObjectJson = JSON.stringify(myObject);
        sessionStorage.setItem('w2index', myObjectJson);
        localStorage.setItem('trial', apiresponse.data);
        localStorage.setItem('trial_name', this.testvalue);
      } else {
      }
    });
    // } else {
    //   this.toastr.error('Select Test store to continue!', 'Alert');
    // }
  }

  Movetowizard3() {
    let teststore = localStorage.getItem('Measurementdata');
    let data: any = {
      test_name: this.test_mea_name_val,
      market_id: this.market[0].market_id,
      stage_id: 1,
      istestplan: false,
      select_store: this.temp_teststores,
      datas: teststore
    };

    var stringified_data = JSON.stringify(data);
    let data1: any = {
      test_name: this.test_mea_name_val,
      market_id: this.market[0].market_id,
      stage_id: 1,
      istestplan: false,
      stringified_data: stringified_data
    };

    this.homeservice.SaveMeasurement(data1).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        localStorage.setItem('trial', apiresponse.data);
        this.router.navigate(['./testmeasure']);
      } else {
        this.toastr.warning('', apiresponse.data);
      }
    });
  }

  LoadData(id: any, test_name: any) {
    this.homeservice.LoadSavedTest(test_name).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        let stage_id = JSON.parse(apiresponse.data.stage_id);
        let navigationExtras = {
          queryParams: {
            trial: test_name
          }
        };
        if (stage_id == 1) {
          this.router.navigate(['./controlstore'], navigationExtras);
        } else if (stage_id == 2) {
          this.router.navigate(['./testmeasure'], navigationExtras);
        } else if (stage_id == 3) {
          this.router.navigate(['./testmeasure'], navigationExtras);
        }
      } else {
      }
    });
  }

  DeleteData(del: any) {
    this.homeservice.DeleteSavedData(del).subscribe((apiresponse: any) => {
      if (apiresponse.status == 'ok') {
        this.homeservice.Load_savedata().subscribe((apiresponse: any) => {
          this.Load_saved_DATA = [];
          this.LoadSavedTestdata = [];
          if (apiresponse.status == 'ok') {
            for (var i = 0; i < apiresponse.data.length; i++) {
              this.Load_saved_DATA.push(apiresponse.data[i]);
              this.LoadSavedTestdata = this.Load_saved_DATA;
            }
          }
        });
      } else {
      }
    });
  }
  /*---------------------Sorting table---------------------*/
}
/*Sort functions*/
function compare_select_store(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_upload_store(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_confirm_store(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_loadsaved_store(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compare_testmeasure_store(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
/*Sort functions*/
