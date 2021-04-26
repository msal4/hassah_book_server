import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintOnFavorite1619283312180 implements MigrationInterface {
  name = "AddUniqueConstraintOnFavorite1619283312180";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "unique_favorite" UNIQUE ("userId", "productId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "unique_favorite"`);
  }
}
