export interface INewPoll {
    description: string;
    name: string;
}

export interface IPoll extends INewPoll {
    active: boolean;
    id: number;
    last_active: string;
    room_id: number;
}
