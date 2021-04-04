export class Survey{
    constructor( 
        public FormID: string,
        public FormName: string,
        public FormDepartment: string,
        public isCaseNumber: string,
        public GeneralForm: string,
        public FormDepartmentID: string,
        public FormCreatorName: string,
        public FormQuestions: Question[]
        ){}
}

export class Question{
    constructor( 
        public QuestionID: string,
        public QuestionType: string,
        public QuestionValue: string,
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
        ){}
}

export class Option{
    constructor(
        public OptionID: number,
        public OptionValue: string,
    ){}
}
  