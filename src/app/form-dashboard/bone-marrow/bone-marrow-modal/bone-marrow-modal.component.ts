import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BoneMarrowForm, PatientDetails } from '../../tumor-board/Tumor-data';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bone-marrow-modal',
  templateUrl: './bone-marrow-modal.component.html',
  styleUrls: ['./bone-marrow-modal.component.css']
})
export class BoneMarrowModalComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = "start";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";
  formControl = new FormControl(['']);
  users = [];
  doctors = [];
  filteredDoctors: Observable<string[]>;
  @ViewChild('doctorsInput') doctorsInput: ElementRef<HTMLInputElement>;
  employees = [];
  filteredOptions1: Observable<string[]>;
  docfilter = new FormControl();
  UserName = localStorage.getItem("loginUserName");
  imagesList: any[] = [];
  RecievingTypeList = ['היפרצלולרי', 'נורמוצלולרי', 'היפוצלולרי']

  constructor(
    public dialog: MatDialogRef<BoneMarrowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public DataDialog: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.filteredOptions1 = this.docfilter.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter1(value))
      );
  }

  selectable = true;
  removable = true;
  patientGroup: FormGroup;
  fullForm: FormGroup;
  all_doctors_filter = [];
  pipe = new DatePipe('en-US');
  myDate = new Date();

  ngOnInit(): void {
    let patient: PatientDetails;
    let form: BoneMarrowForm;
    this.getEmployeesList();
    if (this.DataDialog.PatientDetails == undefined) {
      // edit
      this.editFormFunc(this.DataDialog.data);
    } else {
      // new
      patient = this.DataDialog.PatientDetails;
      form = this.DataDialog.PatientDetails;
      this.patientGroup = this.fb.group({
        RowID: patient.RowID,
        Passport: patient.Passport,
        FirstName: patient.FirstName,
        LastName: patient.LastName,
        PhoneNumber: patient.PhoneNumber,
        CaseNumber: patient.CaseNumber,
        Address: patient.Address,
        DOB: patient.DOB,
      });

      this.fullForm = this.fb.group({
        Row_ID: form.Row_ID,
        DateOfForm: this.pipe.transform(this.myDate, 'yyyy-MM-dd'),
        TimeOfForm: this.pipe.transform(this.myDate, 'HH:mm'),
        ReceiveDate: new FormControl('', null),
        RecievingType: new FormControl('', null),
        RedRow: new FormControl('', null),
        WhiteRow: new FormControl('', null),
        Eosinophils: new FormControl('', null),
        Lymphocytes: new FormControl('', null),
        PlasmaCells: new FormControl('', null),
        ImagesList: this.fb.array([]),
        Megakaryocytes: new FormControl('', null),
        IronPainting: new FormControl('', null),
        Summary: new FormControl('', null),
        DoctorSign: new FormControl('', null),
        UpdateUser: new FormControl(this.UserName, null),
        Status: true
      });
    }
  }

  editFormFunc(data) {
    this.patientGroup = this.fb.group({
      RowID: data.PatientDetails.RowID,
      Passport: data.PatientDetails.Passport,
      FirstName: data.PatientDetails.FirstName,
      LastName: data.PatientDetails.LastName,
      PhoneNumber: data.PatientDetails.PhoneNumber,
      CaseNumber: data.PatientDetails.CaseNumber,
      Address: data.PatientDetails.Address,
      DOB: data.PatientDetails.DOB,
    });

    this.fullForm = this.fb.group({
      Row_ID: data.Row_ID,
      DateOfForm: this.pipe.transform(this.myDate, 'yyyy-MM-dd'),
      TimeOfForm: this.pipe.transform(this.myDate, 'HH:mm'),
      ReceiveDate: data.ReceiveDate,
      RecievingType: data.RecievingType,
      RedRow: data.RedRow,
      WhiteRow: data.WhiteRow,
      Eosinophils: data.Eosinophils,
      Lymphocytes: data.Lymphocytes,
      PlasmaCells: data.PlasmaCells,
      Megakaryocytes: data.Megakaryocytes,
      IronPainting: data.IronPainting,
      Summary: data.Summary,
      DoctorSign: data.DoctorSign,
      UpdateUser: this.UserName,
      Status: true
    });
    this.docfilter.setValue(data.DoctorSign);
  }


  getEmployeesList() {
    this.http
      .post(environment.url + "GetUsersForInquiries", {
      })
      .subscribe((Response) => {
        let all_users_filter = Response["d"];
        all_users_filter.forEach(element => {
          this.employees.push({
            firstname: element.firstname + " " + element.lastname
          });
        })
      });
  }

  closeModal() {
    this.dialog.close();
  }

  private _filter1(value: string): string[] {
    const filterValue1 = value;
    this.fullForm.controls['DoctorSign'].setValue(value);
    return this.employees.filter(option => option.firstname.includes(filterValue1));
  }

  // convert new image selection to base64 to display for the user
  selectFile(event: any) { //Angular 11, for stricter type
    // if (event.type == undefined) event['type'] = "image/jpeg";
    var mimeType = event.type;
    // if (mimeType.match(/image\/*/) == null) {
    //   this.msg = "Only images are supported";
    //   return;
    // }
    var reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = (_event) => {
      // this.msg = "";
      let imageObj = {
        Path: reader.result,
        Row_ID: null,
        Status: true
      }
      this.imagesList.push(imageObj);
    }
  }

  onFileSelect(imageFile) {
    if (imageFile.length > 0) {
      const file = imageFile[0];
      if (imageFile[0].lastModified != undefined) this.selectFile(file);
      const files = this.fullForm.get('ImagesList') as FormArray;
      files.push(new FormControl(file));
    }
  }

  // submitForm() {
  //   this.fullForm.controls['ReceiveDate'].setValue(this.pipe.transform(this.fullForm.controls['ReceiveDate'].value, 'yyyy-MM-dd'));
  //   //this.prepareFormData(this.fullForm);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'multipart/form-data',
  //     'Accept': 'application/json'
  //   });
  //   let options = { headers: headers };
  //   let formData: FormData = new FormData();
  //   // formData.append('dataForm', this.fullForm.value);
  //   // formData.append('dataPatient', this.patientGroup.value);
  //   let body = {
  //     'imageStream': formData
  //   }
  //   this.http
  //     .post(environment.url + "SaveBoneMarrowForm", body.imageStream, options)
  //     .subscribe((Response) => {
  //       if (Response["d"]) {
  //         this.openSnackBar("נשמר בהצלחה");
  //         // this.closeModal();
  //       } else {
  //         this.openSnackBar("משהו השתבש, לא נשמר");
  //       }
  //     });
  // }
  
  submitForm() {
    this.fullForm.controls['ReceiveDate'].setValue(this.pipe.transform(this.fullForm.controls['ReceiveDate'].value, 'yyyy-MM-dd'));
    this.http
      .post(environment.url + "SaveBoneMarrowForm", {
        _fullForm: this.fullForm.value,
        _patientDetails: this.patientGroup.value
      })
      .subscribe((Response) => {
        if (Response["d"]) {
          this.openSnackBar("נשמר בהצלחה");
          // this.closeModal();
        } else {
          this.openSnackBar("משהו השתבש, לא נשמר");
        }
      });
  }

  prepareFormData(formGroupData) {
    var formData = new FormData();
    let editimagecount = 0;
    let images = formGroupData.controls['ImagesList'].value;
    for (const key in formGroupData.controls) {
      formData.append(key, formGroupData.controls[key].value);
    }
    let newImageCounter = 0;
    for (let i = 0; i < images.length; i++) {
      // if new image
      if (images[i].Row_ID == undefined) {
        formData = this.newImageInsert(formData, newImageCounter, images[i]);
        newImageCounter++;
      }
      // if update image
      else if (images[i].Row_ID != undefined && images[i].Status != undefined) {
        formData.append(`image${i}`, images[i].Row_ID + ',' + images[i].Status);
        editimagecount++;
      }
    }

    // Add the image to update count to the FormData object
    formData.append('editimagecount', editimagecount.toString());
    return formData;
  }

  newImageInsert(formData, counter, image) {
    formData.append(`newimage${counter}`, image);
    return formData;
  }

  openSnackBar(message) {
    this._snackBar.open(message, "X", {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


}
