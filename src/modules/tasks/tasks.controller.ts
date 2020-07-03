import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dtos/create-task.dto';


@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    getAllTasks(): Task[] {
        return this.taskService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Post()
    createTask(@Body() creatTaskDto: CreateTaskDto): Task{
        return this.taskService.createTask(creatTaskDto);
    }
}
