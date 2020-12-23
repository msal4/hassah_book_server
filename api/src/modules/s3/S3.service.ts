import { S3 } from "aws-sdk";
import { Service } from "typedi";

@Service()
export class S3Service {
  public readonly s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
    apiVersion: "2006-03-01",
  });
}
