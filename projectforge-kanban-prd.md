# Product Requirements Document (PRD)

## Project: Kanban Project Board Platform

### Working Title: ProjectForge

---

## 1. Executive Summary

ProjectForge is a full-featured Kanban-style project management platform inspired by Trello, designed for teams, agencies, and technical organizations that need visual task management with developer-focused integrations.

The platform supports standalone boards, parent projects with multiple boards underneath, GitHub Issue synchronization, and Discord webhook notifications per board.

The product vision is:

**Trello-style simplicity + GitHub workflow integration + Discord team updates.**

---

## 2. Core Objectives

### Primary Goals

#### A. Kanban Board System

Users should be able to:

- Create unlimited project boards.
- Create a main project that contains multiple boards.
- Create, rename, reorder, and archive board columns/lists.
- Create cards inside lists.
- Drag cards between lists.
- Assign cards to users.
- Add labels, due dates, attachments, comments, checklists, and activity history.

#### B. GitHub Integration

Users should be able to:

- Connect a GitHub account using OAuth.
- Connect a board to one or more GitHub repositories.
- Create a GitHub Issue from a card.
- Import GitHub Issues as cards.
- Link existing GitHub Issues to cards.
- Sync issue/card status, labels, title, description, and comments where appropriate.

#### C. Discord Integration

Users should be able to:

- Add a Discord webhook URL to each board.
- Configure which board events post to Discord.
- Send updates when cards are created, moved, assigned, commented on, completed, or synced with GitHub.

---

## 3. Target Users

### Primary Users

- Software development teams
- Web agencies
- Freelance developers
- Product teams
- Open-source maintainers
- Small businesses managing technical projects

### Secondary Users

- Client-facing project managers
- QA testers
- Support teams
- Community-driven development teams using Discord

---

## 4. User Roles and Permissions

### Super Admin

Can manage the entire platform.

Permissions:

- Manage users.
- Manage billing, if SaaS billing is added later.
- View system logs.
- Manage integrations globally.
- Access admin dashboard.

### Project Owner

Can manage a project and all boards under that project.

Permissions:

- Create/edit/delete projects.
- Create/edit/delete boards.
- Invite users.
- Configure GitHub integrations.
- Configure Discord webhooks.
- Manage project permissions.

### Board Admin

Can manage a specific board.

Permissions:

- Manage lists.
- Manage cards.
- Configure board-level integrations.
- Manage board members.
- Archive cards/lists.

### Member

Can actively work inside boards.

Permissions:

- Create/edit cards.
- Comment on cards.
- Move cards.
- Assign themselves or others, depending on board settings.
- Upload attachments.

### Viewer

Read-only access.

Permissions:

- View boards.
- View cards.
- View activity.
- Cannot modify content.

---

## 5. Product Structure

ProjectForge should support two organizational models.

### 5.1 Standalone Boards

A user can create a board directly without placing it inside a larger project.

Example:

- Website Redesign Board
- Bug Tracker Board
- Content Calendar Board

### 5.2 Main Projects With Multiple Boards

A user can create a main project that contains several boards.

Example:

**FOSH Platform**

- Backend Development Board
- Mobile App Board
- Marketing Board
- Bug Tracking Board
- Feature Requests Board

This allows teams to organize work at a higher level while still maintaining focused boards.

---

## 6. Core Features

## 6.1 Projects

A project is an optional parent container for multiple boards.

### Project Features

- Project name
- Project description
- Project owner
- Project members
- Project-level permissions
- Project dashboard
- Project activity feed
- Project archive status
- Multiple boards under one project

### Project Dashboard

The project dashboard should show:

- All boards in the project.
- Recent card activity.
- Overdue cards.
- Cards assigned to the current user.
- GitHub sync status.
- Discord notification status.
- Basic project health summary.

---

## 6.2 Boards

A board represents a Kanban workspace.

### Board Features

- Board name
- Board description
- Board visibility:
  - Private
  - Team
  - Public/read-only, optional future feature
- Board members
- Board admins
- Lists/columns
- Cards
- Labels
- Activity feed
- GitHub repository connections
- Discord webhook configuration

### Board Templates

The platform should eventually support reusable templates such as:

- Software Development
- Bug Tracking
- Content Calendar
- Client Project
- Sprint Board
- Personal Tasks

MVP can include manually created boards only.

---

## 6.3 Lists / Columns

Lists are columns inside a board.

Examples:

- Backlog
- To Do
- In Progress
- Review
- QA
- Done
- Blocked

### List Features

- Create list
- Rename list
- Reorder list
- Archive list
- Set optional Work In Progress limit
- Sort cards manually or by due date/priority

---

## 6.4 Cards

Cards represent work items.

### Card Fields

Each card should support:

- Title
- Description with Markdown support
- Assigned users
- Labels
- Priority
- Due date
- Start date, optional
- Checklist items
- Comments
- Attachments
- GitHub Issue link
- Activity history
- Watchers/subscribers
- Archived status

### Card Actions

Users should be able to:

- Create card
- Edit card
- Move card across lists
- Reorder card inside list
- Assign/unassign users
- Add/remove labels
- Set due date
- Add comments
- Upload attachments
- Link to GitHub Issue
- Create GitHub Issue from card
- Archive card
- Delete card, depending on permissions

---

## 6.5 Comments and Activity

Each card should have a unified activity timeline.

Timeline entries may include:

- Card created
- Card moved
- Title changed
- Description changed
- User assigned
- Label added
- Comment added
- Due date changed
- GitHub Issue linked
- GitHub Issue synced
- Discord notification sent
- Attachment uploaded

Comments should support:

- Markdown
- Mentions
- Edit history, optional future feature
- GitHub comment sync, if enabled

---

## 6.6 Labels

Boards should support custom labels.

Label fields:

- Name
- Color
- Board ID
- Optional description

Cards may have multiple labels.

Example labels:

- Bug
- Feature
- Urgent
- Client Request
- Backend
- Frontend
- Blocked

---

## 6.7 Attachments

Cards should support file attachments.

Attachment storage options:

- Local disk for development.
- S3-compatible storage for production.

Attachment metadata:

- Original filename
- File size
- MIME type
- Uploaded by
- Upload date
- Storage path

---

## 7. Trello Import and Board Export

## 7.1 Trello Board Import

The platform should support importing an existing Trello board so users can migrate into ProjectForge without manually recreating their lists, cards, labels, and checklists.

