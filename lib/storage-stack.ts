import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class StorageStack extends cdk.Stack {
  bucket: s3.IBucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'app-storage-bucket', {
      bucketName: 'sample-bucket-202303260926-jst',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }
}
