// Flashcards for quiz-01-iam-fundamentals.md: each card is [question, answer].
window.DECKS.push({
  topic: '02 · IAM',
  title: 'Quiz 01: IAM Fundamentals',
  notes: '02-iam/quiz-01-iam-fundamentals.md',
  cards: [
    ['In an IAM policy, what does `"Effect": "Allow"` mean?',
     'It **grants** permission for the listed actions on the listed resources.\nEverything is denied by default, and an explicit `Deny` always overrides an `Allow`.'],
    ['What is the main benefit of IAM user groups?',
     'You attach a policy **once** to the group, and every user in it inherits the permissions. That’s simpler and more consistent than managing each user separately.'],
    ['What is an AWS account alias for?',
     'A friendly sign-in URL in place of the 12-digit account ID:\n`https://<alias>.signin.aws.amazon.com/console`'],
    ['What does AMI stand for?',
     '**Amazon Machine Image**: the template an EC2 instance is created from (operating system plus pre-installed software).'],
    ['What is the most direct way to test an IAM user’s permissions?',
     'Sign in **as that user** (e.g. in an incognito window) and try actions that should work **and** ones that shouldn’t.\nThe IAM Policy Simulator can check it without signing in.'],
    ['What does the condition `ec2:ResourceTag/Env` do in a policy?',
     'It limits the statement to EC2 resources whose `Env` tag matches the given value, e.g. only instances tagged `Env = development`.'],
  ],
});
