# 02 · IAM (Identity and Access Management)

Controlling *who* can access AWS and *what* they are allowed to do.

## AWS Concepts & Services Covered

- Root user vs. IAM users, and why you shouldn't use root day to day
- IAM users, groups, and roles
- IAM policies (JSON structure, managed vs. inline, least privilege)
- Multi-factor authentication (MFA)
- Access keys and CLI credentials

## Lessons

| # | Lesson | Summary |
|---|--------|---------|
| 01 | [Cloud Security with AWS IAM](lesson-01-cloud-security-with-iam.md) | 🚧 Tag-based IAM policy restricting a developer to dev EC2 instances; account alias |
| Q1 | [Quiz 01: IAM Fundamentals](quiz-01-iam-fundamentals.md) | Policy effects, user groups, account alias, AMIs, testing access, tag-based conditions |

<!-- Add a row for each new note, e.g.:
| 01 | [Title](lesson-01-short-description.md) | One-line summary |
-->

## Recommended Learning Order

Follow the lessons in numerical order. Each builds on the previous one.

## Related Topics

- [03 · EC2](../03-ec2/): instance roles and permissions
- [04 · S3](../04-s3/): bucket policies vs. IAM policies

---

To add a lesson, copy [`TEMPLATE.md`](../TEMPLATE.md) into this directory and see the [root README](../README.md#how-to-add-new-notes). Screenshots go in `images/`.
