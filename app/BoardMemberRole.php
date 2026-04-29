<?php

namespace App;

enum BoardMemberRole: string
{
    case Admin = 'admin';
    case Member = 'member';
    case Viewer = 'viewer';
}
