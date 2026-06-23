import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { loadSpoqaHanSansNeoFonts } from "@/utils/loadSpoqaHanSansNeoFonts";
import config from "@/config";

export const GET: APIRoute = async () => {
  const { regular, bold } = await loadSpoqaHanSansNeoFonts();

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
                      fontSize: 28,
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
                          style: {
                            color: "#4f708d",
                            fontSize: 22,
                            letterSpacing: "0.08em",
                          },
                          children: "DEV NOTES",
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
                      flexDirection: "column",
                      maxWidth: "980px",
                    },
                    children: [
                      {
                        type: "p",
                        props: {
                          style: {
                            margin: 0,
                            fontSize: 84,
                            fontWeight: 700,
                            letterSpacing: "-0.04em",
                          },
                          children: config.site.title,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: {
                            margin: "20px 0 0",
                            color: "#4f708d",
                            fontSize: 32,
                            lineHeight: 1.45,
                          },
                          children: config.site.description,
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
                      justifyContent: "space-between",
                      color: "#4f708d",
                      fontSize: 24,
                    },
                    children: [
                      {
                        type: "span",
                        props: { children: "설계와 구현 사이의 기록" },
                      },
                      {
                        type: "span",
                        props: {
                          style: { fontWeight: 700, color: "#223149" },
                          children: new URL(config.site.url).hostname,
                        },
                      },
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
