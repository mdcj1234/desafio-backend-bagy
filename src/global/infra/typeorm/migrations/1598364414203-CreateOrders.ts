import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrders1598364414203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'varchar(100)',
            isPrimary: true,
          },
          {
            name: 'customer_id',
            type: 'varchar(100)',
          },
          {
            name: 'installments',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'varchar(30)',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'OrderCustomer',
            referencedTableName: 'customers',
            referencedColumnNames: ['id'],
            columnNames: ['customer_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
