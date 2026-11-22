import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Pencil, Reply, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UserAvatar } from "~/components/user-avatar";
import { CommentForm } from "~/components/comment-form";
import type { RenderedComment } from "~/components/comment-types";
import { cn, formatRelativeTime } from "~/lib/utils";

function AuthorBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      {label}
    </span>
  );
}

function CommentActions({
  comment,
  canEdit,
  canDelete,
  canReply,
  onEdit,
  onReply,
}: {
  comment: RenderedComment;
  canEdit: boolean;
  canDelete: boolean;
  canReply: boolean;
  onEdit: () => void;
  onReply: () => void;
}) {
  const deleteFetcher = useFetcher<{ ok?: boolean; error?: string }>();

  useEffect(() => {
    if (deleteFetcher.data?.error) toast.error(deleteFetcher.data.error);
  }, [deleteFetcher.data]);

  if (!canEdit && !canDelete && !canReply) return null;
  return (
    <div className="mt-2 flex items-center gap-1">
      {canReply && (
        <Button variant="ghost" size="sm" onClick={onReply}>
          <Reply className="mr-1 size-3.5" />
          Reply
        </Button>
      )}
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="mr-1 size-3.5" />
          Edit
        </Button>
      )}
      {canDelete && (
        <deleteFetcher.Form
          method="post"
          onSubmit={(event) => {
            if (!confirm("Delete this comment?")) event.preventDefault();
          }}
        >
          <input type="hidden" name="intent" value="delete-comment" />
          <input type="hidden" name="commentId" value={comment.id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={deleteFetcher.state !== "idle"}
          >
            <Trash2 className="mr-1 size-3.5" />
            Delete
          </Button>
        </deleteFetcher.Form>
      )}
    </div>
  );
}

function Replies({
  comment,
  currentUserId,
  canModerate,
  canPost,
}: {
  comment: RenderedComment;
  currentUserId: number | null;
  canModerate: boolean;
  canPost: boolean;
}) {
  if (comment.replies.length === 0) return null;
  return (
    <div className="ml-11 mt-1 space-y-1">
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          canModerate={canModerate}
          canPost={canPost}
          isReply
        />
      ))}
    </div>
  );
}

export function CommentItem({
  comment,
  currentUserId,
  canModerate,
  canPost,
  isReply,
}: {
  comment: RenderedComment;
  currentUserId: number | null;
  canModerate: boolean;
  canPost: boolean;
  isReply: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const isAuthor = currentUserId !== null && comment.author.id === currentUserId;

  if (comment.deleted) {
    return (
      <div id={`comment-${comment.id}`} className="scroll-mt-6 py-3">
        <p className="text-sm italic text-muted-foreground">
          This comment was deleted.
        </p>
        <Replies
          comment={comment}
          currentUserId={currentUserId}
          canModerate={canModerate}
          canPost={canPost}
        />
      </div>
    );
  }

  return (
    <div
      id={`comment-${comment.id}`}
      className={cn("scroll-mt-6 py-3", isReply && "border-l pl-4")}
    >
      <div className="flex items-start gap-3">
        <UserAvatar
          name={comment.author.name}
          avatarUrl={comment.author.avatarUrl}
          className="size-8 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            {comment.author.isInstructor && <AuthorBadge label="Instructor" />}
            {comment.author.isAdmin && <AuthorBadge label="Admin" />}
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
              {formatRelativeTime(comment.createdAt)}
            </span>
            {comment.editedAt && (
              <span className="text-xs text-muted-foreground" title={`Edited ${comment.editedAt}`}>
                (edited)
              </span>
            )}
          </div>
          {editing ? (
            <div className="mt-2">
              <CommentForm
                intent="edit-comment"
                commentId={comment.id}
                defaultValue={comment.body}
                placeholder="Edit your comment"
                submitLabel="Save changes"
                autoFocus
                onDone={() => setEditing(false)}
              />
            </div>
          ) : (
            <div
              className="prose prose-sm prose-neutral dark:prose-invert mt-1 max-w-none"
              dangerouslySetInnerHTML={{ __html: comment.bodyHtml }}
            />
          )}
          {!editing && (
            <CommentActions
              comment={comment}
              canEdit={isAuthor}
              canDelete={isAuthor || canModerate}
              canReply={canPost && !isReply}
              onEdit={() => setEditing(true)}
              onReply={() => setReplying(true)}
            />
          )}
          {replying && (
            <div className="mt-3">
              <CommentForm
                intent="create-comment"
                parentId={comment.id}
                placeholder={`Reply to ${comment.author.name}`}
                submitLabel="Post reply"
                autoFocus
                onDone={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
      <Replies
        comment={comment}
        currentUserId={currentUserId}
        canModerate={canModerate}
        canPost={canPost}
      />
    </div>
  );
}
