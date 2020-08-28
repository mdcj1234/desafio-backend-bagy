import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import CancelOrderService from '@modules/orders/services/CancelOrderService';
import UpdateOrderStatusService from '@modules/orders/services/UpdateOrderStatusService';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

export default {
  Order: {
    totalPrice: order => {
      const { products } = order;

      const total = products
        .map(product => {
          return product.quantity * product.price;
        })
        .reduce((acc, value) => {
          return acc + value;
        }, 0);

      return total;
    },
    installmentValue: order => {
      const { products, installments } = order;

      const total = products
        .map(product => {
          return product.quantity * product.price;
        })
        .reduce((acc, value) => {
          return acc + value;
        }, 0);

      return total / installments;
    },
  },
  Query: {
    orders: () => {
      const ordersRepository = new OrdersRepository();
      return ordersRepository.list();
    },
    order: (_, { id }) => {
      const ordersRepository = new OrdersRepository();
      return ordersRepository.findById(id);
    },
  },
  Mutation: {
    createOrder: (_, { data }) => {
      const createOrderService = container.resolve(CreateOrderService);
      return createOrderService.execute(data);
    },
    updateOrderStatus: (_, { id }) => {
      const updateOrderStatusService = container.resolve(
        UpdateOrderStatusService,
      );
      return updateOrderStatusService.execute(id);
    },
    cancelOrder: (_, { id }) => {
      const cancelOrderService = container.resolve(CancelOrderService);
      return cancelOrderService.execute(id);
    },
  },
};
