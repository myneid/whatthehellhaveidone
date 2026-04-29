<?php

namespace App;

enum BoardVisibility: string
{
    case Private = 'private';
    case Team = 'team';
    case Public = 'public';
}
