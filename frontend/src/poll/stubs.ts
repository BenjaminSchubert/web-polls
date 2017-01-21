export interface INewPoll {
    description: string;
    name: string;
    room_id: number;
}

export interface IPoll extends INewPoll {
    active: boolean;
    id: number;
    last_active: string;
    visible: boolean;
}
