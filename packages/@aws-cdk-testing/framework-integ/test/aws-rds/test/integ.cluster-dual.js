"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const rds = require("aws-cdk-lib/aws-rds");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-dual-integ');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 0 });
const ipv6 = new ec2.CfnVPCCidrBlock(stack, 'Ipv6CidrBlock', { vpcId: vpc.vpcId, amazonProvidedIpv6CidrBlock: true });
vpc.isolatedSubnets.forEach((subnet, idx) => {
    const cfnSubnet = subnet.node.defaultChild;
    cfnSubnet.ipv6CidrBlock = cdk.Fn.select(idx, cdk.Fn.cidr(cdk.Fn.select(0, vpc.vpcIpv6CidrBlocks), 256, '64'));
    cfnSubnet.addDependsOn(ipv6);
});
new rds.DatabaseCluster(stack, 'DualstackCluster', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_0 }),
    credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
    instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        vpc,
    },
    networkType: rds.NetworkType.DUAL,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new rds.DatabaseCluster(stack, 'Ipv4Cluster', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_0 }),
    credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
    instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        vpc,
    },
    networkType: rds.NetworkType.IPV4,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
new integ_tests_alpha_1.IntegTest(app, 'cluster-dual-test', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2x1c3Rlci1kdWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2x1c3Rlci1kdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFDdkQsMkNBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUVuRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckUsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSwyQkFBMkIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3RILEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzFDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBNkIsQ0FBQztJQUM1RCxTQUFTLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7SUFDakQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25HLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsa0NBQWtDLENBQUMsRUFBRSxDQUFDO0lBQ3JJLGFBQWEsRUFBRTtRQUNiLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUN4RixVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtRQUMzRCxHQUFHO0tBQ0o7SUFDRCxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJO0lBQ2pDLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDNUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25HLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsa0NBQWtDLENBQUMsRUFBRSxDQUFDO0lBQ3JJLGFBQWEsRUFBRTtRQUNiLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUN4RixVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtRQUMzRCxHQUFHO0tBQ0o7SUFDRCxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJO0lBQ2pDLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtJQUN0QyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtcmRzJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLXJkcy1jbHVzdGVyLWR1YWwtaW50ZWcnKTtcblxuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDAgfSk7XG5jb25zdCBpcHY2ID0gbmV3IGVjMi5DZm5WUENDaWRyQmxvY2soc3RhY2ssICdJcHY2Q2lkckJsb2NrJywgeyB2cGNJZDogdnBjLnZwY0lkLCBhbWF6b25Qcm92aWRlZElwdjZDaWRyQmxvY2s6IHRydWUgfSk7XG52cGMuaXNvbGF0ZWRTdWJuZXRzLmZvckVhY2goKHN1Ym5ldCwgaWR4KSA9PiB7XG4gIGNvbnN0IGNmblN1Ym5ldCA9IHN1Ym5ldC5ub2RlLmRlZmF1bHRDaGlsZCBhcyBlYzIuQ2ZuU3VibmV0O1xuICBjZm5TdWJuZXQuaXB2NkNpZHJCbG9jayA9IGNkay5Gbi5zZWxlY3QoaWR4LCBjZGsuRm4uY2lkcihjZGsuRm4uc2VsZWN0KDAsIHZwYy52cGNJcHY2Q2lkckJsb2NrcyksIDI1NiwgJzY0JykpO1xuICBjZm5TdWJuZXQuYWRkRGVwZW5kc09uKGlwdjYpO1xufSk7XG5cbm5ldyByZHMuRGF0YWJhc2VDbHVzdGVyKHN0YWNrLCAnRHVhbHN0YWNrQ2x1c3RlcicsIHtcbiAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLmF1cm9yYU15c3FsKHsgdmVyc2lvbjogcmRzLkF1cm9yYU15c3FsRW5naW5lVmVyc2lvbi5WRVJfM18wMl8wIH0pLFxuICBjcmVkZW50aWFsczogcmRzLkNyZWRlbnRpYWxzLmZyb21Vc2VybmFtZSgnYWRtaW4nLCB7IHBhc3N3b3JkOiBjZGsuU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCc3OTU5ODY2Y2FjYzAyYzJkMjQzZWNmZTE3NzQ2NGZlNicpIH0pLFxuICBpbnN0YW5jZVByb3BzOiB7XG4gICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTMsIGVjMi5JbnN0YW5jZVNpemUuTUVESVVNKSxcbiAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfSxcbiAgICB2cGMsXG4gIH0sXG4gIG5ldHdvcmtUeXBlOiByZHMuTmV0d29ya1R5cGUuRFVBTCxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5uZXcgcmRzLkRhdGFiYXNlQ2x1c3RlcihzdGFjaywgJ0lwdjRDbHVzdGVyJywge1xuICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuYXVyb3JhTXlzcWwoeyB2ZXJzaW9uOiByZHMuQXVyb3JhTXlzcWxFbmdpbmVWZXJzaW9uLlZFUl8zXzAyXzAgfSksXG4gIGNyZWRlbnRpYWxzOiByZHMuQ3JlZGVudGlhbHMuZnJvbVVzZXJuYW1lKCdhZG1pbicsIHsgcGFzc3dvcmQ6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJzc5NTk4NjZjYWNjMDJjMmQyNDNlY2ZlMTc3NDY0ZmU2JykgfSksXG4gIGluc3RhbmNlUHJvcHM6IHtcbiAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMywgZWMyLkluc3RhbmNlU2l6ZS5NRURJVU0pLFxuICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCB9LFxuICAgIHZwYyxcbiAgfSxcbiAgbmV0d29ya1R5cGU6IHJkcy5OZXR3b3JrVHlwZS5JUFY0LFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2x1c3Rlci1kdWFsLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19