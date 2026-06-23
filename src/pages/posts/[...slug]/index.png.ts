import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import { loadSpoqaHanSansNeoFonts } from "@/utils/loadSpoqaHanSansNeoFonts";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) return [];

  const posts = await getCollection("posts").then(posts =>
    posts.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const { regular, bold } = await loadSpoqaHanSansNeoFonts();
  const title = props.data.title as string;
  const tags = (props.data.tags as string[]).slice(0, 3).join(" · ");
  const date = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: props.data.timezone ?? config.site.timezone,
  }).format(new Date(props.data.pubDatetime));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "56px",
          overflow: "hidden",
          color: "#223149",
          background: "#eaf8ff",
          fontFamily: "Spoqa Han Sans Neo",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-110px",
                right: "-50px",
                width: "330px",
                height: "330px",
                borderRadius: "999px",
                background: "#d2f0ff",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-100px",
                left: "-70px",
                width: "270px",
                height: "270px",
                borderRadius: "999px",
                background: "#f3c4db",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "52px",
                border: "4px solid #83d6f7",
                borderRadius: "32px",
                background: "#f8fcff",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 26,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", alignItems: "center" },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: {
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "14px",
                                  borderRadius: "999px",
                                  background: "#b84278",
                                },
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: { fontWeight: 700 },
                                children: config.site.title,
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: { color: "#4f708d", fontSize: 22 },
                          children: tags,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      minHeight: "300px",
                      overflow: "hidden",
                    },
                    children: {
                      type: "p",
                      props: {
                        style: {
                          margin: 0,
                          maxWidth: "1000px",
                          fontSize: title.length > 38 ? 54 : 64,
                          fontWeight: 700,
                          lineHeight: 1.3,
                          letterSpacing: "-0.035em",
                        },
                        children: title,
                      },
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#4f708d",
                      fontSize: 24,
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: { fontWeight: 700, color: "#223149" },
                          children: `by ${props.data.author}`,
                        },
                      },
                      { type: "span", props: { children: date } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "Spoqa Han Sans Neo",
          data: regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Spoqa Han Sans Neo",
          data: bold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
