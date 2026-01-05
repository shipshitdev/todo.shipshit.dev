import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const maxOrder = await this.taskModel
      .findOne({ userId, projectId: createTaskDto.projectId || null })
      .sort({ order: -1 })
      .exec();

    const task = new this.taskModel({
      ...createTaskDto,
      userId,
      order: maxOrder ? maxOrder.order + 1 : 0,
      priority: createTaskDto.priority || 'medium',
    });

    return task.save();
  }

  async findAll(
    userId: string,
    projectId?: string,
    completed?: boolean,
    dueDate?: string,
  ): Promise<Task[]> {
    const query: any = { userId };

    if (projectId) {
      query.projectId = projectId;
    }

    if (completed !== undefined) {
      if (completed) {
        query.completedAt = { $ne: null };
      } else {
        query.completedAt = null;
      }
    }

    if (dueDate) {
      const date = new Date(dueDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    return this.taskModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel
      .deleteOne({ _id: id, userId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async bulkComplete(ids: string[], userId: string): Promise<void> {
    await this.taskModel.updateMany(
      { _id: { $in: ids }, userId },
      { completedAt: new Date() },
    );
  }

  async bulkDelete(ids: string[], userId: string): Promise<void> {
    await this.taskModel.deleteMany({ _id: { $in: ids }, userId });
  }
}

