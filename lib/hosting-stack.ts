import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface HostingStackProps extends cdk.StackProps {
  bucket: s3.IBucket;
}

export class HostingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    // CloudFrontの設定
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'app-cloudfront-distribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              // S3をオリジンとして指定
              s3BucketSource: props.bucket,
            },
            behaviors: [{ isDefaultBehavior: true }], // デフォルトの振る舞いを指定
          },
        ],
      }
    );
  }
}
