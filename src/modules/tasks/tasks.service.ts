import { Injectable, Get } from '@nestjs/common';
import { Task } from './models/task.model';
import { TaskStatus } from './enums/task-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto){
        const { status, search} = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search){
            tasks = tasks.filter(task =>
                task.title.includes(search) || 
                task.description.includes(search),
            );
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task =  this.tasks.find(task => task.id === id);
        task.status = status;
        return task;
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
