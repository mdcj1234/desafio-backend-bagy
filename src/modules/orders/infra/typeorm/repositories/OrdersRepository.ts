import { getRepository, Repository } from 'typeorm';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IOrdersRepository from '@modules/orders/infra/repository/IOrdersRepository';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  async save(order: Order): Promise<Order> {
    return this.ormRepository.save(order);
  }

  public async create({
    customer,
    products,
    installments,
    status,
  }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      products,
      installments,
      status,
    });

    await this.ormRepository.save(order);

    return order;
  }

  async delete(id: string): Promise<boolean> {
    await this.ormRepository.delete(id);

    return true;
  }

  async list(): Promise<Order[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);

    return order;
  }
}

export default OrdersRepository;
