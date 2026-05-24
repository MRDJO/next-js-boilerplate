import type { User, UserStatus } from "./user.types";

const FIRST_NAMES = [
  "Amandine",
  "Paul",
  "Nina",
  "Koffi",
  "Awa",
  "Yao",
  "Fatou",
  "Ibrahim",
  "Chloe",
  "Marc",
  "Sarah",
  "Lucas",
  "Emma",
  "Noah",
  "Lea",
];

const LAST_NAMES = [
  "Kossi",
  "Savi",
  "Adjovi",
  "Diallo",
  "Traore",
  "Mensah",
  "Dupont",
  "Martin",
  "Bernard",
  "Petit",
  "Robert",
  "Richard",
  "Durand",
  "Moreau",
  "Simon",
];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Finance",
  "HR",
  "Operations",
  "Legal",
];

const JOB_TITLES = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "Account Executive",
  "Support Specialist",
  "Finance Controller",
  "HR Business Partner",
  "DevOps Engineer",
  "QA Engineer",
];

const CITIES = [
  "Cotonou",
  "Lome",
  "Abidjan",
  "Dakar",
  "Paris",
  "Lyon",
  "Marseille",
  "Bruxelles",
  "Geneve",
  "Montreal",
];

const COUNTRIES = [
  "Benin",
  "Togo",
  "Cote d'Ivoire",
  "Senegal",
  "France",
  "Belgique",
  "Suisse",
  "Canada",
];

const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Support" },
  { id: 4, name: "Viewer" },
  { id: 5, name: "Editor" },
];

const CONTRACT_TYPES = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];
const SALARY_BANDS = ["A1", "A2", "B1", "B2", "C1", "C2", "D1"];
const STATUSES: UserStatus[] = ["active", "inactive", "pending"];

const pick = <T>(items: T[], index: number) => items[index % items.length];

const pad = (value: number, size = 3) => String(value).padStart(size, "0");

const formatDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const generateMockUsers = (count = 120): User[] =>
  Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const firstName = pick(FIRST_NAMES, index);
    const lastName = pick(LAST_NAMES, index + 3);
    const username = `${firstName.charAt(0)}${lastName}`.toLowerCase().replace(/[^a-z]/g, "");
    const department = pick(DEPARTMENTS, index);
    const managerIndex = Math.max(1, (index % 15) + 1);

    return {
      id,
      employeeId: `EMP-${pad(id, 4)}`,
      fullName: `${firstName} ${lastName}`,
      username: `${username}${id}`,
      email: `${username}${id}@example.com`,
      phone: `+22961${pad(100000 + id, 6)}`,
      role: pick(ROLES, index),
      department,
      jobTitle: pick(JOB_TITLES, index + 2),
      city: pick(CITIES, index + 1),
      country: pick(COUNTRIES, index + 4),
      manager: `Manager ${managerIndex}`,
      contractType: pick(CONTRACT_TYPES, index),
      salaryBand: pick(SALARY_BANDS, index + 1),
      status: pick(STATUSES, index),
      lastLoginAt: formatDate(index % 45),
      createdAt: formatDate(120 + index),
    };
  });
