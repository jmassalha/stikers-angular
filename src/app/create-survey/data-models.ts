export class Survey{
    constructor( 
        public FormID: number,
        public FormName: string,
        public FormQuestions: Question[]
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

export class Option{
    constructor(
        public OptionID: number,
        public OptionValue: string,
    ){}
}
  