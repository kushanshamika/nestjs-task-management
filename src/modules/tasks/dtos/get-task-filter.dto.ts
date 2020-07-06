import { TaskStatus } from "../enums/task-status.enum";

export class GetTaskFilterDto {
    status: TaskStatus;
    search: string;
}