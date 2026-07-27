export type ProjectAssetConfig = {
  slug: string;
  name: string;
  category: "completed" | "ongoing" | "design";
  sourceFolder: string;
};

export const projectAssetConfig: ProjectAssetConfig[] = [
  { slug: "alivio", name: "Alivio Project", category: "completed", sourceFolder: "ALIVIO PROJECT" },
  { slug: "bonus", name: "Bonus Project", category: "completed", sourceFolder: "BONUS PROJECT" },
  { slug: "gono", name: "Gono Project", category: "completed", sourceFolder: "GONO PROJECT" },
  { slug: "obida", name: "Obida Project", category: "completed", sourceFolder: "OBIDA PROJECT" },
  { slug: "zemke", name: "Zemke Project", category: "completed", sourceFolder: "ZEMKE PROJECT" },
  { slug: "alonzo", name: "Alonzo Project", category: "ongoing", sourceFolder: "ALONZO PROJECT" },
  { slug: "amores", name: "Amores Project", category: "ongoing", sourceFolder: "AMORES PROJECT" },
  {
    slug: "francisco",
    name: "Francisco Project",
    category: "ongoing",
    sourceFolder: "FRANCISCO PROJECT",
  },
  { slug: "kim", name: "Kim Project", category: "ongoing", sourceFolder: "KIM PROJECT" },
  { slug: "grajo", name: "Grajo Project", category: "design", sourceFolder: "GRAJO PROJECT" },
  { slug: "laparan", name: "Laparan Project", category: "design", sourceFolder: "LAPARAN PROJECT" },
  { slug: "wong", name: "Wong Project", category: "design", sourceFolder: "WONG PROJECT" },
  {
    slug: "yambao-condo",
    name: "Yambao Project (Condo)",
    category: "design",
    sourceFolder: "YAMBAO PROJECT (Condo)",
  },
];
