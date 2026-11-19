import fs from "node:fs";
import path from "node:path";
import Root from "./_components/Root";
import type { StoryPhotos } from "./_components/story/Story";

// Our photos for the trailer are optional cut-outs (transparent PNGs) in /public/story.
// Until a file exists, its slot shows a yellow TODO tag instead.
const pub = path.join(process.cwd(), "public");
const pick = (name: string) => (fs.existsSync(path.join(pub, "story", name)) ? `/story/${name}` : null);

export default function V2Page() {
  const photos: StoryPhotos = { him: pick("him.png"), her: pick("her.png"), us: pick("us.png") };
  return <Root photos={photos} />;
}
