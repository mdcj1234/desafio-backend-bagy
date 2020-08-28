import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IOrdersRepository from '@modules/orders/infra/repository/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

@injectable()
class UpdateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new SystemError('Order not found.');
    }

    if (order.status !== 'requested') {
      throw new SystemError("Order must be with status 'request'");
    }

    order.status = 'delivered';

    await this.ordersRepository.save(order);

    return order;
  }
}

export default UpdateOrderService;
