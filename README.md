# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

# Initial Setup

wfor node.js verion depends the enviroment

https://nullnull.dev/blog/how-to-use-volta-in-mac/

pretiier の設定
https://ma-vericks.com/blog/vscode-prettier/

パッケージを最新版にする
npx -p npm-check-updates -c "ncu -u"
npm install

volta pin node@18.15.0
npx -p aws-cdk cdk init app --language=typescript

npx cdk bootstrap

```
npm install -g aws-cdk
npm init app --language=typescript
```

S3
CloudFront
EventBridge
SNS

GuardDuty
CloudTrail
