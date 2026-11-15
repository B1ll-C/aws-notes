# Lesson 01: Cloud Security with AWS IAM

> **Date:** 2026-11-15 · **Source:** [NextWork: Cloud Security with AWS IAM](https://www.nextwork.org/) · **Related:** [Quiz 01: IAM Fundamentals](quiz-01-iam-fundamentals.md)
>
> **Status:** 🚧 In progress. Steps 1–4 are done; the user group, testing and cleanup are still to come.

## Description

- **What is this lesson about?** Using IAM to control *who* can do *what* to EC2 instances, so a developer can manage development servers but can't touch production.
- **What does it cover?** Amazon EC2 (instances, tags) and AWS IAM (JSON policies, conditions, account alias, users and user groups).
- **Objective:** Launch two EC2 instances (production and development), then write an IAM policy that only grants access to the development one, based on its tag.

## Learning Objectives

After completing this lesson, I should be able to:

- [x] Launch an EC2 instance and tag it by environment
- [x] Write a custom IAM policy in JSON with a tag-based condition
- [x] Create an AWS account alias
- [ ] Create an IAM user group and user and attach the policy
- [ ] Test the permissions by signing in as the IAM user

## Prerequisites

- **Required knowledge:** None. This is a beginner project.
- **AWS services or tools needed:** An AWS account and the AWS Management Console
- **Required configurations or resources:** An admin user to sign in with (not the root user, ideally)

## Steps / Implementation

### Step 1: Launch a production EC2 instance

- **What I did:** Launched an EC2 instance tagged as production.
- **Why:** The project needs two instances, one per environment, so I can later prove the policy only allows access to one of them.
- **How:**
  1. Signed in to the AWS Management Console and opened **EC2** from the search bar.
  2. Switched the **Region** to the one closest to me.
  3. Chose **Launch instance** and entered a **Name**.
  4. Chose **Add additional tags** → **Add new tag**: `Env` = `production`.
  5. Left the **AMI** on a *Free tier eligible* option and picked a *Free tier eligible* **instance type** to avoid charges.
  6. For **Key pair (login)**, chose **Proceed without a key pair**.
- **Configuration:**

  | Setting | Value |
  |---------|-------|
  | Tag | `Env` = `production` |
  | AMI / instance type | Free tier eligible |
  | Key pair | None (no SSH needed in this project) |

- **Expected result:** A running instance tagged `Env: production`.

> **Why proceed without a key pair?** A key pair is used to connect to the instance over **SSH** from my own terminal instead of the console. This project only uses the console, so it isn't needed. The console marks this as *Not recommended* because without a key pair there's no secure way to get into the instance to troubleshoot it. For longer-lived projects, create one.

### Step 2: Launch a development EC2 instance

- **What I did:** Repeated Step 1 with the tag `Env` = `development`.
- **Why:** This is the instance the developer *should* be allowed to manage.
- **Expected result:** Two running instances that differ only in their `Env` tag.

### Step 3: Create the IAM policy

- **What I did:** Created a custom policy named `NextWorkDevEnvironmentPolicy`.
- **Why:** To give the developer full EC2 access, but only on resources tagged `Env = development`.
- **How:**
  1. Opened the **IAM** console → **Policies** → **Create policy**.
  2. Switched the **Policy editor** to **JSON** and pasted the policy below.
  3. Chose **Next**, then filled in:
     - **Name:** `NextWorkDevEnvironmentPolicy`
     - **Description:** `IAM Policy for NextWork's development environment` (this caused an error, see [Problems](#problems-encountered--solutions))
  4. Chose **Create policy**.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Env": "development"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    },
    {
      "Effect": "Deny",
      "Action": [
        "ec2:DeleteTags",
        "ec2:CreateTags"
      ],
      "Resource": "*"
    }
  ]
}
```

**What each statement does:**

| # | Effect | What it means |
|---|--------|---------------|
| 1 | Allow `ec2:*` | Allow **every** EC2 action, but only on resources tagged `Env = development` (the condition). |
| 2 | Allow `ec2:Describe*` | Allow *viewing* (listing and describing) **all** EC2 resources, so the user can see both instances in the console. |
| 3 | Deny `CreateTags` / `DeleteTags` | Block anyone with this policy from changing tags. Otherwise a user could re-tag the production instance as `development` and get around statement 1. |

- **Expected result:** The policy appears under **Policies** as a customer managed policy.

### Step 4: Create an AWS account alias

- **What I did:** Created the account alias `nextwork-learning-alias-paul`.
- **Why:** So IAM users sign in through a readable URL (`https://nextwork-learning-alias-paul.signin.aws.amazon.com/console`) instead of one containing the 12-digit account ID.
- **How:** IAM console → **Dashboard** → under **Account Alias** (right-hand side) → **Create**.
- **Expected result:** The dashboard shows the new sign-in URL.

### Step 5: Create the IAM user group and user

- 🚧 *In progress.* I'm creating the IAM user `nextwork-dev-paul`.

<!-- TODO: user group name, policy attachment, user settings -->

### Step 6: Test the user's access

- 🚧 *Not done yet.*

<!-- TODO: sign in as nextwork-dev-paul in a private window; try stopping the production instance (expect it to be denied) and the development instance (expect it to work) -->

### Cleanup

- 🚧 *Not done yet.* Delete both EC2 instances, the IAM user, the user group, the policy and the account alias.

## What I Learned

- **EC2 instances:** EC2 is the service that provides virtual computers, and each **instance** is one of those computers. As with buying a laptop, you choose the CPU, memory, storage and networking it needs.
- **Virtual computer vs. server:** A virtual computer is a normal computer without the physical parts (screen, keyboard), so you reach it from your own computer. A **server** is also a computer, but one built to serve many other computers, for example by hosting a website, storing files or running a multiplayer game.
- **Development vs. production:** *Development* is where code is written, tested and broken safely. *Production* is the live environment that real users depend on. Keeping them apart, and limiting who can touch production, is a core security practice.
- **Tags:** Tags are key–value labels on AWS resources (here `Env = production` / `development`). They're useful for:
  - filtering and finding resources
  - cost allocation
  - **access control:** policies can grant permissions based on tags, which is exactly what this project does
- **How a JSON policy is structured:**
  - *Version:* the version of the policy *language*. `2012-10-17` is the current one and should always be used. It is not the date the policy was written.
  - *Statement:* the list of permission rules.
  - *Effect:* `Allow` or `Deny`. An explicit **Deny always wins** over an Allow.
  - *Action:* which API actions the statement covers (`ec2:*` = all EC2 actions, `ec2:Describe*` = all read-only "Describe" actions).
  - *Resource:* which resources it applies to (`*` = all).
  - *Condition (optional):* when the statement applies. Combined with `"Resource": "*"`, the condition narrows it down to resources tagged `Env = development` only.
- **Initially confusing, now understood:** The `Deny` on tagging. At first it looks unrelated, but without it a developer could simply change the production instance's tag and gain access. The policy protects the tags that the policy itself relies on.

## Problems Encountered & Solutions

| Problem / Error | Cause | Solution |
|-----------------|-------|----------|
| Policy **Description** rejected with an invalid-character error | The text contained a character IAM doesn't allow in descriptions. The hint under the text box lists the allowed characters. Most likely the curly apostrophe (`’`) in "NextWork’s" | Removed the offending character and recreated the description <!-- TODO: confirm which character it was --> |

## Key Takeaways

1. **Tag your resources.** Tags aren't just labels; IAM can use them to decide who has access.
2. **Least privilege:** give developers full access to *development* and none to *production*.
3. **Protect the tags your policy depends on.** Deny `CreateTags` and `DeleteTags` so users can't re-tag their way past the rules.
4. **Explicit Deny overrides any Allow.**
5. **An account alias** makes the sign-in URL friendlier for IAM users. It doesn't change security.

## Conclusion

🚧 *To be written when the project is finished.*

## References

- NextWork: [Cloud Security with AWS IAM](https://www.nextwork.org/)
- AWS Docs: [IAM JSON policy element reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)
- AWS Docs: [Controlling access to AWS resources using tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html)
- AWS Docs: [Your AWS account ID and its alias](https://docs.aws.amazon.com/IAM/latest/UserGuide/console-account-alias.html)
- AWS Docs: [Tag your Amazon EC2 resources](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)