### Import Options

The MVP should support:

- Import from Trello board export JSON file.

A future version may support:

- Direct Trello import through Trello API authentication.
- Import from a public Trello board URL, when supported.
- Bulk import of multiple Trello boards.

### Trello Data to Import

The Trello importer should attempt to import:

- Board name
- Board description
- Lists/columns
- Cards
- Card descriptions
- Card comments, where available in export
- Labels
- Due dates
- Checklists
- Checklist item completion state
- Card members, where mappable
- Attachments, where downloadable or included as references
- Card archived state
- Original Trello card URL
- Original Trello card ID, stored as source metadata

### Import Flow

1. User chooses **Import Board**.
2. User selects **Trello JSON Export**.
3. User uploads the Trello JSON file.
4. System validates the file.
5. System previews detected board data:
   - Board name
   - Number of lists
   - Number of cards
   - Number of labels
   - Number of checklists
   - Number of attachments
6. User maps Trello members to existing platform users, invites new users, or skips unmapped members.
7. User confirms import.
8. System queues the import.
9. System creates the board, lists, labels, cards, checklists, comments, and attachment metadata.
10. System displays an import summary.

### Import Requirements

The importer must:

- Validate Trello JSON before processing.
- Reject malformed or unsupported files with clear errors.
- Process imports through queued jobs for larger boards.
- Preserve original Trello list/card ordering.
- Preserve original Trello card URLs as metadata.
- Preserve original creation dates where practical.
- Avoid duplicate imports by storing imported source identifiers.
- Log skipped or unsupported items.
- Allow the user to download an import report.

### Import Summary

After import, the system should show:

- Lists imported
- Cards imported
- Labels imported
- Checklists imported
- Comments imported
- Attachments imported or skipped
- Members mapped or skipped
- Errors
- Warnings

### Suggested Import Tables / Fields

A source tracking layer should be added so future imports and re-imports do not create duplicates.

Possible fields:

- source_system, example: `trello`
- source_board_id
- source_list_id
- source_card_id
- source_payload, optional JSON
- imported_at

These can exist either as columns on imported records or in a dedicated `external_imports` table.

---

## 7.2 Full Board JSON Export

Each board should support a full JSON export for backup, migration, debugging, support, and future re-import.

### Exported Data

The JSON export should include:

- Board metadata
- Project relationship, if any
- Board settings
- Lists and list order
- Cards and card order
- Card descriptions
- Labels
- Card-label relationships
- Assignments
- Comments
- Checklists
- Checklist item completion state
- Attachments metadata
- GitHub issue links
- GitHub repository mappings
- Discord webhook configuration metadata
- Activity logs, optional
- Custom fields, future feature
- Export schema version
- Export timestamp

### Export Security

The default export should be safe to share with another developer or support person.

The export must not include:

- GitHub OAuth access tokens
- Raw Discord webhook URLs
- Encrypted secrets
- Passwords
- Session data
- Private system-only audit data

Optional future feature:

- Admin-only sensitive export mode that includes selected secrets, clearly marked as sensitive and protected behind confirmation.

### Export Uses

Full board JSON export supports:

- Board backup
- Migration between installations
- Debugging support
- Account transfer
- Workspace transfer
- Disaster recovery
- Future re-import
- Local development seeding

### Export Format Requirements

The export should be:

- Valid JSON.
- Pretty-printed by default.
- Versioned with an `export_schema_version`.
- Self-contained where practical.
- Compatible with a future board re-import tool.
- Downloaded as a `.json` file.

Example filename format:

```text
projectforge-board-{board-slug}-{YYYY-MM-DD}.json
```

---

## 8. Individual Work Log

The platform should include an individual work log system that shows what each person actually did each day. This should combine automatic board/card activity with manual and API-submitted work entries.

The work log should be useful for daily summaries, team accountability, client reporting, personal productivity tracking, and reconstructing what happened during a project.

---

## 8.1 Purpose

The work log should answer:

- What did I do today?
- Which cards did I move or update?
- Which cards changed status because of my work?
- What project did that work belong to?
- What non-card work did I spend time on?
- What did each team member accomplish over a date range?
- What work happened outside of the Kanban board?

---

## 8.2 Work Log Sources

### Automatic Card Activity

The system should automatically create work log entries when a user:

- Creates a card.
- Moves a card from one list/status to another.
- Completes a card.
- Reopens a card.
- Changes card priority.
- Adds a meaningful comment.
- Adds or completes checklist items.
- Links a GitHub Issue.
- Updates a linked GitHub Issue.
- Updates card assignment.
- Adds attachments.
- Changes a due date.

### Manual Work Entries

Users should be able to manually add work entries that are not tied to a card.

Examples:

- Client call
- Debugging session
- Research
- Deployment
- Code review
- Documentation
- Planning
- Admin work
- Watching a tutorial or YouTube video
- Reading API documentation
- Testing a third-party service
- Any other activity that explains where their time went

The system should intentionally allow broad logging, even for activities that are not directly tied to deliverables.

Example:

```text
Watched YouTube video on GitHub webhook signatures #projectforge
```

---

## 8.3 Work Log API

The platform should expose an authenticated API for creating work log entries from external tools, scripts, browser extensions, CLI utilities, or automations.

### API Use Cases

The API should support:

- Developer CLI tools posting work notes throughout the day.
- Browser extensions logging research or video/tutorial watching.
- Time trackers posting completed activity blocks.
- Git commit hooks posting summaries.
- Deployment scripts posting release notes.
- External automations posting daily activity.
- AI tools posting completed task summaries.
- Mobile shortcuts posting quick work notes.

### API Entry Payload

The API should allow clients to submit:

- Entry text/body
- Optional project hashtag, such as `#fosh`, `#spicygigs`, or `#client-redesign`
- Optional project ID
- Optional board ID
- Optional card ID
- Optional start time
- Optional end time
- Optional duration
- Optional source, such as `cli`, `browser_extension`, `manual`, `github`, `system`, `api`, or `timer`
- Optional URL/reference
- Optional metadata JSON

### Example API Request

```json
{
  "body": "Watched YouTube video on OAuth device flow and took notes #projectforge",
  "source": "browser_extension",
  "reference_url": "https://youtube.com/example",
  "started_at": "2026-04-28T09:00:00-07:00",
  "ended_at": "2026-04-28T09:22:00-07:00",
  "metadata": {
    "content_type": "video",
    "browser": "Chrome"
  }
}
```

