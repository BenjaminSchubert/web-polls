export interface INewChoice {
    text: string;
}


export interface INewQuestion {
    choices: INewChoice[];
    title: string;
    type: string;
    poll_id: number;
    name: string;
}

export interface IQuestion extends INewQuestion {
    is_open: boolean;
    id: number;
}
