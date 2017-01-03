export interface INewRoom {
    name: string;
}

export interface IRoom extends INewRoom {
    active: boolean;
    archived: boolean;
    id: number;
    last_active: string;
    token: string;
    owning: boolean;
}
