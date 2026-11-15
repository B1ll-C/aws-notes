# AWS Learning Notes

My personal AWS knowledge base: a long-term learning journal and technical reference for everything I study and build on Amazon Web Services.

## Purpose

This repository records what I **actually did and understood** while learning AWS: the steps I followed, the commands I ran, the mistakes I made, and how I fixed them. It is written so that future me (or anyone else) can come back months later and quickly understand or reimplement something.

## Learning Platform

My primary learning resource is **[NextWork](https://www.nextwork.org/)**. Most notes correspond to a NextWork lesson, tutorial, or hands-on project, supplemented by the official [AWS Documentation](https://docs.aws.amazon.com/) and other resources linked in each note.

## Directory Organization

```text
aws-notes/
├── README.md                  ← you are here
├── TEMPLATE.md                ← copy this for every new lesson
├── 01-cloud-fundamentals/     ← cloud concepts, AWS global infrastructure, billing
├── 02-iam/                    ← users, groups, roles, policies
├── 03-ec2/                    ← virtual servers, security groups, key pairs
├── 04-s3/                     ← object storage, buckets, permissions
└── projects/                  ← multi-service, hands-on builds
```

**Organizing rules:**

- **Topic directories** are organized by AWS service or concept and numbered in a rough learning order (`NN-topic-name`).
- **Lesson notes** live inside the topic directory they belong to, never at the root.
- **Projects** that combine several services go in `projects/`. If a project is mostly about one service, it can live in that service's directory instead.
- **Screenshots and diagrams** go in an `images/` folder inside the same topic directory (e.g. `03-ec2/images/`).
- **New topics:** when you start a service that doesn't fit an existing directory (e.g. VPC, Lambda, RDS), create the next numbered directory (`05-vpc/`) with its own `README.md`, then add it to the tree above.

## How to Use This Repository

1. Start at a topic directory that matches what you're looking for.
2. Open that directory's `README.md`. It lists every lesson in recommended reading order with a one-line summary.
3. Open the lesson note. Each one follows the same structure (see [TEMPLATE.md](TEMPLATE.md)), so you can jump straight to **Steps**, **Problems Encountered & Solutions**, or **Key Takeaways**.

Tip: use GitHub's search or `grep -ri "keyword" .` to find a command, error message, or concept across all notes.

## How to Add New Notes

1. **Pick the directory.** Find the topic directory for the service or concept, or create a new numbered one (see above).
2. **Copy the template:**
   ```bash
   cp TEMPLATE.md 02-iam/lesson-03-iam-roles.md
   ```
3. **Name the file** `lesson-NN-short-description.md` (or `project-NN-short-description.md` in `projects/`): lowercase, hyphen-separated, numbered in the order you studied it.
4. **Fill in the template** while (or right after) you do the lesson. Write in your own words.
5. **Add screenshots** to the directory's `images/` folder and reference them with relative links:
   ```markdown
   ![Security group inbound rules](images/lesson-02-inbound-rules.png)
   ```
6. **Update the directory README.** Add a row to its lessons table.
7. **Link related notes** where useful, e.g. `See [IAM roles](../02-iam/lesson-03-iam-roles.md)`.
8. **Commit** with a descriptive message, e.g. `Add notes: EC2 security groups`.

## Documentation Standards

- **Markdown only** (`.md`), using the [TEMPLATE.md](TEMPLATE.md) structure for every lesson.
- **Filenames:** descriptive, lowercase, hyphen-separated (`lesson-01-s3-fundamentals.md`).
- **Own words, not copied instructions.** Record what *you* did and understood, not NextWork's text verbatim.
- **Explain, don't just list.** Every important command or configuration gets a sentence on what it does and why.
- **Beginner-friendly.** Define terms the first time they appear. Assume the reader is you, six months from now, having forgotten the details.
- **Enough detail to reproduce.** Someone should be able to follow your steps and get the same result.
- **Consistency.** Same headings, same naming, same structure across all directories.

## Best Practices

- ✅ **Clear explanations:** describe the *why* behind each step, not only the *what*.
- ✅ **Practical examples:** real configurations and values you used (with secrets removed).
- ✅ **Commands and code:** use fenced code blocks with a language tag (` ```bash `, ` ```json `) and explain the flags.
- ✅ **Screenshots:** include them when they add context (console settings, results, architecture), not for every click.
- ✅ **Troubleshooting notes:** record errors verbatim along with how you fixed them. These are often the most valuable part later.
- ✅ **Personal takeaways:** what surprised you, what finally clicked, and what you'd do differently.
- ⚠️ **Never commit secrets:** no access keys, secret keys, passwords, account IDs, or private key (`.pem`) files. Redact them in screenshots too.
- 💸 **Note cleanup steps:** record which resources you deleted at the end of a lesson to avoid unexpected AWS charges.

## Progress

| Directory | Topic | Lessons |
|-----------|-------|---------|
| [01-cloud-fundamentals](01-cloud-fundamentals/) | Cloud & AWS fundamentals | 0 |
| [02-iam](02-iam/) | Identity and Access Management | 1 lesson, 1 quiz |
| [03-ec2](03-ec2/) | Elastic Compute Cloud | 0 |
| [04-s3](04-s3/) | Simple Storage Service | 0 |
| [projects](projects/) | Hands-on projects | 0 |
