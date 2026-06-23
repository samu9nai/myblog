import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const spoqaRegularPath =
  require.resolve("spoqa-han-sans/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Regular.ttf");
const spoqaBoldPath =
  require.resolve("spoqa-han-sans/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Bold.ttf");

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

export async function loadSpoqaHanSansNeoFonts() {
  const [regular, bold] = await Promise.all([
    readFile(spoqaRegularPath),
    readFile(spoqaBoldPath),
  ]);

  return {
    regular: toArrayBuffer(regular),
    bold: toArrayBuffer(bold),
  };
}
