import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import IOrdersRepository from '@modules/orders/infra/repository/IOrdersRepository';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';

import Order from '../infra/typeorm/entities/Order';

@injectable()
class UpdateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new SystemError('Order not found.');
    }

    if (order.status !== 'requested') {
      throw new SystemError("Order must be with status 'requested'");
    }

    order.status = 'canceled';

    await this.ordersRepository.save(order);

    const updateProducts = order.products.map(product => {
      return {
        id: product.product_id,
        quantity: product.quantity * -1,
      };
    });

    await this.productsRepository.updateStock(updateProducts);

    return order;
  }
}

export default UpdateOrderService;
