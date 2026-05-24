import Link from "next/link";
import { notFound } from "next/navigation";
import HeaderTitle from "../../_components/header-title";
import { Button } from "@/components/ui/button";
import { userService } from "@/features/users";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const user = await userService.getById(id);

    return (
      <div className="min-w-0 space-y-6">
        <HeaderTitle
          title={user.fullName}
          description={`Fiche utilisateur #${user.employeeId}`}
        />
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Telephone</dt>
              <dd className="font-medium">{user.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd className="font-medium">{user.role.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Departement</dt>
              <dd className="font-medium">{user.department}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Poste</dt>
              <dd className="font-medium">{user.jobTitle}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Statut</dt>
              <dd className="font-medium capitalize">{user.status}</dd>
            </div>
          </dl>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/users">Retour a la liste</Link>
        </Button>
      </div>
    );
  } catch {
    notFound();
  }
}
