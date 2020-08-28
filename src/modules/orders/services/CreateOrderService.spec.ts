import SystemError from '@global/errors/SystemError';

import FakeMailProvider from '@global/container/providers/Mail/fakes/FakeMailProvider';
import FakeCustomersRepository from '@modules/customers/infra/repository/fakes/FakeCustomerRepository';
import FakeProductsRepository from '@modules/products/infra/repository/fakes/FakeProductsRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import Product from '@modules/products/infra/typeorm/entities/Product';
import FakeOrdersRepository from '../infra/repository/fakes/FakeOrdersRepository';
import CreateOrderService from './CreateOrderService';

let fakeMailProvider: FakeMailProvider;
let fakeCustomersRepository: FakeCustomersRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let createOrderService: CreateOrderService;

let customer: Customer;
let product: Product;

describe('Create Order', () => {
  beforeEach(async () => {
    fakeMailProvider = new FakeMailProvider();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();

    createOrderService = new CreateOrderService(
      fakeCustomersRepository,
      fakeProductsRepository,
      fakeOrdersRepository,
      fakeMailProvider,
    );

    customer = await fakeCustomersRepository.create({
      birthDate: new Date(1994, 0, 3),
      cpf: '12826691686',
      email: 'junior@teste.com.br',
      name: 'Marcio Junior',
      address: {
        city: 'Belo Horizonte',
        country: 'Brasil',
        neighbourhood: 'Gutierrez',
        state: 'MG',
        street: 'Estacio de Sa',
        number: 147,
        zipcode: 30441042,
      },
    });

    product = await fakeProductsRepository.create({
      name: 'Chaveiro',
      image_url: 'fake_url',
      description: 'Descrição chaveiro',
      price: 1.1,
      stock: 1,
      weight: 0.05,
    });
  });

  it('should be able to create a new order', async () => {
    const order = await createOrderService.execute({
      customer_id: customer.id,
      installments: 1,
      products: [
        {
          product_id: product.id,
          quantity: 1,
        },
      ],
    });

    const updatedProduct = await fakeProductsRepository.findById(product.id);

    expect(order).toHaveProperty('id');
    expect(order.customer).toBeInstanceOf(Customer);
    expect(order.customer.id).toBe(customer.id);
    expect(order.installments).toBe(1);
    expect(order.status).toBe('requested');
    expect(order.products).toEqual(
      expect.arrayContaining([
        {
          price: 1.1,
          image_url: 'fake_url',
          name: 'Chaveiro',
          product_id: product.id,
          quantity: 1,
        },
      ]),
    );
    expect(updatedProduct).toBeInstanceOf(Product);
    expect(updatedProduct?.stock).toBe(0);
  });

  it('should not be able to create a new order with invalid customer', async () => {
    await expect(
      createOrderService.execute({
        customer_id: 'fake-id',
        installments: 1,
        products: [
          {
            product_id: product.id,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a new order with installments less or equal to zero', async () => {
    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        installments: 0,
        products: [
          {
            product_id: product.id,
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a new order with invalid products', async () => {
    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        installments: 1,
        products: [
          {
            product_id: 'fake-id',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });

  it('should not be able to create a new order with insuficcient products in stock', async () => {
    await expect(
      createOrderService.execute({
        customer_id: customer.id,
        installments: 1,
        products: [
          {
            product_id: product.id,
            quantity: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(SystemError);
  });
});
