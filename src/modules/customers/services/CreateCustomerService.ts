import { injectable, inject } from 'tsyringe';

import SystemError from '@global/errors/SystemError';
import ICustomersRepository from '@modules/customers/infra/repository/ICustomerRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  birthDate: Date;
  address: {
    street: string;
    neighbourhood: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    number: number;
  };
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(data: IRequest): Promise<Customer> {
    const { name, email, cpf, birthDate, address } = data;

    const checkCustomerEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (checkCustomerEmail) {
      throw new SystemError('Email address is not available.');
    }

    const checkCustomerCPF = await this.customersRepository.findByCPF(cpf);

    if (checkCustomerCPF) {
      throw new SystemError('CPF is not available.');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
      cpf,
      birthDate,
      address,
    });

    return customer;
  }
}

export default CreateCustomerService;
