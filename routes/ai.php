<?php

use App\Mcp\Servers\ProjectForgeServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::web('/mcp/whhid', ProjectForgeServer::class)
    ->middleware('auth:sanctum');
