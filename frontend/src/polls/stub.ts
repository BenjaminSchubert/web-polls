export type Room = {
    active: boolean;
    archived: boolean;
    id: number;
    last_active: string;
    name: string;
    owning: boolean;
};


export type Poll = {
    active: boolean;
    id: number;
    last_active: string;
    name: string;
    owning: boolean;
}
