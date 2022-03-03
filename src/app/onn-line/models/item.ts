
export class Item {
    RowId: string;
    LinkId: string;
    LinkDescription: string;
    LinkStatus: string;
    Level: string;
    SubToLinkId: string;
    Children: Item[];

    constructor(options: {
        RowId: string;
        LinkId: string;
        LinkDescription: string;
        LinkStatus: string;
        Level: string;
        SubToLinkId: string;
        Children?: Item[];
    }) {
        this.RowId = options.RowId;
        this.LinkId = options.LinkId;
        this.LinkDescription = options.LinkDescription;
        this.LinkStatus = options.LinkStatus;
        this.Level = options.Level;
        this.SubToLinkId = options.SubToLinkId;
        this.Children = options.Children || [];
    }
}