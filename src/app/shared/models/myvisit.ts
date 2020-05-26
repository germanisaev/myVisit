export class myVisit {
    QueueId: number;
    QueueNumber: string;
    FullName: string;
    QueueDate: string;
    QueueStatus: number;
}

export enum myStatus {
    Waiting = 0,
    InService = 1,
    Complete = 2
}
