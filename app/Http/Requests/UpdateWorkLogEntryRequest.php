<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkLogEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:5000'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'board_id' => ['nullable', 'exists:boards,id'],
            'card_id' => ['nullable', 'exists:cards,id'],
            'source' => ['nullable', 'string'],
            'entry_type' => ['nullable', 'string'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'reference_url' => ['nullable', 'url'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
