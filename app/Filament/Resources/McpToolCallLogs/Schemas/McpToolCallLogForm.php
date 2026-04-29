<?php

namespace App\Filament\Resources\McpToolCallLogs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class McpToolCallLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name'),
                Select::make('mcp_token_id')
                    ->relationship('mcpToken', 'name'),
                Select::make('project_id')
                    ->relationship('project', 'name'),
                TextInput::make('tool_name')
                    ->required(),
                Textarea::make('input_summary')
                    ->columnSpanFull(),
                Textarea::make('output_summary')
                    ->columnSpanFull(),
                TextInput::make('status')
                    ->required()
                    ->default('success'),
                Textarea::make('error_message')
                    ->columnSpanFull(),
                TextInput::make('ip_address'),
                TextInput::make('user_agent'),
            ]);
    }
}
