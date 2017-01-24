export interface INewPoll {
    description: string;
    name: string;
    room_id: number;
}

export interface IPoll extends INewPoll {
    id: number;
    is_open: boolean;
    visible: boolean;
}
