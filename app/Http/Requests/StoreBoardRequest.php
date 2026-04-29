<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBoardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'visibility' => ['nullable', 'in:private,team,public'],
            'background_color' => ['nullable', 'string', 'max:7'],
        ];
    }
}
