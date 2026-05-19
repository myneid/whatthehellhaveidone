# Demo data seeding — Team guide

Use this to spin up a **shared demo workspace** on a fresh install or local machine. Demo data is attached to the standard test account, not a personal email.

---

## Demo account

| Field | Value |
|-------|--------|
| Email | `test@example.com` |
| Name | Test User (from `DatabaseSeeder`) |
| Password | Whatever you set when seeding — see below |

`DatabaseSeeder` creates this user, then runs `DemoDataSeeder`.

---

## Quick start

### Fresh database (recommended)

```bash
php artisan migrate:fresh --seed
```

This creates `test@example.com` and seeds all demo projects, boards, lists, labels, and cards.

### Already migrated — seed only

If `test@example.com` already exists (e.g. from a previous `db:seed`):

```bash
php artisan db:seed --class=DemoDataSeeder
```

If the user does **not** exist yet:

```bash
php artisan db:seed
```

Or register/login flow: run `php artisan db:seed` once to create the test user, then run `DemoDataSeeder` as above.

---

## What gets seeded

### Project: Website Redesign

| Item | Value |
|------|--------|
| Project slug | `demo-website-redesign` |
| Board | **Sprint Board** (`demo-website-sprint`) |
| Lists | Backlog, To Do, In Progress, Review, Done |
| Labels | Bug, Feature, Urgent, Frontend, Backend |
| Sample cards | 5 (one per column) |

**Try it:** `/boards/demo-website-sprint`

### Project: Mobile App

| Item | Value |
|------|--------|
| Project slug | `demo-mobile-app` |
| Board | **Release Train** (`demo-mobile-release`) |
| Lists | Same five columns |
| Sample cards | 4 |

**Try it:** `/boards/demo-mobile-release`

### Board defaults

- **Review** column is set as the **Pull request automation** target (`copilot_done_list_id`).
- Cards in **In Progress** / **Review** may have assignees on the demo user where the seeder sets `assign => true`.
- Seeder is **idempotent** for projects/boards/lists/labels; it will **not** duplicate cards if the board already has cards.

---

## Sign in locally

1. Run migrations + seed (above).
2. Open the app (e.g. `https://whatthehellhaveidone.test` with Herd).
3. Log in as **`test@example.com`**.
   - If Fortify registration is enabled and no password was set, use **Register** with that email or reset password via your usual dev flow.
   - After `migrate:fresh --seed`, the factory default password is typically **`password`** (Laravel factory default) unless your `UserFactory` overrides it — check `database/factories/UserFactory.php` if login fails.

---

## GitHub workflow testing

Demo data does **not** connect GitHub or create issues. To test the [GitHub + board workflow](GITHUB-BOARD-WORKFLOW.md):

1. Log in as `test@example.com`.
2. Connect GitHub under **Settings → Integrations**.
3. Link a repo on the Sprint Board and configure **In Progress** → **Create GitHub issue**.

---

## Commands reference

| Command | Effect |
|---------|--------|
| `php artisan migrate:fresh --seed` | Reset DB, create test user, seed demo data |
| `php artisan db:seed` | Run `DatabaseSeeder` (user + demo data) |
| `php artisan db:seed --class=DemoDataSeeder` | Demo data only (requires `test@example.com` to exist) |

---

## Changing the demo user email

The email is defined once in code:

```php
// database/seeders/DemoDataSeeder.php
public const DEMO_USER_EMAIL = 'test@example.com';
```

Do not change this to a personal email in committed code; keep `test@example.com` for the team.

---

## Related docs

- [GITHUB-BOARD-WORKFLOW.md](GITHUB-BOARD-WORKFLOW.md) — In Progress → assign → PR → Review
- In-app: `/docs/github-workflow`
- Sprint board internals (local): `docs/boards/sprint-board.md`
