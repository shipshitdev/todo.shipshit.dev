import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  projectId?: string;

  @Prop()
  dueDate?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ required: true, default: 'medium', enum: ['low', 'medium', 'high', 'urgent'] })
  priority: string;

  @Prop({ type: [String], default: [] })
  labels?: string[];

  @Prop()
  goalId?: string;

  @Prop()
  milestoneId?: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Transform _id to id in JSON output
TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

