import { v4 as uuid } from 'uuid';

import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import IOrdersRepository from '@modules/orders/infra/repository/IOrdersRepository';
import Order from '@modules/orders/infra/typeorm/entities/Order';

class OrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<Order> {
    const findIndex = this.orders.findIndex(
      findOrder => findOrder.id === order.id,
    );

    this.orders[findIndex] = order;

    return order;
  }

  public async create(orderData: ICreateOrderDTO): Promise<Order> {
    const order = new Order();

    Object.assign(order, { id: uuid(), ...orderData });

    this.orders.push(order);

    return order;
  }

  async delete(id: string): Promise<boolean> {
    const findIndex = this.orders.findIndex(findOrder => findOrder.id === id);

    this.orders = this.orders.splice(findIndex, 1);

    return true;
  }

  async list(): Promise<Order[]> {
    return this.orders;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const findOrder = this.orders.find(order => order.id === id);
    return findOrder;
  }
}

export default OrdersRepository;