---

## 8.4 Hashtag Project Mapping

Work log entries should support hashtags that designate project association.

Example:

```text
Fixed webhook retry bug and reviewed GitHub docs #projectforge
```

The system should:

- Parse hashtags from submitted text.
- Match hashtags to projects, boards, or aliases.
- Allow project owners to define accepted hashtags/aliases.
- Store unmatched hashtags for later mapping.
- Allow users to correct project assignment after submission.
- Support multiple hashtags on one entry.
- Prefer explicit `project_id` over hashtag inference when both are provided.

### Project Alias Examples

A project may define aliases such as:

- `#projectforge`
- `#kanban`
- `#boardapp`
- `#client-redesign`

---

## 8.5 Work Log Views

### Personal Daily Work Log

Each user should have a daily work log showing:

- Manual entries.
- API-submitted entries.
- Cards created.
- Cards updated.
- Cards moved between statuses.
- Cards completed.
- GitHub-linked work.
- Related project.
- Related board.
- Related card.
- Time of each entry.
- Source of each entry.

### Team Work Log

Project owners/admins should be able to view team activity by:

- Project
- Board
- User
- Date range
- Card
- Entry source
- Status change type

### Card-Related Work Log

Each card should show a mini work log of:

- Who moved it.
- When it changed status.
- Who commented.
- Who completed checklist items.
- Who linked or updated GitHub Issues.

---

## 8.6 Sorting and Searching

The work log should support:

- Search by text.
- Search by hashtag.
- Filter by user.
- Filter by project.
- Filter by board.
- Filter by card.
- Filter by source.
- Filter by date range.
- Filter by status change type.
- Sort newest first.
- Sort oldest first.
- Sort by project.
- Sort by user.
- Sort by source.

---

## 8.7 Work Log Export

Users and admins should be able to export work logs as:

- JSON
- CSV
- Markdown daily summary, future feature

Export filters should include:

- Date range
- User
- Project
- Board
- Source
- Hashtag

---

## 8.8 Suggested Work Log Tables

### work_log_entries

Stores all manual, API, and system-generated work log entries.

Important fields:

- id
- user_id
- project_id, nullable
- board_id, nullable
- card_id, nullable
- source
- entry_type
- body
- hashtags JSON
- started_at, nullable
- ended_at, nullable
- duration_seconds, nullable
- reference_url, nullable
- metadata JSON
- created_at
- updated_at

### work_log_project_aliases

Stores hashtag aliases for projects.

Important fields:

- id
- project_id
- alias
- created_at
- updated_at

### work_log_card_events

Optional table or database view for normalized card status changes.

Important fields:

- id
- user_id
- card_id
- from_list_id
- to_list_id
- event_type
- created_at

---

## 8.9 Work Log API Security

The API should support:

- Personal access tokens.
- Token naming.
- Token revocation.
- Optional per-token scopes.
- Rate limiting.
- Request validation.
- Audit logging.
- User-owned entries only unless elevated permissions exist.

Possible scopes:

- `worklog:create`
- `worklog:read`
- `worklog:update`
- `worklog:export`

---

## 8.10 MVP Work Log Scope

The MVP should include:

- Automatic work log entries for card creation, movement, completion, and comments.
- Manual work log entries.
- Authenticated API endpoint for creating entries.
- Hashtag parsing for project assignment.
- Personal daily work log view.
- Search/filter/sort controls.
- JSON export for work log entries.

---

## 9. Project Document Repository

Each project should include a document repository for Markdown files. This should function as a lightweight project wiki, documentation library, and internal knowledge base.

The document repository should live inside each project and inherit from the project's user, role, and group permission system.

---

## 9.1 Purpose

The document repository should allow teams to store and manage:

- Project specs
- Product requirements
- Meeting notes
- Technical documentation
- Client notes
- Deployment instructions
- API notes
- Research notes
- Internal procedures
- Markdown-based reports
- Support playbooks
- Onboarding notes

---

## 9.2 Document Format

All documents should be stored as Markdown files.

Supported format:

- `.md`

Optional future support:

- Frontmatter metadata
- Mermaid diagrams
- Table of contents generation
- Markdown export to PDF
- Markdown export to HTML
- Versioned published documents

---

## 9.3 Folder Structure

Each project should have a document area with folders.

Folder features:

- Create folders
- Rename folders
- Move folders
- Archive folders
- Delete folders, depending on permissions
- Nested folders, recommended
- Sort folders manually
- Sort folders alphabetically
- Folder-level visibility controls

Example folders:

- `/Specs`
- `/Meeting Notes`
- `/Technical Docs`
- `/Client Notes`
- `/Deployment`
- `/Research`
- `/Support`
- `/Operations`

---

## 9.4 Document Features

Users should be able to:

- Create Markdown documents
- Edit Markdown documents
- Preview Markdown documents
- Move documents between folders
- Rename documents
- Archive documents
- Delete documents, depending on permissions
- Search document titles
- Search document content
- View document metadata
- View document history, future feature
- Restore previous versions, future feature

Document metadata should include:

- Title
- Folder
- Author/creator
- Last editor
- Created date
- Updated date
- Access level
- Archived status

---

## 9.5 Access Control

Access should be controlled at the project, folder, and document level.

### Access Levels

Supported access levels:

- No access
- View only
- Edit
- Manage

### Project-Level Defaults

Project owners should be able to define default document permissions for:

- Project owners
- Project admins
- Board admins
- Members
- Viewers
- Custom project groups

### Folder-Level Permissions

Folders should support permissions for:

- Individual users
- Groups/teams
- Project roles

Folder permissions should determine whether a user can:

- See the folder
- View documents inside the folder
- Edit documents inside the folder
- Create documents inside the folder
- Manage the folder
- Manage folder permissions

### Document-Level Overrides

Individual Markdown files should optionally override folder permissions.

Examples:

- `/Client Notes` folder is viewable only by Project Owner and Client Manager group.
- `/Technical Docs` folder is viewable by all developers and editable by senior developers.
- A specific file inside `/Deployment` is editable only by admins.
- A client-facing README is viewable by Clients but editable only by Managers.

### Permission Inheritance

Recommended inheritance order:

1. Project default document permissions
2. Folder permissions
3. Document-specific overrides

Document-specific permissions should win over folder permissions.

---

## 9.6 Project Groups

Projects should support user groups for document permissions.

Example groups:

