import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as guardduty from 'aws-cdk-lib/aws-guardduty';

interface NotificationStackProps extends cdk.StackProps {
  bucket: s3.IBucket;
}

export class NotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NotificationStackProps) {
    super(scope, id, props);

    const mailAddress = scope.node.tryGetContext('notification-mail') as string;

    if (!mailAddress) {
      throw new Error('mailAddress is not defined in CDK context');
    }

    // 通知を受け取るSNSトピックを作成
    const topic = new sns.Topic(this, 'app-notification-sns-topic');

    // 通知先をメールアドレスに設定
    topic.addSubscription(new subs.EmailSubscription(mailAddress));

    // S3のPutObjectイベントをトリガーにEventBridgeルールを作成
    const uploadEvent = new events.Rule(this, 'app-notification-rule-upload-event', {
      eventPattern: {
        source: ['aws.s3'],
        detailType: ['AWS API Call via CloudTrail'],
        detail: {
          eventSource: ['s3.amazonaws.com'],
          eventName: ['PutObject', 'CopyObject', 'CompleteMultipartUpload'],
          requestParameters: {
            bucketName: [props.bucket.bucketName],
          },
        },
      },
    });

    // ルールとSNSトピックを紐付け
    uploadEvent.addTarget(new targets.SnsTopic(topic));

    // GuardDutyの有効化
    const guardduty_enable = new guardduty.CfnDetector(this, 'app-notificiation-guardduty', {
      enable: true,
    });

    // GuardDutyのイベントをトリガーにEventBridgeルールを作成
    const guarddutyRule = new events.Rule(this, 'app-notificaition-rule-guardduty', {
      eventPattern: {
        source: ['aws.guardduty'],
        detailType: ['GuardDuty Finding'],
        detail: {
          severity: [
            { numeric: ['>=', 4] }, // 重要度中・高のみ通知するようにフィルタリング
          ],
        },
      },
    });

    // GuardDutyのルールとSNSトピックを紐付け
    guarddutyRule.addTarget(new targets.SnsTopic(topic));
  }
}
