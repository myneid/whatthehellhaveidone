# What the HELL have i DONE

<p align="center">
  <img src="public/whatthehellhaveidone.png" alt="What the HELL have i DONE" width="300" />
</p>

<p align="center">
  <strong>A full-featured Kanban project management platform with GitHub sync, Discord notifications, AI agent access via MCP, and a complete work log.</strong>
</p>

<p align="center">
  <a href="https://whatthehellhaveidone.net">Hosted version</a> ·
  <a href="#installation">Self-host</a> ·
  <a href="#license">License</a>
</p>

---

## Hosted Version

Want to skip the setup? The hosted version is live at **[https://whatthehellhaveidone.net](https://whatthehellhaveidone.net)** — sign up and start managing your chaos immediately.

---

## Features

- **Kanban Boards** — Drag-and-drop cards across customisable lists. Priorities, due dates, labels, assignees, checklists, comments, and file attachments.
- **Projects** — Group boards under projects. Invite team members with role-based access (owner / admin / member / viewer).
- **GitHub Sync** — Connect repositories to boards. Import issues as cards, create GitHub issues from cards, and stay in sync via webhooks.
- **Discord Notifications** — Fire webhook messages to Discord on card creation, moves, and due-date events.
- **Work Log** — Every card action is automatically logged. Add manual entries with `#project` hashtag routing, filter by date/source, and export to CSV or JSON.
- **Document Repository** — Write project docs in Markdown, organise them in folders, and surface them on demand.
- **MCP Server** — An [MCP-compatible](https://modelcontextprotocol.io) server lets Claude and other AI agents read boards, create/move cards, log work, and fetch documents — all within your permission model.
- **Filament Admin** — A full admin panel at `/admin` for user, project, board, and token management.
- **Trello Import** — Import Trello JSON exports to spin up boards instantly.
- **Real-time** — Laravel Reverb powers live card updates across connected clients.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4 |
| Frontend | React 19, Inertia.js v3, TypeScript, Tailwind CSS v4 |
| UI components | shadcn/ui |
| Drag & drop | @dnd-kit |
| Auth | Laravel Fortify + Socialite (GitHub OAuth) |
| API tokens | Laravel Sanctum |
| Real-time | Laravel Reverb (WebSockets) |
| Admin | Filament v5 |
| AI agent access | laravel/mcp |
| Queues | Laravel Queue (database driver by default) |
| Database | SQLite (dev) / MySQL or PostgreSQL (production) |

---

## Installation

### Requirements

- PHP 8.4+
- Composer
- Node.js 20+
- A database (SQLite works out of the box for local dev)

### 1. Clone the repository

```bash
git clone https://github.com/yourhandle/whatthehellhaveidone.git
cd whatthehellhaveidone
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Configure the environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set at minimum:

```dotenv
APP_NAME="What the HELL have i DONE"
APP_URL=http://localhost

DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite   # defaults to database/database.sqlite

# GitHub OAuth (optional — enables Connect GitHub button)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URL="${APP_URL}/github/callback"

# Laravel Reverb (real-time, optional for local dev)
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=localhost
REVERB_PORT=8080

# Queue driver — use 'database' for simple setups, 'redis' for production
QUEUE_CONNECTION=database
```

### 4. Run migrations

```bash
php artisan migrate
```

### 5. Build frontend assets

```bash
npm run build
# or for hot-reloading during development:
npm run dev
```

### 6. Start the application

```bash
# Using Laravel Herd or Valet — the site is served automatically.

# Or with the built-in dev server:
composer run dev
```

The app will be at `http://localhost:8000` (or your configured `APP_URL`).

### 7. (Optional) Queue worker

Background jobs handle GitHub webhook processing, Discord notifications, and Trello imports. Start a worker:

```bash
php artisan queue:work
```

### 8. (Optional) Real-time with Reverb

```bash
php artisan reverb:start
```

---

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers) and create a new OAuth App.
2. Set the **Authorization callback URL** to `{YOUR_APP_URL}/github/callback`.
3. Copy the Client ID and Secret into your `.env`.

---

## MCP Server (AI Agent Access)

The MCP server is available at `/mcp/whhid`. It requires a Sanctum API token.

1. Log in and go to **Settings → API Tokens** (or create one programmatically).
2. Configure your AI client (e.g. Claude Desktop) to connect:

```json
{
  "mcpServers": {
    "projectforge": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-app.com/mcp/whhid"],
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

Available tools: `list_projects`, `get_board`, `list_cards`, `get_card`, `create_card`, `move_card`, `create_work_log_entry`, `get_daily_work_log`, `list_documents`, `get_document`.

---

## Admin Panel

The Filament admin panel lives at `/admin`. The first user to register can be promoted to super admin directly in the database:

```bash
php artisan tinker --execute 'App\Models\User::first()->update(["is_super_admin" => true]);'
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is released under the **[Unlicense](https://unlicense.org)** — you can do whatever you want with it. No attribution required.

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute
this software, either in source code form or as a compiled binary, for any
purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of
this software dedicate any and all copyright interest in the software to
the public domain.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
