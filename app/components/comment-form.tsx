import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { MAX_COMMENT_LENGTH } from "~/lib/comments";

export function CommentForm({
  intent,
  parentId,
  commentId,
  defaultValue,
  placeholder,
  submitLabel,
  autoFocus,
  onDone,
}: {
  intent: "create-comment" | "edit-comment";
  parentId?: number;
  commentId?: number;
  defaultValue?: string;
  placeholder: string;
  submitLabel: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [body, setBody] = useState(defaultValue ?? "");
  const submitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.ok) {
      if (intent === "create-comment") setBody("");
      onDone?.();
    }
    // onDone is recreated by callers; depending on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data, intent]);

  const tooLong = body.length > MAX_COMMENT_LENGTH;
  const empty = body.trim().length === 0;

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="intent" value={intent} />
      {parentId !== undefined && (
        <input type="hidden" name="parentId" value={parentId} />
      )}
      {commentId !== undefined && (
        <input type="hidden" name="commentId" value={commentId} />
      )}
      <Textarea
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        rows={4}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting || empty || tooLong}>
          {submitting ? "Posting..." : submitLabel}
        </Button>
        {onDone && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancel
          </Button>
        )}
        <span
          className={cn(
            "ml-auto text-xs",
            tooLong ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {body.length} / {MAX_COMMENT_LENGTH}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Markdown supported. Use ``` for code blocks.
      </p>
    </fetcher.Form>
  );
}
