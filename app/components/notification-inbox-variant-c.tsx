import { useState } from "react";
import { BookOpen, MessageSquareText } from "lucide-react";
import {
  EmptyState,
  NotificationRow,
  type InboxViewProps,
  type NotificationKind,
  type PrototypeNotification,
} from "~/components/notification-inbox-prototype";

export function InboxVariantC(props: InboxViewProps) {
  const courses = [...new Set(props.notifications.map((item) => item.course))];
  const [selectedCourse, setSelectedCourse] = useState(courses[0] ?? "");
  const courseItems = props.notifications.filter(
    (item) => item.course === selectedCourse
  );
  const discussions = courseItems.filter((item) => item.kind === "Discussion");
  const updates = courseItems.filter((item) => item.kind === "Course updates");
  const discussionUnread = discussions.filter((item) => item.unread).length;
  const updateUnread = updates.filter((item) => item.unread).length;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{props.persona} view</p>
          <h2 className="mt-1 text-xl font-semibold">Activity by course</h2>
        </div>
        <button
          type="button"
          onClick={props.onMarkAllAsRead}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
        >
          Mark all as read
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Courses with notifications" className="space-y-2">
          {courses.map((course) => {
            const courseUnread = props.notifications.filter(
              (item) => item.course === course && item.unread
            ).length;
            return (
              <button
                key={course}
                type="button"
                onClick={() => setSelectedCourse(course)}
                aria-pressed={selectedCourse === course}
                className={`w-full rounded-lg border p-4 text-left ${
                  selectedCourse === course
                    ? "border-primary bg-background shadow-sm"
                    : "border-border bg-background/50 hover:bg-background"
                }`}
              >
                <span className="block font-medium">{course}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {courseUnread} unread
                </span>
              </button>
            );
          })}
          {courses.length === 0 && <EmptyState kind="Discussion" />}
        </nav>
        <div className="space-y-5">
          <ActivityGroup
            title="Discussion"
            count={discussionUnread}
            items={discussions}
            onSelect={props.onSelect}
          />
          <ActivityGroup
            title="Course updates"
            count={updateUnread}
            items={updates}
            onSelect={props.onSelect}
          />
        </div>
      </div>
    </section>
  );
}

function ActivityGroup({
  title,
  count,
  items,
  onSelect,
}: {
  title: string;
  count: number;
  items: PrototypeNotification[];
  onSelect: (item: PrototypeNotification) => void;
}) {
  const isDiscussion = title === "Discussion";
  const kind: NotificationKind = isDiscussion ? "Discussion" : "Course updates";
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          {isDiscussion ? (
            <MessageSquareText className="size-4 text-muted-foreground" />
          ) : (
            <BookOpen className="size-4 text-muted-foreground" />
          )}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{count} unread</span>
      </header>
      {items.length === 0 ? (
        <div className="p-4">
          <EmptyState kind={kind} />
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="border-b border-border last:border-0">
            <NotificationRow item={item} onSelect={onSelect} />
          </div>
        ))
      )}
    </section>
  );
}
