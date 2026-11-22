import { Link } from "react-router";
import { ArrowUpRight, BookOpen, MessageCircle } from "lucide-react";

export type PrototypePersona = "Student" | "Instructor";
export type NotificationKind = "Discussion" | "Course updates";

export type PrototypeNotification = {
  id: string;
  kind: NotificationKind;
  course: string;
  lesson: string;
  person: string;
  initials: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  href: string;
};

export type InboxViewProps = {
  persona: PrototypePersona;
  notifications: PrototypeNotification[];
  kind: NotificationKind;
  setKind: (kind: NotificationKind) => void;
  selectedNotification: PrototypeNotification | null;
  onSelect: (item: PrototypeNotification) => void;
  onMarkAllAsRead: () => void;
};

const studentNotifications: PrototypeNotification[] = [
  {
    id: "student-thread-13",
    kind: "Discussion",
    course: "Building REST APIs with Node.js",
    lesson: "What is a REST API?",
    person: "Alex Rivera",
    initials: "AR",
    title: "replied to your question",
    body: "All mocked — nothing leaves your machine. The repo linked on the lesson has the fixtures.",
    time: "12 min ago",
    unread: true,
    href: "/courses/building-rest-apis-with-nodejs/lessons/20#comment-13",
  },
  {
    id: "student-course-1",
    kind: "Course updates",
    course: "Building REST APIs with Node.js",
    lesson: "Validation with Zod",
    person: "New lesson",
    initials: "BR",
    title: "Validation with Zod",
    body: "A new lesson is available in a course where you have an Enrollment.",
    time: "Today",
    unread: true,
    href: "/courses/building-rest-apis-with-nodejs/lessons/27",
  },
];

const instructorNotifications: PrototypeNotification[] = [
  {
    id: "instructor-thread-13",
    kind: "Discussion",
    course: "Building REST APIs with Node.js",
    lesson: "What is a REST API?",
    person: "Olivia Martinez",
    initials: "OM",
    title: "left a comment on a lesson",
    body: "Are the example requests in this lesson hitting a real API, or is it all mocked?",
    time: "8 min ago",
    unread: true,
    href: "/courses/building-rest-apis-with-nodejs/lessons/20#comment-13",
  },
  {
    id: "instructor-thread-12",
    kind: "Discussion",
    course: "Building REST APIs with Node.js",
    lesson: "HTTP Methods and Status Codes",
    person: "Liam Thompson",
    initials: "LT",
    title: "left a comment on a lesson",
    body: "When would you return a 422 instead of a 400? The distinction still isn't clicking for me.",
    time: "2 hours ago",
    unread: true,
    href: "/courses/building-rest-apis-with-nodejs/lessons/22#comment-12",
  },
];

export function getPrototypeNotifications(persona: PrototypePersona) {
  return persona === "Student" ? studentNotifications : instructorNotifications;
}
export function countUnread(
  notifications: PrototypeNotification[],
  kind: NotificationKind
) {
  return notifications.filter((item) => item.kind === kind && item.unread).length;
}

export function EmptyState({ kind }: { kind: NotificationKind }) {
  const isDiscussion = kind === "Discussion";
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {isDiscussion ? (
          <MessageCircle className="size-5" />
        ) : (
          <BookOpen className="size-5" />
        )}
      </div>
      <h3 className="font-medium">No {kind.toLowerCase()} yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {isDiscussion
          ? "Replies and new lesson comments for your discussions will appear here."
          : "New lessons in courses where you have an Enrollment will appear here."}
      </p>
    </div>
  );
}

export function KindTabs({
  kind,
  setKind,
  notifications,
}: Pick<InboxViewProps, "kind" | "setKind" | "notifications">) {
  const kinds: NotificationKind[] = ["Discussion", "Course updates"];
  return (
    <div className="flex gap-2 border-b border-border">
      {kinds.map((item) => {
        const selected = item === kind;
        const unread = countUnread(notifications, item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => setKind(item)}
            aria-pressed={selected}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              selected
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {unread}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function NotificationRow({
  item,
  selected = false,
  onSelect,
}: {
  item: PrototypeNotification;
  selected?: boolean;
  onSelect: (item: PrototypeNotification) => void;
}) {
  return (
    <div
      className={`flex gap-3 border-b border-border px-4 py-4 last:border-0 ${
        selected ? "bg-muted/70" : "bg-background"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`${item.unread ? "Unread" : "Read"}: ${item.person} ${item.title}`}
        className="flex min-w-0 flex-1 gap-3 text-left"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {item.initials}
          {item.unread && (
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-blue-600" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">
            <span className="font-semibold">{item.person}</span> {item.title}
          </span>
          <span className="mt-1 block text-sm leading-5 text-muted-foreground">
            {item.body}
          </span>
          <span className="mt-2 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
          <span>{item.lesson}</span>
          <span aria-hidden="true">·</span>
          <span>{item.course}</span>
            <span aria-hidden="true">·</span>
            <span>{item.time}</span>
          </span>
        </span>
      </button>
      <Link
        to={item.href}
        className="inline-flex h-fit shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        Open <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
