import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, MessageSquareText } from "lucide-react";
import {
  getPrototypeNotifications,
  type NotificationKind,
  type PrototypeNotification,
  type PrototypePersona,
} from "~/components/notification-inbox-prototype";
import { InboxVariantA } from "~/components/notification-inbox-variant-a";
import { InboxVariantB } from "~/components/notification-inbox-variant-b";
import { InboxVariantC } from "~/components/notification-inbox-variant-c";

const variants = [
  { key: "A", name: "Tabbed inbox" },
  { key: "B", name: "Work queue" },
  { key: "C", name: "Course-first" },
] as const;

type VariantKey = (typeof variants)[number]["key"];

function isVariantKey(value: string | null): value is VariantKey {
  return variants.some((variant) => variant.key === value);
}

export default function NotificationInboxPrototype() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [persona, setPersona] = useState<PrototypePersona>("Student");
  const [kind, setKind] = useState<NotificationKind>("Discussion");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Record<PrototypePersona, string[]>>({
    Student: [],
    Instructor: [],
  });
  const requestedVariant = searchParams.get("variant");
  const variant: VariantKey = isVariantKey(requestedVariant)
    ? requestedVariant
    : "B";
  const variantIndex = variants.findIndex((item) => item.key === variant);
  const notifications = getPrototypeNotifications(persona).map((item) => ({
    ...item,
    unread: item.unread && !readIds[persona].includes(item.id),
  }));
  const selectedNotification =
    notifications.find((item) => item.id === selectedId) ??
    notifications[0] ??
    null;

  function changeVariant(direction: number) {
    const nextIndex =
      (variantIndex + direction + variants.length) % variants.length;
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("variant", variants[nextIndex].key);
        return next;
      },
      { replace: true }
    );
  }

  function markAsRead(id: string) {
    setReadIds((current) => ({
      ...current,
      [persona]: current[persona].includes(id)
        ? current[persona]
        : [...current[persona], id],
    }));
  }

  function markAllAsRead() {
    setReadIds((current) => ({
      ...current,
      [persona]: [
        ...new Set([...current[persona], ...notifications.map((item) => item.id)]),
      ],
    }));
  }

  function selectNotification(item: PrototypeNotification) {
    setSelectedId(item.id);
    markAsRead(item.id);
  }

  useEffect(() => {
    function handleArrowKeys(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      changeVariant(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, [variantIndex]);

  const sharedProps = {
    notifications,
    kind,
    setKind,
    selectedNotification,
    onSelect: selectNotification,
    onMarkAllAsRead: markAllAsRead,
  };

  return (
    <div className="min-h-full bg-muted/30 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <MessageSquareText className="size-4" />
              Prototype · mock data
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Compare how Students and Instructors find discussion activity and
              course updates. Read changes stay in this page only.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Preview as
            </p>
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              {(["Student", "Instructor"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setPersona(role)}
                  aria-pressed={persona === role}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    persona === role
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </header>

        {variant === "A" && <InboxVariantA {...sharedProps} persona={persona} />}
        {variant === "B" && <InboxVariantB {...sharedProps} persona={persona} />}
        {variant === "C" && <InboxVariantC {...sharedProps} persona={persona} />}
      </div>

      <PrototypeSwitcher
        current={variants[variantIndex]}
        onPrevious={() => changeVariant(-1)}
        onNext={() => changeVariant(1)}
      />
    </div>
  );
}

function PrototypeSwitcher({
  current,
  onPrevious,
  onNext,
}: {
  current: (typeof variants)[number];
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (import.meta.env.PROD) return null;

  return (
    <nav
      aria-label="Prototype variations"
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-neutral-950 px-3 py-2 text-white shadow-xl"
    >
      <button
        type="button"
        aria-label="Previous variation"
        onClick={onPrevious}
        className="rounded-full p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-36 text-center text-xs font-medium">
        {current.key} · {current.name}
      </span>
      <button
        type="button"
        aria-label="Next variation"
        onClick={onNext}
        className="rounded-full p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
