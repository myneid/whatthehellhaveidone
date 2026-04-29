<?php

namespace App;

enum WorkLogSource: string
{
    case Manual = 'manual';
    case Api = 'api';
    case System = 'system';
    case Github = 'github';
    case BrowserExtension = 'browser_extension';
    case Cli = 'cli';
    case Timer = 'timer';
}