- Developers
- Designers
- Clients
- Managers
- Admins
- QA
- Contractors
- External Reviewers

Groups should be usable for:

- Folder visibility
- Folder editing
- Document viewing
- Document editing
- Document management

A user may belong to multiple project groups.

---

## 9.7 Markdown Editor

The editor should be a full Markdown editor with easy toolbar buttons.

Toolbar actions should include:

- Bold
- Italic
- Headings
- Bullet list
- Numbered list
- Checklist
- Blockquote
- Code block
- Inline code
- Link
- Image link/embed
- Table helper
- Horizontal rule
- Preview toggle
- Split editor/preview mode

Recommended editor options:

- MDXEditor
- Milkdown
- TipTap with Markdown support
- EasyMDE, if a simpler editor is preferred

The editor should support:

- Autosave
- Manual save
- Unsaved changes warning
- Markdown preview
- Keyboard shortcuts
- Permission-aware editing
- Read-only mode
- Fullscreen editing mode, optional

The editor should feel approachable for non-technical users while still producing clean Markdown.

---

## 9.8 Search

The document repository should support:

- Search by document title
- Search by Markdown content
- Filter by folder
- Filter by author
- Filter by last updated date
- Filter by permissions/access level
- Filter by archived status

Search results must respect document and folder permissions. Users should never see search results for documents they cannot access.

---

## 9.9 Suggested Document Tables

### document_folders

Stores project document folders.

Important fields:

- id
- project_id
- parent_id, nullable
- name
- slug
- position
- archived_at
- created_at
- updated_at

### project_documents

Stores Markdown documents.

Important fields:

- id
- project_id
- document_folder_id, nullable
- creator_id
- last_editor_id, nullable
- title
- slug
- markdown_body
- archived_at
- created_at
- updated_at

### project_groups

Stores project-level groups.

Important fields:

- id
- project_id
- name
- created_at
- updated_at

### project_group_members

Stores group membership.

Important fields:

- id
- project_group_id
- user_id
- created_at
- updated_at

### document_permissions

Stores folder and document permissions.

Important fields:

- id
- project_id
- subject_type, folder or document
- subject_id
- grantee_type, user/group/role
- grantee_id, nullable for role-based grants
- access_level, none/view/edit/manage
- created_at
- updated_at

### document_versions

Optional future table for document history.

Important fields:

- id
- project_document_id
- editor_id
- markdown_body
- change_summary
- created_at

---

## 9.10 MVP Document Repository Scope

The MVP should include:

- Project document area
- Markdown-only documents
- Folder creation and organization
- Nested folders, if practical
- View/edit permissions by user
- Folder visibility control
- Basic project groups
- Markdown editor with toolbar
- Markdown preview
- Search by title/content

Future versions can add full version history, restore points, public share links, PDF export, and advanced publishing workflows.

---

## 10. MCP Server

The platform should include a Model Context Protocol (MCP) server so AI agents, coding assistants, local automation tools, and developer workflows can safely interact with a user's ProjectForge account.

MCP provides a standardized way for applications to expose tools, resources, and prompts to AI agents. In ProjectForge, the MCP server should act as a controlled gate between agents and the user's projects, boards, cards, work logs, documents, and exports.

---

## 10.1 Purpose

The MCP server should allow authorized agents to:

- Read projects.
- Read boards, lists, and cards.
- Create and update cards.
- Move cards between statuses.
- Add comments to cards.
- Read Markdown project documents.
- Create or update Markdown project documents, if authorized.
- Add work log entries.
- Search work logs.
- Export board data.
- Generate project summaries.
- Interact with GitHub-linked cards, within granted permissions.

The goal is to let a user connect an agent to their account without giving that agent unrestricted control of everything.

---

## 10.2 MCP Capabilities

The MCP server should expose:

- **Tools** for actions an agent can perform.
- **Resources** for readable project context.
- **Prompts** for reusable workflows and structured agent behaviors.

---

## 10.3 Authentication and Authorization

MCP access must be explicitly enabled by the user or project owner.

Authentication options:

- Personal access tokens.
- Project-scoped agent tokens.
- OAuth application tokens, future feature.

Authorization requirements:

- Tokens must have scopes.
- Tokens must be revocable.
- Tokens must be rate-limited.
- Tokens must map to a real user or service account.
- MCP actions must obey the same project, board, card, document, and work log permissions as the web app.
- MCP must never bypass normal Laravel policies.

Suggested scopes:

- `mcp:read`
- `mcp:write`
- `boards:read`
- `boards:write`
- `cards:read`
- `cards:write`
- `documents:read`
- `documents:write`
- `worklog:read`
- `worklog:create`
- `exports:create`
- `github:read`
- `github:write`

---

## 10.4 MCP Tools

Suggested MCP tools are listed below.

### Board and Card Tools

- `list_projects`
- `get_project`
- `list_boards`
- `get_board`
- `list_board_lists`
- `list_cards`
- `get_card`
- `create_card`
- `update_card`
- `move_card`
- `comment_on_card`
- `assign_card`
- `add_card_label`
- `complete_card`

### Work Log Tools

- `create_work_log_entry`
- `search_work_log`
- `get_daily_work_log`
- `export_work_log`

### Document Tools

- `list_document_folders`
- `list_documents`
- `get_document`
- `create_document`
- `update_document`
- `move_document`
- `search_documents`

### Import and Export Tools

- `export_board_json`
- `get_import_status`

### GitHub Integration Tools

- `list_linked_github_issues`
- `create_github_issue_from_card`
- `sync_card_with_github_issue`

---

## 10.5 MCP Resources

Suggested readable resources:

- `projectforge://projects/{project_id}`
- `projectforge://boards/{board_id}`
- `projectforge://cards/{card_id}`
- `projectforge://documents/{document_id}`
- `projectforge://worklog/users/{user_id}/daily/{date}`
- `projectforge://exports/boards/{board_id}`

Resources should only expose data the authenticated user or token is allowed to view.

Resources must not expose:

- GitHub OAuth access tokens
- Discord webhook URLs
- Raw secrets
- Passwords
- Private system logs
- Other users' restricted documents
- Hidden folders or documents

---

## 10.6 MCP Prompts

Suggested MCP prompts:

- Daily standup summary
- Project status report
- Sprint planning assistant
- Card cleanup assistant
- Documentation update assistant
- Work log summary
- GitHub issue triage
- Release notes generator

Prompt templates should be permission-aware and only include data the token is allowed to access.

