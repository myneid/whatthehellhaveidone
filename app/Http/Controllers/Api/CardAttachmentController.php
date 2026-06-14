<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\CardAttachmentAdded;
use App\Models\Card;
use App\Models\CardAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CardAttachmentController extends Controller
{
    /**
     * Store a new attachment via API.
     */
    public function store(Request $request, Card $card): JsonResponse
    {
        $user = $request->user();

        if (!$user->can('update', $card)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => ['required', 'file', 'max:1024000', 'mimes:jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,txt,csv,zip,rar,7z,mov,mp4,avi,wmv,flv,mkv'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $path = $file->store("attachments/cards/{$card->id}", 'public');

        $attachment = $card->attachments()->create([
            'user_id' => $user->id,
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
        ];

        event(new CardAttachmentAdded($card, $attachment));

        return response()->json([
            'message' => 'File uploaded successfully.',
            'attachment' => $attachment,
        ], 201);
    }

    /**
     * Destroy an attachment via API.
     */
    public function destroy(CardAttachment $attachment): JsonResponse
    {
        if ($attachment->card->user_id !== auth()->id()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk($attachment->disk)->delete([$attachment->path]);
        $attachment->delete();

        return response()->json(['message' => 'Attachment removed.'], 200);
    }
}
