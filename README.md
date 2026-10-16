# 🏨 Hotbeds Parent Enterprise Developer Matrix

Welcome to the central command documentation for the Hotbeds platform ecosystem. This file dictates our model task separation rules to protect the code from corruption and prevent hourly AI quota lockouts.

## 🧠 Section 1: Technical & Coding Matrix (Argon Tier)
Use the high-thinking model for these tasks.

| Capability Layer | 🧠 High-Thinking Tier ("Argon" / Ultra) |
| :--- | :--- |
| **Data Architecture** | **Data Normalization & DTO Mapping:** Parsing deeply nested JSON payloads from the RateHawk API response into local, type-safe Data Transfer Objects without mutation data loss. |
| **Concurrency Guard** | **Distributed Transaction Locks:** Writing ACID-compliant PostgreSQL transaction functions utilizing explicit row locks (`SELECT FOR UPDATE`) to prevent overbooking race conditions on curated room allotments. |
| **Security Gate** | **Cross-Domain Session & Auth Gates:** Architecting a secure JWT/OAuth2 authentication middleware layer that handles cross-domain token handshakes between the base site and the isolated Guild web app. |
| **Financial Ledger** | **Multi-Tenant Revenue Distribution Ledgers:** Designing relational database schemas with isolated foreign keys to calculate asynchronous 30%–60% profit splits and multi-city equity metrics. |
| **Identity Masking** | **Two-Tier Identity Encapsulation Modules:** Building backend mapping tables that safely associate real billing identities with string aliases, outputting an automated B2B "Phantom Manifest" via Node-Mailer. |

## ⚡ Section 2: Plain Layman’s Terms Matrix (Pro / Flash Tier)
Use execution models or quick updates for these tasks.

| Business Layer | ⚡ Execution Tier (Pro / Flash) |
| :--- | :--- |
| **Visual Interfaces** | **Building the Visual Screen Layouts:** Designing the physical appearance of the web pages, like creating the look of a search box or a clean product result box using Tailwind CSS. |
| **Form Safety** | **Typing Error Protection:** Writing quick rules that check if a user typed a real email address or a valid phone number before letting them submit a form. |
| **Styling & Tweaks** | **Visual Color & Text Adjustments:** Tinkering with the visual design elements, like turning a header button emerald green, making text bold, or fixing padding spacing gaps. |
| **Testing Simulation** | **Generating Fake Test Data:** Creating a static list of 15 fake hotels and fictional room prices so you can see how the layout looks on your screen before your site goes live. |
| **Frontend Utility** | **Instant List Sorting Buttons:** Creating the quick buttons that let a user immediately rearrange their results by "Lowest Price," "Shortest Distance," or "Most Savings." |

## 🛡️ The AI Execution Guardrail Checklist
When prompting execution models for tasks in Section 2, you must enforce this pipeline:
1. **Inject the Setup Prompt:** Paste your task into the model with: *"Review these exact task instructions and repeat them back to me. **Do not write any code yet.** Acknowledge and wait for my go word."*
2. **Verify & Issue the Go Word:** Once the model correctly plays back your requirements without inventing or missing anything, type your go word to initiate the generation.
3. **The Clean Break Rule:** The absolute second the model outputs your clean code snippet, copy it into your local code, **delete that chat thread completely**, and open a fresh window to wipe the cache context to zero.
