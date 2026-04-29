import type { User } from './auth';

export type { User };

export type Project = {
    id: number;
    owner_id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    owner?: User;
    members?: ProjectMember[];
    invitations?: ProjectInvitation[];
    boards?: Board[];
    boards_count?: number;
    members_count?: number;
};

export type ProjectInvitation = {
    id: number;
    email: string;
    role: 'admin' | 'member' | 'viewer';
    expires_at: string | null;
    is_expired: boolean;
    accept_url: string;
    inviter?: Pick<User, 'id' | 'name'> | null;
};

export type ProjectMember = {
    id: number;
    project_id: number;
    user_id: number;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    created_at: string;
    updated_at: string;
    user?: User;
};

export type Board = {
    id: number;
    project_id: number | null;
    owner_id: number;
    name: string;
    slug: string;
    description: string | null;
    background_color: string | null;
    visibility: 'private' | 'team' | 'public';
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    project?: Project;
    owner?: User;
    members?: BoardMember[];
    lists?: BoardList[];
    labels?: Label[];
    discord_webhook?: DiscordWebhook | null;
    github_repositories?: (GithubRepository & { pivot?: { sync_direction: string } })[];
    cards_count?: number;
};

export type BoardMember = {
    id: number;
    board_id: number;
    user_id: number;
    role: 'admin' | 'member' | 'viewer';
    created_at: string;
    updated_at: string;
    user?: User;
};

export type BoardList = {
    id: number;
    board_id: number;
    name: string;
    position: number;
    wip_limit: number | null;
    github_action: 'open_issue' | 'close_issue' | 'reopen_issue' | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    cards?: Card[];
};

export type Card = {
    id: number;
    board_id: number;
    list_id: number;
    creator_id: number;
    title: string;
    description: string | null;
    position: number;
    priority: 'none' | 'low' | 'medium' | 'high' | 'critical' | null;
    due_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    archived_at: string | null;
    source_system: string | null;
    source_card_id: string | null;
    created_at: string;
    updated_at: string;
    list?: BoardList;
    creator?: User;
    assignees?: User[];
    labels?: Label[];
    comments?: CardComment[];
    attachments?: CardAttachment[];
    checklists?: Checklist[];
    watchers?: User[];
    github_link?: GithubIssueLink | null;
    activity_logs?: ActivityLog[];
};

export type Label = {
    id: number;
    board_id: number;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
};

export type CardComment = {
    id: number;
    card_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user?: User;
};

export type CardAttachment = {
    id: number;
    card_id: number;
    user_id: number;
    filename: string;
    original_filename: string;
    mime_type: string;
    size: number;
    disk: string;
    path: string;
    url: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
};

export type Checklist = {
    id: number;
    card_id: number;
    title: string;
    position: number;
    created_at: string;
    updated_at: string;
    items?: ChecklistItem[];
};

export type ChecklistItem = {
    id: number;
    checklist_id: number;
    title: string;
    is_completed: boolean;
    position: number;
    completed_at: string | null;
    completed_by_id: number | null;
    created_at: string;
    updated_at: string;
    completed_by?: User;
};

export type GithubIssueLink = {
    id: number;
    card_id: number;
    github_repository_id: number;
    issue_number: number;
    issue_title: string;
    issue_url: string;
    state: 'open' | 'closed';
    synced_at: string | null;
    github_repository?: GithubRepository;
};

export type GithubRepository = {
    id: number;
    github_account_id: number;
    full_name: string;
    name: string;
    owner: string;
    private: boolean;
    html_url: string;
};

export type GithubAccount = {
    id: number;
    user_id: number;
    github_user_id: number;
    login: string;
    name: string | null;
    avatar_url: string | null;
    revoked_at: string | null;
    repositories?: GithubRepository[];
};

export type DiscordWebhook = {
    id: number;
    board_id: number;
    name: string;
    events: string[];
    is_active: boolean;
};

export type WorkLogEntry = {
    id: number;
    user_id: number;
    project_id: number | null;
    board_id: number | null;
    card_id: number | null;
    source: string;
    entry_type: string;
    body: string;
    hashtags: string[];
    started_at: string | null;
    ended_at: string | null;
    duration_seconds: number | null;
    reference_url: string | null;
    created_at: string;
    updated_at: string;
    project?: Project | null;
    board?: Board | null;
    card?: Card | null;
};

export type ActivityLog = {
    id: number;
    subject_type: string;
    subject_id: number;
    event_type: string;
    actor_id: number | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    created_at: string;
    actor?: User | null;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
};
