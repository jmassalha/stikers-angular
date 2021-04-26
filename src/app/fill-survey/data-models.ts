export class Survey{
    constructor( 
        public FormID: string,
        public CaseNumber: string,
        public nurseInCharge: string,
        public NurseInChargeID: string,
        public Signature: string,
        public FormAnswers: Answer[],
        public FormAnsweredTable: Table[],
        public FormTable: Table[]
        ){}
}

export class Table{
    constructor( 
        public Row_ID: string,
        public TableText: string,
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
        public ColType: string,
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

export class Question{
    constructor( 
        public QuestionID: number,
        public QuestionType: string,
        public QuestionValue: string,
        public QuestionOptions: Option[],
        public QuestionIsRequired: boolean,
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
        public PinQuestion: string,
        ){}
}

export class Option{
    constructor(
        public OptionID: number,
        public OptionValue: string,
    ){}
}
  