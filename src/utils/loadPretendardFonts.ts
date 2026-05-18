import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const pretendardRegularPath =
  require.resolve("pretendard/dist/public/static/alternative/Pretendard-Regular.ttf");
const pretendardBoldPath =
  require.resolve("pretendard/dist/public/static/alternative/Pretendard-Bold.ttf");

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

export async function loadPretendardFonts() {
  const [regular, bold] = await Promise.all([
    readFile(pretendardRegularPath),
    readFile(pretendardBoldPath),
  ]);

  return {
    regular: toArrayBuffer(regular),
    bold: toArrayBuffer(bold),
  };
}
