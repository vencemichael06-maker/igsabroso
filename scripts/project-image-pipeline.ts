import { execFile } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

export type HeicConverter = (input: string, output: string) => Promise<void>;

async function convertHeicToPng(input: string, output: string) {
  await execFileAsync(
    process.platform === "win32" ? "heif-convert.cmd" : "heif-convert",
    [input, output],
    { shell: process.platform === "win32" },
  );
}

export type OptimizedProjectImage = {
  alt: string;
  full: string;
  thumb: string;
};

export async function optimizeProjectFolder({
  slug,
  projectName,
  sourceDir,
  outputDir,
  heicConverter = convertHeicToPng,
}: {
  slug: string;
  projectName: string;
  sourceDir: string;
  outputDir: string;
  heicConverter?: HeicConverter;
}): Promise<OptimizedProjectImage[]> {
  const sources = (await readdir(sourceDir))
    .filter((name) => /^\d{2}\.(jpe?g|png|webp|hei[cf])$/i.test(name))
    .sort();

  if (sources.length !== 6) {
    throw new Error(
      `Expected exactly 6 curated images for ${projectName}; received ${sources.length}`,
    );
  }

  await mkdir(outputDir, { recursive: true });

  return Promise.all(
    sources.map(async (source, index) => {
      const number = String(index + 1).padStart(2, "0");
      const input = path.join(sourceDir, source);
      let preparedInput = input;
      if (/\.hei[cf]$/i.test(source)) {
        const intermediateDir = path.join(sourceDir, ".heic-intermediates");
        await mkdir(intermediateDir, { recursive: true });
        preparedInput = path.join(intermediateDir, `${number}.png`);
        await heicConverter(input, preparedInput);
      }
      await sharp(preparedInput)
        .rotate()
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outputDir, `thumb-${number}.webp`));
      await sharp(preparedInput)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(path.join(outputDir, `large-${number}.webp`));

      return {
        alt: `${projectName} — image ${index + 1} of 6`,
        full: `/assets/projects/${slug}/large-${number}.webp`,
        thumb: `/assets/projects/${slug}/thumb-${number}.webp`,
      };
    }),
  );
}
