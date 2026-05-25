---
name: create-form
description: >-
  Build validated create/edit forms in the delivery dashboard using Zod schemas,
  react-hook-form, shadcn Form components, and server actions. Use when creating
  or refactoring form pages, multi-step wizards, modals with fields, or when the
  user mentions create-form, Zod validation, or react-hook-form.
---

# Create Form (delivery_dashboard)

## Stack obligatoire

- **Zod** : `features/<feature>/model/<feature>.schemas.ts`
- **react-hook-form** + **zodResolver** (`@hookform/resolvers/zod`)
- **UI** : `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- **Champs réutilisables** : `FormInputField`, `FormTextareaField`, `FormPhoneInputField`, etc. dans `src/components/form/`
- **Téléphone** : `PhoneInput` (client-only via dynamic import) ; normalisation E.164 via `@/lib/phone` (`libphonenumber-js`, safe côté serveur)
- **Submit** : server action dans `features/<feature>/actions/` — jamais de fetch direct depuis le client

## Structure fichiers

```
features/<feature>/
├── model/<feature>.schemas.ts    # schémas Zod + types infer
├── actions/<feature>.actions.ts  # "use server" + revalidatePath
└── ui/<feature>-create-form.tsx  # "use client" + useForm
```

## Schémas Zod

```ts
// model/company.schemas.ts
import { z } from "zod";

export const entityStepSchema = z.object({
  name: z.string().trim().min(1, "Obligatoire").max(160),
  email: z.string().trim().refine(
    (v) => v === "" || z.email().safeParse(v).success,
    { message: "Email invalide" },
  ),
});

export const entityCreateFormSchema = entityStepSchema.extend({
  // autres champs
}).superRefine((values, ctx) => {
  // validations cross-field
});

export type EntityCreateFormValues = z.infer<typeof entityCreateFormSchema>;
export const entityStepFields = ["name", "email"] as const;
```

- Messages d'erreur en français, courts
- Champs optionnels : accepter `""` puis transformer en `undefined` au submit
- Téléphone optionnel : min 8 chiffres si non vide

## Formulaire client

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const form = useForm<EntityCreateFormValues>({
  resolver: zodResolver(entityCreateFormSchema),
  defaultValues: { /* ... */ },
  mode: "onSubmit",
});

const onSubmit = form.handleSubmit(async (values) => {
  await createEntityAction(/* mapper values */);
});

// Multi-step : form.trigger(["name", "email"]) avant de changer d'étape URL
```

## Multi-step + URL

- Hook dédié : `hooks/use-<feature>-create-url.ts` — `step` dans `?step=1|2`
- Étape 1 : `await form.trigger(step1Fields)` puis `setStep(2)`
- État formulaire conservé dans RHF (pas de reset entre steps)
- Stepper UI séparé (`*-create-stepper.tsx`)

## Modal avec champs

- Formulaire RHF **dans** le modal, schéma Zod dédié (ex. `newManagerSchema`)
- `form.reset()` à la fermeture du dialog
- Validation via `form.handleSubmit` — pas de `useState` manuel par champ

## PhoneInput

- Toujours via `FormField` + `PhoneInput` (dynamic import, `ssr: false`)
- Ne pas importer `react-phone-number-input` directement dans les pages

## Anti-patterns

- ❌ `useState` + validation manuelle + `toast.error`
- ❌ Submit sans `zodResolver`
- ❌ Logique métier dans le composant UI (→ server action + service)
- ❌ `required` HTML seul sans Zod

## Checklist

- [ ] Schémas dans `model/*.schemas.ts`
- [ ] `useForm` + `zodResolver`
- [ ] `FormMessage` sur chaque champ
- [ ] Server action + `revalidatePath`
- [ ] Multi-step : `trigger()` par étape
- [ ] `pnpm exec tsc --noEmit`

## Référence implémentée

- `features/companies/model/company.schemas.ts`
- `features/companies/ui/company-create-form.tsx`
- `features/companies/ui/company-create-manager-modal.tsx`
- `components/login-form.tsx`
