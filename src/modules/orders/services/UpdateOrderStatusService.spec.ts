import SystemError from '@global/errors/SystemError';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import FakeOrdersRepository from '../infra/repository/fakes/FakeOrdersRepository';
import UpdateOrderStatusService from './UpdateOrderStatusService';

let fakeOrdersRepository: FakeOrdersRepository;
let updateOrderStatusService: UpdateOrderStatusService;

describe('Update Order Status', () => {
  beforeEach(async () => {
    fakeOrdersRepository = new FakeOrdersRepository();

    updateOrderStatusService = new UpdateOrderStatusService(
      fakeOrdersRepository,
    );
  });

  it('should be able to update order status', async () => {
    const order = await fakeOrdersRepository.create({
      customer: new Customer(),
      installments: 1,
      status: 'requested',
      products: [
        {
          product_id: 'product-id',
          price: 1,
          quantity: 1,
        },
      ],
    });

    const updatedOrder = await updateOrderStatusService.execute(order.id);

    expect(updatedOrder.status).toBe('delivered');
  });

  it('should not be able to update order status without status beeing requested', async () => {
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

    await expect(
      updateOrderStatusService.execute(order.id),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to update order status with invalid order', async () => {
    await expect(
      updateOrderStatusService.execute('fake-id'),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
