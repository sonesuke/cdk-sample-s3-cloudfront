#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { HostingStack } from '../lib/hosting-stack';
import { NotificationStack } from '../lib/notification-stack';
import { CloudTrailUserActivityStack } from '../lib/cloudtrail-user-activitiy-stack';

const app = new cdk.App();

new CloudTrailUserActivityStack(app, 'app-stack-cloudtrail-user-activity');

const storage = new StorageStack(app, 'app-stack-storage');

new HostingStack(app, 'app-stack-hosting', { bucket: storage.bucket });

new NotificationStack(app, 'app-stack-notification', { bucket: storage.bucket });
