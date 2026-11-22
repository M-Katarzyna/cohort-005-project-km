import { Link } from "react-router";
import { ArrowUpRight, Circle, Inbox } from "lucide-react";
import {
  EmptyState,
  countUnread,
  type InboxViewProps,
} from "~/components/notification-inbox-prototype";

export function InboxVariantB(props: InboxViewProps) {
  const visible = props.notifications.filter((item) => item.kind === props.kind);
  const selected =
    visible.find((item) => item.id === props.selectedNotification?.id) ??
    visible[0] ??
    null;
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{props.persona} view</p>
          <h2 className="mt-1 text-xl font-semibold">Notification work queue</h2>
        </div>
        <button
          type="button"
          onClick={props.onMarkAllAsRead}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
        >
          Mark all as read
        </button>
      </div>
      <div className="grid min-h-[460px] overflow-hidden rounded-xl border border-border bg-background shadow-sm md:grid-cols-[170px_minmax(240px,0.9fr)_minmax(300px,1.1fr)]">
        <nav
          aria-label="Notification categories"
          className="border-b border-border p-3 md:border-b-0 md:border-r"
        >
          {(["Discussion", "Course updates"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => props.setKind(item)}
              aria-pressed={props.kind === item}
              className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                props.kind === item
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <span>{item}</span>
              <span className="text-xs">{countUnread(props.notifications, item)}</span>
            </button>
          ))}
        </nav>
        <div className="border-b border-border md:border-b-0 md:border-r">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">
            {props.kind}
          </div>
          {visible.length === 0 ? (
            <div className="p-3">
              <EmptyState kind={props.kind} />
            </div>
          ) : (
            visible.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => props.onSelect(item)}
                aria-current={selected?.id === item.id ? "true" : undefined}
                className={`block w-full border-b border-border px-4 py-4 text-left ${
                  selected?.id === item.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {item.unread && (
                    <Circle className="size-2.5 fill-blue-600 text-blue-600" />
                  )}
                  {item.person}
                </span>
                <span className="mt-1 block text-sm">{item.title}</span>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {item.lesson} · {item.time}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="p-6">
          {selected ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {selected.lesson} · {selected.course} · {selected.time}
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                {selected.person} {selected.title}
              </h3>
              <p className="mt-4 leading-7 text-muted-foreground">{selected.body}</p>
              <Link
                to={selected.href}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Open in Cadence <ArrowUpRight className="size-4" />
              </Link>
            </>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <Inbox className="size-8 text-muted-foreground/50" />
              <h3 className="mt-3 font-medium">Choose an update</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The full context appears here before you leave the inbox.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
