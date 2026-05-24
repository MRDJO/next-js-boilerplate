import { SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableEmptyStateProps {
  variant?: "default" | "filtered";
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export function DataTableEmptyState({
  variant = "default",
  title,
  description,
  onClearFilters,
}: DataTableEmptyStateProps) {
  const isFiltered = variant === "filtered";
  const Icon = isFiltered ? SearchX : Users;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {title ?? (isFiltered ? "Aucun resultat pour ces filtres" : "Aucun element trouve")}
        </p>
        <p className="text-sm text-muted-foreground">
          {description ??
            (isFiltered
              ? "Essayez de modifier ou supprimer vos filtres."
              : "Les elements apparaitront ici une fois ajoutes.")}
        </p>
      </div>
      {isFiltered && onClearFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
