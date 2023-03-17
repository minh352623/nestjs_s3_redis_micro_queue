import { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export class BaseRepository<Schema extends Document> {
  constructor(private readonly model: Model<Schema>) {}

  async create(doc: any): Promise<any> {
    const createdEntity = new this.model(doc);
    return await createdEntity.save();
  }

  async findById(id: string, option?: QueryOptions): Promise<Schema> {
    return this.model.findById(id, option);
  }

  async findByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<Schema> {
    return this.model.findOne(filter, field, option);
  }

  async getByCondition(
    filter: any,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<Schema[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  async findAll(): Promise<Schema[]> {
    return this.model.find();
  }

  async aggregate(option: any) {
    return this.model.aggregate(option);
  }

  async populate(result: Schema[], option: any) {
    return await this.model.populate(result, option);
  }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<Schema>);
  }

  async deleteMany(id: string[]) {
    return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<Schema>);
  }

  async deleteByCondition(filter: any) {
    return this.model.deleteMany(filter);
  }

  async findByConditionAndUpdate(filter: any, update: any) {
    return this.model.findOneAndUpdate(filter as FilterQuery<Schema>, update);
  }

  async updateMany(
    filter: any,
    update: any,
    option?: any | null,
    callback?: any | null,
  ) {
    return this.model.updateMany(filter, update, option, callback);
  }

  async findByIdAndUpdate(id: string, update: any) {
    return this.model.findByIdAndUpdate(id, update);
  }
}
