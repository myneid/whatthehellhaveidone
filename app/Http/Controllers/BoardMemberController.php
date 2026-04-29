<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BoardMemberController extends Controller
{
    public function store(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,member,viewer'],
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user) {
            return back()->withErrors(['email' => 'No user found with that email address.']);
        }

        $alreadyMember = BoardMember::where('board_id', $board->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyMember) {
            return back()->withErrors(['email' => 'This user is already a member of this board.']);
        }

        BoardMember::create([
            'board_id' => $board->id,
            'user_id' => $user->id,
            'role' => $request->role,
        ]);

        return back()->with('success', "{$user->name} has been added to the board.");
    }

    public function update(Request $request, BoardMember $member): RedirectResponse
    {
        $this->authorize('update', $member->board);

        $request->validate(['role' => ['required', 'in:admin,member,viewer']]);
        $member->update(['role' => $request->role]);

        return back()->with('success', 'Member role updated.');
    }

    public function destroy(BoardMember $member): RedirectResponse
    {
        $this->authorize('update', $member->board);

        if ($member->user_id === $member->board->owner_id) {
            return back()->withErrors(['error' => 'Cannot remove the board owner.']);
        }

        $member->delete();

        return back()->with('success', 'Member removed.');
    }
}
