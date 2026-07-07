<?php

namespace App\Http\Controllers\Api;

use App\Events\CardAttachmentAdded;
use App\Http\Controllers\Controller;
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

        if (! $user || ! $user->can('update', $card)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => ['required', 'file', 'max:1024000', 'mimes:jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,txt,csv,zip,rar,7z,mov,mp4,avi,wmv,flv,mkv'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $attachment = CardAttachment::createFromUploadedFile($card, $request->file('file'), $user);

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
        $this->authorize('update', $attachment->card);

        Storage::disk($attachment->disk)->delete([$attachment->path]);
        CardAttachment::query()->whereKey($attachment->getKey())->delete();

        return response()->json(['message' => 'Attachment removed.'], 200);
    }
}
