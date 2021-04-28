export class Survey{
    constructor( 
        public FormID: string,
        public FormName: string,
        public FormOpenText: string,
        public TableForm: string,
        public FormDepartment: string,
        public isCaseNumber: string,
        public UserDepart: string,
        public GeneralForm: string,
        public FormDepartmentID: string,
        public FormCreatorName: string,
        public FormQuestions: Question[],
        public FormTable: Table[],
        ){}
}

export class Question{
    constructor( 
        public QuestionID: string,
        public QuestionType: string,
        public QuestionValue: string,
        public priority: string,
        public QuestionIsRequired: boolean,
        ){}
}
export class Table{
    constructor( 
        public Row_ID: string,
        public TableText: string,
        public TablePriority: string,
        public ColsType: string,
        public ColsSplitNumber: string,
        public TableStatus: string,
        public colsGroup: colsGroup[],
        public rowsGroup: rowsGroup[],
        ){}
}

export class colsGroup{
    constructor( 
        public Row_ID: string,
        public colsText: string,
        public checkBoxV: string,
        public colStatus: string,
        ){}
}
export class rowsGroup{
    constructor( 
        public Row_ID: string,
        public rowsText: string,
        public rowStatus: string,
        ){}
}
export class Answer{
    constructor( 
        public AnswerID: number,
        public AnswerValue: string,
        public questionID: string,
        public formID: string,
        public AnswerType: string,
        public questionValue: string,
        ){}
}

export class Option{
    constructor(
        public OptionID: number,
        public OptionValue: string,
    ){}
}
  