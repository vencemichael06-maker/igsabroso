import { mkdir, mkdtemp, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { optimizeProjectFolder } from "./project-image-pipeline";

describe("optimizeProjectFolder", () => {
  it("creates six thumbnails and six lightbox images", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "igs-project-"));
    const sourceDir = path.join(root, "source");
    const outputDir = path.join(root, "output");
    await mkdir(sourceDir, { recursive: true });

    for (let index = 1; index <= 6; index += 1) {
      await sharp({
        create: {
          width: 1800,
          height: 1200,
          channels: 3,
          background: { r: 220, g: 80 + index, b: 30 },
        },
      })
        .jpeg()
        .toFile(path.join(sourceDir, `${String(index).padStart(2, "0")}.jpg`));
    }

    const result = await optimizeProjectFolder({
      slug: "sample",
      projectName: "Sample Project",
      sourceDir,
      outputDir,
    });

    expect(result).toHaveLength(6);
    expect(await readdir(outputDir)).toEqual([
      "large-01.webp",
      "large-02.webp",
      "large-03.webp",
      "large-04.webp",
      "large-05.webp",
      "large-06.webp",
      "thumb-01.webp",
      "thumb-02.webp",
      "thumb-03.webp",
      "thumb-04.webp",
      "thumb-05.webp",
      "thumb-06.webp",
    ]);
    expect(result[0]).toEqual({
      alt: "Sample Project — image 1 of 6",
      full: "/assets/projects/sample/large-01.webp",
      thumb: "/assets/projects/sample/thumb-01.webp",
    });
  });

  it("rejects a folder that does not contain six curated images", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "igs-project-short-"));
    await expect(
      optimizeProjectFolder({
        slug: "short",
        projectName: "Short Project",
        sourceDir: root,
        outputDir: path.join(root, "output"),
      }),
    ).rejects.toThrow("Expected exactly 6 curated images");
  });

  it("preprocesses HEIC sources before Sharp creates derivatives", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "igs-project-heic-"));
    const sourceDir = path.join(root, "source");
    const outputDir = path.join(root, "output");
    await mkdir(sourceDir, { recursive: true });

    for (let index = 1; index <= 5; index += 1) {
      await sharp({
        create: {
          width: 1200,
          height: 800,
          channels: 3,
          background: { r: 40, g: 90 + index, b: 180 },
        },
      })
        .jpeg()
        .toFile(path.join(sourceDir, `${String(index).padStart(2, "0")}.jpg`));
    }
    await writeFile(path.join(sourceDir, "06.heic"), "verified-heic-placeholder");

    const result = await optimizeProjectFolder({
      slug: "heic-sample",
      projectName: "HEIC Sample",
      sourceDir,
      outputDir,
      heicConverter: async (_input, output) => {
        await sharp({
          create: {
            width: 1200,
            height: 800,
            channels: 3,
            background: { r: 60, g: 120, b: 190 },
          },
        })
          .png()
          .toFile(output);
      },
    });

    expect(result).toHaveLength(6);
    expect(await readdir(outputDir)).toHaveLength(12);
  });
});
