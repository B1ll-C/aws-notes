# Lesson 01: Cloud Security with AWS IAM

> **Date:** 2026-11-15 · **Source:** [NextWork: Cloud Security with AWS IAM](https://www.nextwork.org/) (AWS Beginners Challenge, project 2 · Beginner · ~1 h · Free) · **Related:** [Quiz 01: IAM Fundamentals](quiz-01-iam-fundamentals.md)
>
> **Status:** ✅ Complete, including the 💎 secret mission (IAM Policy Simulator). Quiz: 6/6.

## Description

- **What is this lesson about?** Using IAM to control *who* can do *what* to EC2 instances, so a new intern can work on development servers but can't touch production.
- **What does it cover?** Amazon EC2 (instances, AMIs, instance types, tags) and AWS IAM (JSON policies, conditions, account alias, user groups, users, the Policy Simulator).
- **Objective:** Launch a production and a development EC2 instance, write a tag-based IAM policy that only grants access to development, give an intern user that policy through a group, and prove it works.

**Scenario:** I joined NextWork as a DevOps engineer. Before the holiday traffic rush, I had to (1) add computing power by launching EC2 instances, and (2) onboard an intern who can work on development without risking production.

```text
                  AWS account (alias: nextwork-learning-alias-paul)
                  ┌─────────────────────────────────────────────────┐
  intern ──login──►  IAM user ──member of──► nextwork-dev-group      │
                  │                              │ attached          │
                  │                  NextWorkDevEnvironmentPolicy    │
                  │                     │ allow            │ deny    │
                  │      EC2 Env=development ✅    EC2 Env=production ❌ │
                  └─────────────────────────────────────────────────┘
```

## Learning Objectives

After completing this lesson, I should be able to:

- [x] Launch an EC2 instance and tag it by environment
- [x] Write a custom IAM policy in JSON with a tag-based condition
- [x] Create an AWS account alias
- [x] Create an IAM user group and IAM user, and attach the policy through the group
- [x] Test permissions by signing in as the IAM user
- [x] Test permissions safely with the IAM Policy Simulator

## Prerequisites

- **Required knowledge:** None. This is a beginner project ([Set Up an AWS Account](https://www.nextwork.org/) is the related first project).
- **AWS services or tools needed:** An AWS account, the AWS Management Console, and a browser with an incognito/private window
- **Required configurations or resources:** An admin user to sign in with (ideally not the root user)

## Steps / Implementation

### Step 1: Launch the EC2 instances

- **What I did:** Launched two EC2 instances, one for production and one for development.
- **Why:** To add computing power, and to have two instances that differ only by their `Env` tag, so the policy can tell them apart.
- **How:**
  1. Signed in to the AWS Management Console and opened **EC2** from the search bar.
  2. Switched the **Region** to the one closest to me.
  3. Chose **Launch instance**, entered a **Name**, then **Add additional tags** → **Add new tag**: `Env` = `production`.
  4. Kept a *Free tier eligible* **AMI** and **instance type** to avoid charges.
  5. For **Key pair (login)**, chose **Proceed without a key pair**.
  6. Left network and storage settings at their defaults and chose **Launch instance**.
  7. Repeated the steps for the second instance with `Env` = `development`.
  8. Checked both under **Instances** (refresh if only one shows) → select one → **Tags** tab.
- **Configuration:**

  | | Production | Development |
  |---|---|---|
  | Name | `nextwork-prod-<name>` | `nextwork-dev-<name>` |
  | Tag | `Env` = `production` | `Env` = `development` |
  | AMI / instance type | Free tier eligible | Free tier eligible |
  | Key pair | None | None |

- **Expected result:** Two running instances, each showing its `Env` tag in the Tags tab.

> **Why proceed without a key pair?** A key pair lets you connect to an instance over **SSH** from your own terminal instead of the console. This project only uses the console, so it isn't needed. The console marks it *Not recommended* because without one there's no secure way to get into the instance to troubleshoot it. For longer-lived projects, create one.
>
> **Skipped settings:** *Network settings* control how the instance talks to the internet and other AWS resources (IP addresses, routing). *Storage settings* control the type and size of its disks (volumes). Both are left at their defaults here.

### Step 2: Create the IAM policy

- **What I did:** Created a custom policy named `NextWorkDevEnvironmentPolicy` using the **JSON** editor (not the visual editor).
- **Why:** The intern should have access to the development instance but **not** production, so they can't accidentally shut down the live platform.
- **How:**
  1. **IAM** console → **Policies** → **Create policy**.
  2. Switched the **Policy editor** to **JSON**, replaced all the existing code with the policy below, and chose **Next**.
  3. **Name:** `NextWorkDevEnvironmentPolicy`
  4. **Description:** `IAM Policy for NextWorks development environment` (with the apostrophe removed, see [Problems](#problems-encountered--solutions))
  5. Chose **Create policy**.

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
| 3 | Deny `CreateTags` / `DeleteTags` | Block changing tags. Otherwise the intern could re-tag production as `development` and get around statement 1. |

In short, the policy lets users manage development EC2 instances only, and explicitly stops them from creating or deleting tags.

### Step 3: Create an AWS account alias

- **What I did:** Created the account alias `nextwork-learning-alias-paul`.
- **Why:** New users sign in through a URL specific to the account. With an alias, it's easy to remember and share with the intern.
  - Before: `https://<account-id>.signin.aws.amazon.com/console`
  - After: `https://nextwork-learning-alias-paul.signin.aws.amazon.com/console`
- **How:** IAM console → **Dashboard** → **Account Alias** (right-hand side) → **Create** → entered the preferred alias → **Create alias**. It took about a minute.

### Step 4: Create the IAM user group and IAM user

- **What I did:** Created the group `nextwork-dev-group` with the policy attached, then created the intern's user `nextwork-dev-paul` inside it.
- **Why:** I shouldn't share my own login, because it has access to production. Groups let me manage the permissions of *all* interns in one place: when 5 interns join next summer, they just join the group.
- **How (group):** IAM → **User groups** → **Create group**:
  - **Name:** `nextwork-dev-group`
  - **Attach permission policies:** `NextWorkDevEnvironmentPolicy`
- **How (user):** IAM → **Users** → **Create user**:
  1. **User name:** `nextwork-dev-paul`
  2. Ticked **Provide user access to the AWS Management Console**. Without it, the user could only use advanced methods (CLI, SDKs, APIs).
  3. If the pop-up *"Are you providing console access to a person?"* appears, choose **I want to create an IAM user**.
  4. **Unticked** *Users must create a new password at next sign-in*. This was only to save time in the lab; in real life, **leave it ticked**.
  5. **Set permissions:** added the user to `nextwork-dev-group` → **Next** → **Create user**.
- **Expected result:** A sign-in details page showing the console URL, user name and password. Keep this tab open for Step 5.

**Two ways to share a new user's sign-in details:**
1. **Download the `.csv`** of credentials from the console and give it to the user securely.
2. **Send the sign-in URL, user name and temporary password** over a secure channel.

> ⚠️ The `.csv` contains a password, so never commit it. This repo's `.gitignore` already ignores `*.csv`.

### Step 5: Test the intern's access by signing in as them

- **What I did:** Signed in as `nextwork-dev-paul` and tried to stop each instance.
- **Why:** To confirm the intern has the right access *before* handing over the login.
- **How:**
  1. Copied the console sign-in URL and opened it in an **incognito window**, so my admin session stays signed in in the normal window.
  2. Signed in with the IAM user's name and password. The console looks brand new, and some dashboard panels already show **Access denied**: the user only has the permissions in the policy.
  3. EC2 → same Region as the instances → **Instances**.
  4. **Production instance:** **Instance state** → **Stop instance** → **Stop**.
  5. **Development instance:** **Actions** → **Manage instance state** → **Stop** → **Change state**.
- **Results:**

  | Instance | Action | Result | Why |
  |----------|--------|--------|-----|
  | Production (`Env=production`) | Stop | ❌ Failed: a red banner said I was **not authorized** | The only statement allowing `ec2:*` requires `Env = development` |
  | Development (`Env=development`) | Stop | ✅ Success | Matches the condition in statement 1 |

### Step 6 (💎 secret mission): Test with the IAM Policy Simulator

- **What I did:** Ran the same permission checks with the **IAM Policy Simulator**.
- **Why:** In Step 5 I actually **stopped a real instance** to test access. In a real team, that could disrupt other engineers and users. The simulator checks policies **without touching real resources** and without signing in as the user.
- **How:**
  1. Back in my **main (admin) account**, not the dev user: IAM **Dashboard** → **Tools** → **Policy Simulator** (or open <https://policysim.aws.amazon.com/>).
  2. Selected the group `nextwork-dev-group`.
  3. **Service:** EC2. **Actions:** `DeleteTags` and `StopInstances` → **Run Simulation**.
  4. Expanded `DeleteTags` → **Show statement** to see exactly which statement of `NextWorkDevEnvironmentPolicy` blocks it.
  5. Expanded `StopInstances`, set the resource/instance field to `development`, and ran the simulation again.
- **Results:**

  | Action | Simulated resource | Result | Why |
  |--------|--------------------|--------|-----|
  | `DeleteTags` | `*` | ❌ Denied | Explicit `Deny` in statement 3 |
  | `StopInstances` | `*` (all instances) | ❌ Denied | Not *every* instance is tagged `development`, so the condition doesn't match |
  | `StopInstances` | tagged `development` | ✅ Allowed | Statement 1's condition now matches |

> **Lesson:** a "denied" in the simulator isn't always a broken policy. The scope may just be too wide. You have to simulate against the **specific resource** the condition targets.

### Cleanup

Deleted all resources to avoid charges:

- [x] EC2 development instance
- [x] EC2 production instance
- [x] IAM user group (`nextwork-dev-group`)
- [x] IAM user (`nextwork-dev-paul`)
- [x] IAM policy (`NextWorkDevEnvironmentPolicy`)
- [x] Account alias

## What I Learned

- **IAM (Identity and Access Management):** controls who is **authenticated** (signed in) and **authorized** (has permissions) in an AWS account.
- **EC2 (Elastic Compute Cloud):** rents virtual computers in the cloud. *Elastic* means flexible in size and power, *Compute* means processing power, and *Cloud* means it's reached over the internet. Each virtual computer is an **instance**.
- **AMI vs. instance type:** the **AMI** (Amazon Machine Image) is the *software* template: the OS plus pre-installed apps, like a pre-built computer off the shelf. The **instance type** is the *hardware*: CPU, memory, storage and networking.
- **Virtual computer vs. server:** a virtual computer is a computer without the physical parts, reached from your own machine. A **server** is also a computer, but one built to serve many others, for example by hosting websites or storing files.
- **Tags:** key–value labels on resources. Here, `Env` marks:
  - **production:** the live, stable environment that end users rely on
  - **development:** where developers code, test and debug without affecting production

  Tags help with filtering, cost allocation, keeping environments clearly separated, and **access control**: IAM can grant permissions based on them.
- **IAM policy:** a rule for *who* can do *what* to *which* resources, and *when*. Its parts:
  - *Version:* the version of the policy **language**. `2012-10-17` is the current one and should always be used. (NextWork describes it as "the date of the latest policy version", but it isn't the date the policy was written.)
  - *Statement:* the list of permission rules.
  - *Effect:* `Allow` or `Deny`. An explicit **Deny always wins**.
  - *Action:* which API actions it covers (`ec2:*` = all, `ec2:Describe*` = read-only).
  - *Resource:* which resources it covers (`*` = all).
  - *Condition (optional):* when it applies. Here it narrows `"Resource": "*"` down to resources tagged `Env = development`.
- **User groups:** organize users by team or role. Every user in a group **inherits** the group's policies, so permissions are managed once instead of per user.
- **IAM user:** a distinct identity inside the AWS account for a specific person or application that needs to use AWS resources.
- **Account alias:** an easy-to-remember name used in place of the account ID in the sign-in URL.
- **Initially confusing, now understood:**
  - The `Deny` on tagging protects the tags that the rest of the policy depends on.
  - The simulator says `StopInstances` is *denied* for `*` even though the user can stop the dev instance. That's because `*` includes production.

## Problems Encountered & Solutions

| Problem / Error | Cause | Solution |
|-----------------|-------|----------|
| Policy **Description** rejected with an invalid-character error | The apostrophe in "NextWork's" isn't allowed in IAM policy descriptions (the hint under the text box lists the allowed characters) | Removed the apostrophe: `IAM Policy for NextWorks development environment` |
| Only one instance showed on the Instances page | The list hadn't refreshed after the second launch | Clicked the refresh button |
| As the IAM user: *not authorized* when stopping production | Expected: the policy only allows actions on `Env = development` | Nothing to fix. This proves the policy works |
| Policy Simulator: `StopInstances` **denied** | The simulation resource was `*` (all instances, including production) | Set the resource/instance to `development` and re-ran it, which gave **allowed** |

## Key Takeaways

1. **Tag your resources.** Tags aren't just labels; IAM conditions can use them to decide who has access.
2. **Least privilege:** give the intern full access to *development* and none to *production*.
3. **Protect the tags your policy depends on** by denying `CreateTags` and `DeleteTags`.
4. **Explicit Deny overrides any Allow.**
5. **Manage permissions through groups**, never one user at a time, and never share your own login.
6. **Test before handing over access.** Prefer the **Policy Simulator**, because testing as the user can disrupt real resources. Simulate against the *specific* resource, not just `*`.
7. **Clean up** every resource at the end of a project.

## Conclusion

I secured a two-environment EC2 setup with IAM. I tagged the instances by environment, wrote a tag-based JSON policy, attached it to a user group, and created an intern user who could stop the development instance but was denied on production. I then checked the same permissions with the IAM Policy Simulator without touching real resources, and learned that the simulator's results depend on the resource scope you test against. This tag-based, group-managed, least-privilege pattern is the same one I'll use in future projects whenever different people or environments share one AWS account.

## References

- NextWork: [Cloud Security with AWS IAM](https://www.nextwork.org/)
- AWS Docs: [IAM JSON policy element reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)
- AWS Docs: [Controlling access to AWS resources using tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html)
- AWS Docs: [Your AWS account ID and its alias](https://docs.aws.amazon.com/IAM/latest/UserGuide/console-account-alias.html)
- AWS Docs: [IAM user groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)
- AWS Docs: [Testing IAM policies with the IAM Policy Simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)
- AWS Docs: [Tag your Amazon EC2 resources](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html)
