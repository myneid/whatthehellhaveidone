<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'list_id' => ['required', 'exists:board_lists,id'],
            'title' => ['required', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'due_at' => ['nullable', 'date'],
            'create_github_issue' => ['sometimes', 'boolean'],
            'github_repository_id' => ['nullable', 'integer', 'exists:github_repositories,id'],
        ];
    }
}
