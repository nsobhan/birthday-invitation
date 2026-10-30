# Birthday invitation + family RSVP (GitHub Pages)

A responsive, Evite-style invitation with **independent adult and child headcounts**. Works on iPhone, Android and desktop. No build tools required.

## How it works

- GitHub Pages hosts `index.html`, `styles.css`, `config.js`, and `app.js` for free.
- Supabase stores RSVP data. GitHub Pages alone cannot persist form responses.
- Each family fills in name, email, yes/no, adult count, child count and an optional note.
- The host sees all RSVPs privately in Supabase Table Editor. Guests **cannot read** other guests' RSVPs.
- This version accepts submissions only. There is no login, email notification, attendee-side editing, unique-email enforcement or automatic confirmation email. Hosts can change records in Supabase. Repeated submissions will create multiple records, so tell guests to submit only once.

## 1. Create database

1. Make a free project at https://supabase.com/ .
2. Open **SQL Editor**, paste contents of `supabase.sql`, and click **Run**.
3. Open the project's **Connect** dialog or **Settings > API Keys** and copy the **Project URL** and **Publishable key** (`sb_publishable_...`).
4. In `config.js`, replace the empty `supabaseUrl` and `supabasePublishableKey` with those two values.
5. Never put the **secret key** or `service_role` key into browser code. Publishable keys are intended for frontend use, paired with Row Level Security. This project configures insert-only permissions.

## 2. Edit party details

Edit `partyName`, `date`, `time`, `venue`, and `address` in `config.js`. The provided text uses 11 AM–1 PM and lets children stay after the party. Edit the welcome message in `index.html` if needed.

## 3. Publish on GitHub Pages

1. Create a **public** GitHub repository, e.g. `birthday-invitation`.
2. Upload the **contents** of this folder to the repository root, then commit.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, `main` and `/(root)`, then **Save**.
5. Your link will be `https://YOUR-USERNAME.github.io/birthday-invitation/` once deployment finishes. Share it by text, email, or QR code.

## 4. View headcounts

Open **Supabase > Table Editor > rsvps**. Each row includes `attending`, `adults` and `kids`. To total the YES RSVPs, run in SQL Editor:

```sql
select count(*) filter (where attending) as yes_families,
       coalesce(sum(adults) filter (where attending),0) as adults,
       coalesce(sum(kids) filter (where attending),0) as kids
from public.rsvps;
```

## Test before sending

Submit a sample YES RSVP with 2 adults/3 kids, and a NO RSVP. Verify both in Table Editor and in your aggregate SQL query. Delete these test rows in Table Editor before sharing. Check the page on an iPhone.

## Privacy & abuse considerations

The form collects a parent/family name and email. Tell families how you will use and delete their responses. Do not collect children's names unnecessarily. The public API intentionally permits anonymous **inserts**; strangers could spam submissions if they find the URL. For a larger/public event, implement CAPTCHA and server-side validation/rate limiting through a secure edge function. There is no secret authentication token in a static GitHub Pages app. Keep the URL limited to invitees and review submissions for duplicates. No guest count or guest names are publicly exposed.

## Troubleshooting

- The form shows "host is still setting up": you haven't entered the Supabase URL and publishable key in `config.js`.
- HTTP 401/403: confirm your publishable key, project URL, SQL grants and RLS policies.
- HTTP 400: verify the table name and fields match `supabase.sql`; check required/maximum values.
- GitHub shows README instead of website: `index.html` must be in repo root.
