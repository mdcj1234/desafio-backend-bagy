import { injectable, inject } from 'tsyringe';

import path from 'path';

import SystemError from '@global/errors/SystemError';
import IMailProvider from '@global/container/providers/Mail/models/IMailProvider';
import ICustomersRepository from '@modules/customers/infra/repository/ICustomerRepository';
import IProductsRepository from '@modules/products/infra/repository/IProductsRepository';
import IOrdersRepository from '@modules/orders/infra/repository/IOrdersRepository';

import Order from '../infra/typeorm/entities/Order';

interface IRequest {
  customer_id: string;
  installments: number;
  products: [
    {
      product_id: string;
      quantity: number;
    },
  ];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(data: IRequest): Promise<Order> {
    const { customer_id, products, installments } = data;
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new SystemError('Customer not found.');
    }

    if (installments < 1) {
      throw new SystemError('Installments must be greater than zero.');
    }

    const productsIds = products.map(product => {
      return { id: product.product_id };
    });

    const productsInStock = await this.productsRepository.findAllById(
      productsIds,
    );

    const order_products = products.map(product => {
      const productIndex = productsInStock.findIndex(
        searchedProduct => searchedProduct.id === product.product_id,
      );

      if (productIndex === -1) {
        throw new SystemError('Some products in the order does not exists.');
      }

      if (product.quantity > productsInStock[productIndex].stock) {
        throw new SystemError('Insuficcient products in stock');
      }

      return {
        product_id: productsInStock[productIndex].id,
        price: productsInStock[productIndex].price,
        quantity: product.quantity,
        name: productsInStock[productIndex].name,
        image_url: productsInStock[productIndex].image_url,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: order_products,
      installments,
      status: 'requested',
    });

    const updateProducts = products.map(product => {
      return {
        id: product.product_id,
        quantity: product.quantity,
      };
    });

    await this.productsRepository.updateStock(updateProducts);

    const newOrderTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new-order.hbs',
    );

    const {
      street,
      number,
      city,
      neighbourhood,
      state,
      country,
      zipcode,
    } = customer.address;

    const totalPrice = order_products
      .map(order_product => {
        return order_product.quantity * order_product.price;
      })
      .reduce((acc, value) => {
        return acc + value;
      }, 0);

    await this.mailProvider.sendMail({
      to: {
        name: customer.name,
        email: customer.email,
      },
      subject: '[Bagy] Confirmação de pedido',
      templateData: {
        file: newOrderTemplate,
        variables: {
          name: customer.name,
          cpf: customer.cpf,
          address: `${street}, ${number}, ${neighbourhood} - ${zipcode}`,
          address2: `${city}, ${state}, ${country}`,
          products: [
            ...order_products.map(order_product => {
              return `${order_product.quantity}x ${order_product.name}: R$ ${
                order_product.price * order_product.quantity
              }`;
            }),
          ],
          totalPrice: `R$ ${totalPrice}`,
        },
      },
    });

    return order;
  }
}

export default CreateOrderService;
