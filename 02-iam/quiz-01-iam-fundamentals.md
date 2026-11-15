# Quiz 01: IAM Fundamentals

> **Date:** 2026-11-15 · **Source:** [NextWork](https://www.nextwork.org/), IAM quiz · **Related:** [IAM directory](README.md), [EC2 directory](../03-ec2/README.md)

My answers from one of my first AWS IAM quizzes, with extra notes to help me review.

## Questions & Answers

### 1. In an IAM policy, what does the `Effect` element with a value of `Allow` signify?

**Answer:** The `Allow` effect grants permissions for the specified actions on the specified resources.

> **Review note:** `Effect` can only be `Allow` or `Deny`. Everything is **denied by default** (implicit deny), and an **explicit `Deny` always overrides an `Allow`**.

```json
{
  "Effect": "Allow",
  "Action": "ec2:DescribeInstances",
  "Resource": "*"
}
```

### 2. What is the main benefit of using IAM user groups?

**Answer:** User groups simplify permission management by letting you apply policies to many users at once.

> **Review note:** Attach the policy to the group (e.g. `developers`) once, and every user in it inherits the permissions. A user can belong to several groups. Groups can't be nested, and a group can't be used to sign in.

### 3. What is the primary purpose of creating an AWS Account Alias?

**Answer:** An account alias gives you a user-friendly sign-in URL for the AWS Management Console in place of the account ID.

> **Review note:** `https://123456789012.signin.aws.amazon.com/console` becomes `https://my-alias.signin.aws.amazon.com/console`. The alias must be globally unique, and the account ID still works.

### 4. What does AMI stand for in the context of launching EC2 instances?

**Answer:** **Amazon Machine Image**: a template used to create EC2 instances, containing the operating system and applications.

> **Review note:** AMIs are region-specific. You can use AWS-provided ones (e.g. Amazon Linux), Marketplace ones, or create your own from an existing instance.

### 5. What is the most effective way to test if an IAM user has the correct permissions?

**Answer:** Log in as the IAM user and attempt actions to verify the permissions work as expected.

> **Review note:** Use a private/incognito window so you stay signed in as your admin user in the other. Try something that *should* work **and** something that *shouldn't*. The **IAM Policy Simulator** can also check policies without signing in.

### 6. In an IAM policy, what does the condition `ec2:ResourceTag/Env` achieve?

**Answer:** It restricts the policy to EC2 instances that have a specific `Env` tag value.

> **Review note:** This is tag-based access control. For example, this statement lets a user start/stop only instances tagged `Env = development`:

```json
{
  "Effect": "Allow",
  "Action": ["ec2:StartInstances", "ec2:StopInstances"],
  "Resource": "*",
  "Condition": {
    "StringEquals": { "ec2:ResourceTag/Env": "development" }
  }
}
```

## Key Takeaways

1. Everything is denied by default; `Allow` grants access, and an explicit `Deny` always wins.
2. Manage permissions through **groups**, not individual users.
3. An account alias only makes the sign-in URL friendlier. It doesn't change security.
4. Always **test permissions as the user**, checking both allowed and denied actions.
5. **Tags + conditions** let one policy target specific resources (e.g. dev vs. prod instances).

## References

- [IAM JSON policy elements: Effect](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html)
- [IAM user groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)
- [Your AWS account ID and its alias](https://docs.aws.amazon.com/IAM/latest/UserGuide/console-account-alias.html)
- [Amazon Machine Images (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Testing IAM policies with the IAM Policy Simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)
- [Controlling access to AWS resources using tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html)
