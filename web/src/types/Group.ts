export type Group = {
    id: number;
    status: string;
    GName: string;
    GPass: string;
    Users: number;
    leader: number;
    members: Member[];
    stage: GroupJobStep[];
    ScriptCreated: boolean;
};
