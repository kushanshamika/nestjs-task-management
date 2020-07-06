import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../enums/task-status.enum";

export class TaskValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any){
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException;
        }

        return value;
    }

    private isStatusValid(status: any){
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}