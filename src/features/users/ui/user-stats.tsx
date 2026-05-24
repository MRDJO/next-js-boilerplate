import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function UserStats({ total }: { total: number }) {
  return (
    <Card className="rounded-2xl border-none bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            Utilisateurs
          </p>
          <p className="text-3xl font-semibold">{total}</p>
          <p className="text-sm text-white/70">
            Vue pilote pour le nouveau socle CRUD.
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <Users className="size-7" />
        </div>
      </CardContent>
    </Card>
  );
}
