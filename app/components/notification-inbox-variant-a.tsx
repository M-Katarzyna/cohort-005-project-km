import {
  EmptyState,
  KindTabs,
  type InboxViewProps,
  NotificationRow,
} from "~/components/notification-inbox-prototype";

export function InboxVariantA(props: InboxViewProps) {
  const visible = props.notifications.filter((item) => item.kind === props.kind);
  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{props.persona} view</p>
          <h2 className="mt-1 text-xl font-semibold">Your activity</h2>
        </div>
        <button
          type="button"
          onClick={props.onMarkAllAsRead}
          className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
        >
          Mark all as read
        </button>
      </div>
      <KindTabs
        kind={props.kind}
        setKind={props.setKind}
        notifications={props.notifications}
      />
      <div className="overflow-hidden rounded-b-xl border border-t-0 border-border shadow-sm">
        {visible.length === 0 ? (
          <div className="p-4">
            <EmptyState kind={props.kind} />
          </div>
        ) : (
          visible.map((item) => (
            <NotificationRow key={item.id} item={item} onSelect={props.onSelect} />
          ))
        )}
      </div>
    </section>
  );
}
