import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { TestConfigService } from './testconfig.service';
import { WizardComponent } from 'angular-archwizard';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
    details: 'Analuse how new user interface has affected the sales',
    test_window: 'Test Configuration to Test Measurement',
    Created: '29/3/2020',
    Modified: '30/3/2020',
    Actions: ''
  },
  {
    test_name: 'Test 2',
    status: 'Completed',
    details: 'Analuse how new user interface has affected the sales',
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
  public banner: any[] = ['Banner 1', 'Banner 2'];
  public segment: any[] = ['Segment 1', 'Segment 2'];
  public territory: any[] = ['Territory 1', 'Territory 2'];
  public storegrid: any[] = ['Store Grid 1', 'Store Grid 2'];
  public category: any[] = ['Category 1', 'Category 2'];
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
  //         this.filenameval_test_cntrl = this.filenameval_test_cntrl.replace(/^.*[/]/, '');
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
    this.savenextshow = true;
    this.LoadSavedTestdata = new MatTableDataSource(ELEMENT_DATA2);
    this.TestStoreSelectTable = new MatTableDataSource(ELEMENT_DATA3);
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
      $(document).ready(function() {
        $('li#1').removeClass('done');
      });
    } else {
      var newMyObjectJSON = sessionStorage.getItem('index');
      var newMyObject = JSON.parse(newMyObjectJSON);
      this.stepindex = newMyObject.stepval;
      this.isShow = true;
      this.CompletedStep = true;
      $(document).ready(function() {
        $('li#1').addClass('done');
      });
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

                  // this.homeservice.GetStoresDetails(parseData.select_store).subscribe((apiresponse: any) => {
                  //   if (apiresponse.status == 'ok') {
                  //     this.Confirmstoredata = apiresponse.data;
                  //     this.CONFIRM_STORE_DATA = apiresponse.data;
                  //     this.selectstorechecked = apiresponse.data;
                  //   }
                  // });
                }
              });
            }
          }
        }
      });

      let par = JSON.parse("[{\"index\":9,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":450000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":56697.21,\"City\":\"VENLO\",\"City (Rural\/Urban File)\":\"VENLO\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":336.0,\"Fulltime_visits\":4.0,\"House Number\":\"20\",\"House Number (Rural\/Urban File)\":\"20\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.8,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1857,\"Outlet surface\":4250.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1309,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":38811.8,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"8m\",\"Shelf meters Choc\":\"9m\",\"Shelf meters Dog\":\"7m\",\"Status\":\"Active visited\",\"Street\":\"Nijmeegseweg\",\"Street (Rural\/Urban File)\":\"Nijmeegseweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":95509.01,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5916 PT\",\"ZIP code (Rural\/Urban File)\":\"5916 PT\",\"ZIP code 4 digitis (Rural\/Urban File)\":5916.0,\"thirdparty_total_duration\":348.0,\"thirdparty_visits\":5.0},{\"index\":10,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":48038.88,\"City\":\"MUIDEN\",\"City (Rural\/Urban File)\":\"MUIDEN\",\"Classification\":5.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":559.0,\"Fulltime_visits\":6.0,\"House Number\":\"13\",\"House Number (Rural\/Urban File)\":\"13\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1855,\"Outlet surface\":4000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1311,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":80310.98,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"10m\",\"Shelf meters Choc\":\"10m\",\"Shelf meters Dog\":\"9m\",\"Status\":\"Active visited\",\"Street\":\"Pampusweg\",\"Street (Rural\/Urban File)\":\"Pampusweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":128349.86,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1398 PT\",\"ZIP code (Rural\/Urban File)\":\"1398 PT\",\"ZIP code 4 digitis (Rural\/Urban File)\":1398.0,\"thirdparty_total_duration\":93.0,\"thirdparty_visits\":1.0},{\"index\":15,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":500000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":54149.31,\"City\":\"NIJMEGEN\",\"City (Rural\/Urban File)\":\"NIJMEGEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":496.0,\"Fulltime_visits\":5.0,\"House Number\":\"5505\",\"House Number (Rural\/Urban File)\":\"5505\",\"Influence Chocolate\":2.3,\"Influence Overall\":1.825,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1621,\"Outlet surface\":3100.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1329,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":56393.07,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Zwanenveld\",\"Street (Rural\/Urban File)\":\"Zwanenveld\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":110542.38,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"6538 TZ\",\"ZIP code (Rural\/Urban File)\":\"6538 TZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":6538.0,\"thirdparty_total_duration\":499.0,\"thirdparty_visits\":6.0},{\"index\":19,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":500000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":51628.72,\"City\":\"EINDHOVEN\",\"City (Rural\/Urban File)\":\"EINDHOVEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":168.0,\"Fulltime_visits\":2.0,\"House Number\":\"119\",\"House Number (Rural\/Urban File)\":\"119\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1614,\"Outlet surface\":3500.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1342,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":42645.56,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"10m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Winkelcentr. \”Woensel\",\"Street (Rural\/Urban File)\":\"Winkelcentr. \”Woensel\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":94274.28,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5625 AG\",\"ZIP code (Rural\/Urban File)\":\"5625 AG\",\"ZIP code 4 digitis (Rural\/Urban File)\":5625.0,\"thirdparty_total_duration\":132.0,\"thirdparty_visits\":2.0},{\"index\":25,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":1000000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":107638.35,\"City\":\"TILBURG\",\"City (Rural\/Urban File)\":\"TILBURG\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":477.0,\"Fulltime_visits\":5.0,\"House Number\":\"10\",\"House Number (Rural\/Urban File)\":\"10\",\"Influence Chocolate\":0.95,\"Influence Overall\":1.35,\"Influence Petcare\":1.75,\"Influence Segment\":\"High\",\"Influence on activation\":1.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1521,\"Outlet surface\":3800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1363,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":87901.67,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"8m\",\"Shelf meters Choc\":\"10m\",\"Shelf meters Dog\":\"7m\",\"Status\":\"Active visited\",\"Street\":\"Jan Heijnstraat\",\"Street (Rural\/Urban File)\":\"Jan Heijnstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":195540.02,\"V4+ invloed op activatie\":\"1\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5041 GB\",\"ZIP code (Rural\/Urban File)\":\"5041 GB\",\"ZIP code 4 digitis (Rural\/Urban File)\":5041.0,\"thirdparty_total_duration\":87.0,\"thirdparty_visits\":2.0},{\"index\":36,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":810000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":77901.88,\"City\":\"EINDHOVEN\",\"City (Rural\/Urban File)\":\"EINDHOVEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":621.0,\"Fulltime_visits\":8.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":2.25,\"Influence Overall\":2.55,\"Influence Petcare\":2.85,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":1394,\"Outlet surface\":3950.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1402,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":73357.37,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"8m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Limburglaan\",\"Street (Rural\/Urban File)\":\"Limburglaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":151259.25,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"5652 AA\",\"ZIP code (Rural\/Urban File)\":\"5652 AA\",\"ZIP code 4 digitis (Rural\/Urban File)\":5652.0,\"thirdparty_total_duration\":533.0,\"thirdparty_visits\":7.0},{\"index\":37,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":43659.15,\"City\":\"DIEMEN\",\"City (Rural\/Urban File)\":\"DIEMEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":480.0,\"Fulltime_visits\":7.0,\"House Number\":\"200\",\"House Number (Rural\/Urban File)\":\"200\",\"Influence Chocolate\":2.05,\"Influence Overall\":2.05,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1106,\"Outlet surface\":3400.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1405,\"Partner Name\":\"Albert Heijn Xl\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Xl\",\"Petcare RSV\":57788.74,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Diemerplein\",\"Street (Rural\/Urban File)\":\"Diemerplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":101447.89,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1111 JD\",\"ZIP code (Rural\/Urban File)\":\"1111 JD\",\"ZIP code 4 digitis (Rural\/Urban File)\":1111.0,\"thirdparty_total_duration\":268.0,\"thirdparty_visits\":4.0},{\"index\":39,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":41821.21,\"City\":\"ASSEN\",\"City (Rural\/Urban File)\":\"ASSEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":591.0,\"Fulltime_visits\":6.0,\"House Number\":\"14\",\"House Number (Rural\/Urban File)\":\"14\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1515,\"Outlet surface\":3600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1412,\"Partner Name\":\"Albert Heijn XL\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn XL\",\"Petcare RSV\":55235.59,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"10m\",\"Shelf meters Choc\":\"10m\",\"Shelf meters Dog\":\"8m\",\"Status\":\"Active visited\",\"Street\":\"Triade\",\"Street (Rural\/Urban File)\":\"Triade\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":97056.8,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9401 ZH\",\"ZIP code (Rural\/Urban File)\":\"9401 ZH\",\"ZIP code 4 digitis (Rural\/Urban File)\":9401.0,\"thirdparty_total_duration\":499.0,\"thirdparty_visits\":6.0},{\"index\":41,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":88314.3,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":265.0,\"Fulltime_visits\":4.0,\"House Number\":\"47\",\"House Number (Rural\/Urban File)\":\"47\",\"Influence Chocolate\":2.05,\"Influence Overall\":2.05,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1080,\"Outlet surface\":3600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1421,\"Partner Name\":\"Albert Heijn Xl\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Xl\",\"Petcare RSV\":85619.48,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"9m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Gelderlandplein\",\"Street (Rural\/Urban File)\":\"Gelderlandplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":173933.78,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1082 KZ\",\"ZIP code (Rural\/Urban File)\":\"1082 KZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":1082.0,\"thirdparty_total_duration\":370.0,\"thirdparty_visits\":2.0},{\"index\":42,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":64474.65,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":424.0,\"Fulltime_visits\":6.0,\"House Number\":\"469\",\"House Number (Rural\/Urban File)\":\"469\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1027,\"Outlet surface\":3100.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1426,\"Partner Name\":\"Albert Heijn Xl\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Xl\",\"Petcare RSV\":52348.97,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"10m\",\"Shelf meters Choc\":\"10m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Osdorpplein\",\"Street (Rural\/Urban File)\":\"Osdorpplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":116823.62,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1068 SZ\",\"ZIP code (Rural\/Urban File)\":\"1068 SZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":1068.0,\"thirdparty_total_duration\":126.0,\"thirdparty_visits\":2.0},{\"index\":68,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":79574.56,\"City\":\"ALMERE-BUITEN\",\"City (Rural\/Urban File)\":\"ALMERE-BUITEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":191.0,\"Fulltime_visits\":3.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":2.05,\"Influence Overall\":2.05,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":8643,\"Outlet surface\":2000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1527,\"Partner Name\":\"Albert Heijn Weernekers\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Weernekers\",\"Petcare RSV\":62350.19,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Lombokstraat\",\"Street (Rural\/Urban File)\":\"Lombokstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":141924.75,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1335 JR\",\"ZIP code (Rural\/Urban File)\":\"1335 JR\",\"ZIP code 4 digitis (Rural\/Urban File)\":1335.0,\"thirdparty_total_duration\":189.0,\"thirdparty_visits\":2.0},{\"index\":90,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":600000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":77846.48,\"City\":\"VLEUTEN\",\"City (Rural\/Urban File)\":\"VLEUTEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":null,\"Fulltime_visits\":null,\"House Number\":\"14\",\"House Number (Rural\/Urban File)\":\"14\",\"Influence Chocolate\":1.55,\"Influence Overall\":1.35,\"Influence Petcare\":1.15,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8635,\"Outlet surface\":2253.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1622,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":47805.88,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Middenburcht\",\"Street (Rural\/Urban File)\":\"Middenburcht\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":125652.36,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"3452 MT\",\"ZIP code (Rural\/Urban File)\":\"3452 MT\",\"ZIP code 4 digitis (Rural\/Urban File)\":3452.0,\"thirdparty_total_duration\":32.0,\"thirdparty_visits\":1.0},{\"index\":116,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":57869.71,\"City\":\"ARNHEM\",\"City (Rural\/Urban File)\":\"ARNHEM\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":251.0,\"Fulltime_visits\":3.0,\"House Number\":\"17\",\"House Number (Rural\/Urban File)\":\"17\",\"Influence Chocolate\":1.55,\"Influence Overall\":1.35,\"Influence Petcare\":1.15,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8633,\"Outlet surface\":2800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1727,\"Partner Name\":\"Albert Heijn driessen\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn driessen\",\"Petcare RSV\":41947.45,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Fortunastraat\",\"Street (Rural\/Urban File)\":\"Fortunastraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":99817.16,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"6846 XZ\",\"ZIP code (Rural\/Urban File)\":\"6846 XZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":6846.0,\"thirdparty_total_duration\":231.0,\"thirdparty_visits\":3.0},{\"index\":127,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":390000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":53988.14,\"City\":\"HOUTEN\",\"City (Rural\/Urban File)\":\"HOUTEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":262.0,\"Fulltime_visits\":2.0,\"House Number\":\"12\",\"House Number (Rural\/Urban File)\":\"12\",\"Influence Chocolate\":1.75,\"Influence Overall\":1.475,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1204,\"Outlet surface\":1682.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1764,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":27033.92,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Cardo\",\"Street (Rural\/Urban File)\":\"Cardo\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":81022.06,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"3995 XM\",\"ZIP code (Rural\/Urban File)\":\"3995 XM\",\"ZIP code 4 digitis (Rural\/Urban File)\":3995.0,\"thirdparty_total_duration\":637.0,\"thirdparty_visits\":7.0},{\"index\":140,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":40376.72,\"City\":\"WINSCHOTEN\",\"City (Rural\/Urban File)\":\"WINSCHOTEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":147.0,\"Fulltime_visits\":2.0,\"House Number\":\"1D\",\"House Number (Rural\/Urban File)\":\"1D\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.8,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1627,\"Outlet surface\":1800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1811,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":62517.17,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Beertsterweg\",\"Street (Rural\/Urban File)\":\"Beertsterweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":102893.89,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9672 BE\",\"ZIP code (Rural\/Urban File)\":\"9672 BE\",\"ZIP code 4 digitis (Rural\/Urban File)\":9672.0,\"thirdparty_total_duration\":45.0,\"thirdparty_visits\":1.0},{\"index\":141,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":41554.18,\"City\":\"DRUTEN\",\"City (Rural\/Urban File)\":\"DRUTEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":182.0,\"Fulltime_visits\":3.0,\"House Number\":\"21\",\"House Number (Rural\/Urban File)\":\"21\",\"Influence Chocolate\":1.55,\"Influence Overall\":1.35,\"Influence Petcare\":1.15,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8733,\"Outlet surface\":1874.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1814,\"Partner Name\":\"Albert Heijn Geveling\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Geveling\",\"Petcare RSV\":32860.81,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Scharenburg\",\"Street (Rural\/Urban File)\":\"Scharenburg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":74414.99,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"6652 AK\",\"ZIP code (Rural\/Urban File)\":\"6652 AK\",\"ZIP code 4 digitis (Rural\/Urban File)\":6652.0,\"thirdparty_total_duration\":110.0,\"thirdparty_visits\":1.0},{\"index\":158,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":420000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":50192.07,\"City\":\"DEN HAAG\",\"City (Rural\/Urban File)\":\"DEN HAAG\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":171.0,\"Fulltime_visits\":2.0,\"House Number\":\"55\",\"House Number (Rural\/Urban File)\":\"55\",\"Influence Chocolate\":1.85,\"Influence Overall\":1.55,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1332,\"Outlet surface\":1600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1885,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":29460.44,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Simon Carmiggeltthof\",\"Street (Rural\/Urban File)\":\"Simon Carmiggeltthof\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":79652.51,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2492 JR\",\"ZIP code (Rural\/Urban File)\":\"2492 JR\",\"ZIP code 4 digitis (Rural\/Urban File)\":2492.0,\"thirdparty_total_duration\":26.0,\"thirdparty_visits\":1.0},{\"index\":169,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":47257.55,\"City\":\"SITTARD\",\"City (Rural\/Urban File)\":\"SITTARD\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":601.0,\"Fulltime_visits\":6.0,\"House Number\":\"1\",\"House Number (Rural\/Urban File)\":\"1\",\"Influence Chocolate\":1.9,\"Influence Overall\":1.95,\"Influence Petcare\":2.0,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1351,\"Outlet surface\":2340.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1925,\"Partner Name\":\"Albert Heijn Brugstraat\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Brugstraat\",\"Petcare RSV\":42321.14,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"9m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Brugstraat\",\"Street (Rural\/Urban File)\":\"Brugstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":89578.69,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6131 AE\",\"ZIP code (Rural\/Urban File)\":\"6131 AE\",\"ZIP code 4 digitis (Rural\/Urban File)\":6131.0,\"thirdparty_total_duration\":259.0,\"thirdparty_visits\":4.0},{\"index\":184,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":53080.63,\"City\":\"AMSTELVEEN\",\"City (Rural\/Urban File)\":\"AMSTELVEEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":450.0,\"Fulltime_visits\":5.0,\"House Number\":\"31\",\"House Number (Rural\/Urban File)\":\"31\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1820,\"Outlet surface\":1750.0,\"Overall Segment\":\"High-High\",\"Partner ID\":1990,\"Partner Name\":\"Albert Heijn Maalderij\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Maalderij\",\"Petcare RSV\":50679.44,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Maalderij\",\"Street (Rural\/Urban File)\":\"Maalderij\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":103760.07,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1185 ZC\",\"ZIP code (Rural\/Urban File)\":\"1185 ZC\",\"ZIP code 4 digitis (Rural\/Urban File)\":1185.0,\"thirdparty_total_duration\":453.0,\"thirdparty_visits\":4.0},{\"index\":215,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":57058.94,\"City\":\"KAATSHEUVEL\",\"City (Rural\/Urban File)\":\"KAATSHEUVEL\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":422.0,\"Fulltime_visits\":6.0,\"House Number\":\"124\",\"House Number (Rural\/Urban File)\":\"124\",\"Influence Chocolate\":2.3,\"Influence Overall\":1.825,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8611,\"Outlet surface\":1900.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2117,\"Partner Name\":\"Albert Heijn den Hartog\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn den Hartog\",\"Petcare RSV\":35185.47,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Gasthuisstraat\",\"Street (Rural\/Urban File)\":\"Gasthuisstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":92244.41,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"5171 GJ\",\"ZIP code (Rural\/Urban File)\":\"5171 GJ\",\"ZIP code 4 digitis (Rural\/Urban File)\":5171.0,\"thirdparty_total_duration\":300.0,\"thirdparty_visits\":4.0},{\"index\":237,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":500000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":61411.74,\"City\":\"KATWIJK (ZH)\",\"City (Rural\/Urban File)\":\"KATWIJK (ZH)\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":234.0,\"Fulltime_visits\":2.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":2.15,\"Influence Overall\":1.35,\"Influence Petcare\":0.55,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":0.0,\"Outlet Banner Code\":1630,\"Outlet surface\":3000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2218,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":48448.6,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Zeilmakerstraat\",\"Street (Rural\/Urban File)\":\"Zeilmakerstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":109860.34,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"0\",\"ZIP code\":\"2222 AA\",\"ZIP code (Rural\/Urban File)\":\"2222 AA\",\"ZIP code 4 digitis (Rural\/Urban File)\":2222.0,\"thirdparty_total_duration\":420.0,\"thirdparty_visits\":7.0},{\"index\":254,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":310000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":40886.65,\"City\":\"BRUNSSUM\",\"City (Rural\/Urban File)\":\"BRUNSSUM\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":555.0,\"Fulltime_visits\":6.0,\"House Number\":\"90\",\"House Number (Rural\/Urban File)\":\"90\",\"Influence Chocolate\":1.45,\"Influence Overall\":1.675,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1611,\"Outlet surface\":2300.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2293,\"Partner Name\":\"Albert Heijn Brunssum Noord\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Brunssum Noord\",\"Petcare RSV\":52106.63,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Kennedylaan\",\"Street (Rural\/Urban File)\":\"Kennedylaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":92993.28,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6441 JG\",\"ZIP code (Rural\/Urban File)\":\"6441 JG\",\"ZIP code 4 digitis (Rural\/Urban File)\":6441.0,\"thirdparty_total_duration\":238.0,\"thirdparty_visits\":4.0},{\"index\":262,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":100743.16,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":525.0,\"Fulltime_visits\":7.0,\"House Number\":\"226\",\"House Number (Rural\/Urban File)\":\"226\",\"Influence Chocolate\":2.85,\"Influence Overall\":2.525,\"Influence Petcare\":2.2,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1001,\"Outlet surface\":1700.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2331,\"Partner Name\":\"Albert Heijn Dam\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Dam\",\"Petcare RSV\":20567.03,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"2,5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"2m\",\"Status\":\"Active visited\",\"Street\":\"Nieuwezijds Voorburgwal\",\"Street (Rural\/Urban File)\":\"Nieuwezijds Voorburgwal\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":121310.19,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1012 RR\",\"ZIP code (Rural\/Urban File)\":\"1012 RR\",\"ZIP code 4 digitis (Rural\/Urban File)\":1012.0,\"thirdparty_total_duration\":106.0,\"thirdparty_visits\":3.0},{\"index\":299,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":55849.67,\"City\":\"ZUNDERT\",\"City (Rural\/Urban File)\":\"ZUNDERT\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":667.0,\"Fulltime_visits\":7.0,\"House Number\":\"58\",\"House Number (Rural\/Urban File)\":\"58\",\"Influence Chocolate\":2.35,\"Influence Overall\":1.85,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8590,\"Outlet surface\":1800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2494,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":51619.02,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Molenstraat\",\"Street (Rural\/Urban File)\":\"Molenstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":107468.69,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4881 CT\",\"ZIP code (Rural\/Urban File)\":\"4881 CT\",\"ZIP code 4 digitis (Rural\/Urban File)\":4881.0,\"thirdparty_total_duration\":526.0,\"thirdparty_visits\":9.0},{\"index\":300,\"2019 Freq. rating\":2.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":280000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":41037.04,\"City\":\"ZUIDHORN\",\"City (Rural\/Urban File)\":\"ZUIDHORN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":129.0,\"Fulltime_visits\":3.0,\"House Number\":\"5\",\"House Number (Rural\/Urban File)\":\"5\",\"Influence Chocolate\":0.5,\"Influence Overall\":1.45,\"Influence Petcare\":2.4,\"Influence Segment\":\"High\",\"Influence on activation\":0.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":8549,\"Outlet surface\":2050.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2500,\"Partner Name\":\"Albert Heijn ten Have\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn ten Have\",\"Petcare RSV\":34872.84,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Burgemeester Kruisingalaan\",\"Street (Rural\/Urban File)\":\"Burgemeester Kruisingalaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":75909.88,\"V4+ invloed op activatie\":\"0\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"9801 BH\",\"ZIP code (Rural\/Urban File)\":\"9801 BH\",\"ZIP code 4 digitis (Rural\/Urban File)\":9801.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":334,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":260000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":30864.38,\"City\":\"RHOON\",\"City (Rural\/Urban File)\":\"RHOON\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":589.0,\"Fulltime_visits\":6.0,\"House Number\":\"37\",\"House Number (Rural\/Urban File)\":\"37\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":8541,\"Outlet surface\":1800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2662,\"Partner Name\":\"Albert Heijn Mahu\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Mahu\",\"Petcare RSV\":27375.58,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"2m\",\"Status\":\"Active visited\",\"Street\":\"Julianastraat\",\"Street (Rural\/Urban File)\":\"Julianastraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":58239.96,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"3161 AJ\",\"ZIP code (Rural\/Urban File)\":\"3161 AJ\",\"ZIP code 4 digitis (Rural\/Urban File)\":3161.0,\"thirdparty_total_duration\":312.0,\"thirdparty_visits\":5.0},{\"index\":352,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":440000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":45625.29,\"City\":\"MALDEN\",\"City (Rural\/Urban File)\":\"MALDEN\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":64.0,\"Fulltime_visits\":1.0,\"House Number\":\"19\",\"House Number (Rural\/Urban File)\":\"19\",\"Influence Chocolate\":1.55,\"Influence Overall\":1.35,\"Influence Petcare\":1.15,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8735,\"Outlet surface\":2700.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2749,\"Partner Name\":\"Albert Heijn jansen\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn jansen\",\"Petcare RSV\":30433.36,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Winkelcentrum\",\"Street (Rural\/Urban File)\":\"Winkelcentrum\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":76058.65,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"6581 BV\",\"ZIP code (Rural\/Urban File)\":\"6581 BV\",\"ZIP code 4 digitis (Rural\/Urban File)\":6581.0,\"thirdparty_total_duration\":173.0,\"thirdparty_visits\":2.0},{\"index\":353,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":45928.75,\"City\":\"MADE\",\"City (Rural\/Urban File)\":\"MADE\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":326.0,\"Fulltime_visits\":4.0,\"House Number\":\"104\",\"House Number (Rural\/Urban File)\":\"104\",\"Influence Chocolate\":1.85,\"Influence Overall\":1.55,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8791,\"Outlet surface\":1700.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2754,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":45045.96,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"3m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Nieuwstraat\",\"Street (Rural\/Urban File)\":\"Nieuwstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":90974.71,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4921 CZ\",\"ZIP code (Rural\/Urban File)\":\"4921 CZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":4921.0,\"thirdparty_total_duration\":166.0,\"thirdparty_visits\":1.0},{\"index\":377,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":47049.76,\"City\":\"HOEVEN\",\"City (Rural\/Urban File)\":\"HOEVEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":290.0,\"Fulltime_visits\":4.0,\"House Number\":\"91\",\"House Number (Rural\/Urban File)\":\"91\",\"Influence Chocolate\":2.1,\"Influence Overall\":1.7,\"Influence Petcare\":1.3,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":8533,\"Outlet surface\":1650.0,\"Overall Segment\":\"High-High\",\"Partner ID\":2888,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":37331.04,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"St. Janstraat\",\"Street (Rural\/Urban File)\":\"St. Janstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":84380.8,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4741 AN\",\"ZIP code (Rural\/Urban File)\":\"4741 AN\",\"ZIP code 4 digitis (Rural\/Urban File)\":4741.0,\"thirdparty_total_duration\":360.0,\"thirdparty_visits\":8.0},{\"index\":412,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":325000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":50092.11,\"City\":\"BORGER\",\"City (Rural\/Urban File)\":\"BORGER\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":364.0,\"Fulltime_visits\":4.0,\"House Number\":\"35\",\"House Number (Rural\/Urban File)\":\"35\",\"Influence Chocolate\":1.45,\"Influence Overall\":1.675,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":8572,\"Outlet surface\":1750.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3043,\"Partner Name\":\"Albert Heijn Ten Have\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Ten Have\",\"Petcare RSV\":41542.39,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Hoofdstraat\",\"Street (Rural\/Urban File)\":\"Hoofdstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":91634.5,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9531 AB\",\"ZIP code (Rural\/Urban File)\":\"9531 AB\",\"ZIP code 4 digitis (Rural\/Urban File)\":9531.0,\"thirdparty_total_duration\":111.0,\"thirdparty_visits\":2.0},{\"index\":451,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":340000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":43928.92,\"City\":\"WIJCHEN\",\"City (Rural\/Urban File)\":\"WIJCHEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":797.0,\"Fulltime_visits\":9.0,\"House Number\":\"85\",\"House Number (Rural\/Urban File)\":\"85\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1370,\"Outlet surface\":1600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3166,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":26165.4,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Europaplein\",\"Street (Rural\/Urban File)\":\"Europaplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":70094.32,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6602 GV\",\"ZIP code (Rural\/Urban File)\":\"6602 GV\",\"ZIP code 4 digitis (Rural\/Urban File)\":6602.0,\"thirdparty_total_duration\":287.0,\"thirdparty_visits\":6.0},{\"index\":469,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":33773.47,\"City\":\"VELP (GLD)\",\"City (Rural\/Urban File)\":\"VELP (GLD)\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":157.0,\"Fulltime_visits\":2.0,\"House Number\":\"232\",\"House Number (Rural\/Urban File)\":\"232\",\"Influence Chocolate\":1.8,\"Influence Overall\":1.5,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1024,\"Outlet surface\":1600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3185,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":30827.01,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Hoofdstraat\",\"Street (Rural\/Urban File)\":\"Hoofdstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":64600.48,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"6881 TS\",\"ZIP code (Rural\/Urban File)\":\"6881 TS\",\"ZIP code 4 digitis (Rural\/Urban File)\":6881.0,\"thirdparty_total_duration\":388.0,\"thirdparty_visits\":5.0},{\"index\":488,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":35797.09,\"City\":\"UITHOORN\",\"City (Rural\/Urban File)\":\"UITHOORN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":194.0,\"Fulltime_visits\":2.0,\"House Number\":\"37\",\"House Number (Rural\/Urban File)\":\"37\",\"Influence Chocolate\":1.45,\"Influence Overall\":1.675,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":8659,\"Outlet surface\":2060.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3312,\"Partner Name\":\"Albert Heijn Jos van den Berg\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Jos van den Berg\",\"Petcare RSV\":34852.22,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Amstelplein\",\"Street (Rural\/Urban File)\":\"Amstelplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":70649.31,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1421 SB\",\"ZIP code (Rural\/Urban File)\":\"1421 SB\",\"ZIP code 4 digitis (Rural\/Urban File)\":1421.0,\"thirdparty_total_duration\":214.0,\"thirdparty_visits\":2.0},{\"index\":495,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":37371.1,\"City\":\"TILBURG\",\"City (Rural\/Urban File)\":\"TILBURG\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":135.0,\"Fulltime_visits\":2.0,\"House Number\":\"52\",\"House Number (Rural\/Urban File)\":\"52\",\"Influence Chocolate\":2.0,\"Influence Overall\":2.0,\"Influence Petcare\":2.0,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1189,\"Outlet surface\":2000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3389,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":26946.18,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Richard Wagnerplein\",\"Street (Rural\/Urban File)\":\"Richard Wagnerplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":64317.28,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5011 LR\",\"ZIP code (Rural\/Urban File)\":\"5011 LR\",\"ZIP code 4 digitis (Rural\/Urban File)\":5011.0,\"thirdparty_total_duration\":50.0,\"thirdparty_visits\":1.0},{\"index\":601,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":null,\"City\":\"VENLO\",\"City (Rural\/Urban File)\":\"VENLO\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":null,\"Fulltime_visits\":null,\"House Number\":\"183\",\"House Number (Rural\/Urban File)\":\"183\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":126,\"Outlet surface\":1550.0,\"Overall Segment\":\"High-High\",\"Partner ID\":3757,\"Partner Name\":\"Jumbo Benders Venlo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Benders Venlo\",\"Petcare RSV\":null,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":null,\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"3m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Straelseweg\",\"Street (Rural\/Urban File)\":\"Straelseweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":null,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5914 AL\",\"ZIP code (Rural\/Urban File)\":\"5914 AL\",\"ZIP code 4 digitis (Rural\/Urban File)\":5914.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":801,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":295000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":32899.18,\"City\":\"NIEUWEGEIN\",\"City (Rural\/Urban File)\":\"NIEUWEGEIN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":420.0,\"Fulltime_visits\":3.0,\"House Number\":\"65\",\"House Number (Rural\/Urban File)\":\"65\",\"Influence Chocolate\":1.55,\"Influence Overall\":1.35,\"Influence Petcare\":1.15,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1327,\"Outlet surface\":1799.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4171,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":26231.94,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"De Passage\",\"Street (Rural\/Urban File)\":\"De Passage\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":59131.12,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"3431 LN\",\"ZIP code (Rural\/Urban File)\":\"3431 LN\",\"ZIP code 4 digitis (Rural\/Urban File)\":3431.0,\"thirdparty_total_duration\":58.0,\"thirdparty_visits\":1.0},{\"index\":804,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":325000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":34078.44,\"City\":\"MEPPEL\",\"City (Rural\/Urban File)\":\"MEPPEL\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":188.0,\"Fulltime_visits\":2.0,\"House Number\":\"1\",\"House Number (Rural\/Urban File)\":\"1\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1159,\"Outlet surface\":2410.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4204,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":37803.55,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Grote Akkerstraat\",\"Street (Rural\/Urban File)\":\"Grote Akkerstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":71881.99,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"7941 BB\",\"ZIP code (Rural\/Urban File)\":\"7941 BB\",\"ZIP code 4 digitis (Rural\/Urban File)\":7941.0,\"thirdparty_total_duration\":267.0,\"thirdparty_visits\":4.0},{\"index\":814,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":550000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":47473.8,\"City\":\"LEIDERDORP\",\"City (Rural\/Urban File)\":\"LEIDERDORP\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":133.0,\"Fulltime_visits\":1.0,\"House Number\":\"29\",\"House Number (Rural\/Urban File)\":\"29\",\"Influence Chocolate\":2.45,\"Influence Overall\":1.525,\"Influence Petcare\":0.6,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":0.0,\"Outlet Banner Code\":1402,\"Outlet surface\":2100.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4326,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":48090.13,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Winkelhof\",\"Street (Rural\/Urban File)\":\"Winkelhof\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":95563.93,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"0\",\"ZIP code\":\"2353 TS\",\"ZIP code (Rural\/Urban File)\":\"2353 TS\",\"ZIP code 4 digitis (Rural\/Urban File)\":2353.0,\"thirdparty_total_duration\":110.0,\"thirdparty_visits\":2.0},{\"index\":865,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":320000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":72840.55,\"City\":\"DEVENTER\",\"City (Rural\/Urban File)\":\"DEVENTER\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":608.0,\"Fulltime_visits\":6.0,\"House Number\":\"4\",\"House Number (Rural\/Urban File)\":\"4\",\"Influence Chocolate\":1.7,\"Influence Overall\":1.45,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4827,\"Outlet surface\":2349.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4508,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":43259.02,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"8m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Boreelplein\",\"Street (Rural\/Urban File)\":\"Boreelplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":116099.57,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"7411 EH\",\"ZIP code (Rural\/Urban File)\":\"7411 EH\",\"ZIP code 4 digitis (Rural\/Urban File)\":7411.0,\"thirdparty_total_duration\":879.0,\"thirdparty_visits\":5.0},{\"index\":873,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":270000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":46213.49,\"City\":\"GRONINGEN\",\"City (Rural\/Urban File)\":\"GRONINGEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":178.0,\"Fulltime_visits\":3.0,\"House Number\":\"525\",\"House Number (Rural\/Urban File)\":\"525\",\"Influence Chocolate\":2.8,\"Influence Overall\":2.9,\"Influence Petcare\":3.0,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":6504,\"Outlet surface\":3503.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4518,\"Partner Name\":\"Jumbo Maripaan Euroborg HK\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Maripaan Euroborg HK\",\"Petcare RSV\":20845.32,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"No\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"9m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Boumaboulevard\",\"Street (Rural\/Urban File)\":\"Boumaboulevard\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":67058.81,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"9723 ZS\",\"ZIP code (Rural\/Urban File)\":\"9723 ZS\",\"ZIP code 4 digitis (Rural\/Urban File)\":9723.0,\"thirdparty_total_duration\":372.0,\"thirdparty_visits\":7.0},{\"index\":896,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":62446.51,\"City\":\"HOOGEZAND\",\"City (Rural\/Urban File)\":\"HOOGEZAND\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":659.0,\"Fulltime_visits\":6.0,\"House Number\":\"26\",\"House Number (Rural\/Urban File)\":\"26\",\"Influence Chocolate\":1.6,\"Influence Overall\":1.4,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":6542,\"Outlet surface\":1529.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4543,\"Partner Name\":\"Jumbo Martenshoek\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Martenshoek\",\"Petcare RSV\":70977.59,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Meint Veningastraat\",\"Street (Rural\/Urban File)\":\"Meint Veningastraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":133424.1,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"9601 KG\",\"ZIP code (Rural\/Urban File)\":\"9601 KG\",\"ZIP code 4 digitis (Rural\/Urban File)\":9601.0,\"thirdparty_total_duration\":1684.0,\"thirdparty_visits\":6.0},{\"index\":900,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":68800.08,\"City\":\"BEILEN\",\"City (Rural\/Urban File)\":\"BEILEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":843.0,\"Fulltime_visits\":7.0,\"House Number\":\"3\",\"House Number (Rural\/Urban File)\":\"3\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.45,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3508,\"Outlet surface\":2114.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4547,\"Partner Name\":\"Jumbo Mulder\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Mulder\",\"Petcare RSV\":54740.85,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Ventweg Zuid\",\"Street (Rural\/Urban File)\":\"Ventweg Zuid\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":123540.93,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"9411 ZZ\",\"ZIP code (Rural\/Urban File)\":\"9411 ZZ\",\"ZIP code 4 digitis (Rural\/Urban File)\":9411.0,\"thirdparty_total_duration\":490.0,\"thirdparty_visits\":8.0},{\"index\":904,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":310000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":74880.54,\"City\":\"STADSKANAAL\",\"City (Rural\/Urban File)\":\"STADSKANAAL\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":348.0,\"Fulltime_visits\":4.0,\"House Number\":\"6\",\"House Number (Rural\/Urban File)\":\"6\",\"Influence Chocolate\":1.3,\"Influence Overall\":1.6,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3493,\"Outlet surface\":1507.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4552,\"Partner Name\":\"Jumbo Beneluxlaan\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Beneluxlaan\",\"Petcare RSV\":63638.04,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Beneluxlaan\",\"Street (Rural\/Urban File)\":\"Beneluxlaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":138518.58,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9501 CT\",\"ZIP code (Rural\/Urban File)\":\"9501 CT\",\"ZIP code 4 digitis (Rural\/Urban File)\":9501.0,\"thirdparty_total_duration\":66.0,\"thirdparty_visits\":1.0},{\"index\":934,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":390000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":67775.33,\"City\":\"SCHIJNDEL\",\"City (Rural\/Urban File)\":\"SCHIJNDEL\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":684.0,\"Fulltime_visits\":7.0,\"House Number\":\"5\",\"House Number (Rural\/Urban File)\":\"5\",\"Influence Chocolate\":2.1,\"Influence Overall\":2.1,\"Influence Petcare\":2.1,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":4897,\"Outlet surface\":1603.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4583,\"Partner Name\":\"Jumbo Rooiseheide\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Rooiseheide\",\"Petcare RSV\":36217.58,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Rooiseheide\",\"Street (Rural\/Urban File)\":\"Rooiseheide\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":103992.91,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5481 SG\",\"ZIP code (Rural\/Urban File)\":\"5481 SG\",\"ZIP code 4 digitis (Rural\/Urban File)\":5481.0,\"thirdparty_total_duration\":898.0,\"thirdparty_visits\":9.0},{\"index\":936,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":330000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":48393.08,\"City\":\"RAAMSDONKSVEER\",\"City (Rural\/Urban File)\":\"RAAMSDONKSVEER\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":723.0,\"Fulltime_visits\":9.0,\"House Number\":\"11\",\"House Number (Rural\/Urban File)\":\"11\",\"Influence Chocolate\":1.7,\"Influence Overall\":1.45,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4889,\"Outlet surface\":1610.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4585,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":44864.45,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Boterpolderlaan\",\"Street (Rural\/Urban File)\":\"Boterpolderlaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":93257.53,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4941 ZL\",\"ZIP code (Rural\/Urban File)\":\"4941 ZL\",\"ZIP code 4 digitis (Rural\/Urban File)\":4941.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":954,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":430000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":57972.11,\"City\":\"NIEUWE NIEDORP\",\"City (Rural\/Urban File)\":\"NIEUWE NIEDORP\",\"Classification\":5.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":689.0,\"Fulltime_visits\":7.0,\"House Number\":\"69\",\"House Number (Rural\/Urban File)\":\"69\",\"Influence Chocolate\":1.95,\"Influence Overall\":1.6,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4689,\"Outlet surface\":1603.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4604,\"Partner Name\":\"Jumbo Nieuwe Niedorp\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Nieuwe Niedorp\",\"Petcare RSV\":53784.57,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Trambaan\",\"Street (Rural\/Urban File)\":\"Trambaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":111756.68,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"1733 AX\",\"ZIP code (Rural\/Urban File)\":\"1733 AX\",\"ZIP code 4 digitis (Rural\/Urban File)\":1733.0,\"thirdparty_total_duration\":185.0,\"thirdparty_visits\":4.0},{\"index\":982,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":410000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":77606.38,\"City\":\"ROOSENDAAL\",\"City (Rural\/Urban File)\":\"ROOSENDAAL\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":581.0,\"Fulltime_visits\":6.0,\"House Number\":\"7\",\"House Number (Rural\/Urban File)\":\"7\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.45,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4656,\"Outlet surface\":1875.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4633,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":67229.92,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Van Beethovenlaan\",\"Street (Rural\/Urban File)\":\"Van Beethovenlaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":144836.3,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4702 KE\",\"ZIP code (Rural\/Urban File)\":\"4702 KE\",\"ZIP code 4 digitis (Rural\/Urban File)\":4702.0,\"thirdparty_total_duration\":199.0,\"thirdparty_visits\":4.0},{\"index\":987,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":270000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":50357.67,\"City\":\"NIEUWKOOP\",\"City (Rural\/Urban File)\":\"NIEUWKOOP\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":278.0,\"Fulltime_visits\":3.0,\"House Number\":\"1\",\"House Number (Rural\/Urban File)\":\"1\",\"Influence Chocolate\":3.0,\"Influence Overall\":3.0,\"Influence Petcare\":3.0,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":6348,\"Outlet surface\":1500.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4638,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":43748.67,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Kennedyplein\",\"Street (Rural\/Urban File)\":\"Kennedyplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":94106.34,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"2421 EN\",\"ZIP code (Rural\/Urban File)\":\"2421 EN\",\"ZIP code 4 digitis (Rural\/Urban File)\":2421.0,\"thirdparty_total_duration\":67.0,\"thirdparty_visits\":3.0},{\"index\":999,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":550000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":98380.95,\"City\":\"HILVERSUM\",\"City (Rural\/Urban File)\":\"HILVERSUM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":674.0,\"Fulltime_visits\":6.0,\"House Number\":\"155\",\"House Number (Rural\/Urban File)\":\"155\",\"Influence Chocolate\":1.85,\"Influence Overall\":1.95,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":6362,\"Outlet surface\":2342.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4651,\"Partner Name\":\"Jumbo van Dam - Schoonhoven\",\"Partner Name (Rural\/Urban File)\":\"Jumbo van Dam - Schoonhoven\",\"Petcare RSV\":102350.09,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Larenseweg\",\"Street (Rural\/Urban File)\":\"Larenseweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":200731.04,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1221 CL\",\"ZIP code (Rural\/Urban File)\":\"1221 CL\",\"ZIP code 4 digitis (Rural\/Urban File)\":1221.0,\"thirdparty_total_duration\":1607.0,\"thirdparty_visits\":8.0},{\"index\":1006,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":310000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":61696.93,\"City\":\"GORINCHEM\",\"City (Rural\/Urban File)\":\"GORINCHEM\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":554.0,\"Fulltime_visits\":7.0,\"House Number\":\"22-30\",\"House Number (Rural\/Urban File)\":\"22-30\",\"Influence Chocolate\":2.65,\"Influence Overall\":2.8,\"Influence Petcare\":2.95,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":6336,\"Outlet surface\":1881.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4658,\"Partner Name\":\"Jumbo Snaterse\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Snaterse\",\"Petcare RSV\":69825.52,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"7m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"7m\",\"Status\":\"Active visited\",\"Street\":\"Piazza Center\",\"Street (Rural\/Urban File)\":\"Piazza Center\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":131522.45,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"4204 BP\",\"ZIP code (Rural\/Urban File)\":\"4204 BP\",\"ZIP code 4 digitis (Rural\/Urban File)\":4204.0,\"thirdparty_total_duration\":631.0,\"thirdparty_visits\":9.0},{\"index\":1032,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":413000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":60145.43,\"City\":\"AALTEN\",\"City (Rural\/Urban File)\":\"AALTEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":309.0,\"Fulltime_visits\":5.0,\"House Number\":\"8\",\"House Number (Rural\/Urban File)\":\"8\",\"Influence Chocolate\":2.15,\"Influence Overall\":2.1,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":6487,\"Outlet surface\":1503.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4685,\"Partner Name\":\"Jumbo Leussink\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Leussink\",\"Petcare RSV\":29625.17,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"3m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Adm. De Ruyterstraat\",\"Street (Rural\/Urban File)\":\"Adm. De Ruyterstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":89770.6,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"7122 WJ\",\"ZIP code (Rural\/Urban File)\":\"7122 WJ\",\"ZIP code 4 digitis (Rural\/Urban File)\":7122.0,\"thirdparty_total_duration\":251.0,\"thirdparty_visits\":5.0},{\"index\":1047,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":325000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":69729.79,\"City\":\"HAAKSBERGEN\",\"City (Rural\/Urban File)\":\"HAAKSBERGEN\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":461.0,\"Fulltime_visits\":5.0,\"House Number\":\"12\",\"House Number (Rural\/Urban File)\":\"12\",\"Influence Chocolate\":2.1,\"Influence Overall\":2.1,\"Influence Petcare\":2.1,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":6520,\"Outlet surface\":1536.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4702,\"Partner Name\":\"Jumbo Leussink\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Leussink\",\"Petcare RSV\":29797.22,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Stationsstraat\",\"Street (Rural\/Urban File)\":\"Stationsstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":99527.01,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"7481 JA\",\"ZIP code (Rural\/Urban File)\":\"7481 JA\",\"ZIP code 4 digitis (Rural\/Urban File)\":7481.0,\"thirdparty_total_duration\":266.0,\"thirdparty_visits\":5.0},{\"index\":1049,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":63355.6,\"City\":\"ZWOLLE\",\"City (Rural\/Urban File)\":\"ZWOLLE\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":503.0,\"Fulltime_visits\":5.0,\"House Number\":\"20\",\"House Number (Rural\/Urban File)\":\"20\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.8,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":4810,\"Outlet surface\":2000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4704,\"Partner Name\":\"Jumbo Veemarkt\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Veemarkt\",\"Petcare RSV\":38940.11,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Veemarkt\",\"Street (Rural\/Urban File)\":\"Veemarkt\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":102295.71,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"8011 AH\",\"ZIP code (Rural\/Urban File)\":\"8011 AH\",\"ZIP code 4 digitis (Rural\/Urban File)\":8011.0,\"thirdparty_total_duration\":328.0,\"thirdparty_visits\":5.0},{\"index\":1062,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":275000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":76418.01,\"City\":\"TILBURG\",\"City (Rural\/Urban File)\":\"TILBURG\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":157.0,\"Fulltime_visits\":3.0,\"House Number\":\"74-B\",\"House Number (Rural\/Urban File)\":\"74-B\",\"Influence Chocolate\":2.05,\"Influence Overall\":2.4,\"Influence Petcare\":2.75,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":4905,\"Outlet surface\":1780.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4717,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":59921.36,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Broekhovenseweg\",\"Street (Rural\/Urban File)\":\"Broekhovenseweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":136339.37,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"5021 LG\",\"ZIP code (Rural\/Urban File)\":\"5021 LG\",\"ZIP code 4 digitis (Rural\/Urban File)\":5021.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":1067,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":600000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":73622.8,\"City\":\"SCHEVENINGEN\",\"City (Rural\/Urban File)\":\"SCHEVENINGEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":587.0,\"Fulltime_visits\":6.0,\"House Number\":\"7\",\"House Number (Rural\/Urban File)\":\"7\",\"Influence Chocolate\":1.8,\"Influence Overall\":1.55,\"Influence Petcare\":1.3,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4711,\"Outlet surface\":2075.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4722,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":85150.81,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Van Bergenstraat\",\"Street (Rural\/Urban File)\":\"Van Bergenstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":158773.61,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2583 CS\",\"ZIP code (Rural\/Urban File)\":\"2583 CS\",\"ZIP code 4 digitis (Rural\/Urban File)\":2583.0,\"thirdparty_total_duration\":228.0,\"thirdparty_visits\":4.0},{\"index\":1070,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":260000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":62633.51,\"City\":\"DEN HAAG\",\"City (Rural\/Urban File)\":\"DEN HAAG\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":557.0,\"Fulltime_visits\":5.0,\"House Number\":\"21\",\"House Number (Rural\/Urban File)\":\"21\",\"Influence Chocolate\":2.15,\"Influence Overall\":1.75,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4852,\"Outlet surface\":1632.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4725,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":67712.05,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"De Stede\",\"Street (Rural\/Urban File)\":\"De Stede\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":130345.56,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2543 BG\",\"ZIP code (Rural\/Urban File)\":\"2543 BG\",\"ZIP code 4 digitis (Rural\/Urban File)\":2543.0,\"thirdparty_total_duration\":94.0,\"thirdparty_visits\":1.0},{\"index\":1078,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":99989.58,\"City\":\"SEVENUM\",\"City (Rural\/Urban File)\":\"SEVENUM\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":520.0,\"Fulltime_visits\":5.0,\"House Number\":\"64\",\"House Number (Rural\/Urban File)\":\"64\",\"Influence Chocolate\":1.9,\"Influence Overall\":1.95,\"Influence Petcare\":2.0,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":6536,\"Outlet surface\":1836.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4733,\"Partner Name\":\"Jumbo Phicoop\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Phicoop\",\"Petcare RSV\":37746.27,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Horsterweg\",\"Street (Rural\/Urban File)\":\"Horsterweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":137735.85,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5975 NB\",\"ZIP code (Rural\/Urban File)\":\"5975 NB\",\"ZIP code 4 digitis (Rural\/Urban File)\":5975.0,\"thirdparty_total_duration\":713.0,\"thirdparty_visits\":4.0},{\"index\":1090,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":310000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":43430.19,\"City\":\"EINDHOVEN\",\"City (Rural\/Urban File)\":\"EINDHOVEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":287.0,\"Fulltime_visits\":3.0,\"House Number\":\"21\",\"House Number (Rural\/Urban File)\":\"21\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.45,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":4859,\"Outlet surface\":1740.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4745,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":32375.31,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Belgi\ëplein\",\"Street (Rural\/Urban File)\":\"Belgi\ëplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":75805.5,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"5628 XJ\",\"ZIP code (Rural\/Urban File)\":\"5628 XJ\",\"ZIP code 4 digitis (Rural\/Urban File)\":5628.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":1100,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":330000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":46499.83,\"City\":\"NOOTDORP\",\"City (Rural\/Urban File)\":\"NOOTDORP\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":582.0,\"Fulltime_visits\":6.0,\"House Number\":\"7\",\"House Number (Rural\/Urban File)\":\"7\",\"Influence Chocolate\":2.15,\"Influence Overall\":1.75,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":6570,\"Outlet surface\":1600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4755,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":43652.6,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Paradeplein\",\"Street (Rural\/Urban File)\":\"Paradeplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":90152.43,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2632 GG\",\"ZIP code (Rural\/Urban File)\":\"2632 GG\",\"ZIP code 4 digitis (Rural\/Urban File)\":2632.0,\"thirdparty_total_duration\":102.0,\"thirdparty_visits\":3.0},{\"index\":1106,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":63417.25,\"City\":\"BAARLE-NASSAU\",\"City (Rural\/Urban File)\":\"BAARLE-NASSAU\",\"Classification\":5.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":430.0,\"Fulltime_visits\":6.0,\"House Number\":\"15\",\"House Number (Rural\/Urban File)\":\"15\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3507,\"Outlet surface\":1593.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4761,\"Partner Name\":\"Jumbo de Bresser\",\"Partner Name (Rural\/Urban File)\":\"Jumbo de Bresser\",\"Petcare RSV\":55584.31,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"3m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"St. Annaplein\",\"Street (Rural\/Urban File)\":\"St. Annaplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":119001.56,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5111 CA\",\"ZIP code (Rural\/Urban File)\":\"5111 CA\",\"ZIP code 4 digitis (Rural\/Urban File)\":5111.0,\"thirdparty_total_duration\":202.0,\"thirdparty_visits\":6.0},{\"index\":1117,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":270000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":48629.61,\"City\":\"MAASTRICHT\",\"City (Rural\/Urban File)\":\"MAASTRICHT\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":713.0,\"Fulltime_visits\":7.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":1.9,\"Influence Overall\":1.95,\"Influence Petcare\":2.0,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":4875,\"Outlet surface\":1790.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4773,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":43842.32,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"7m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Franciscus Romanusweg\",\"Street (Rural\/Urban File)\":\"Franciscus Romanusweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":92471.93,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6221 AE\",\"ZIP code (Rural\/Urban File)\":\"6221 AE\",\"ZIP code 4 digitis (Rural\/Urban File)\":6221.0,\"thirdparty_total_duration\":424.0,\"thirdparty_visits\":6.0},{\"index\":1153,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":38644.88,\"City\":\"LELYSTAD\",\"City (Rural\/Urban File)\":\"LELYSTAD\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":917.0,\"Fulltime_visits\":10.0,\"House Number\":\"76\",\"House Number (Rural\/Urban File)\":\"76\",\"Influence Chocolate\":1.7,\"Influence Overall\":2.2,\"Influence Petcare\":2.7,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":4814,\"Outlet surface\":1794.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4811,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":29699.08,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Waagpassage\",\"Street (Rural\/Urban File)\":\"Waagpassage\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":68343.96,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"8232 DV\",\"ZIP code (Rural\/Urban File)\":\"8232 DV\",\"ZIP code 4 digitis (Rural\/Urban File)\":8232.0,\"thirdparty_total_duration\":534.0,\"thirdparty_visits\":6.0},{\"index\":1198,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":62593.54,\"City\":\"MAASTRICHT\",\"City (Rural\/Urban File)\":\"MAASTRICHT\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":609.0,\"Fulltime_visits\":6.0,\"House Number\":\"19\",\"House Number (Rural\/Urban File)\":\"19\",\"Influence Chocolate\":3.0,\"Influence Overall\":3.0,\"Influence Petcare\":3.0,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":3480,\"Outlet surface\":1812.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4859,\"Partner Name\":\"Jumbo Mannien\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Mannien\",\"Petcare RSV\":69308.24,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Brusselse Poort\",\"Street (Rural\/Urban File)\":\"Brusselse Poort\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":131901.78,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"6216 CE\",\"ZIP code (Rural\/Urban File)\":\"6216 CE\",\"ZIP code 4 digitis (Rural\/Urban File)\":6216.0,\"thirdparty_total_duration\":112.0,\"thirdparty_visits\":4.0},{\"index\":1216,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":507000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":106404.59,\"City\":\"DELFT\",\"City (Rural\/Urban File)\":\"DELFT\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":810.0,\"Fulltime_visits\":7.0,\"House Number\":\"135\",\"House Number (Rural\/Urban File)\":\"135\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.45,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3052,\"Outlet surface\":2100.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4878,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":48800.57,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Bastiaansplein\",\"Street (Rural\/Urban File)\":\"Bastiaansplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":155205.16,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2611 DC\",\"ZIP code (Rural\/Urban File)\":\"2611 DC\",\"ZIP code 4 digitis (Rural\/Urban File)\":2611.0,\"thirdparty_total_duration\":189.0,\"thirdparty_visits\":2.0},{\"index\":1226,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":53243.02,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":752.0,\"Fulltime_visits\":11.0,\"House Number\":\"52\",\"House Number (Rural\/Urban File)\":\"52\",\"Influence Chocolate\":2.15,\"Influence Overall\":2.5,\"Influence Petcare\":2.85,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":3054,\"Outlet surface\":1770.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4888,\"Partner Name\":\"Jumbo Amsterdam BSP\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Amsterdam BSP\",\"Petcare RSV\":57355.64,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Buikslotermeerplein\",\"Street (Rural\/Urban File)\":\"Buikslotermeerplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":110598.66,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"1025 EW\",\"ZIP code (Rural\/Urban File)\":\"1025 EW\",\"ZIP code 4 digitis (Rural\/Urban File)\":1025.0,\"thirdparty_total_duration\":319.0,\"thirdparty_visits\":4.0},{\"index\":1229,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":430000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":82756.23,\"City\":\"ALKMAAR\",\"City (Rural\/Urban File)\":\"ALKMAAR\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":637.0,\"Fulltime_visits\":8.0,\"House Number\":\"49\",\"House Number (Rural\/Urban File)\":\"49\",\"Influence Chocolate\":1.95,\"Influence Overall\":1.6,\"Influence Petcare\":1.25,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3047,\"Outlet surface\":1610.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4891,\"Partner Name\":\"Jumbo Alkmaar JN\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Alkmaar JN\",\"Petcare RSV\":87510.99,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Johanna Naberstraat\",\"Street (Rural\/Urban File)\":\"Johanna Naberstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":170267.22,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"1827 LB\",\"ZIP code (Rural\/Urban File)\":\"1827 LB\",\"ZIP code 4 digitis (Rural\/Urban File)\":1827.0,\"thirdparty_total_duration\":617.0,\"thirdparty_visits\":6.0},{\"index\":1230,\"2019 Freq. rating\":2.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":430000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":57720.94,\"City\":\"GRONINGEN\",\"City (Rural\/Urban File)\":\"GRONINGEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":67.0,\"Fulltime_visits\":1.0,\"House Number\":\"464\",\"House Number (Rural\/Urban File)\":\"464\",\"Influence Chocolate\":0.5,\"Influence Overall\":1.45,\"Influence Petcare\":2.4,\"Influence Segment\":\"High\",\"Influence on activation\":0.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":1184,\"Outlet surface\":2013.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4892,\"Partner Name\":\"Albert Heijn\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn\",\"Petcare RSV\":61658.72,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Siersteenlaan\",\"Street (Rural\/Urban File)\":\"Siersteenlaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":119379.66,\"V4+ invloed op activatie\":\"0\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"9743 ES\",\"ZIP code (Rural\/Urban File)\":\"9743 ES\",\"ZIP code 4 digitis (Rural\/Urban File)\":9743.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":1248,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":260000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":45133.25,\"City\":\"DELFT\",\"City (Rural\/Urban File)\":\"DELFT\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":411.0,\"Fulltime_visits\":6.0,\"House Number\":\"11\",\"House Number (Rural\/Urban File)\":\"11\",\"Influence Chocolate\":2.4,\"Influence Overall\":1.9,\"Influence Petcare\":1.4,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3051,\"Outlet surface\":1710.0,\"Overall Segment\":\"High-High\",\"Partner ID\":4910,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":36734.69,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Troelstralaan\",\"Street (Rural\/Urban File)\":\"Troelstralaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":81867.94,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2624 ET\",\"ZIP code (Rural\/Urban File)\":\"2624 ET\",\"ZIP code 4 digitis (Rural\/Urban File)\":2624.0,\"thirdparty_total_duration\":1135.0,\"thirdparty_visits\":4.0},{\"index\":1432,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":280000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":0.0,\"City\":\"BLERICK\",\"City (Rural\/Urban File)\":\"BLERICK\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":240.0,\"Fulltime_visits\":3.0,\"House Number\":\"40\",\"House Number (Rural\/Urban File)\":\"40\",\"Influence Chocolate\":2.25,\"Influence Overall\":2.15,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3188,\"Outlet surface\":1650.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6034,\"Partner Name\":\"Jumbo Blerick Wieenpassage\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Blerick Wieenpassage\",\"Petcare RSV\":0.0,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"No\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Wie\ënpassage\",\"Street (Rural\/Urban File)\":\"Wie\ënpassage\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":0.0,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"5921 GD\",\"ZIP code (Rural\/Urban File)\":\"5921 GD\",\"ZIP code 4 digitis (Rural\/Urban File)\":5921.0,\"thirdparty_total_duration\":711.0,\"thirdparty_visits\":10.0},{\"index\":1480,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":280000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":32833.68,\"City\":\"DRACHTEN\",\"City (Rural\/Urban File)\":\"DRACHTEN\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":495.0,\"Fulltime_visits\":8.0,\"House Number\":\"30\",\"House Number (Rural\/Urban File)\":\"30\",\"Influence Chocolate\":1.85,\"Influence Overall\":2.3,\"Influence Petcare\":2.75,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":3758,\"Outlet surface\":1519.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6092,\"Partner Name\":\"Jumbo Maripaan\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Maripaan\",\"Petcare RSV\":24590.29,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"No\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Eems\",\"Street (Rural\/Urban File)\":\"Eems\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":57423.97,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"9204 JX\",\"ZIP code (Rural\/Urban File)\":\"9204 JX\",\"ZIP code 4 digitis (Rural\/Urban File)\":9204.0,\"thirdparty_total_duration\":391.0,\"thirdparty_visits\":7.0},{\"index\":1490,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":390000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":58651.45,\"City\":\"STEENWIJK\",\"City (Rural\/Urban File)\":\"STEENWIJK\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":288.0,\"Fulltime_visits\":4.0,\"House Number\":\"61\",\"House Number (Rural\/Urban File)\":\"61\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.8,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3494,\"Outlet surface\":1667.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6104,\"Partner Name\":\"Jumbo Bert Vis\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Bert Vis\",\"Petcare RSV\":65978.05,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"6m\",\"Status\":\"Active visited\",\"Street\":\"Steenwijkerdiep\",\"Street (Rural\/Urban File)\":\"Steenwijkerdiep\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":124629.5,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"8331 LP\",\"ZIP code (Rural\/Urban File)\":\"8331 LP\",\"ZIP code 4 digitis (Rural\/Urban File)\":8331.0,\"thirdparty_total_duration\":438.0,\"thirdparty_visits\":7.0},{\"index\":1501,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":63572.37,\"City\":\"VEENENDAAL\",\"City (Rural\/Urban File)\":\"VEENENDAAL\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":690.0,\"Fulltime_visits\":6.0,\"House Number\":\"617\",\"House Number (Rural\/Urban File)\":\"617\",\"Influence Chocolate\":2.7,\"Influence Overall\":2.45,\"Influence Petcare\":2.2,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3613,\"Outlet surface\":1722.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6118,\"Partner Name\":\"Jumbo Huibers\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Huibers\",\"Petcare RSV\":39028.25,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"7m\",\"Status\":\"Active visited\",\"Street\":\"Prins Willem Alexanderpark\",\"Street (Rural\/Urban File)\":\"Prins Willem Alexanderpark\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":102600.62,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"3905 CT\",\"ZIP code (Rural\/Urban File)\":\"3905 CT\",\"ZIP code 4 digitis (Rural\/Urban File)\":3905.0,\"thirdparty_total_duration\":847.0,\"thirdparty_visits\":11.0},{\"index\":1507,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":4.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":310000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":45867.49,\"City\":\"ENSCHEDE\",\"City (Rural\/Urban File)\":\"ENSCHEDE\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":395.0,\"Fulltime_visits\":5.0,\"House Number\":\"21\",\"House Number (Rural\/Urban File)\":\"21\",\"Influence Chocolate\":1.7,\"Influence Overall\":1.45,\"Influence Petcare\":1.2,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3141,\"Outlet surface\":1991.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6125,\"Partner Name\":\"Jumbo Wesselerbrink\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Wesselerbrink\",\"Petcare RSV\":29911.22,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Wesseler Nering\",\"Street (Rural\/Urban File)\":\"Wesseler Nering\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":75778.71,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"7544 JB\",\"ZIP code (Rural\/Urban File)\":\"7544 JB\",\"ZIP code 4 digitis (Rural\/Urban File)\":7544.0,\"thirdparty_total_duration\":30.0,\"thirdparty_visits\":1.0},{\"index\":1515,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":37979.73,\"City\":\"BEEK LB\",\"City (Rural\/Urban File)\":\"BEEK LB\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":191.0,\"Fulltime_visits\":2.0,\"House Number\":\"170\",\"House Number (Rural\/Urban File)\":\"170\",\"Influence Chocolate\":1.65,\"Influence Overall\":1.8,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1517,\"Outlet surface\":3900.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6134,\"Partner Name\":\"Albert Heijn Beek\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Beek\",\"Petcare RSV\":44549.44,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Wethouder Sangersstraat\",\"Street (Rural\/Urban File)\":\"Wethouder Sangersstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":82529.17,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6191 NA\",\"ZIP code (Rural\/Urban File)\":\"6191 NA\",\"ZIP code 4 digitis (Rural\/Urban File)\":6191.0,\"thirdparty_total_duration\":91.0,\"thirdparty_visits\":1.0},{\"index\":1527,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":58042.79,\"City\":\"WASSENAAR\",\"City (Rural\/Urban File)\":\"WASSENAAR\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":712.0,\"Fulltime_visits\":7.0,\"House Number\":\"1\",\"House Number (Rural\/Urban File)\":\"1\",\"Influence Chocolate\":2.45,\"Influence Overall\":2.3,\"Influence Petcare\":2.15,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3548,\"Outlet surface\":1538.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6147,\"Partner Name\":\"Jumbo Blaauw\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Blaauw\",\"Petcare RSV\":46746.82,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Luifelbaan\",\"Street (Rural\/Urban File)\":\"Luifelbaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":104789.61,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"2242 KT\",\"ZIP code (Rural\/Urban File)\":\"2242 KT\",\"ZIP code 4 digitis (Rural\/Urban File)\":2242.0,\"thirdparty_total_duration\":231.0,\"thirdparty_visits\":6.0},{\"index\":1539,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":47485.48,\"City\":\"UITHOORN\",\"City (Rural\/Urban File)\":\"UITHOORN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":508.0,\"Fulltime_visits\":4.0,\"House Number\":\"60\",\"House Number (Rural\/Urban File)\":\"60\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3725,\"Outlet surface\":1500.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6160,\"Partner Name\":\"Jumbo Peter de Jong\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Peter de Jong\",\"Petcare RSV\":44439.09,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Zijdelwaardplein\",\"Street (Rural\/Urban File)\":\"Zijdelwaardplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":91924.57,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1422 DN\",\"ZIP code (Rural\/Urban File)\":\"1422 DN\",\"ZIP code 4 digitis (Rural\/Urban File)\":1422.0,\"thirdparty_total_duration\":158.0,\"thirdparty_visits\":3.0},{\"index\":1542,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":null,\"City\":\"STRAMPROY\",\"City (Rural\/Urban File)\":\"STRAMPROY\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":null,\"Fulltime_visits\":null,\"House Number\":\"3\",\"House Number (Rural\/Urban File)\":\"3\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":28560,\"Outlet surface\":1970.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6163,\"Partner Name\":\"Jumbo Rene Puts\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Rene Puts\",\"Petcare RSV\":null,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":null,\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"3m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Dr. Schaepmanstraat\",\"Street (Rural\/Urban File)\":\"Dr. Schaepmanstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":null,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"6039 CP\",\"ZIP code (Rural\/Urban File)\":\"6039 CP\",\"ZIP code 4 digitis (Rural\/Urban File)\":6039.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":1558,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":51040.16,\"City\":\"NIEUW VENNEP\",\"City (Rural\/Urban File)\":\"NIEUW VENNEP\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":356.0,\"Fulltime_visits\":4.0,\"House Number\":\"65\",\"House Number (Rural\/Urban File)\":\"65\",\"Influence Chocolate\":2.4,\"Influence Overall\":1.9,\"Influence Petcare\":1.4,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3650,\"Outlet surface\":1950.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6183,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":37206.44,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"De Symfonie\",\"Street (Rural\/Urban File)\":\"De Symfonie\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":88246.6,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2151 ME\",\"ZIP code (Rural\/Urban File)\":\"2151 ME\",\"ZIP code 4 digitis (Rural\/Urban File)\":2151.0,\"thirdparty_total_duration\":521.0,\"thirdparty_visits\":6.0},{\"index\":1566,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":52533.03,\"City\":\"LIENDEN\",\"City (Rural\/Urban File)\":\"LIENDEN\",\"Classification\":5.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":592.0,\"Fulltime_visits\":6.0,\"House Number\":\"16\",\"House Number (Rural\/Urban File)\":\"16\",\"Influence Chocolate\":2.15,\"Influence Overall\":1.75,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3171,\"Outlet surface\":1910.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6191,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":74778.94,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"6m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Verbrughweg\",\"Street (Rural\/Urban File)\":\"Verbrughweg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":127311.97,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"4033 GP\",\"ZIP code (Rural\/Urban File)\":\"4033 GP\",\"ZIP code 4 digitis (Rural\/Urban File)\":4033.0,\"thirdparty_total_duration\":282.0,\"thirdparty_visits\":5.0},{\"index\":1567,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":360000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":67399.27,\"City\":\"LICHTENVOORDE\",\"City (Rural\/Urban File)\":\"LICHTENVOORDE\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":358.0,\"Fulltime_visits\":4.0,\"House Number\":\"17\",\"House Number (Rural\/Urban File)\":\"17\",\"Influence Chocolate\":1.9,\"Influence Overall\":1.95,\"Influence Petcare\":2.0,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3475,\"Outlet surface\":1800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6192,\"Partner Name\":\"Jumbo Bennink\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Bennink\",\"Petcare RSV\":28208.9,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Van Heydenstraat\",\"Street (Rural\/Urban File)\":\"Van Heydenstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":95608.17,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"7131 CA\",\"ZIP code (Rural\/Urban File)\":\"7131 CA\",\"ZIP code 4 digitis (Rural\/Urban File)\":7131.0,\"thirdparty_total_duration\":423.0,\"thirdparty_visits\":7.0},{\"index\":1568,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":48975.15,\"City\":\"LEUSDEN\",\"City (Rural\/Urban File)\":\"LEUSDEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":624.0,\"Fulltime_visits\":6.0,\"House Number\":\"29\",\"House Number (Rural\/Urban File)\":\"29\",\"Influence Chocolate\":3.0,\"Influence Overall\":3.0,\"Influence Petcare\":3.0,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":3.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":3.0,\"Outlet Banner Code\":3696,\"Outlet surface\":1569.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6193,\"Partner Name\":\"Jumbo Wahle\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Wahle\",\"Petcare RSV\":29843.18,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"\‘t Plein\",\"Street (Rural\/Urban File)\":\"\‘t Plein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":78818.33,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"3\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"3\",\"ZIP code\":\"3831 CR\",\"ZIP code (Rural\/Urban File)\":\"3831 CR\",\"ZIP code 4 digitis (Rural\/Urban File)\":3831.0,\"thirdparty_total_duration\":1047.0,\"thirdparty_visits\":12.0},{\"index\":1570,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":41527.76,\"City\":\"LEIDERDORP\",\"City (Rural\/Urban File)\":\"LEIDERDORP\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":99.0,\"Fulltime_visits\":1.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":2.2,\"Influence Overall\":2.15,\"Influence Petcare\":2.1,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":4105,\"Outlet surface\":1506.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6195,\"Partner Name\":\"Albert Heijn Bun\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Bun\",\"Petcare RSV\":34049.58,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Laan Van Ouderzorg\",\"Street (Rural\/Urban File)\":\"Laan Van Ouderzorg\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":75577.34,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"2352 HT\",\"ZIP code (Rural\/Urban File)\":\"2352 HT\",\"ZIP code 4 digitis (Rural\/Urban File)\":2352.0,\"thirdparty_total_duration\":null,\"thirdparty_visits\":null},{\"index\":1586,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":84751.01,\"City\":\"HEESCH\",\"City (Rural\/Urban File)\":\"HEESCH\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":839.0,\"Fulltime_visits\":8.0,\"House Number\":\"8\",\"House Number (Rural\/Urban File)\":\"8\",\"Influence Chocolate\":1.9,\"Influence Overall\":1.6,\"Influence Petcare\":1.3,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3704,\"Outlet surface\":1636.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6216,\"Partner Name\":\"Jumbo Wiegmans\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Wiegmans\",\"Petcare RSV\":39139.09,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Schoonstraat\",\"Street (Rural\/Urban File)\":\"Schoonstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":123890.1,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"5384 AN\",\"ZIP code (Rural\/Urban File)\":\"5384 AN\",\"ZIP code 4 digitis (Rural\/Urban File)\":5384.0,\"thirdparty_total_duration\":1150.0,\"thirdparty_visits\":11.0},{\"index\":1590,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":275000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":54137.71,\"City\":\"GIETEN\",\"City (Rural\/Urban File)\":\"GIETEN\",\"Classification\":4.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":647.0,\"Fulltime_visits\":6.0,\"House Number\":\"37\",\"House Number (Rural\/Urban File)\":\"37\",\"Influence Chocolate\":2.15,\"Influence Overall\":2.1,\"Influence Petcare\":2.05,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3524,\"Outlet surface\":1610.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6225,\"Partner Name\":\"Jumbo Abbas\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Abbas\",\"Petcare RSV\":51061.86,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Stationsstraat\",\"Street (Rural\/Urban File)\":\"Stationsstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":105199.57,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9461 GR\",\"ZIP code (Rural\/Urban File)\":\"9461 GR\",\"ZIP code 4 digitis (Rural\/Urban File)\":9461.0,\"thirdparty_total_duration\":745.0,\"thirdparty_visits\":7.0},{\"index\":1599,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":400000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":62974.37,\"City\":\"DEVENTER\",\"City (Rural\/Urban File)\":\"DEVENTER\",\"Classification\":3.0,\"Classification RTM\":\"Rural\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":414.0,\"Fulltime_visits\":6.0,\"House Number\":\"2\",\"House Number (Rural\/Urban File)\":\"2\",\"Influence Chocolate\":2.4,\"Influence Overall\":1.9,\"Influence Petcare\":1.4,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3626,\"Outlet surface\":1600.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6237,\"Partner Name\":\"Jumbo Hans Kok\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Hans Kok\",\"Petcare RSV\":43240.51,\"Rural vs Urban\":\"Rural\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Flora\",\"Street (Rural\/Urban File)\":\"Flora\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":106214.88,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"7422 LL\",\"ZIP code (Rural\/Urban File)\":\"7422 LL\",\"ZIP code 4 digitis (Rural\/Urban File)\":7422.0,\"thirdparty_total_duration\":174.0,\"thirdparty_visits\":4.0},{\"index\":1608,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Franchise\",\"CSV of outlet\":360000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":53316.27,\"City\":\"BODEGRAVEN\",\"City (Rural\/Urban File)\":\"BODEGRAVEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":481.0,\"Fulltime_visits\":4.0,\"House Number\":\"15\",\"House Number (Rural\/Urban File)\":\"15\",\"Influence Chocolate\":2.15,\"Influence Overall\":1.75,\"Influence Petcare\":1.35,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":2.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":3633,\"Outlet surface\":1580.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6247,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":35699.66,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"5m\",\"Shelf meters Dog\":\"4m\",\"Status\":\"Active visited\",\"Street\":\"Raadhuisplein\",\"Street (Rural\/Urban File)\":\"Raadhuisplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":89015.93,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"2\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"2411 BD\",\"ZIP code (Rural\/Urban File)\":\"2411 BD\",\"ZIP code 4 digitis (Rural\/Urban File)\":2411.0,\"thirdparty_total_duration\":373.0,\"thirdparty_visits\":5.0},{\"index\":1617,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":64901.67,\"City\":\"ASSEN\",\"City (Rural\/Urban File)\":\"ASSEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":618.0,\"Fulltime_visits\":8.0,\"House Number\":\"259\",\"House Number (Rural\/Urban File)\":\"259\",\"Influence Chocolate\":1.3,\"Influence Overall\":1.6,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":0.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":3149,\"Outlet surface\":1527.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6258,\"Partner Name\":\"Jumbo\",\"Partner Name (Rural\/Urban File)\":\"Jumbo\",\"Petcare RSV\":57855.59,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"5m\",\"Status\":\"Active visited\",\"Street\":\"Nobellaan\",\"Street (Rural\/Urban File)\":\"Nobellaan\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":122757.26,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"0\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"9406 AJ\",\"ZIP code (Rural\/Urban File)\":\"9406 AJ\",\"ZIP code 4 digitis (Rural\/Urban File)\":9406.0,\"thirdparty_total_duration\":444.0,\"thirdparty_visits\":4.0},{\"index\":1640,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":280000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":60965.4,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":704.0,\"Fulltime_visits\":8.0,\"House Number\":\"526\",\"House Number (Rural\/Urban File)\":\"526\",\"Influence Chocolate\":2.6,\"Influence Overall\":2.0,\"Influence Petcare\":1.4,\"Influence Segment\":\"High\",\"Influence on activation\":3.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":3.0,\"Influence on shelf\":1.0,\"Outlet Banner Code\":1502,\"Outlet surface\":2300.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6288,\"Partner Name\":\"Albert Heijn Bijlmerplein\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Bijlmerplein\",\"Petcare RSV\":23618.99,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Bijlmerplein\",\"Street (Rural\/Urban File)\":\"Bijlmerplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":84584.39,\"V4+ invloed op activatie\":\"3\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"3\",\"V4+ invloed op schap\":\"1\",\"ZIP code\":\"1102 DP\",\"ZIP code (Rural\/Urban File)\":\"1102 DP\",\"ZIP code 4 digitis (Rural\/Urban File)\":1102.0,\"thirdparty_total_duration\":316.0,\"thirdparty_visits\":4.0},{\"index\":1673,\"2019 Freq. rating\":7.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":37211.25,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":567.0,\"Fulltime_visits\":8.0,\"House Number\":\"310\",\"House Number (Rural\/Urban File)\":\"310\",\"Influence Chocolate\":1.45,\"Influence Overall\":1.675,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1146,\"Outlet surface\":2300.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6627,\"Partner Name\":\"Albert Heijn Buiksloot\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Buiksloot\",\"Petcare RSV\":40931.93,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"8m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Buikslotermeerplein\",\"Street (Rural\/Urban File)\":\"Buikslotermeerplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":78143.18,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1025 GB\",\"ZIP code (Rural\/Urban File)\":\"1025 GB\",\"ZIP code 4 digitis (Rural\/Urban File)\":1025.0,\"thirdparty_total_duration\":488.0,\"thirdparty_visits\":5.0},{\"index\":1683,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":300000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":48333.25,\"City\":\"AMSTELVEEN\",\"City (Rural\/Urban File)\":\"AMSTELVEEN\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":528.0,\"Fulltime_visits\":7.0,\"House Number\":\"49\",\"House Number (Rural\/Urban File)\":\"49\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1011,\"Outlet surface\":1800.0,\"Overall Segment\":\"High-High\",\"Partner ID\":6937,\"Partner Name\":\"Albert Heijn Rembrandthof\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Rembrandthof\",\"Petcare RSV\":21945.8,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"2m\",\"Status\":\"Active visited\",\"Street\":\"Rembrandthof\",\"Street (Rural\/Urban File)\":\"Rembrandthof\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":70279.05,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1181 ZL\",\"ZIP code (Rural\/Urban File)\":\"1181 ZL\",\"ZIP code 4 digitis (Rural\/Urban File)\":1181.0,\"thirdparty_total_duration\":136.0,\"thirdparty_visits\":2.0},{\"index\":1692,\"2019 Freq. rating\":2.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Chain store\",\"CSV of outlet\":435000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":49399.96,\"City\":\"ALMERE-BUITEN\",\"City (Rural\/Urban File)\":\"ALMERE-BUITEN\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":856.0,\"Fulltime_visits\":11.0,\"House Number\":\"1\",\"House Number (Rural\/Urban File)\":\"1\",\"Influence Chocolate\":1.75,\"Influence Overall\":1.85,\"Influence Petcare\":1.95,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":1.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":1275,\"Outlet surface\":3000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":7392,\"Partner Name\":\"Albert Heijn Rio de Janeiroplein\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Rio de Janeiroplein\",\"Petcare RSV\":52360.12,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"9m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Rio de Janeiroplein\",\"Street (Rural\/Urban File)\":\"Rio de Janeiroplein\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":101760.08,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"1\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1334 HE\",\"ZIP code (Rural\/Urban File)\":\"1334 HE\",\"ZIP code 4 digitis (Rural\/Urban File)\":1334.0,\"thirdparty_total_duration\":397.0,\"thirdparty_visits\":6.0},{\"index\":1699,\"2019 Freq. rating\":2.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Albert Heijn\",\"Business Model\":\"Franchise\",\"CSV of outlet\":520000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":78241.47,\"City\":\"ALMERE-STAD\",\"City (Rural\/Urban File)\":\"ALMERE-STAD\",\"Classification\":2.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":206.0,\"Fulltime_visits\":3.0,\"House Number\":\"15\",\"House Number (Rural\/Urban File)\":\"15\",\"Influence Chocolate\":1.5,\"Influence Overall\":1.7,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":2.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":8591,\"Outlet surface\":2000.0,\"Overall Segment\":\"High-High\",\"Partner ID\":7730,\"Partner Name\":\"Albert Heijn Bun\",\"Partner Name (Rural\/Urban File)\":\"Albert Heijn Bun\",\"Petcare RSV\":62556.93,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"5m\",\"Shelf meters Choc\":\"6m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Watercipresstraat\",\"Street (Rural\/Urban File)\":\"Watercipresstraat\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":140798.4,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"2\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1326 CM\",\"ZIP code (Rural\/Urban File)\":\"1326 CM\",\"ZIP code 4 digitis (Rural\/Urban File)\":1326.0,\"thirdparty_total_duration\":122.0,\"thirdparty_visits\":1.0},{\"index\":1738,\"2019 Freq. rating\":4.0,\"2020 Freq. rating\":7.0,\"Banner\":\"Jumbo\",\"Business Model\":\"Chain store\",\"CSV of outlet\":350000.0,\"CSV of outlet Segment\":\"High\",\"Channel\":\"Retail\",\"Chocolate RSV\":51572.66,\"City\":\"AMSTERDAM\",\"City (Rural\/Urban File)\":\"AMSTERDAM\",\"Classification\":1.0,\"Classification RTM\":\"Urban\",\"Department\":\"Grocery & Petrol\",\"Fulltime_total_duration\":627.0,\"Fulltime_visits\":8.0,\"House Number\":\"223\",\"House Number (Rural\/Urban File)\":\"223\",\"Influence Chocolate\":1.4,\"Influence Overall\":1.65,\"Influence Petcare\":1.9,\"Influence Segment\":\"High\",\"Influence on activation\":2.0,\"Influence on checkout\":1.0,\"Influence on permanent siting\":0.0,\"Influence on shelf\":2.0,\"Outlet Banner Code\":4703,\"Outlet surface\":2400.0,\"Overall Segment\":\"High-High\",\"Partner ID\":28403,\"Partner Name\":\"Jumbo Foodmarkt\",\"Partner Name (Rural\/Urban File)\":\"Jumbo Foodmarkt\",\"Petcare RSV\":46942.43,\"Rural vs Urban\":\"Urban\",\"Sales Throughout Year\":\"Yes\",\"Segment\":\"Supermarket Large\",\"Segment (Based on Outlet Surface Area)\":\"Supermarket Large\",\"Shelf meters Cat\":\"4m\",\"Shelf meters Choc\":\"4m\",\"Shelf meters Dog\":\"3m\",\"Status\":\"Active visited\",\"Street\":\"Gedempt Hamerkanaal\",\"Street (Rural\/Urban File)\":\"Gedempt Hamerkanaal\",\"Sub Channel\":\"Retail Food\",\"Total RSV\":98515.09,\"V4+ invloed op activatie\":\"2\",\"V4+ invloed op kassa\":\"1\",\"V4+ invloed op permanente siting\":\"0\",\"V4+ invloed op schap\":\"2\",\"ZIP code\":\"1021 KP\",\"ZIP code (Rural\/Urban File)\":\"1021 KP\",\"ZIP code 4 digitis (Rural\/Urban File)\":1021.0,\"thirdparty_total_duration\":1021.0,\"thirdparty_visits\":3.0}]")
      let data = {
        "test_stores" : par,
        "compare_variables" : ['Outlet surface','CSV of outlet'],
        "banners": ['Albert Heijn','Jumbo'],
        "segments": ['High-High'],
        "store_segments" : ['Supermarket Large']
      }
      this.homeservice.Validatestore(data).subscribe((apiresponse: any) => {
                if (apiresponse.status == 'ok') {

                }
              })

     this.homeservice.storesummary(data).subscribe((apiresponse: any) => {
                if (apiresponse.status == 'ok') {
                  
                }
              })


     }


  CreateTest() {
    this.createtestshow = true;
    this.savenextshow = false;
    this.step1show = true;
  }

  NextStep() {
    console.log(this.TestName);
    if (this.TestName == undefined || this.TestName == '') {
      this.openSnackBar('Please Enter Testname', 'Close');
      return 0;
    }
    if (this.TypeTest == undefined) {
      this.openSnackBar('Please Select Type of Test', 'Close');
      return 0;
    }
    if (this.TargetVariable == undefined) {
      this.openSnackBar('Please Select Target Variable', 'Close');
      return 0;
    }
    if (this.Banner == undefined) {
      this.openSnackBar('Please Select Banner', 'Close');
      return 0;
    }
    if (this.Segment == undefined) {
      this.openSnackBar('Please Select Segment', 'Close');
      return 0;
    }
    if (this.Territory == undefined) {
      this.openSnackBar('Please Select Territory', 'Close');
      return 0;
    }
    if (this.StoreGrid == undefined) {
      this.openSnackBar('Please Select Store Grid', 'Close');
      return 0;
    }
    if (this.Category == undefined) {
      this.openSnackBar('Please Select Category', 'Close');
      return 0;
    }
    this.nextstepshow = true;
    this.savenextshow = false;
    this.saveandnextshow = false;
  }

  TestParameter() {
    this.openSnackBar('Test Parameter Stored Successfully', 'Close');
  }

  ResetTestParameter() {
    this.ConfLevel = [];
    this.NoofError = [];
    this.NoofTestStore = [];
    this.PreTestStart = [];
    this.PreTestEnd = [];
    this.TestStart = [];
    this.TestEnd = [];
  }

  SaveContinue() {
    if (this.ConfLevel == undefined || this.ConfLevel == '') {
      this.openSnackBar('Please Enter Confidence Level', 'Close');
      return 0;
    }
    if (this.NoofError == undefined || this.NoofError == '') {
      this.openSnackBar('Please No of Error', 'Close');
      return 0;
    }
    if (this.NoofTestStore == undefined || this.NoofTestStore == '') {
      this.openSnackBar('Please No of Test Stores', 'Close');
      return 0;
    }
    if (this.NoofTestStore == undefined) {
      this.openSnackBar('Please No of Test Stores', 'Close');
      return 0;
    }
    if (this.TestStart == undefined) {
      this.openSnackBar('Please Select Start Date', 'Close');
      return 0;
    }
    if (this.TestEnd == undefined) {
      this.openSnackBar('Please Select Start Date', 'Close');
      return 0;
    }
    this.savenextshow = false;
    this.savecontshow = true;
    this.saveandnextshow = true;
    this.nextstepshow = false;
    this.step1show = false;
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
    this.createtestshow = false;
    this.step1show = false;
    this.savenextshow = true;
  }

  Previous() {
    this.nextstepshow = false;
    this.createtestshow = true;
    this.step1show = true;
    this.savecontshow = false;
    this.bradhide = true;
    this.saveandnextshow = false;
  }

  ConfirmValidate() {
    this.openSnackBar('Test Store Selected Successfully', 'Close');
    //   return 0;
  }

  SavePlanning() {
    console.log(this.TestName);
    this.openSnackBar('Test Planning Saved Successfully', 'Close');
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
    this.get_current_index = this.wizard.currentStepIndex;
    if (this.get_current_index == 0) {
      this.showcnt1 = false;
      this.showcnt2 = true;
    } else {
      this.showcnt1 = true;
      this.showcnt2 = false;
    }
  }

  showcontrolstore(value: any) {
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