---

## 10.7 Agent Safety Requirements

Because agents can perform real account actions, the MCP server must include strong safety controls.

Required controls:

- Scope-based permissions.
- Per-token rate limits.
- Full audit log of every MCP tool call.
- Confirmation requirement for destructive actions, where possible.
- Disable dangerous tools by default.
- Project-level MCP enable/disable toggle.
- User-level MCP enable/disable toggle.
- Allowlist of enabled tools per token.
- Clear tool descriptions and input schemas.
- No raw secret exposure through resources or tools.
- Redaction of GitHub tokens, Discord webhook URLs, and other secrets.
- Laravel policy checks for every tool call.
- Optional read-only token mode.

Destructive or sensitive operations should either be excluded from MVP or require explicit confirmation:

- Delete project
- Delete board
- Delete document
- Delete card
- Export sensitive data
- Change permissions
- Modify GitHub OAuth settings
- Modify Discord webhook settings

---

## 10.8 MCP Audit Log

Every MCP interaction should be logged.

Audit log fields:

- id
- user_id
- token_id
- project_id, nullable
- tool_name
- input_summary
- output_summary
- status
- error_message, nullable
- ip_address
- user_agent
- created_at

The audit log should be visible to:

- The user who owns the token.
- Project owners for project-scoped tokens.
- Super admins.

---

## 10.9 Suggested MCP Tables

### mcp_tokens

Stores MCP access tokens.

Important fields:

- id
- user_id
- project_id, nullable
- name
- token_hash
- scopes JSON
- allowed_tools JSON
- last_used_at
- revoked_at
- created_at
- updated_at

### mcp_tool_call_logs

Stores MCP tool call audit logs.

Important fields:

- id
- user_id
- mcp_token_id
- project_id, nullable
- tool_name
- input_summary
- output_summary
- status
- error_message
- ip_address
- user_agent
- created_at

---

## 10.10 MVP MCP Scope

The MVP should include:

- MCP server endpoint.
- Personal/project-scoped MCP tokens.
- Scoped access control.
- Read-only tools for projects, boards, cards, documents, and work logs.
- Write tools for creating cards and work log entries.
- Tool call audit logs.
- Project-level MCP enable/disable setting.

Future versions can add broader write access, richer prompts, remote OAuth-based agent authorization, and agent-specific dashboards.

---

## 11. Filament Admin Area

The platform should include an internal admin area built with Filament. This admin area should be used by system administrators, project owners where appropriate, and support staff to manage users, projects, integrations, logs, and platform health.

Filament should not replace the main user-facing React application. It should serve as the operational cockpit for administration, support, diagnostics, and platform oversight.

---

## 11.1 Purpose

The Filament admin area should provide operational control over:

- Users
- Projects
- Boards
- Cards
- Documents
- Work logs
- GitHub integrations
- Discord webhooks
- Trello imports
- Board exports
- MCP tokens and tool calls
- System logs
- Failed jobs
- Audit events

---

## 11.2 Admin User Types

### Super Admin

Can access the full Filament panel and manage the entire platform.

### Support Admin

Can view diagnostic data and help troubleshoot accounts but should not access secrets.

### Project Owner Admin View

Optional future feature: project owners may get a scoped Filament panel or admin-style screens for managing only their own projects.

---

## 11.3 Filament Resources

Suggested Filament resources:

- Users
- Projects
- Project Members
- Boards
- Board Members
- Cards
- Labels
- Document Folders
- Project Documents
- Project Groups
- Work Log Entries
- GitHub Accounts
- GitHub Repositories
- GitHub Card Links
- Discord Webhooks
- Trello Imports
- Board Exports
- MCP Tokens
- MCP Tool Call Logs
- Activity Logs
- Failed Jobs

---

## 11.4 Admin Dashboards

The admin area should include dashboards for:

- Total users
- Active users
- Active projects
- Active boards
- Cards created
- Cards completed
- Work log entries created
- Documents created/updated
- GitHub accounts connected
- Discord webhooks configured
- Trello imports completed/failed
- MCP tool calls
- Failed jobs
- Recent errors

---

## 11.5 Integration Diagnostics

Admins should be able to inspect integration health.

### GitHub Diagnostics

- Connected accounts
- Token status
- Repositories connected
- Last successful sync
- Failed sync attempts
- Webhook delivery logs

### Discord Diagnostics

- Webhooks configured
- Last successful post
- Last failed post
- Failure reasons
- Test webhook action, permission restricted

### MCP Diagnostics

- Active tokens
- Revoked tokens
- Tool call volume
- Failed tool calls
- Suspicious activity
- Rate-limited calls

### Trello Import Diagnostics

- Import status
- Import source file name
- Imported cards/lists/labels count
- Skipped records
- Import warnings/errors

---

## 11.6 Security Requirements

The Filament admin area must:

- Require admin authorization.
- Use Laravel policies/gates.
- Never display raw GitHub tokens.
- Never display raw Discord webhook URLs by default.
- Never display raw MCP tokens after creation.
- Redact secrets in logs.
- Audit sensitive admin actions.
- Support role-based admin permissions.
- Support read-only support/admin roles.
- Prevent support users from changing billing/security settings unless explicitly granted.

---

## 11.7 Useful Filament Actions

Suggested admin actions:

- Impersonate user, super admin only and audited.
- Re-run failed GitHub sync.
- Re-send Discord notification.
- Requeue failed import.
- Revoke MCP token.
- Disable project MCP access.
- Archive board.
- Restore archived document.
- Export board JSON.
- View work log for user/date.
- View failed jobs.
- Mark import/export issue as resolved.

---

## 11.8 MVP Admin Scope

The MVP should include:

- Filament panel.
- Super admin login/access control.
- User resource.
- Project resource.
- Board resource.
- Card resource.
- Work log entry resource.
- Document resource.
- GitHub integration diagnostics.
- Discord webhook diagnostics.
- MCP token/tool-call logs.
- Trello import logs.
- Failed job visibility.

---

## 12. GitHub Integration

## 7.1 GitHub OAuth

Users should be able to connect their GitHub account using OAuth.

### Required OAuth Capabilities

The app should request only the permissions required for the selected integration mode.

Possible scopes:

- read:user
- user:email
- repo, if private repositories must be supported
- public_repo, if only public repositories are supported
- read:org, if organization repositories must be listed

The app should clearly explain why each permission is required.

### Token Security

