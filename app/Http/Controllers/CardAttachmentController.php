<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\CardAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CardAttachmentController extends Controller
{
    public function store(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,txt'],
        ]);

        $file = $request->file('file');
        $path = $file->store("attachments/cards/{$card->id}", 'public');

        $card->attachments()->create([
            'user_id' => $request->user()->id,
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
        ]);

        return back()->with('success', 'File uploaded.');
    }

    public function destroy(CardAttachment $attachment): RedirectResponse
    {
        $this->authorize('update', $attachment->card);

        Storage::disk($attachment->disk)->delete($attachment->path);
        $attachment->delete();

        return back()->with('success', 'Attachment removed.');
    }
}
