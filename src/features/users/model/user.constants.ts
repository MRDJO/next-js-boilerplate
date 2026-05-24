import type { UserStatus } from "./user.types";

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
};

export const USER_FILTER_OPTIONS = {
  status: [
    { label: USER_STATUS_LABELS.active, value: "active" },
    { label: USER_STATUS_LABELS.inactive, value: "inactive" },
    { label: USER_STATUS_LABELS.pending, value: "pending" },
  ],
  role: [
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Support", value: "Support" },
    { label: "Viewer", value: "Viewer" },
    { label: "Editor", value: "Editor" },
  ],
  department: [
    { label: "Engineering", value: "Engineering" },
    { label: "Product", value: "Product" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Support", value: "Support" },
    { label: "Finance", value: "Finance" },
    { label: "HR", value: "HR" },
    { label: "Operations", value: "Operations" },
    { label: "Legal", value: "Legal" },
  ],
  city: [
    { label: "Cotonou", value: "Cotonou" },
    { label: "Lome", value: "Lome" },
    { label: "Abidjan", value: "Abidjan" },
    { label: "Dakar", value: "Dakar" },
    { label: "Paris", value: "Paris" },
    { label: "Lyon", value: "Lyon" },
    { label: "Marseille", value: "Marseille" },
    { label: "Bruxelles", value: "Bruxelles" },
    { label: "Geneve", value: "Geneve" },
    { label: "Montreal", value: "Montreal" },
  ],
} as const;
