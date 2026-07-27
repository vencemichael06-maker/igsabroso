import path from "node:path";
import { optimizeProjectFolder } from "./project-image-pipeline";
import { projectAssetConfig } from "./project-assets.config";

for (const project of projectAssetConfig) {
  await optimizeProjectFolder({
    slug: project.slug,
    projectName: project.name,
    sourceDir: path.resolve("tmp/drive-projects", project.slug),
    outputDir: path.resolve("public/assets/projects", project.slug),
  });
}

console.log(`Optimized ${projectAssetConfig.length} project galleries.`);
