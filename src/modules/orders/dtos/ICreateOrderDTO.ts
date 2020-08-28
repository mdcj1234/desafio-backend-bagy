import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IOrderProduct {
  product_id: string;
  price: number;
  quantity: number;
}

export default interface ICreateOrderDTO {
  customer: Customer;
  products: IOrderProduct[];
  installments: number;
  status: 'requested' | 'delivered' | 'canceled';
}
