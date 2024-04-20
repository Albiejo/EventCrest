import { Model, Document } from "mongoose";

abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(conditions: any): Promise<T | null> {
    return this.model.findOne(conditions);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  
  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email });
  }
  
  async update(id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async find(conditions: any): Promise<T[]> {
    return this.model.find(conditions);
  }
}

export default BaseRepository;