GitHub access tokens must be:

- Encrypted at rest.
- Never exposed to the frontend.
- Revocable by the user.
- Logged only in redacted form.

---

## 7.2 Connecting Repositories to Boards

A board admin should be able to:

- Select a connected GitHub account.
- Choose an organization or personal account.
- Select one or more repositories.
- Configure sync direction:
  - GitHub to board only.
  - Board to GitHub only.
  - Two-way sync.

---

## 7.3 Creating GitHub Issues From Cards

A user should be able to open a card and click:

**Create GitHub Issue**

The system should then create a GitHub Issue using:

- Card title → Issue title
- Card description → Issue body
- Card labels → Issue labels, if mapped
- Card assignee → GitHub assignee, if mapped
- Card comments → Optional initial issue comments
- Card URL → Included in issue body

After creation, the card should store:

- GitHub issue ID
- GitHub issue number
- GitHub repository ID
- GitHub issue URL
- Last synced timestamp

---

## 7.4 Importing GitHub Issues as Cards

A board admin should be able to import issues from a connected repository.

Import filters:

- Open issues
- Closed issues
- Labels
- Milestone
- Assignee
- Created date
- Updated date

Imported issues should create cards with:

- Issue title
- Issue body
- Issue labels
- Issue assignee mapping, when possible
- Link back to GitHub Issue
- Current issue status

---

## 7.5 Two-Way Sync

When enabled, the platform should synchronize card and issue data.

### Syncable Fields

- Title
- Description/body
- Labels
- Assignees
- Comments
- Status/open/closed state

### Status Mapping

Example:

- Backlog → Open
- To Do → Open
- In Progress → Open
- Review → Open
- Done → Closed

Board admins should be able to customize status mappings.

---

## 7.6 GitHub Webhooks

The platform should register GitHub webhooks for connected repositories.

Webhook events:

- issues
- issue_comment
- label
- repository, optional
- ping

Webhook payloads should be verified using GitHub webhook signatures.

### Webhook Handling

Incoming GitHub webhook events should:

- Verify signature.
- Match repository.
- Match linked card, if any.
- Queue a sync job.
- Update card data.
- Log result.
- Trigger Discord notification if enabled.

---

## 7.7 Sync Conflicts

Sync conflicts can happen when GitHub and the board are updated around the same time.

Conflict strategy:

- Track last synced timestamp.
- Track last edited source.
- Prefer newest update by default.
- Log conflict.
- Provide manual review option for serious conflicts.

---

## 13. Discord Integration

## 8.1 Board Webhook URL

Each board should support one Discord webhook URL.

Board admins can:

- Add webhook URL.
- Update webhook URL.
- Remove webhook URL.
- Send test message.
- Enable/disable Discord notifications.

Webhook URLs should be encrypted at rest.

---

## 8.2 Discord Notification Events

Board admins should be able to choose which events post to Discord.

Events:

- Card created
- Card moved
- Card assigned
- Card completed
- Card commented on
- Due date changed
- Label changed
- GitHub Issue created
- GitHub Issue linked
- GitHub sync completed
- GitHub Issue closed
- Checklist completed

---

## 8.3 Discord Message Format

Example message:

```text
📌 Card Moved
Board: FOSH Backend
Card: API Refactor
From: To Do
To: In Progress
Assigned: Tanguy
```

Example GitHub message:

```text
🐙 GitHub Issue Linked
Card: Payment Bug
Issue: #342
Repo: spicygigs/app
Status: Open
```

### Message Formatting Requirements

Discord notifications should include:

- Event type
- Board name
- Card title
- Actor/user
- Relevant status change
- Link to card
- Link to GitHub Issue, if applicable

---

## 8.4 Discord Failure Handling

If Discord delivery fails:

- Log the failed request.
- Show warning in board integration settings.
- Retry transient failures through queue.
- Disable webhook after repeated permanent failures, optional.

---

## 14. Notifications

## 9.1 In-App Notifications

Users should receive in-app notifications for:

- Mentions
- Assignments
- Due dates
- Comments on watched cards
- GitHub sync conflicts
- Board invitations

---

## 9.2 Email Notifications

Optional for MVP, but useful.

Email notification types:

- You were assigned to a card.
- A card is due soon.
- You were mentioned.
- Daily digest.
- Weekly project summary.

---

## 9.3 Realtime Updates

The board UI should update in near real time when:

- Cards move.
- Cards are edited.
- Comments are added.
- Lists are changed.
- GitHub sync modifies a card.

Recommended options:

- Laravel Reverb
- Pusher
- Ably
- Soketi

---

## 15. Technical Stack

## 10.1 Backend

### Recommended Backend

**Laravel 12**

Key Laravel components:

- Laravel authentication
- Laravel Socialite for GitHub OAuth
- Laravel Sanctum for session/API auth where needed
- Laravel queues
- Redis
- Laravel events/listeners
- Laravel policies
- Laravel notifications
- Laravel scheduler
- Laravel filesystem
- Laravel Reverb or compatible broadcasting stack

---

## 10.2 Frontend

### Recommended Frontend

**Laravel React Starter Kit**

The frontend should be built using the official Laravel React starter kit as the foundation. This gives the project a clean Laravel-native React stack from day one, including Inertia, TypeScript, Tailwind CSS, shadcn/ui, and Radix UI.

Recommended frontend stack:

- Laravel React starter kit
- React
- Inertia.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI primitives
- dnd-kit, Pragmatic Drag and Drop, or a vetted shadcn registry Kanban component
- Vite


### 10.2.1 shadcn/ui and Kanban UI Direction

The project should use shadcn/ui as the primary UI component foundation.

Implementation notes:

- Use the shadcn components already included with the Laravel React starter kit.
- Add additional shadcn/ui components using the shadcn CLI as needed.
- Use shadcn registry/community Kanban components or blocks as a starting point for the board UI.
- Review any third-party registry code before adding it to the app.
- Prefer accessible Radix-based components for dialogs, dropdowns, sheets, popovers, tabs, command menus, and menus.
- Build reusable internal components for Board, List, Card, CardModal, LabelPicker, AssigneePicker, and GitHubIssueLinker.

The Kanban board should look and feel like a polished shadcn application rather than a generic admin panel.

### Frontend Requirements

The React interface should support:

- Drag-and-drop cards.
- Drag-and-drop lists.
- Fast card modal editing.
- Optimistic UI for card moves.
- Realtime board updates.
- Keyboard shortcuts, future feature.
- Responsive layouts.
- Mobile-friendly board navigation.

