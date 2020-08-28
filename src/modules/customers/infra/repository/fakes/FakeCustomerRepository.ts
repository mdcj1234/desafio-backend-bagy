import { v4 as uuid } from 'uuid';

import ICustomerRepository from '@modules/customers/infra/repository/ICustomerRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';

class FakeCustomersRepository implements ICustomerRepository {
  private customers: Customer[] = [];

  async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[findIndex] = customer;

    return customer;
  }

  async create(customerData: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, { id: uuid(), ...customerData });

    this.customers.push(customer);

    return customer;
  }

  async delete(id: string): Promise<boolean> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === id,
    );

    this.customers = this.customers.splice(findIndex, 1);

    return true;
  }

  async list(): Promise<Customer[]> {
    return this.customers;
  }

  async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.id === id);
    return findCustomer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(
      customer => customer.email === email,
    );
    return findCustomer;
  }

  async findByCPF(cpf: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.cpf === cpf);
    return findCustomer;
  }
}

export default FakeCustomersRepository;
