import { Injectable, Get } from '@nestjs/common';
import { Task } from './models/task.model';
import { TaskStatus } from './enums/task-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description} = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task); 
        return task;
    }
}
