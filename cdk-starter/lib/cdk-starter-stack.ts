import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    const L2BucketProps: cdk.aws_s3.BucketProps = {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(expiration),
        },
      ],
    };

    new Bucket(this, id, L2BucketProps);
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3BucketUniqueId = "MyUniqueId";

    new L3Bucket(this, s3BucketUniqueId + "L3", 2);

    // L2 Construct
    const L2BucketProps: cdk.aws_s3.BucketProps = {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(2),
        },
      ],
    };

    new Bucket(this, s3BucketUniqueId + "L2", L2BucketProps);

    // L1 Construct
    const L1BucketProps: cdk.aws_s3.CfnBucketProps = {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 2,
            status: "Enabled",
          },
        ],
      },
    };

    new CfnBucket(this, s3BucketUniqueId + "L1", L1BucketProps);
  }
}
