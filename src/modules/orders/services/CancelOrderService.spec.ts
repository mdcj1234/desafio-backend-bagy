import SystemError from '@global/errors/SystemError';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import FakeProductsRepository from '@modules/products/infra/repository/fakes/FakeProductsRepository';
import FakeOrdersRepository from '../infra/repository/fakes/FakeOrdersRepository';
import CancelOrderService from './CancelOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeProductsRepository: FakeProductsRepository;
let cancelOrderService: CancelOrderService;

describe('Update Order Status', () => {
  beforeEach(async () => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeProductsRepository = new FakeProductsRepository();

    cancelOrderService = new CancelOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
    );
  });

  it('should be able to cancel an order', async () => {
    const product = await fakeProductsRepository.create({
      name: 'test',
      description: 'test description',
      image_url: 'test_url',
      price: 1,
      stock: 1,
      weight: 1,
    });

    const order = await fakeOrdersRepository.create({
      customer: new Customer(),
      installments: 1,
      status: 'requested',
      products: [
        {
          product_id: product.id,
          price: 1,
          quantity: 1,
        },
      ],
    });

    const canceledOrder = await cancelOrderService.execute(order.id);
    const updatedProduct = await fakeProductsRepository.findById(product.id);

    expect(canceledOrder.status).toBe('canceled');
    expect(updatedProduct?.stock).toBe(2);
  });

  it('should not be able to cancel an order without status beeing requested', async () => {
    const order = await fakeOrdersRepository.create({
      customer: new Customer(),
      installments: 1,
      status: 'delivered',
      products: [
        {
          product_id: 'product-id',
          price: 1,
          quantity: 1,
        },
      ],
    });

    await expect(cancelOrderService.execute(order.id)).rejects.toBeInstanceOf(
      SystemError,
    );
  });

  it('should not be able to update order status with invalid order', async () => {
    await expect(cancelOrderService.execute('fake-id')).rejects.toBeInstanceOf(
      SystemError,
    );
  });
});
