import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './shared/repositories/task.repository';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';
import { TaskStatus } from './enums/task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TaskService', () => {
    let taskService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        taskService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
            const result = await taskService.getTasks(filters);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue'); 
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
            taskRepository.findOne.mockResolvedValue({title: 'Test task', description: 'Test desc'});

            const result = await taskService.getTaskById(1);
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(taskService.getTaskById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.create and returns the value', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = {title: 'Test Title', description: 'Test Description'}
            const result = await taskService.createTask(createTaskDto); 
            expect(taskRepository.createTask) .toHaveBeenCalledWith(createTaskDto);
            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete task', async () => {
            taskRepository.delete.mockResolvedValue({ affected:1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await taskService.deleteTaskById(1);
            expect(taskRepository.delete).toHaveBeenCalledWith(1)
        });

        it('throws as errors as task could not be found', async () => {
            taskRepository.delete.mockResolvedValue({ affected:0 });
            expect(taskService.deleteTaskById(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('update a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);

            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(taskService.getTaskById).not.toBeCalled();
            expect(save).not.toBeCalled();
            const result = await taskService.updateTaskStatus(1, TaskStatus.DONE);
            expect(taskService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});