---

## 10.3 Admin Panel

### Recommended Admin

**Filament**

Admin panel features:

- User management
- Project management
- Board management
- Integration diagnostics
- GitHub token health
- Discord webhook logs
- Failed job monitoring links
- Activity/audit log viewer

---

## 10.4 Database

### Recommended Database

**MySQL**

The schema should be relational and optimized for:

- Board loading
- Card ordering
- Activity feeds
- Membership permissions
- Integration lookups
- Webhook handling

---

## 10.5 Queues

Queues should handle:

- GitHub API calls
- Discord webhook posts
- Attachment processing
- Email notifications
- Webhook event processing
- Sync jobs

Recommended queue driver:

- Redis

---

## 16. Suggested Database Schema

## 11.1 Core Tables

### users

Stores platform users.

Important fields:

- id
- name
- email
- password
- avatar
- timezone
- created_at
- updated_at

### projects

Stores parent projects.

Important fields:

- id
- owner_id
- name
- slug
- description
- archived_at
- created_at
- updated_at

### project_members

Stores project membership.

Important fields:

- id
- project_id
- user_id
- role
- created_at
- updated_at

### boards

Stores boards.

Important fields:

- id
- project_id, nullable
- owner_id
- name
- slug
- description
- visibility
- archived_at
- created_at
- updated_at

### board_members

Stores board-specific membership.

Important fields:

- id
- board_id
- user_id
- role
- created_at
- updated_at

### lists

Stores board columns.

Important fields:

- id
- board_id
- name
- position
- wip_limit
- archived_at
- created_at
- updated_at

### cards

Stores cards/tasks.

Important fields:

- id
- board_id
- list_id
- creator_id
- title
- description
- position
- priority
- due_at
- started_at
- completed_at
- archived_at
- created_at
- updated_at

### card_assignments

Stores assigned users.

Important fields:

- id
- card_id
- user_id
- assigned_by
- created_at

### card_comments

Stores card comments.

Important fields:

- id
- card_id
- user_id
- body
- created_at
- updated_at

### card_attachments

Stores card attachments.

Important fields:

- id
- card_id
- user_id
- filename
- path
- mime_type
- size
- created_at

### labels

Stores board labels.

Important fields:

- id
- board_id
- name
- color
- created_at
- updated_at

### card_labels

Pivot table for card labels.

Important fields:

- card_id
- label_id

---

## 11.2 GitHub Integration Tables

### github_accounts

Stores connected GitHub accounts.

Important fields:

- id
- user_id
- github_user_id
- username
- avatar_url
- encrypted_access_token
- scopes
- connected_at
- revoked_at
- created_at
- updated_at

### github_repositories

Stores repositories connected to boards.

Important fields:

- id
- github_account_id
- github_repo_id
- owner
- name
- full_name
- private
- html_url
- created_at
- updated_at

### board_github_repositories

Connects boards to repositories.

Important fields:

- id
- board_id
- github_repository_id
- sync_direction
- status_mapping
- created_at
- updated_at

### github_card_links

Connects cards to GitHub Issues.

Important fields:

- id
- card_id
- github_repository_id
- github_issue_id
- issue_number
- issue_url
- issue_state
- last_synced_at
- created_at
- updated_at

### github_webhook_events

Logs incoming GitHub webhook events.

Important fields:

- id
- github_repository_id
- event_type
- delivery_id
- payload
- processed_at
- failed_at
- failure_reason
- created_at

---

## 11.3 Discord Integration Tables

### discord_webhooks

Stores board Discord webhook settings.

Important fields:

- id
- board_id
- encrypted_webhook_url
- enabled
- event_settings
- last_success_at
- last_failed_at
- created_at
- updated_at

### discord_webhook_logs

Stores outbound Discord notification attempts.

Important fields:

- id
- board_id
- card_id
- event_type
- payload
- response_status
- response_body
- sent_at
- failed_at
- failure_reason
- created_at

---

## 11.4 Activity and Audit Tables

### activity_logs

Stores project, board, and card activity.

Important fields:

- id
- actor_id
- subject_type
- subject_id
- event_type
- old_values
- new_values
- metadata
- created_at

### sync_conflicts

Stores GitHub sync conflicts.

Important fields:

- id
- card_id
- github_card_link_id
- source
- conflict_type
- board_value
- github_value
- resolved_by
- resolved_at
- created_at

---

## 17. Automation Rules

The platform should eventually support simple automations.

### Example Automations

- When card moves to Done, close linked GitHub Issue.
- When GitHub Issue closes, move card to Done.
- When urgent card is created, post to Discord.
- When due date is tomorrow, notify assigned users.
- When card is moved to Review, assign QA user.
- When label Bug is added, create GitHub Issue.

Automation can be Phase 2 unless basic GitHub/Discord triggers are needed for MVP.

---

## 18. API Requirements

## 13.1 Internal Application API

Endpoints/controllers should support:

- Projects CRUD
- Boards CRUD
- Lists CRUD
- Cards CRUD
- Labels CRUD
- Comments CRUD
- Attachments CRUD
- Membership management
- GitHub integration actions
- Discord integration actions

## 13.2 External APIs

The application must integrate with:

- GitHub REST API
- GitHub Webhooks
- Discord Webhooks

---

## 19. Security Requirements

Security is especially important because the app stores GitHub tokens and Discord webhook URLs.

### Required Security Controls

- Encrypt GitHub access tokens.
- Encrypt Discord webhook URLs.
- Use HTTPS only.
- Use signed and verified GitHub webhooks.
- Use CSRF protection.
- Use role-based authorization.
- Use Laravel policies for project/board/card access.
- Rate-limit integration endpoints.
- Sanitize Markdown output.
- Validate uploaded files.
- Restrict attachment file types and sizes.
- Audit sensitive actions.

---

## 20. MVP Scope

## 15.1 MVP Included

The MVP should include:

