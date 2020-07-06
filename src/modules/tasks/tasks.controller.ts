import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';


@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto);
        }else{
            return this.taskService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string, 
        @Body('status') status: TaskStatus
    ): Task {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Post()
    createTask(@Body() creatTaskDto: CreateTaskDto): Task{
        return this.taskService.createTask(creatTaskDto);
    }
}
