"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCard } from "./data-table.types";

interface DataTableStatCardsProps {
  cards: StatCard[];
  activeCardId?: string | null;
  onCardClick?: (card: StatCard) => void;
  isFiltering?: boolean;
}

const accentDotClass: Record<NonNullable<StatCard["accent"]>, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  muted: "bg-muted-foreground/50",
};

export function DataTableStatCards({
  cards,
  activeCardId,
  onCardClick,
  isFiltering = false,
}: DataTableStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCardId === card.id;

        return (
          <Card
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => onCardClick?.(card)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onCardClick?.(card);
              }
            }}
            className={cn(
              "flex cursor-pointer flex-col gap-1 p-4 transition-all duration-150 select-none",
              isActive
                ? "bg-primary/5 shadow-sm ring-2 ring-primary"
                : "hover:bg-muted/40 hover:shadow-sm",
              isFiltering && isActive && "opacity-80",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.label}
              </span>
              {Icon && (
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {card.accent && (
                <span className={cn("size-1.5 rounded-full", accentDotClass[card.accent])} />
              )}
              {card.description}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