- User registration/login.
- Project creation.
- Board creation.
- Lists.
- Cards.
- Drag-and-drop card movement.
- Card comments.
- Card labels.
- Card assignments.
- GitHub OAuth.
- Connect board to GitHub repository.
- Create GitHub Issue from card.
- Import GitHub Issues as cards.
- Basic sync status.
- Discord webhook per board.
- Discord notifications for major card events.
- Trello JSON board import.
- Full board JSON export.
- Individual work log.
- Automatic card status-change logging by user.
- Work log API for arbitrary daily entries.
- Hashtag-based project assignment for work log entries.
- Work log search, sorting, and filtering.
- Project Markdown document repository.
- Folder-based document organization.
- Per-user and group-based document/folder permissions.
- Full Markdown editor with toolbar and preview.
- MCP server for agent access.
- MCP tokens with scopes and audit logs.
- Read-only MCP tools for projects, boards, cards, documents, and work logs.
- Write MCP tools for creating cards and work log entries.
- Filament admin area.
- Filament resources for users, projects, boards, cards, documents, work logs, integrations, imports, exports, and MCP logs.
- Admin dashboards and integration diagnostics.
- Board/project permissions.
- Filament admin panel.

---

## 15.2 MVP Excluded

The MVP does not need:

- Billing.
- Native mobile apps.
- White labeling.
- AI task generation.
- Advanced reports.
- Complex automation builder.
- Offline mode.
- Full GitHub Projects replacement.
- Slack integration.
- Calendar integration.

---

## 21. Phase 2 Features

Phase 2 may include:

- Advanced automation builder.
- Sprint planning.
- Burndown charts.
- Time tracking.
- Estimates.
- Client portals.
- Slack integration.
- AI-generated card summaries.
- AI-generated project status reports.
- Mobile app wrappers.
- Board templates.
- Public roadmap boards.
- Custom fields.
- Calendar view.
- Gantt/timeline view.
- Billing/subscriptions.
- Team workspaces.
- White-label agency version.

---

## 22. Monetization Ideas

If built as SaaS, possible pricing tiers:

### Free

- Limited boards.
- Limited users.
- Basic cards/lists.
- Basic Discord notifications.

### Pro

- Unlimited boards.
- GitHub integration.
- Discord integration.
- Larger attachment storage.
- Advanced permissions.

### Team

- Team workspace.
- Multiple projects.
- Advanced sync.
- Automation rules.
- Priority support.

### Agency

- Client portals.
- White-label branding.
- Advanced reporting.
- More storage.
- Dedicated support.

---

## 23. Key Risks

### Technical Risks

- GitHub API rate limits.
- OAuth token security.
- Sync conflicts between cards and GitHub Issues.
- Discord webhook delivery failures.
- Drag-and-drop performance with large boards.
- Realtime state conflicts.
- Complex permission inheritance between projects and boards.

### Product Risks

- Trello is already well known.
- GitHub Projects already exists.
- Feature creep could slow MVP.
- Users may not want full two-way sync at first.

### Mitigation

- Keep MVP focused.
- Make GitHub and Discord integrations genuinely useful.
- Prioritize developer/agency workflows.
- Avoid rebuilding every Trello feature immediately.
- Make the product faster and simpler for technical project work.

---

## 24. Success Metrics

Important metrics:

- Boards created per user.
- Cards created per board.
- Weekly active users.
- GitHub accounts connected.
- GitHub Issues created from cards.
- GitHub Issues imported.
- Discord webhooks configured.
- Discord notifications delivered.
- Team retention.
- Project completion rate.
- Number of active boards after 30 days.

---

## 25. Recommended Build Plan

### Sprint 1: Foundation

- Laravel 12 app setup.
- React + Inertia setup.
- Authentication.
- Base layout.
- Project model.
- Board model.
- Filament admin.

### Sprint 2: Kanban Core

- Lists.
- Cards.
- Drag-and-drop.
- Card modal.
- Labels.
- Assignments.
- Comments.

### Sprint 3: Permissions

- Project members.
- Board members.
- Roles.
- Laravel policies.
- Invitation flow.

### Sprint 4: GitHub OAuth

- GitHub OAuth via Socialite.
- Store encrypted token.
- List repositories.
- Connect repo to board.

### Sprint 5: GitHub Issue Sync

- Create issue from card.
- Import issues as cards.
- Store card/issue links.
- Basic sync jobs.
- Webhook receiving.

### Sprint 6: Discord Integration

- Board webhook settings.
- Test webhook.
- Notification templates.
- Queue delivery.
- Delivery logs.

### Sprint 7: Trello Import and JSON Export

- Trello JSON upload and validation.
- Trello board preview.
- Member mapping.
- Queued import processor.
- Import summary report.
- Full board JSON export.
- Export schema versioning.

### Sprint 8: Work Log

- Automatic work log event creation from card activity.
- Personal daily work log view.
- Manual work log entries.
- Work log API endpoint.
- Personal access token support.
- Hashtag project mapping.
- Search, sorting, and filters.
- JSON work log export.

### Sprint 9: Document Repository

- Project document repository.
- Markdown document CRUD.
- Folder CRUD.
- Folder visibility controls.
- User and group document permissions.
- Markdown editor with toolbar.
- Markdown preview.
- Document search.

### Sprint 10: MCP Server

- MCP server endpoint.
- Personal/project-scoped MCP tokens.
- Scope and allowed-tool management.
- Read-only MCP tools for projects, boards, cards, documents, and work logs.
- Write MCP tools for creating cards and work log entries.
- MCP audit logging.
- Project-level MCP enable/disable setting.

### Sprint 11: Filament Admin Area

- Install/configure Filament.
- Super admin access control.
- User, project, board, and card resources.
- Document and work log resources.
- GitHub and Discord diagnostics.
- Trello import/export logs.
- MCP token and tool-call logs.
- Failed job visibility.
- Admin dashboard widgets.

### Sprint 12: Polish and Launch Prep

- Activity logs.
- Dashboard summaries.
- Error handling.
- Integration diagnostics.
- Basic onboarding.
- Production deployment.

---

## 26. Final Product Vision

ProjectForge should become a practical command center for technical teams.

It should feel like:

**Trello for project clarity, GitHub for developer workflow, Discord for team awareness.**

The goal is not to clone Trello feature-for-feature. The goal is to create a faster, more development-aware Kanban board for teams that already live in GitHub and Discord.

---

## 27. Recommended Technical Direction

The recommended stack is:

- Laravel 12
- Laravel React starter kit
- React
- Inertia.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- MySQL
- Redis
- Laravel queues
- Laravel Reverb or Pusher-compatible broadcasting
- Filament admin
- GitHub OAuth via Socialite
- Discord webhooks
- S3-compatible storage

This stack supports rapid MVP development, strong maintainability, and a clear path toward SaaS expansion.
