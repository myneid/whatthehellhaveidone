# Sprint Board

Internal reference for the **Sprint Board** demo board (`/boards/demo-website-sprint`) under the **Website Redesign** project.

## Demo data

Seeded via `php artisan db:seed` for `test@example.com` (see `DEMO-DATA.md` in repo root).

| Column | Card | Labels | Notes |
|--------|------|--------|--------|
| Backlog | Audit current homepage | Feature | medium priority |
| To Do | Wireframe pricing page | Frontend, Feature | high, due ~5 days |
| In Progress | Implement hero section | Frontend | high, assigned to you |
| Review | Accessibility pass on nav | Bug, Urgent | urgent |
| Done | Set up analytics events | Backend | low, completed |

Board-level labels: **Bug**, **Feature**, **Urgent**, **Frontend**, **Backend**.

- Project slug: `demo-website-redesign`
- Board slug: `demo-website-sprint`
- Background accent: `#1e3a5f` (navy bar under title)

## Backend

| Piece | Location |
|-------|----------|
| Route | `boards.show` → `GET /boards/{board:slug}` |
| Controller | `app/Http/Controllers/BoardController.php` → `show()` |
| Page props | `board`, `githubAccounts` |
| Authorization | `BoardPolicy` → `view` |

`show()` eager-loads:

- `project`, `owner`, `members.user`, `labels`, `discordWebhook`, `githubRepositories`
- `lists` (non-archived, ordered by `position`) with `cards` (assignees, labels, attachments, githubLink, checklists.items, comments.user, creator)

## Frontend

| Piece | Location |
|-------|----------|
| Page | `resources/js/pages/boards/show.tsx` |
| Card detail | `resources/js/components/boards/card-modal.tsx` |
| Board settings | `resources/js/components/boards/board-settings-sheet.tsx` |
| Layout | `AppLayout` → sidebar + breadcrumbs (Dashboard → project → board) |

### Libraries

- **React 19** + **Inertia v3** — `Head`, `Link`, `router`, `useForm`
- **@dnd-kit** — drag/drop for cards (between columns) and column reorder
- **Wayfinder** — `@/routes/boards`, `@/routes/cards`, `@/routes/lists`, etc.
- **shadcn/ui** — `Button`, `Input`, `Popover`, `Select`
- **lucide-react** — icons
- **Tailwind CSS** — layout, priority left-border colors

### Mutations (Inertia `router`, no separate API client)

| Action | Method | Route helper |
|--------|--------|----------------|
| Create card | `POST` | `cardRoutes.store()` |
| Move card | `POST` | `cardRoutes.move(card)` |
| Reorder column | `PATCH` | `listRoutes.update(list)` |
| Column GitHub action | `PATCH` | `listRoutes.update(list)` — `github_action` |
| Delete column | `DELETE` | `listRoutes.destroy(list)` |
| Add column | `POST` | `boardListRoutes.store(board)` |

Card moves use optimistic UI in React, then `router.reload({ only: ['board'], preserveScroll: true })` after ~1.4s.

When a card lands on a column with `github_action: open_issue` (e.g. **In Progress**), `WorkAssigneeDialog` prompts for **Copilot** or a **team member**. Human assignment sets the card assignee and disables automatic Copilot PR review (`request_copilot_review` on `github_card_links`).

Backend move handler: `CardController@move` — updates `list_id` / `position`, activity log, work log, fires `CardMoved` event.

## Real-time

- **Laravel Echo + Reverb** are configured in `resources/js/app.tsx` (`configureEcho({ broadcaster: 'reverb' })`).
- **Sprint Board does not subscribe** to board/card channels — no live updates from other users without a manual reload.

## Related (not this page)

| Location | Purpose |
|----------|---------|
| `resources/js/pages/docs/*.tsx` | In-app user docs at `/docs/*` |
| `projectforge-kanban-prd.md` | Product requirements (repo root) |
| Project Documents (DB) | Per-project wiki in the app |
