<?php

namespace App;

enum WorkLogEntryType: string
{
    case Manual = 'manual';
    case CardCreated = 'card_created';
    case CardMoved = 'card_moved';
    case CardCompleted = 'card_completed';
    case CardReopened = 'card_reopened';
    case CardPriorityChanged = 'card_priority_changed';
    case CommentAdded = 'comment_added';
    case ChecklistItemCompleted = 'checklist_item_completed';
    case GithubIssueLinked = 'github_issue_linked';
    case GithubIssueSynced = 'github_issue_synced';
    case AssignmentChanged = 'assignment_changed';
    case AttachmentAdded = 'attachment_added';
    case DueDateChanged = 'due_date_changed';
}
