import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1619108271461 implements MigrationInterface {
  name = "Initial1619108271461";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "publisher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_70a5936b43177f76161724da3e6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "image" character varying NOT NULL, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "user_request_status_enum" AS ENUM('Pending', 'Processing', 'Failed', 'Success')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "status" "user_request_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_5a8702f28aa636f59038532bb85" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT 1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "productId" uuid, "orderId" uuid, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM('Pending', 'Processed', 'Delivering', 'Delivered', 'Failed', 'Canceled')`
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "province" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying, "status" "order_status_enum" NOT NULL DEFAULT 'Pending', "totalPrice" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "phone" character varying NOT NULL, "province" character varying, "address" character varying, "confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, "productId" uuid, CONSTRAINT "unique_favorite" UNIQUE ("userId", "productId"), CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "product_status_enum" AS ENUM('Available', 'OnSale', 'ComingSoon', 'SoldOut')`
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "overview" text NOT NULL, "price" double precision NOT NULL, "image" text NOT NULL, "pages" integer, "status" "product_status_enum" NOT NULL DEFAULT 'Available', "language" character varying NOT NULL DEFAULT 'en', "document" tsvector NOT NULL, "publishedAt" TIMESTAMP NOT NULL DEFAULT 'now()', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" uuid, "publisherId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "overview" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "phone_session_info" ("id" SERIAL NOT NULL, "sessionInfo" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d3c124a5af030042ba486401797" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category_products_product" ("categoryId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_0b4e34a45516284987c6dbe91cd" PRIMARY KEY ("categoryId", "productId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90d521137ff8c3e927187bcd27" ON "category_products_product" ("categoryId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ee240b247f9f23e5d35854c186" ON "category_products_product" ("productId") `
    );
    await queryRunner.query(
      `CREATE TABLE "collection_products_product" ("collectionId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_7bd1f9aff16a6ffa8e61e955e0a" PRIMARY KEY ("collectionId", "productId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ba5893f9297c1c7d5fce37850" ON "collection_products_product" ("collectionId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be63dd25b704df1870d08aea84" ON "collection_products_product" ("productId") `
    );
    await queryRunner.query(
      `ALTER TABLE "user_request" ADD CONSTRAINT "FK_d8054ca3475d5de52095c5286b8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_e59125ac7bd12b5b821ce71aed0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "FK_b8e337759b77baa0a4055d1894e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_dddbf2ae70d3f6312a02458837a" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_826d2d490a78e9439c3538c26df" FOREIGN KEY ("publisherId") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "category_products_product" ADD CONSTRAINT "FK_90d521137ff8c3e927187bcd27d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "category_products_product" ADD CONSTRAINT "FK_ee240b247f9f23e5d35854c186b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "collection_products_product" ADD CONSTRAINT "FK_3ba5893f9297c1c7d5fce37850b" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "collection_products_product" ADD CONSTRAINT "FK_be63dd25b704df1870d08aea846" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection_products_product" DROP CONSTRAINT "FK_be63dd25b704df1870d08aea846"`
    );
    await queryRunner.query(
      `ALTER TABLE "collection_products_product" DROP CONSTRAINT "FK_3ba5893f9297c1c7d5fce37850b"`
    );
    await queryRunner.query(
      `ALTER TABLE "category_products_product" DROP CONSTRAINT "FK_ee240b247f9f23e5d35854c186b"`
    );
    await queryRunner.query(
      `ALTER TABLE "category_products_product" DROP CONSTRAINT "FK_90d521137ff8c3e927187bcd27d"`
    );
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_826d2d490a78e9439c3538c26df"`);
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_dddbf2ae70d3f6312a02458837a"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_b8e337759b77baa0a4055d1894e"`);
    await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
    await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_e59125ac7bd12b5b821ce71aed0"`);
    await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46"`);
    await queryRunner.query(`ALTER TABLE "user_request" DROP CONSTRAINT "FK_d8054ca3475d5de52095c5286b8"`);
    await queryRunner.query(`DROP INDEX "IDX_be63dd25b704df1870d08aea84"`);
    await queryRunner.query(`DROP INDEX "IDX_3ba5893f9297c1c7d5fce37850"`);
    await queryRunner.query(`DROP TABLE "collection_products_product"`);
    await queryRunner.query(`DROP INDEX "IDX_ee240b247f9f23e5d35854c186"`);
    await queryRunner.query(`DROP INDEX "IDX_90d521137ff8c3e927187bcd27"`);
    await queryRunner.query(`DROP TABLE "category_products_product"`);
    await queryRunner.query(`DROP TABLE "phone_session_info"`);
    await queryRunner.query(`DROP TABLE "author"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "product_status_enum"`);
    await queryRunner.query(`DROP TABLE "favorite"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
    await queryRunner.query(`DROP TABLE "purchase"`);
    await queryRunner.query(`DROP TABLE "user_request"`);
    await queryRunner.query(`DROP TYPE "user_request_status_enum"`);
    await queryRunner.query(`DROP TABLE "collection"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "publisher"`);
    await queryRunner.query(`DROP TABLE "admin"`);
  }
}
