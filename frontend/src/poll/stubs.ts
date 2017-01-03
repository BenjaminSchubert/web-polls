export interface INewPoll {
    name: string;
}

export interface IPoll extends INewPoll {
    active: boolean;
    id: number;
    last_active: string;
    owning: boolean;
}
