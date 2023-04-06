import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CloudTrailUserActivityStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logBucket = scope.node.tryGetContext('cloudtrail-log-bucket');

    // S3にCloudTrailのログを保存するためのバケットを作成
    const bucket = new s3.Bucket(this, 'app-cloudtrail-bucket', {
      bucketName: logBucket,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // CloudTrailの設定
    const trail = new cloudtrail.Trail(this, 'app-cloudtrail', {
      sendToCloudWatchLogs: true,
      cloudWatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      bucket: bucket,
      isMultiRegionTrail: true,
    });

    // CloudTrailのログをS3に保存するための権限を付与
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetBucketAcl', 's3:PutObject'],
        resources: [bucket.bucketArn],
        principals: [new iam.ServicePrincipal('cloudtrail.amazonaws.com')],
        effect: iam.Effect.ALLOW,
      })
    );
  }
}
