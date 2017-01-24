export interface INewChoice {
    text: string;
}

export interface IChoice extends INewChoice {
    id: number;
}

export interface INewQuestion {
    choices: INewChoice[];
    title: string;
    type: string;
    poll_id: number;
    name: string;
}

export interface IQuestion extends INewQuestion {
    choices: IChoice[];
    is_open: boolean;
    id: number;
}
