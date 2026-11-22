import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { CommentForm } from "~/components/comment-form";
import { CommentItem } from "~/components/comment-item";
import type { RenderedComment } from "~/components/comment-types";

export type { RenderedComment } from "~/components/comment-types";

export function CommentThread({
  comments,
  currentUserId,
  canModerate,
  canPost,
  instructorName,
}: {
  comments: RenderedComment[];
  currentUserId: number | null;
  /** Owning instructor or admin — may delete anyone's comment. */
  canModerate: boolean;
  canPost: boolean;
  instructorName: string;
}) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Questions &amp; Discussion</h2>
        </div>

        {comments.length === 0 ? (
          <div id="questions-discussion" className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">Stuck on this lesson?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask here — {instructorName} answers questions in this course.
              There&apos;s no such thing as a question that&apos;s too basic.
            </p>
          </div>
        ) : (
          <div id="questions-discussion" className="divide-y">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                canModerate={canModerate}
                canPost={canPost}
                isReply={false}
              />
            ))}
          </div>
        )}

        {canPost && (
          <div className="mt-6 border-t pt-6">
            <CommentForm
              intent="create-comment"
              placeholder="Ask a question or share what you found..."
              submitLabel="Post comment"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
