import { container } from 'tsyringe';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

export default {
  Query: {
    customers: () => {
      const customersRepository = new CustomersRepository();
      return customersRepository.list();
    },
    customer: (_, { id }) => {
      const customersRepository = new CustomersRepository();
      return customersRepository.findById(id);
    },
  },
  Mutation: {
    createCustomer: (_, { data }) => {
      const createCustomerService = container.resolve(CreateCustomerService);
      return createCustomerService.execute(data);
    },
    updateCustomer: (_, { id, data }) => {
      const updateCustomerService = container.resolve(UpdateCustomerService);
      return updateCustomerService.execute({ id, ...data });
    },
    deleteCustomer: (_, { id }) => {
      const deleteCustomerService = container.resolve(DeleteCustomerService);
      return deleteCustomerService.execute(id);
    },
  },
};
