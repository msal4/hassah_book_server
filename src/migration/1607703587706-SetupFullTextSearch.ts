import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupFullTextSearch1607703587706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        UPDATE product set document = 
          setweight(to_tsvector('arabic', name), 'A') ||
          setweight(to_tsvector('arabic', overview), 'B') ||
          setweight(to_tsvector('english', name), 'A') ||
          setweight(to_tsvector('english', overview), 'B');
        CREATE INDEX document_idx
          ON product
          USING GIN (document);
        CREATE OR REPLACE FUNCTION product_tsvector_trigger() RETURNS trigger AS $$
        BEGIN
          new.document :=
            setweight(to_tsvector('arabic', new.name), 'A') ||
            setweight(to_tsvector('arabic', new.overview), 'B') ||
            setweight(to_tsvector('english', new.name), 'A') ||
            setweight(to_tsvector('english', new.overview), 'B');
          return new;
        END
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
            ON product FOR EACH ROW EXECUTE PROCEDURE product_tsvector_trigger();
        `);
  }

  public async down(): Promise<void> {}
}
