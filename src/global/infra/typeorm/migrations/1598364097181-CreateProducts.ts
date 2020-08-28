import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProducts1598364097181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'varchar(100)',
            isPrimary: true,
          },
          {
            name: 'name',
            isUnique: true,
            type: 'varchar(100)',
          },
          {
            name: 'image_url',
            type: 'varchar(200)',
          },
          {
            name: 'description',
            type: 'varchar(200)',
          },
          {
            name: 'weight',
            type: 'decimal(5,3)',
          },
          {
            name: 'price',
            type: 'decimal(12,2)',
          },
          {
            name: 'stock',
            type: 'integer',
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
