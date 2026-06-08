<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBoardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $board = $this->route('board');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'visibility' => ['nullable', 'in:private,team,public'],
            'background_color' => ['nullable', 'string', 'max:7'],
            'copilot_done_list_id' => [
                'nullable',
                'integer',
                Rule::exists('board_lists', 'id')->where(function ($query) use ($board) {
                    if (! $board) {
                        return $query->whereRaw('1 = 0');
                    }

                    return $query
                        ->where('board_id', $board->id)
                        ->whereNull('archived_at');
                }),
            ],
            'done_list_id' => [
                'nullable',
                'integer',
                Rule::exists('board_lists', 'id')->where(function ($query) use ($board) {
                    if (! $board) {
                        return $query->whereRaw('1 = 0');
                    }

                    return $query
                        ->where('board_id', $board->id)
                        ->whereNull('archived_at');
                }),
            ],
        ];
    }
}
