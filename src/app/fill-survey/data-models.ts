export class Survey{
    constructor( 
        public FormID: string,
        public CaseNumber: string,
        public nurseInCharge: string,
        public Signature: string,
        public FormAnswers: Answer[]
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
  