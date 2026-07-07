<?php

namespace App\Http\Controllers;

use App\Events\CardAttachmentAdded;
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
            'file' => ['required', 'file', 'max:1024000', 'mimes:jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,txt,csv,zip,rar,7z,mov,mp4,avi,wmv,flv,mkv'],
        ]);

        $attachment = CardAttachment::createFromUploadedFile($card, $request->file('file'), $request->user());

        event(new CardAttachmentAdded($card, $attachment));

        return back()->with('success', 'File uploaded.');
    }

    public function destroy(CardAttachment $attachment): RedirectResponse
    {
        $this->authorize('update', $attachment->card);

        Storage::disk($attachment->disk)->delete([$attachment->path]);
        CardAttachment::query()->whereKey($attachment->getKey())->delete();

        return back()->with('success', 'Attachment removed.');
    }
}
