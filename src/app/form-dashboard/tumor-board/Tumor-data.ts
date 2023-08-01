export interface TumorBoardDoctors {
  RowID: string;
  DateOfForm: string;
  TimeOfForm: string;
  DoctorEmployeeIDFK: string;
  FormIDFK: string;
  Status: string;
}

export interface TumorBoardForm {
  RowID: string;
  DateOfForm: string;
  TimeOfForm: string;
  OutSourceDoctors: string;
  ContentData: string;
  Status: string;
}

export interface BoneMarrowForm {
  Row_ID: string;
  DateOfForm: string;
  TimeOfForm: string;
  OutSourceDoctors: string;
  ContentData: string;
  Status: string;
}

export interface PatientDetails {
  RowID: string;
  FirstName: string;
  LastName: string;
  Passport: string;
  PhoneNumber: string;
  CaseNumber: string;
  Address: string;
  DOB: string;
}