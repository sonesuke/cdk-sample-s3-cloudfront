import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CloudTrailUserActivityStack } from '../lib/cloudtrail-user-activitiy-stack';
import { HostingStack } from '../lib/hosting-stack';
import { NotificationStack } from '../lib/notification-stack';
import { StorageStack } from '../lib/storage-stack';

test('All Stacks created', () => {
  const app = new cdk.App({
    context: {
      'hosting-bucket': 'sample-hosting-bucket',
      'cloudtrail-log-bucket': 'sample-log-bucket',
      'notification-mail': 'example@sample.com',
    },
  });

  const cloudtrail = new CloudTrailUserActivityStack(app, 'app-stack-cloudtrail-user-activity');

  const storage = new StorageStack(app, 'app-stack-storage');

  const hosting = new HostingStack(app, 'app-stack-hosting', { bucket: storage.bucket });

  const notificaiton = new NotificationStack(app, 'app-stack-notification', {
    bucket: storage.bucket,
  });

  expect(Template.fromStack(cloudtrail).toJSON()).toMatchSnapshot();
  expect(Template.fromStack(storage).toJSON()).toMatchSnapshot();
  expect(Template.fromStack(hosting).toJSON()).toMatchSnapshot();
  expect(Template.fromStack(notificaiton).toJSON()).toMatchSnapshot();
});
