# Core Idea (in plain English)

You're building a mini automation platform similar to Zapier or Make.com.

Someone sends data to your system via a webhook (an HTTP POST).
Your system doesn't process it immediately — it puts it in a queue.
A background worker picks it up, transforms the data using a chosen "action".
Then it sends the transformed result to one or more other systems (subscribers).

This is an event-driven, asynchronous pipeline system.

Real-World Examples of What the System Should Do
Use Case 1: Form → Slack + Google Sheets

A user creates a pipeline called "New Contact".
Source URL: https://yourapp.com/webhooks/pipeline-abc123
Processing action: "Extract name and email, format as nice message"
Subscribers:
Slack webhook (send formatted message)
Google Sheets webhook (add row)

When a website form submits data to the source URL → it eventually appears in Slack and in Google Sheets.
Use Case 2: Payment Notification → Analytics

Source: Stripe webhook URL
Action: "Calculate revenue, detect high-value customers"
Subscribers: Internal analytics service + email notification service

Use Case 3: GitHub → Team Notifications

Source: GitHub PR merged webhook
Action: "Summarize changes and classify priority"
Subscribers: Discord + Linear (issue tracker)

Key Concepts Explained

1. Pipelines
   A pipeline is like a recipe:

Source = Where data comes in (unique URL per pipeline)
Action = What to do with the data (the transformation step)
Subscribers = Where to send the result (can be multiple)

You need a full CRUD API for pipelines (Create, Read, Update, Delete). 2. Processing Action Types (You must implement at least 3)
You get to be creative here. Good examples:

"Transform JSON" – rename fields, filter data, add timestamps
"AI Summarize" – take the payload and return a short summary (mock it if needed)
"Enrich with external data" – e.g., add weather info based on location, or look up user info
"Filter" – only pass through if certain conditions are met
"Format as HTML/CSV"
"Calculate stats" (sum, average, count items)

3. The Flow (very important)

Webhook hits the source URL → immediately return 200 OK (don't block).
System saves the raw payload as a Job in the queue.
Background Worker picks up the job.
Worker applies the chosen Action → produces a result.
System tries to POST the result to each Subscriber.
If delivery fails → retry (with backoff).

4. What "Job Status & History" API should show
   Users should be able to see:

List of all jobs for a pipeline
Status: queued | processing | completed | failed
Input payload (original webhook)
Output after processing
Delivery attempts to each subscriber (success/failure + timestamps)

Important Edge Cases & Scenarios You Should Handle
Webhook Ingestion:

Very large payloads
Invalid JSON
Duplicate webhooks (idempotency)
High traffic (many webhooks at once)

Processing:

Action fails (e.g., bad data, timeout)
Action takes a long time
Action returns empty result

Delivery (Subscribers):

Subscriber returns 404, 500, timeout
Subscriber is slow
One subscriber fails, others succeed (partial success)
Retry logic: 3 attempts with exponential backoff (1s → 5s → 30s)

Pipeline Management:

What happens if you delete a pipeline while jobs are in progress?
Updating an active pipeline
Disabling a pipeline temporarily

Other Edge Cases:

Empty payload
Subscriber URL is unreachable for hours
Jobs that have been "stuck" for too long
Very deep/nested JSON in webhooks

Non-Functional Requirements (important for evaluation)

Everything runs with docker compose up
Background worker runs separately (probably another service/container)
Use a proper job queue (BullMQ, Redis + Bull, or database-based)
PostgreSQL for storing pipelines, jobs, delivery logs
Good error handling and logging
Clear README with setup, API examples, and design decisions

Summary: What Makes a Strong Submission

Clean separation between ingestion, queue, worker, and delivery
At least 3 interesting, different action types
Solid retry mechanism for deliveries
Transparent job tracking (users can debug what happened)
Handles real-world messiness (failures, large data, concurrency)

This project tests your ability to build asynchronous, reliable, observable systems — very valuable skills for backend engineering.
Would you like me to break down any specific part in more detail (e.g., suggested architecture, good action ideas, retry strategy, etc.)?
