# Notification service fit

Research checked 21 November 2026. Actual recipient counts, event frequency, channel mix, retention, and budget are unknown. Pricing and product plans should be confirmed before commitment.

## Fit

| Option | Separate discussion and course-update experiences | Fan-out and operational trade-off |
| --- | --- | --- |
| Novu | Inbox supports tabs filtered by workflow tags, so two labeled views are feasible; preferences and workflow design remain product decisions. [Inbox migration guide](https://docs.novu.co/platform/inbox/migration-guide). | Topics group subscribers and trigger one workflow per resolved subscriber; workflows support multiple channels. [Architecture](https://docs.novu.co/platform/how-novu-works), [glossary](https://docs.novu.co/platform/additional-resources/glossary). Strong candidate for a single inbox with two views; validate counts and exact UI behavior in a spike. |
| Knock | Feed API filters by workflow category or source, enabling separate views over per-user feed items. [Feed API](https://docs.knock.app/api-reference/users/feeds). Preferences can be scoped by category, workflow, or channel. [Preferences](https://docs.knock.app/preferences/overview). | Object subscriptions fan out individual workflow runs to subscribers; the object itself also gets a run, so configure its delivery deliberately. [Modeling guide](https://docs.knock.app/tutorials/modeling-users-objects-and-tenants). Good fit, but paid entry price is relatively high. |
| Courier | Customizable Inbox and headless rendering support an app-owned presentation. [Inbox](https://www.courier.com/solutions/inbox), [custom UI](https://www.courier.com/guides/how-to-build-a-notification-center/chapter-4-why-choose-courier). Verify server-side filtering and independent unread counts for the two views before choosing; these sources do not establish them. | Lists and audiences can target groups. [Lists and audiences](https://www.courier.com/blog/send-one-time-notifications). Confirm recipient expansion, membership synchronization and behavior at dispatch time for course enrollment changes. |
| Cadence-owned | Application can implement the exact two views, unread state, authorization and preferences. It must build and operate persistence, event processing, retries, duplicate prevention, delivery, monitoring, and any email integration. | Resolve eligible recipients from enrollment and discussion rules at an explicitly chosen time, then create individual recipient records. This offers control but is an engineering and operational commitment; cost depends on infrastructure and staff time, neither estimated here. |

In all cases Cadence must define eligible recipients, handle enrollment/refund changes, decide whether the actor is excluded, and choose whether eligibility is checked at event or delivery time. Provider subscription lists are a projection of Cadence's authoritative access data, not proof of access. Persist or transmit minimal content and reauthorize the destination when opened; test removal and stale memberships.

## Recipient privacy

Use individual recipient-scoped notifications; do not expose a cohort recipient list in message payloads or use visible email To/CC for a group. The app must authorize enrollment and thread access independently of provider filtering. Provider-hosted records, logs and email delivery involve sharing data with those providers; check contracts, retention, residency and deletion requirements.

Novu warns that a public application identifier and guessed subscriber ID can expose a feed unless HMAC is enabled; generate the subscriber hash server-side. [Production security](https://docs.novu.co/platform/inbox/prepare-for-production). Knock enhanced security is off by default; enable it and issue signed, appropriately scoped user tokens before launch. [Knock security](https://docs.knock.app/in-app-ui/security-and-authentication). Courier describes backend-generated user-scoped JWTs for Inbox sessions. [Courier authentication](https://www.courier.com/guides/how-to-build-a-notification-center/chapter-2-how-to-build-a-notification-center). These controls protect inbox identity but do not establish course authorization.

## Illustrative monthly pricing

These are invented scenarios, not usage forecasts. Assume every event is delivered in-app to each eligible recipient, no digests, no dropped deliveries, and no additional features or third-party delivery charges. One event to 100 people creates 100 recipient notifications. Adding email changes the metered volume differently by provider.

| Scenario | Recipient notifications / month | Novu Cloud | Knock | Courier |
| --- | ---: | --- | --- | --- |
| 50 events × 20 recipients | 1,000 | Free within 10,000 workflow runs | Free within 10,000 messages | Free within 10,000 sends |
| 500 events × 100 recipients | 50,000 | Above the 30,000 runs included in Pro starting at $30; confirm overage and applicable tier | Starter $250 for 50,000 messages | Business at published $0.005/send: $250 if all 50,000 are billed; confirm free allowance and send definition |

Novu bills per subscriber workflow run, including runs later filtered by preferences or conditions; one run may contain multiple channel steps. [Novu glossary](https://docs.novu.co/platform/additional-resources/glossary), [pricing](https://www.novu.co/pricing/). Knock counts a delivered message per recipient per channel, so in-app plus email can double the example to 100,000 messages: Starter $250 plus 50,000 × $0.005 = $500, excluding delivery provider costs. [Knock pricing](https://knock.app/pricing), [metering](https://docs.knock.app/manage-your-account/knock-plans). Courier publishes 10,000 free sends and $0.005 per send on Business, but its pricing page does not clearly establish whether the free allowance carries into Business; confirm before using a quote. [Courier pricing](https://www.courier.com/pricing). Verify how multi-channel and fan-out requests are counted on the contracted plan. Provider costs, taxes, development and operation are excluded from all figures.

## Decision and open questions

Start with a small Novu and Knock proof of concept, using the same event and recipient rules; Novu's tagged tabs and lower published paid entry are promising, while Knock's category filters and preferences are well documented. This is a conditional recommendation, not a procurement decision. Confirm independent unread counts and read state, accessible UI, membership synchronization, duplicate/retry handling, feed retention, privacy controls and exact pricing with each vendor. Include Courier if its filter and billing answers meet the same requirements. Compare against a Cadence-owned estimate after measuring the actual event and recipient distribution.
