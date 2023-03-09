import mime from 'mime';
import sharp$1 from 'sharp';
/* empty css                               */import 'kleur/colors';
import 'node:fs/promises';
import 'node:path';
import 'node:url';
import 'http-cache-semantics';
import 'node:os';
import 'image-size';
import 'magic-string';
import 'node:stream';
import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderSlot, s as spreadAttributes, e as renderComponent, u as unescapeHTML, F as Fragment, f as renderHead, g as createVNode, _ as __astro_tag_component__ } from '../astro.61083b84.mjs';
/* empty css                           *//* empty css                                          *//* empty css                                       *//* empty css                                     *//* empty css                               */import { optimize } from 'svgo';
/* empty css                             *//* empty css                               *//* empty css                                                          */
function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
}
function isOutputFormatSupportsAlpha(value) {
  return ["avif", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

class SharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
      if (transform.background && !isOutputFormatSupportsAlpha(transform.format)) {
        sharpImage.flatten({ background: transform.background });
      }
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get$1 = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get: get$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$Z = createAstro("https://stargazers.club");
const $$Container = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$Z, $$props, $$slots);
  Astro2.self = $$Container;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["max-w-screen-xl mx-auto px-5", className], "class:list")}>
  ${renderSlot($$result, $$slots["default"])}
</div>`;
}, "D:/demo/test/src/components/container.astro");

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro$Y = createAstro("https://stargazers.club");
const $$Cta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$Y, $$props, $$slots);
  Astro2.self = $$Cta;
  const res = await fetch("http://tailwind-tvg6.onrender.com/api/slider");
  const data = await res.json();
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", '<section class="hero-section__section bg-slate-300 rounded-lg dark:bg-gray-800 astro-C7EDMHXS">\n  <div class="hero-section__text text-xl text-center p-10 astro-C7EDMHXS">\n    <div class="main astro-C7EDMHXS" id="particles-js"></div>\n    <h1 class="text-2xl font-bold dark:text-gray-300 astro-C7EDMHXS">', '</h1>\n    <p class="astro-C7EDMHXS"></p>\n   \n  \n    <div class="hero-btns__container astro-C7EDMHXS"></div>\n  </div>\n  <div class="hero-section__image pl-6 pt-10 pb-10 astro-C7EDMHXS">\n    ', '\n\n    <br class="astro-C7EDMHXS">\n\n    <div style="text-align:center" class="astro-C7EDMHXS">\n      <span class="dot astro-C7EDMHXS"></span>\n      <span class="dot astro-C7EDMHXS"></span>\n      <span class="dot astro-C7EDMHXS"></span>\n    </div>\n  </div>\n</section>\n\n\n\n\n<script type="text/javascript" src="/particles.js"><\/script>\n<script type="text/javascript" src="/app.js"><\/script>'])), maybeRenderHead($$result), data.data.attributes.title, data.data.attributes.slider.map(
    (item) => item.image.map((i, index) => renderTemplate`<div class="slideshow-container astro-C7EDMHXS">
            <div class="mySlides fade astro-C7EDMHXS">
              <div class="numbertext astro-C7EDMHXS">${index + 1} / 3</div>
              <img${addAttribute(i.image.data.attributes.url, "src")} style="width:100%" class="astro-C7EDMHXS">
              <div class="text astro-C7EDMHXS">${i.caption}</div>
            </div>
          </div>`)
  ));
}, "D:/demo/test/src/components/cta.astro");

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":"\"https://stargazers.club\""},{SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, alt, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required. ex: `widths={[100]}`");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          alt,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const $$Astro$X = createAstro("https://stargazers.club");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$X, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>`;
}, "D:/demo/test/node_modules/@astrojs/image/components/Image.astro");

const $$Astro$W = createAstro("https://stargazers.club");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$W, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position,
    alt
  });
  delete image.width;
  delete image.height;
  return renderTemplate`${maybeRenderHead($$result)}<picture>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${addAttribute(alt, "alt")}${spreadAttributes(attrs)}>
</picture>`;
}, "D:/demo/test/node_modules/@astrojs/image/components/Picture.astro");

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const $$Astro$V = createAstro("https://stargazers.club");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$V, $$props, $$slots);
  Astro2.self = $$Features;
  const { title, content, img, href, avartar, category, description } = Astro2.props;
  return renderTemplate`<!-- <h3 class="font-semibold text-lg">{item.title}</h3>{" "}
<p class="text-slate-500 mt-2 leading-relaxed">{item.description}</p>

-->${maybeRenderHead($$result)}<div class="mx-auto astro-BDZCPTIP">
  <a${addAttribute(href, "href")} class="astro-BDZCPTIP">
    <h3 class="font-semibold text-lg text-center astro-BDZCPTIP">${title}</h3>
    <p class="text-slate-500 mt-2 leading-relaxed astro-BDZCPTIP"></p>
    <div class="card astro-BDZCPTIP">
      <div class="poster astro-BDZCPTIP">
        ${renderComponent($$result, "Picture", $$Picture, { "src": img, "format": "avif", "alt": "Team", "widths": [200, 400], "aspectRatio": "1:1", "sizes": "(max-width: 800px) 100vw, 400px", "class": "w-full h-full object-cover rounded transition group-hover:-translate-y-1 group-hover:shadow-xl astro-BDZCPTIP", "format": "avif" })}
      </div>
      <div class="details astro-BDZCPTIP">
        <h3 class="astro-BDZCPTIP">${title}</h3>
        <div class="info astro-BDZCPTIP">
          <span class="astro-BDZCPTIP">${description}</span>
        </div>
      </div>
    </div>
  </a>
</div>`;
}, "D:/demo/test/src/components/features.astro");

const $$Astro$U = createAstro("https://stargazers.club");
const $$Hero2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$U, $$props, $$slots);
  Astro2.self = $$Hero2;
  const { img, content } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section class="mb-40">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="absolute block w-full" style="margin: auto; z-index: -10;" height="680" preserveAspectRatio="none" viewBox="0 0 1920 880">
      <g transform="translate(960,440) scale(1,1) translate(-960,-440)">
        <linearGradient id="lg-0.047955344060927496" x1="0" x2="1" y1="0" y2="0">
          <stop stop-color="hsl(217, 88%, 33.7%)" offset="0"></stop>
          <stop stop-color="hsl(217, 88%, 75.1%)" offset="1"></stop>
        </linearGradient>
        <path d="" fill="url(#lg-0.047955344060927496)" opacity="0.4">
          <animate attributeName="d" dur="33.333333333333336s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="0s" values="M0 0L 0 804.2328934685746Q 320 597.3613372284876  640 571.0708916590191T 1280 512.0661063245175T 1920 301.8788007488083L 1920 0 Z;M0 0L 0 877.6839081951588Q 320 668.0720922803877  640 649.0018928349388T 1280 328.7087077664202T 1920 162.95038242563396L 1920 0 Z;M0 0L 0 724.9886210051687Q 320 661.4364572061575  640 623.2173947479624T 1280 359.20353038907734T 1920 135.51673041732283L 1920 0 Z;M0 0L 0 804.2328934685746Q 320 597.3613372284876  640 571.0708916590191T 1280 512.0661063245175T 1920 301.8788007488083L 1920 0 Z"></animate>
        </path>
        <path d="" fill="url(#lg-0.047955344060927496)" opacity="0.4">
          <animate attributeName="d" dur="33.333333333333336s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="-6.666666666666667s" values="M0 0L 0 765.7607191473613Q 320 641.7853945676919  640 624.2534689988059T 1280 365.27264408032966T 1920 190.38947978522663L 1920 0 Z;M0 0L 0 842.1984196370487Q 320 570.6690721707517  640 540.6844954979398T 1280 439.92879442880593T 1920 200.29713960445451L 1920 0 Z;M0 0L 0 796.6802345094818Q 320 721.9216894353016  640 696.8815669355181T 1280 373.6367381440213T 1920 196.63169821789495L 1920 0 Z;M0 0L 0 765.7607191473613Q 320 641.7853945676919  640 624.2534689988059T 1280 365.27264408032966T 1920 190.38947978522663L 1920 0 Z"></animate>
        </path>
        <path d="" fill="url(#lg-0.047955344060927496)" opacity="0.4">
          <animate attributeName="d" dur="33.333333333333336s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="-13.333333333333334s" values="M0 0L 0 801.7562714943509Q 320 634.0247183381232  640 605.7090791951217T 1280 503.9393370140325T 1920 224.7551247480177L 1920 0 Z;M0 0L 0 821.0401780336218Q 320 670.8690783540507  640 637.0744123031742T 1280 456.40745286432224T 1920 278.1294357804296L 1920 0 Z;M0 0L 0 744.0534225112256Q 320 637.6425395409125  640 593.2079605185819T 1280 457.03995196824286T 1920 254.87693899994804L 1920 0 Z;M0 0L 0 801.7562714943509Q 320 634.0247183381232  640 605.7090791951217T 1280 503.9393370140325T 1920 224.7551247480177L 1920 0 Z"></animate>
        </path>
        <path d="" fill="url(#lg-0.047955344060927496)" opacity="0.4">
          <animate attributeName="d" dur="33.333333333333336s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="-20s" values="M0 0L 0 817.8603658675457Q 320 592.9404308081629  640 559.1126621853513T 1280 428.9912604821798T 1920 209.017381620229L 1920 0 Z;M0 0L 0 802.0504889976935Q 320 561.3963273210122  640 537.6024084387631T 1280 430.41283267566695T 1920 256.1972069733954L 1920 0 Z;M0 0L 0 789.4448177495887Q 320 561.9675446430498  640 531.6192318019404T 1280 414.76018143244175T 1920 265.9163329632971L 1920 0 Z;M0 0L 0 817.8603658675457Q 320 592.9404308081629  640 559.1126621853513T 1280 428.9912604821798T 1920 209.017381620229L 1920 0 Z"></animate>
        </path>
        <path d="" fill="url(#lg-0.047955344060927496)" opacity="0.4">
          <animate attributeName="d" dur="33.333333333333336s" repeatCount="indefinite" keyTimes="0;0.333;0.667;1" calcmod="spline" keySplines="0.2 0 0.2 1;0.2 0 0.2 1;0.2 0 0.2 1" begin="-26.666666666666668s" values="M0 0L 0 844.0541574423102Q 320 623.0697081316591  640 592.8483890737847T 1280 469.85448734523794T 1920 190.81850676853674L 1920 0 Z;M0 0L 0 871.4928294956283Q 320 618.9784567388518  640 593.1183717103518T 1280 376.5051942642811T 1920 141.32293927545027L 1920 0 Z;M0 0L 0 782.0118384610068Q 320 727.3267836497654  640 694.0476176759635T 1280 518.1545471640493T 1920 276.0053882957168L 1920 0 Z;M0 0L 0 844.0541574423102Q 320 623.0697081316591  640 592.8483890737847T 1280 469.85448734523794T 1920 190.81850676853674L 1920 0 Z"></animate>
        </path>
      </g>
    </svg>

    <div class="container py-3 mx-auto px-6 md:px-12 xl:px-32">
      <div class="text-start text-gray-800">
        <div class="break-words grid grid-cols-2 gap-20 rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12" style="margin-top: 180px; background-color: hsla(0, 0%, 100%, 0.8);backdrop-filter: saturate(200%) blur(25px);">
          <div class="grid grid-cols-1">
            <h1 class="text-3xl md:text-3xl xl:text-3xl font-bold tracking-tight mb-12">
              ${content}
            </h1>
         
          </div>
          <div class="grid grid-cols-1  ">
            
            <!-- <a class="inline-block px-7 py-3 mb-2 md:mb-0 mr-0 md:mr-2 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light" href="#!" role="button">Get started</a>
            <a class="inline-block px-7 py-3 text-white font-medium text-sm leading-snug bg-transparent text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:text-blue-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light" href="#!" role="button">Learn more</a> -->
            <img class="ml-0 rounded-md" width="500"${addAttribute(img, "src")} alt="">
          </div>
          
        </div>
      </div>
    </div>
  </section>`;
}, "D:/demo/test/src/components/hero2.astro");

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$T = createAstro("https://stargazers.club");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$T, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "D:/demo/test/node_modules/astro-icon/lib/Icon.astro");

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$S = createAstro("https://stargazers.club");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$S, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "D:/demo/test/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$R = createAstro("https://stargazers.club");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$R, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "D:/demo/test/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$Q = createAstro("https://stargazers.club");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$Q, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "D:/demo/test/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$P = createAstro("https://stargazers.club");
const $$Features2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$P, $$props, $$slots);
  Astro2.self = $$Features2;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    highlight,
    items = []
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<section class="relative">
  <div class="absolute inset-0 bg-blue-50 dark:bg-slate-800 pointer-events-none mb-32" aria-hidden="true"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 -mb-12">
    <div class="py-4 pt-8 sm:py-6 lg:py-8 lg:pt-12">
      ${(title || subtitle || highlight) && renderTemplate`<div class="mb-8 md:mx-auto text-center max-w-3xl">
            ${highlight && renderTemplate`<p class="text-base text-primary dark:text-blue-200 font-semibold tracking-wide uppercase">${unescapeHTML(highlight)}</p>`}
            ${title && renderTemplate`<h2 class="text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-4 font-heading">${unescapeHTML(title)}</h2>`}
            ${subtitle && renderTemplate`<p class="max-w-3xl mx-auto sm:text-center text-xl text-muted dark:text-slate-400">${unescapeHTML(subtitle)}</p>`}
          </div>`}
      <div${addAttribute(`grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-12 dark:text-blue-700 items-stretch`, "class")}>
        ${items.map((item) => renderTemplate`<div class="relative flex flex-col p-6 bg-white rounded shadow-lg hover:shadow-md transition border border-transparent dark:border-slate-800">
              <div class="flex items-center">
                ${renderComponent($$result, "Icon", $$Icon, { "name": item.link.icon, "class": "w-10 h-10" })}
                <div class="ml-4 text-xl font-bold">${item.title}</div>
              </div>
              ${item.content && renderTemplate`<p class="text-muted dark:text-gray-400 text-md mt-4">${unescapeHTML(item.content)}</p>`}
            </div>`)}
      </div>
    </div>
  </div>
</section>`;
}, "D:/demo/test/src/components/Features2.astro");

const $$Astro$O = createAstro("https://stargazers.club");
const $$Progress = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$O, $$props, $$slots);
  Astro2.self = $$Progress;
  return renderTemplate`${maybeRenderHead($$result)}<div class="container flex justify-center items-center overflow-hidden flex-wrap astro-SIAWAK7J">
  <div class="box relative flex justify-center items-center astro-SIAWAK7J">
    <div class="shadow absolute w-full h-full  astro-SIAWAK7J"></div>
    <div class="content relative w-full h-full flex justify-center items-center flex-col astro-SIAWAK7J">
      <div class="percent relative astro-SIAWAK7J" data-text="FORKS" style="--num:85;">
        <div class="dot absolute z-10 astro-SIAWAK7J"></div>
        <svg class="astro-SIAWAK7J">
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
        </svg>
      </div>
      <div class="number relative opacity-0 astro-SIAWAK7J">
        <h2 class="astro-SIAWAK7J">85<span class="astro-SIAWAK7J">%</span></h2>
      </div>
    </div>
  </div>
  <div class="box relative flex justify-center items-center astro-SIAWAK7J">
    <div class="shadow absolute w-full h-full astro-SIAWAK7J"></div>
    <div class="content relative w-full h-full flex justify-center items-center flex-col astro-SIAWAK7J">
      <div class="percent relative astro-SIAWAK7J" data-text="STARS" style="--num:90;">
        <div class="dot absolute z-10 astro-SIAWAK7J"></div>
        <svg class="astro-SIAWAK7J">
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
        </svg>
      </div>
      <div class="number relative opacity-0 astro-SIAWAK7J">
        <h2 class="astro-SIAWAK7J">90<span class="astro-SIAWAK7J">%</span></h2>
      </div>
    </div>
  </div>
  <div class="box relative flex justify-center items-center astro-SIAWAK7J">
    <div class="shadow absolute w-full h-full astro-SIAWAK7J"></div>
    <div class="content relative w-full h-full flex justify-center items-center flex-col astro-SIAWAK7J">
      <div class="percent relative astro-SIAWAK7J" data-text="USERS" style="--num:70;">
        <div class="dot absolute z-10 astro-SIAWAK7J"></div>
        <svg class="astro-SIAWAK7J">
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
          <circle cx="70" cy="70" r="70" class="astro-SIAWAK7J"></circle>
        </svg>
      </div>
      <div class="number relative opacity-0 astro-SIAWAK7J">
        <h2 class="astro-SIAWAK7J">70<span class="astro-SIAWAK7J">%</span></h2>
      </div>
    </div>
  </div>
</div>`;
}, "D:/demo/test/src/components/progress.astro");

const $$Astro$N = createAstro("https://stargazers.club");
const $$Intro = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$N, $$props, $$slots);
  Astro2.self = $$Intro;
  return renderTemplate`${maybeRenderHead($$result)}<video class="center astro-HXRQ4K5A" controls autoplay>
  <source src="/intro.mp4" type="video/mp4" class="astro-HXRQ4K5A">
  Your browser does not support the video tag.
</video>`;
}, "D:/demo/test/src/components/intro.astro");

const $$Astro$M = createAstro("https://stargazers.club");
const $$OpenGraphArticleTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$M, $$props, $$slots);
  Astro2.self = $$OpenGraphArticleTags;
  const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro2.props.openGraph.article;
  return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}
${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}
${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}
${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}
${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}
${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}`;
}, "D:/demo/test/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro");

const $$Astro$L = createAstro("https://stargazers.club");
const $$OpenGraphBasicTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$L, $$props, $$slots);
  Astro2.self = $$OpenGraphBasicTags;
  const { openGraph } = Astro2.props;
  return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}>
<meta property="og:type"${addAttribute(openGraph.basic.type, "content")}>
<meta property="og:image"${addAttribute(openGraph.basic.image, "content")}>
<meta property="og:url"${addAttribute(openGraph.basic.url || Astro2.url.href, "content")}>`;
}, "D:/demo/test/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro");

const $$Astro$K = createAstro("https://stargazers.club");
const $$OpenGraphImageTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$K, $$props, $$slots);
  Astro2.self = $$OpenGraphImageTags;
  const { image } = Astro2.props.openGraph.basic;
  const { url, secureUrl, type, width, height, alt } = Astro2.props.openGraph.image;
  return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>
${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}
${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}
${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}
${!(height === null) ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}
${!(alt === null) ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}`;
}, "D:/demo/test/node_modules/astro-seo/src/components/OpenGraphImageTags.astro");

const $$Astro$J = createAstro("https://stargazers.club");
const $$OpenGraphOptionalTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$J, $$props, $$slots);
  Astro2.self = $$OpenGraphOptionalTags;
  const { optional } = Astro2.props.openGraph;
  return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}
${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}
${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}
${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}
${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}
${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}
${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}`;
}, "D:/demo/test/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro");

const $$Astro$I = createAstro("https://stargazers.club");
const $$ExtendedTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$I, $$props, $$slots);
  Astro2.self = $$ExtendedTags;
  const { props } = Astro2;
  return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}
${props.extend.meta?.map(({ content, httpEquiv, name, property }) => renderTemplate`<meta${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-eqiv")}${addAttribute(name, "name")}${addAttribute(property, "property")}>`)}`;
}, "D:/demo/test/node_modules/astro-seo/src/components/ExtendedTags.astro");

const $$Astro$H = createAstro("https://stargazers.club");
const $$TwitterTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$H, $$props, $$slots);
  Astro2.self = $$TwitterTags;
  const { card, site, creator } = Astro2.props.twitter;
  return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}
${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}
${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}`;
}, "D:/demo/test/node_modules/astro-seo/src/components/TwitterTags.astro");

const $$Astro$G = createAstro("https://stargazers.club");
const $$SEO = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$G, $$props, $$slots);
  Astro2.self = $$SEO;
  const { props } = Astro2;
  const { title, description, canonical, noindex, nofollow, charset } = props;
  function validateProps(props2) {
    const { openGraph, description: description2 } = props2;
    if (openGraph) {
      if (!openGraph.basic || openGraph.basic.title == null || openGraph.basic.type == null || openGraph.basic.image == null) {
        throw new Error(
          "If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!"
        );
      }
    }
    if (title && openGraph?.basic.title) {
      if (title == openGraph.basic.title) {
        console.warn(
          "WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more."
        );
      }
    }
    if (openGraph?.basic?.image && !openGraph?.image?.alt) {
      console.warn(
        "WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is stongly discouraged.'"
      );
    }
  }
  validateProps(props);
  return renderTemplate`${title ? renderTemplate`<title>${unescapeHTML(title)}</title>` : null}

${charset ? renderTemplate`<meta${addAttribute(charset, "charset")}>` : null}

<link rel="canonical"${addAttribute(canonical || Astro2.url.href, "href")}>

${description ? renderTemplate`<meta name="description"${addAttribute(description, "content")}>` : null}

<meta name="robots"${addAttribute(`${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`, "content")}>

${props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...props })}`}
${props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...props })}`}
${props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...props })}`}
${props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...props })}`}
${props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...props })}`}
${props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...props })}`}`;
}, "D:/demo/test/node_modules/astro-seo/src/SEO.astro");

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$F = createAstro("https://stargazers.club");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$F, $$props, $$slots);
  Astro2.self = $$Footer;
  const res = await fetch("http://tailwind-tvg6.onrender.com/api/footer/");
  const data = await res.json();
  const filter_icon = data.data.attributes.footer.filter((item) => {
    if (item.icon != null) {
      return item.icon;
    }
  });
  const filter_link = data.data.attributes.footer.filter((item) => {
    if (item.Link != null) {
      return item.Link;
    }
  });
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<!-- Messenger Plugin chat Code -->", '<div id="fb-root" class="astro-K2F5ZB5C"></div>\n\n    <!-- Your Plugin chat code -->\n    <div id="fb-customer-chat" class="fb-customerchat astro-K2F5ZB5C">\n    </div>\n\n    \n\n    <!-- Your SDK code -->\n    \n<div class="circle flex justify-center items-center astro-K2F5ZB5C">\n  <div class="menu1 relative flex justify-center items-center   astro-K2F5ZB5C">\n    <div class="toggle cursor-pointer absolute bg-white flex justify-center items-center rounded-full  dark:bg-gray-600 astro-K2F5ZB5C">\n      ', '\n    </div>\n    <li style="--i:0;" class="astro-K2F5ZB5C">\n      <a href="#" class="astro-K2F5ZB5C">\n        ', '\n      </a>\n    </li>\n    <li style="--i:1;" class="astro-K2F5ZB5C">\n      <a href="#" class="astro-K2F5ZB5C">\n        ', '\n      </a>\n    </li>\n    <li style="--i:2;" class="astro-K2F5ZB5C">\n      <a href="#" class="astro-K2F5ZB5C">\n        ', '\n      </a>\n    </li>\n    <li style="--i:3;" class="astro-K2F5ZB5C">\n      <a href="#" class="astro-K2F5ZB5C">\n        ', `
      </a>
    </li>
  </div>
</div>
<div class="body astro-K2F5ZB5C">
  <footer class="my-20 dark:bg-teal-300 astro-K2F5ZB5C">
    <div class="waves astro-K2F5ZB5C">
      <div class="wave dark:bg-[url('/wavw.png')] astro-K2F5ZB5C" id="wave1"></div>
      <div class="wave dark:bg-[url('/wavw.png')]  astro-K2F5ZB5C" id="wave2"></div>
      <div class="wave dark:bg-[url('/wavw.png')] astro-K2F5ZB5C" id="wave3"></div>
      <div class="wave dark:bg-[url('/wavw.png')] astro-K2F5ZB5C" id="wave4"></div>
    </div> 
    <ul class="social_icon astro-K2F5ZB5C">
      `, '\n   \n     \n    </ul>\n      <ul class="menu astro-K2F5ZB5C">\n\n        ', '\n       \n        \n      </ul>\n    <p class="astro-K2F5ZB5C">\n      ', '\n    </p>\n    \n  </footer>\n  </div>\n  \n  <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"><\/script>\n  <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"><\/script>'])), maybeRenderHead($$result), renderComponent($$result, "ion-icon", "ion-icon", { "name": "add-outline", "class": "astro-K2F5ZB5C" }), renderComponent($$result, "ion-icon", "ion-icon", { "name": "laptop-outline", "class": "astro-K2F5ZB5C" }), renderComponent($$result, "ion-icon", "ion-icon", { "name": "phone-portrait-outline", "class": "astro-K2F5ZB5C" }), renderComponent($$result, "ion-icon", "ion-icon", { "name": "desktop-outline", "class": "astro-K2F5ZB5C" }), renderComponent($$result, "ion-icon", "ion-icon", { "name": "watch-outline", "class": "astro-K2F5ZB5C" }), filter_icon.map((item) => item.icon.map((i) => renderTemplate`<li class="astro-K2F5ZB5C"><a href="#" class="astro-K2F5ZB5C">${renderComponent($$result, "ion-icon", "ion-icon", { "name": i.icon, "class": "astro-K2F5ZB5C" })}</a> </li>`)), filter_link.map((item) => item.Link.map((i) => renderTemplate`<li class="astro-K2F5ZB5C"><a${addAttribute(i.href, "href")} class="astro-K2F5ZB5C">${i.title}</a></li>`)), data.data.attributes.title);
}, "D:/demo/test/src/components/footer.astro");

const $$Astro$E = createAstro("https://stargazers.club");
const $$Astronav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$E, $$props, $$slots);
  Astro2.self = $$Astronav;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}

`;
}, "D:/demo/test/node_modules/astro-navbar/src/Astronav.astro");

const $$Astro$D = createAstro("https://stargazers.club");
const $$MenuIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$D, $$props, $$slots);
  Astro2.self = $$MenuIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button id="astronav-menu">
  ${renderSlot($$result, $$slots["default"], renderTemplate`
    <svg fill="currentColor"${addAttribute([className], "class:list")} width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <title>Menu</title>
      <path class="astronav-toggle hidden" fill-rule="evenodd" clip-rule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"></path>
      <path class="astronav-toggle" fill-rule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"></path>
    </svg>
  `)}
</button>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/MenuIcon.astro");

const $$Astro$C = createAstro("https://stargazers.club");
const $$OpenIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$C, $$props, $$slots);
  Astro2.self = $$OpenIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["astronav-toggle", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/OpenIcon.astro");

const $$Astro$B = createAstro("https://stargazers.club");
const $$CloseIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$B, $$props, $$slots);
  Astro2.self = $$CloseIcon;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(["astronav-toggle hidden", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</span>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/CloseIcon.astro");

const $$Astro$A = createAstro("https://stargazers.club");
const $$MenuItems = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$MenuItems;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<nav${addAttribute(["astronav-toggle", className], "class:list")}>
    ${renderSlot($$result, $$slots["default"])}
</nav>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/MenuItems.astro");

const $$Astro$z = createAstro("https://stargazers.club");
const $$Dropdown$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$Dropdown$1;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["astronav-dropdown", className], "class:list")} aria-expanded="false">${renderSlot($$result, $$slots["default"])}</div>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/Dropdown.astro");

const $$Astro$y = createAstro("https://stargazers.club");
const $$DropdownItems = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$DropdownItems;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["dropdown-toggle hidden", className], "class:list")}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "D:/demo/test/node_modules/astro-navbar/src/components/DropdownItems.astro");

const $$Astro$x = createAstro("https://stargazers.club");
const $$Dropdown = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$Dropdown;
  const { title, lastItem, children } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li class="relative">
  ${renderComponent($$result, "Dropdown", $$Dropdown$1, { "class": "group" }, { "default": ($$result2) => renderTemplate`<button class="flex items-center gap-1 w-full lg:w-auto lg:px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
      <span>${title}</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 mt-0.5 group-open:rotate-180">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
      </svg>
    </button>${renderComponent($$result2, "DropdownItems", $$DropdownItems, {}, { "default": ($$result3) => renderTemplate`<div${addAttribute([
    "lg:absolute  w-full  lg:w-48",
    lastItem ? "lg:right-0 origin-top-right" : "lg:left-0 origin-top-left"
  ], "class:list")}>
        <div class="px-3 lg:py-2 lg:bg-white lg:rounded-md lg:shadow lg:border flex flex-col">
          ${children.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="py-1 text-gray-600 hover:text-gray-900">
                ${item.title}
              </a>`)}
        </div>
      </div>` })}` })}
</li>`;
}, "D:/demo/test/src/components/navbar/dropdown.astro");

const $$Astro$w = createAstro("https://stargazers.club");
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$Navbar;
  const res = await fetch("http://tailwind-tvg6.onrender.com/api/nav?populate=*");
  const data = await res.json();
  return renderTemplate`${renderComponent($$result, "Container", $$Container, { "class": "astro-57M2WULP" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<header class="flex flex-col lg:flex-row justify-between items-center my-5 astro-57M2WULP">
    ${renderComponent($$result2, "Astronav", $$Astronav, { "class": "astro-57M2WULP" }, { "default": ($$result3) => renderTemplate`<div class="flex w-full lg:w-auto items-center justify-between astro-57M2WULP">
        <a href="/" class="flex items-center astro-57M2WULP">
          <img src="/tw.png" class="h-6 mr-3 sm:h-10 astro-57M2WULP" alt="TailWind Logo">
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white astro-57M2WULP">TailWind</span>
        </a>
        <div class="block lg:hidden astro-57M2WULP">
          ${renderComponent($$result3, "MenuIcon", $$MenuIcon, { "class": "w-4 h-4 text-gray-800 astro-57M2WULP" })}
        </div>
      </div>${renderComponent($$result3, "MenuItems", $$MenuItems, { "class": "hidden w-full lg:w-auto mt-2 lg:flex lg:mt-0 astro-57M2WULP" }, { "default": ($$result4) => renderTemplate`<ul class="flex flex-col lg:flex-row lg:gap-3 astro-57M2WULP">
          <li class="astro-57M2WULP">
            
          </li>
          ${data.data.attributes.navitem.map((item, index) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "class": "astro-57M2WULP" }, { "default": ($$result5) => renderTemplate`<div class="body astro-57M2WULP">
                  ${item.Link && renderTemplate`${renderComponent($$result5, "Dropdown", $$Dropdown, { "title": item.title, "children": item.Link, "lastItem": index === data.length - 1, "class": "astro-57M2WULP" })}`}
                </div>${!item.Link && renderTemplate`<li class="astro-57M2WULP">
                    <a${addAttribute(item.href, "href")} class="flex lg:px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 astro-57M2WULP">
                      ${item.title}
                    </a>
                  </li>`}` })}`)}
          <li class="astro-57M2WULP">
            <button id="theme-toggle" type="button" class="text-gray-500 bg-gray-600 dark:text-gray-400 dark:bg-slate-200 hover:bg-gray-500 dark:hover:bg-white focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 astro-57M2WULP">
              <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 astro-57M2WULP" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" class="astro-57M2WULP"></path></svg>
              <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 astro-57M2WULP" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" class="astro-57M2WULP"></path></svg>
          </button>
          
        </li>
        </ul>` })}` })}
  </header>` })}`;
}, "D:/demo/test/src/components/navbar/navbar.astro");

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$v = createAstro("https://stargazers.club");
const footerData = {
  links: [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#" },
        { text: "Security", href: "#" },
        { text: "Team", href: "#" },
        { text: "Enterprise", href: "#" },
        { text: "Customer stories", href: "#" },
        { text: "Pricing", href: "#" },
        { text: "Resources", href: "#" }
      ]
    },
    {
      title: "Platform",
      links: [
        { text: "Developer API", href: "#" },
        { text: "Partners", href: "#" },
        { text: "Atom", href: "#" },
        { text: "Electron", href: "#" },
        { text: "AstroWind Desktop", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { text: "Docs", href: "#" },
        { text: "Community Forum", href: "#" },
        { text: "Professional Services", href: "#" },
        { text: "Skills", href: "#" },
        { text: "Status", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "#" },
        { text: "Blog", href: "#" },
        { text: "Careers", href: "#" },
        { text: "Press", href: "#" },
        { text: "Inclusion", href: "#" },
        { text: "Social Impact", href: "#" },
        { text: "Shop", href: "#" }
      ]
    }
  ],
  socialLinks: [
    { ariaLabel: "Twitter", icon: "tabler:brand-twitter", href: "#" },
    { ariaLabel: "Instagram", icon: "tabler:brand-instagram", href: "#" },
    { ariaLabel: "Facebook", icon: "tabler:brand-facebook", href: "#" },
    { ariaLabel: "RSS", icon: "tabler:rss", href: "/rss" },
    { ariaLabel: "Github", icon: "tabler:brand-github", href: "" }
  ]
};
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$Layout;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site).toString();
  const resolvedImageWithDomain = new URL(
    "/opengraph.jpg",
    Astro2.site
  ).toString();
  const { title } = Astro2.props;
  const makeTitle = title ? title + " | Thu\u1EADn Gi\xF3" : "Thu\u1EADn Gi\xF3 - C\xD4NG TY TNHH C\xD4NG NGH\u1EC6";
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width">\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n    <meta name="generator"', '>\n    \n<meta http-equiv="cache-control" content="no-cache">\n<meta http-equiv="expires" content="0">\n<meta http-equiv="pragma" content="no-cache">\n    <script>\n      // It\'s best to inline this in `head` to avoid FOUC (flash of unstyled content) when changing pages or themes\n      if (\n        localStorage.getItem("color-theme") === "dark" ||\n        (!("color-theme" in localStorage) &&\n          window.matchMedia("(prefers-color-scheme: dark)").matches)\n      ) {\n        document.documentElement.classList.add("dark");\n      } else {\n        document.documentElement.classList.remove("dark");\n      }\n    <\/script>\n\n    <!-- <link rel="preload" as="image" href={src} alt="Hero" /> -->\n    ', "\n  ", '</head>\n  <body class="dark:bg-black dark:text-white">\n    ', "\n\n    ", "\n    <br><br><br>\n    ", "\n    \n    \n  </body>\n</html>"], ['<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width">\n    <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n    <meta name="generator"', '>\n    \n<meta http-equiv="cache-control" content="no-cache">\n<meta http-equiv="expires" content="0">\n<meta http-equiv="pragma" content="no-cache">\n    <script>\n      // It\'s best to inline this in \\`head\\` to avoid FOUC (flash of unstyled content) when changing pages or themes\n      if (\n        localStorage.getItem("color-theme") === "dark" ||\n        (!("color-theme" in localStorage) &&\n          window.matchMedia("(prefers-color-scheme: dark)").matches)\n      ) {\n        document.documentElement.classList.add("dark");\n      } else {\n        document.documentElement.classList.remove("dark");\n      }\n    <\/script>\n\n    <!-- <link rel="preload" as="image" href={src} alt="Hero" /> -->\n    ', "\n  ", '</head>\n  <body class="dark:bg-black dark:text-white">\n    ', "\n\n    ", "\n    <br><br><br>\n    ", "\n    \n    \n  </body>\n</html>"])), addAttribute(Astro2.generator, "content"), renderComponent($$result, "SEO", $$SEO, { "title": makeTitle, "description": "Astroship is a starter website template for Astro built with TailwindCSS.", "canonical": canonicalURL, "twitter": {
    creator: "@surjithctly",
    site: "@web3templates",
    card: "summary_large_image"
  }, "openGraph": {
    basic: {
      url: canonicalURL,
      type: "website",
      title: `Thu\u1EADn Gi\xF3`,
      image: resolvedImageWithDomain
    },
    image: {
      alt: "Thu\u1EADn Gi\xF3 Homepage Screenshot"
    }
  } }), renderHead($$result), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, { ...footerData }));
}, "D:/demo/test/src/layouts/Layout.astro");

const $$Astro$u = createAstro("https://stargazers.club");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$Index;
  const res = await fetch(
    "http://tailwind-tvg6.onrender.com/api/posts?sort[0]=createdAt%3Adesc&populate=*&pagination[page]=1&pagination[pageSize]=2"
  );
  const page = await res.json();
  const local = "http://tailwind-tvg6.onrender.com";
  const img = page.data.map((item) => {
    return item.attributes.image;
  });
  const filter = img.filter((item) => {
    if (item.data != null) {
      return item.data;
    }
  });
  const temp = filter.map((item) => {
    return item.data.attributes;
  });
  const ft = await fetch(local + "/api/feature");
  const feature = await ft.json();
  const hr = await fetch(local + "/api/hero");
  const hero2 = await hr.json();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Index" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Cta", $$Cta, {})}${maybeRenderHead($$result2)}<div class="dark:text-gray-300 mt-10">
    ${renderComponent($$result2, "Features2", $$Features2, { "subtitle": feature.data.attributes.content, "title": feature.data.attributes.title, "highlight": "", "items": feature.data.attributes.items })}
  </div><div>
    <!-- Section: Design Block -->
    ${hero2 && hero2.data.attributes.items.map((item) => renderTemplate`${renderComponent($$result2, "Hero2", $$Hero2, { "content": item.caption, "img": item.image.data.attributes.url })}`)}
    <!-- Section: Design Block -->
  </div>${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`<div class="grid gap-1 mt-10">
      <div class="text-center text-blue-600 sm:text-5xl">
        <h1 class="dark:text-white">Tin Tức</h1>
      </div>
    </div><div class="grid gap-1 mt-10">
      <div class="text-center text-blue-600 sm:text-5xl">
        ${renderComponent($$result3, "Intro", $$Intro, {})}
      </div>
    </div><div class="grid sm:grid-cols-3 md:grid-cols-3 mt-16 gap-4 sm:text-2xl items-center">
      ${page.data.map((item, index) => renderTemplate`${renderComponent($$result3, "Features", $$Features, { "href": `/blog/${item.attributes.slug}`, "description": item.attributes.description, "title": item.attributes.title, "img": temp[index].url })}`)}
    </div><div class="gird sm:grid-cols-3 md:grid-cols-2 lg:gird-cols-2 gap-2 text-center align-center mt-5">
      <a${addAttribute(`/blog/`, "href")} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Xem Thêm
        <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </a>
    </div>${renderComponent($$result3, "Progress", $$Progress, {})}` })}` })}`;
}, "D:/demo/test/src/pages/index.astro");

const $$file$e = "D:/demo/test/src/pages/index.astro";
const $$url$e = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file$e,
  url: $$url$e
}, Symbol.toStringTag, { value: 'Module' }));

/** */
const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const $$Astro$t = createAstro("https://stargazers.club");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": frontmatter.title }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<div class="mx-auto max-w-[735px] mt-14">
      <span class="text-blue-400 uppercase tracking-wider text-sm font-medium">
        ${frontmatter.category}
      </span>
      <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight">
        ${frontmatter.title}
      </h1>
      <div class="flex gap-2 mt-3 items-center flex-wrap md:flex-nowrap">
        <span class="text-gray-400">
          ${frontmatter.author}
        </span>
        <span class="text-gray-400">•</span>
        <time class="text-gray-400"${addAttribute(frontmatter.publishDate, "datetime")}>
          ${getFormattedDate(frontmatter.publishDate)}
        </time>
        <span class="text-gray-400 hidden md:block">•</span>
        <div class="w-full md:w-auto flex flex-wrap gap-3">
          ${frontmatter.tags.map((tag) => renderTemplate`<span class="text-sm text-gray-500">#${tag}</span>`)}
        </div>
      </div>
    </div><div class="mx-auto prose prose-lg mt-6">
      ${renderSlot($$result3, $$slots["default"])}
    </div><div class="text-center mt-8">
      <a href="/qua-trinh-phat-trien" class="bg-gray-100 px-5 py-3 rounded-md hover:bg-gray-200 transition">← Back to</a>
    </div>` })}` })}`;
}, "D:/demo/test/src/layouts/BlogLayout.astro");

const $$file$d = "D:/demo/test/src/layouts/BlogLayout.astro";
const $$url$d = undefined;

const BlogLayout = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BlogLayout,
  file: $$file$d,
  url: $$url$d
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>\n<p>Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.</p>";

				const frontmatter$3 = {"title":"The Complete Guide to Full Stack Web Development","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-08T11:39:36.050Z","image":"https://images.unsplash.com/photo-1593720213428-28a5b9e94613?&fit=crop&w=430&h=240","category":"Tutorials","author":"Janette Lynch","layout":"@layouts/BlogLayout.astro","tags":["webdev","tailwindcss","frontend"]};
				const file$3 = "D:/demo/test/src/pages/qua-trinh-phat-trien/complete-guide-fullstack-development.md";
				const url$3 = "/qua-trinh-phat-trien/complete-guide-fullstack-development";
				function rawContent$3() {
					return "\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n\r\nSuspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.\r\n";
				}
				function compiledContent$3() {
					return html$2;
				}
				function getHeadings$3() {
					return [{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$BlogLayout, {
									file: file$3,
									url: url$3,
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$3,
  compiledContent: compiledContent$3,
  default: Content$3,
  file: file$3,
  frontmatter: frontmatter$3,
  getHeadings: getHeadings$3,
  rawContent: rawContent$3,
  url: url$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>\n<p>Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.</p>";

				const frontmatter$2 = {"title":" Introduction to the Essential Data Structures & Algorithms","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-09T16:39:36.050Z","image":"https://images.unsplash.com/photo-1627163439134-7a8c47e08208?&fit=crop&w=430&h=240","category":"Courses","author":"Marcell Ziemann","layout":"@layouts/BlogLayout.astro","tags":["webdev","tailwindcss","frontend"]};
				const file$2 = "D:/demo/test/src/pages/qua-trinh-phat-trien/essential-data-structures-algorithms.md";
				const url$2 = "/qua-trinh-phat-trien/essential-data-structures-algorithms";
				function rawContent$2() {
					return "\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n\r\nSuspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.\r\n";
				}
				function compiledContent$2() {
					return html$1;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$BlogLayout, {
									file: file$2,
									url: url$2,
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$2,
  compiledContent: compiledContent$2,
  default: Content$2,
  file: file$2,
  frontmatter: frontmatter$2,
  getHeadings: getHeadings$2,
  rawContent: rawContent$2,
  url: url$2
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>Whatever you do, it’s always beneficial to have the right tools at your disposal. I love working remotely and am a big advocate of doing remote software development. Therefore, I always strive to have the best equipment available to be as productive as possible. Writing posts like this constantly takes a lot of time. Luckily iVanky helped me out and sponsored this post so that I can concentrate on writing. I recently had the chance to test out one of their hottest products, a dual USB-C Docking Station that allows me to connect both my wide-screen monitors to my MacBook with Dual 4K@60Hz display connectivity. It also supports up to 96W laptop charging, which is awesome. If you are in a situation like me and want to upgrade your equipment, check out this and their other products! And now comes the article:</p>\n<p>Whether you are new to programming or already an experienced developer. In this industry, learning new concepts and languages/frameworks is\r\nmandatory to keep up with the rapid changes. Take for example React - open-sourced by Facebook just a shy 4 years ago it already became the number one choice for JavaScript devs around the globe. But also Vue and Angular, of course, have their legitimate follower-base. And then there is Svelte, and universal frameworks like Next.js or Nuxt.js, and Gatsby, and Gridsome, and Quasar, and and and. If you want to shine as an expert JavaScript developer you should at least have some experience in different frameworks and libraries - besides doing your homework with good, old JS.</p>\n<p>To help you become Frontend Masters, I have collected 9 different projects, each with a distinct topic and a different JavaScript framework or library as a tech stack that you can build and add to your portfolio. Remember, nothing helps you more than actually building stuff so go ahead, sharpen your mind and make this happen!</p>\n<h2 id=\"dictum-integer-fusce-ac-ridiculus\">Dictum integer fusce ac ridiculus</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>";

				const frontmatter$1 = {"title":"How to become a Frontend Master","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-07T15:39:36.050Z","image":"https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?&fit=crop&w=430&h=240","category":"Tutorials","author":"Connor Lopez","layout":"@layouts/BlogLayout.astro","tags":["astro","tailwindcss","frontend"]};
				const file$1 = "D:/demo/test/src/pages/qua-trinh-phat-trien/how-to-become-frontend-master.md";
				const url$1 = "/qua-trinh-phat-trien/how-to-become-frontend-master";
				function rawContent$1() {
					return "\r\nWhatever you do, it's always beneficial to have the right tools at your disposal. I love working remotely and am a big advocate of doing remote software development. Therefore, I always strive to have the best equipment available to be as productive as possible. Writing posts like this constantly takes a lot of time. Luckily iVanky helped me out and sponsored this post so that I can concentrate on writing. I recently had the chance to test out one of their hottest products, a dual USB-C Docking Station that allows me to connect both my wide-screen monitors to my MacBook with Dual 4K@60Hz display connectivity. It also supports up to 96W laptop charging, which is awesome. If you are in a situation like me and want to upgrade your equipment, check out this and their other products! And now comes the article:\r\n\r\nWhether you are new to programming or already an experienced developer. In this industry, learning new concepts and languages/frameworks is\r\nmandatory to keep up with the rapid changes. Take for example React - open-sourced by Facebook just a shy 4 years ago it already became the number one choice for JavaScript devs around the globe. But also Vue and Angular, of course, have their legitimate follower-base. And then there is Svelte, and universal frameworks like Next.js or Nuxt.js, and Gatsby, and Gridsome, and Quasar, and and and. If you want to shine as an expert JavaScript developer you should at least have some experience in different frameworks and libraries - besides doing your homework with good, old JS.\r\n\r\nTo help you become Frontend Masters, I have collected 9 different projects, each with a distinct topic and a different JavaScript framework or library as a tech stack that you can build and add to your portfolio. Remember, nothing helps you more than actually building stuff so go ahead, sharpen your mind and make this happen!\r\n\r\n## Dictum integer fusce ac ridiculus\r\n\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n";
				}
				function compiledContent$1() {
					return html;
				}
				function getHeadings$1() {
					return [{"depth":2,"slug":"dictum-integer-fusce-ac-ridiculus","text":"Dictum integer fusce ac ridiculus"},{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$BlogLayout, {
									file: file$1,
									url: url$1,
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content: Content$1,
  compiledContent: compiledContent$1,
  default: Content$1,
  file: file$1,
  frontmatter: frontmatter$1,
  getHeadings: getHeadings$1,
  rawContent: rawContent$1,
  url: url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$s = createAstro("https://stargazers.club");
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    size = "md",
    style = "primary",
    block,
    class: className,
    ...rest
  } = Astro2.props;
  const sizes = {
    md: "px-5 py-2.5",
    lg: "px-6 py-3"
  };
  const styles = {
    outline: "border-2 border-black hover:bg-black text-black hover:text-white",
    primary: "bg-black text-white hover:bg-slate-900  border-2 border-transparent"
  };
  return renderTemplate`${maybeRenderHead($$result)}<button${spreadAttributes(rest)}${addAttribute([
    "rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200",
    block && "w-full",
    sizes[size],
    styles[style],
    className
  ], "class:list")}>${renderSlot($$result, $$slots["default"])}
</button>`;
}, "D:/demo/test/src/components/ui/button.astro");

const MDXLayout = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BlogLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter;
  content.file = file;
  content.url = url;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file,
    url,
    content,
    frontmatter: content,
    headings: getHeadings(),
    "server:root": true,
    children
  });
};
const frontmatter = {
  "title": "Typography Example Post",
  "excerpt": "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat",
  "publishDate": "2022-11-05T15:36:19.399Z",
  "category": "Technology",
  "layout": "@layouts/BlogLayout.astro",
  "image": "https://images.unsplash.com/photo-1542393545-10f5cde2c810?&fit=crop&w=430&h=240",
  "author": "Charles North",
  "tags": ["mdx", "astro", "blog"]
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "headings",
    "text": "Headings"
  }, {
    "depth": 2,
    "slug": "heading-two",
    "text": "Heading two"
  }, {
    "depth": 3,
    "slug": "heading-three",
    "text": "Heading three"
  }, {
    "depth": 4,
    "slug": "heading-four",
    "text": "Heading four"
  }, {
    "depth": 5,
    "slug": "heading-five",
    "text": "Heading five"
  }, {
    "depth": 6,
    "slug": "heading-six",
    "text": "Heading six"
  }, {
    "depth": 2,
    "slug": "paragraphs",
    "text": "Paragraphs"
  }, {
    "depth": 2,
    "slug": "blockquotes",
    "text": "Blockquotes"
  }, {
    "depth": 2,
    "slug": "lists",
    "text": "Lists"
  }, {
    "depth": 3,
    "slug": "ordered-list",
    "text": "Ordered List"
  }, {
    "depth": 3,
    "slug": "unordered-list",
    "text": "Unordered List"
  }, {
    "depth": 2,
    "slug": "horizontal-rule",
    "text": "Horizontal rule"
  }, {
    "depth": 2,
    "slug": "table",
    "text": "Table"
  }, {
    "depth": 2,
    "slug": "code",
    "text": "Code"
  }, {
    "depth": 3,
    "slug": "inline-code",
    "text": "Inline code"
  }, {
    "depth": 3,
    "slug": "highlighted",
    "text": "Highlighted"
  }, {
    "depth": 2,
    "slug": "inline-elements",
    "text": "Inline elements"
  }, {
    "depth": 2,
    "slug": "mdx",
    "text": "MDX"
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    p: "p",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    a: "a",
    blockquote: "blockquote",
    ol: "ol",
    li: "li",
    ul: "ul",
    hr: "hr",
    table: "table",
    thead: "thead",
    tr: "tr",
    th: "th",
    tbody: "tbody",
    td: "td",
    code: "code",
    pre: "pre",
    span: "span",
    strong: "strong",
    img: "img",
    em: "em"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.h2, {
      id: "headings",
      children: [createVNode("a", {
        name: "Headings"
      }), "Headings"]
    }), "\n", createVNode(_components.p, {
      children: "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat commodo id sunt. Nostrud enim ad commodo incididunt cupidatat in ullamco ullamco Lorem cupidatat velit enim et Lorem. Ut laborum cillum laboris fugiat culpa sint irure do reprehenderit culpa occaecat. Exercitation esse mollit tempor magna aliqua in occaecat aliquip veniam reprehenderit nisi dolor in laboris dolore velit."
    }), "\n", createVNode(_components.h2, {
      id: "heading-two",
      children: "Heading two"
    }), "\n", createVNode(_components.p, {
      children: "Aute officia nulla deserunt do deserunt cillum velit magna. Officia veniam culpa anim minim dolore labore pariatur voluptate id ad est duis quis velit dolor pariatur enim. Incididunt enim excepteur do veniam consequat culpa do voluptate dolor fugiat ad adipisicing sit. Labore officia est adipisicing dolore proident eiusmod exercitation deserunt ullamco anim do occaecat velit. Elit dolor consectetur proident sunt aliquip est do tempor quis aliqua culpa aute. Duis in tempor exercitation pariatur et adipisicing mollit irure tempor ut enim esse commodo laboris proident. Do excepteur laborum anim esse aliquip eu sit id Lorem incididunt elit irure ea nulla dolor et. Nulla amet fugiat qui minim deserunt enim eu cupidatat aute officia do velit ea reprehenderit."
    }), "\n", createVNode(_components.h3, {
      id: "heading-three",
      children: "Heading three"
    }), "\n", createVNode(_components.p, {
      children: "Voluptate cupidatat cillum elit quis ipsum eu voluptate fugiat consectetur enim. Quis ut voluptate culpa ex anim aute consectetur dolore proident voluptate exercitation eiusmod. Esse in do anim magna minim culpa sint. Adipisicing ipsum consectetur proident ullamco magna sit amet aliqua aute fugiat laborum exercitation duis et."
    }), "\n", createVNode(_components.h4, {
      id: "heading-four",
      children: "Heading four"
    }), "\n", createVNode(_components.p, {
      children: "Commodo fugiat aliqua minim quis pariatur mollit id tempor. Non occaecat minim esse enim aliqua adipisicing nostrud duis consequat eu adipisicing qui. Minim aliquip sit excepteur ipsum consequat laborum pariatur excepteur. Veniam fugiat et amet ad elit anim laborum duis mollit occaecat et et ipsum et reprehenderit. Occaecat aliquip dolore adipisicing sint labore occaecat officia fugiat. Quis adipisicing exercitation exercitation eu amet est laboris sunt nostrud ipsum reprehenderit ullamco. Enim sint ut consectetur id anim aute voluptate exercitation mollit dolore magna magna est Lorem. Ut adipisicing adipisicing aliqua ullamco voluptate labore nisi tempor esse magna incididunt."
    }), "\n", createVNode(_components.h5, {
      id: "heading-five",
      children: "Heading five"
    }), "\n", createVNode(_components.p, {
      children: "Veniam enim esse amet veniam deserunt laboris amet enim consequat. Minim nostrud deserunt cillum consectetur commodo eu enim nostrud ullamco occaecat excepteur. Aliquip et ut est commodo enim dolor amet sint excepteur. Amet ad laboris laborum deserunt sint sunt aliqua commodo ex duis deserunt enim est ex labore ut. Duis incididunt velit adipisicing non incididunt adipisicing adipisicing. Ad irure duis nisi tempor eu dolor fugiat magna et consequat tempor eu ex dolore. Mollit esse nisi qui culpa ut nisi ex proident culpa cupidatat cillum culpa occaecat anim. Ut officia sit ea nisi ea excepteur nostrud ipsum et nulla."
    }), "\n", createVNode(_components.h6, {
      id: "heading-six",
      children: "Heading six"
    }), "\n", createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "paragraphs",
      children: [createVNode("a", {
        name: "Paragraphs"
      }), "Paragraphs"]
    }), "\n", createVNode(_components.p, {
      children: "Incididunt ex adipisicing ea ullamco consectetur in voluptate proident fugiat tempor deserunt reprehenderit ullamco id dolore laborum. Do laboris laboris minim incididunt qui consectetur exercitation adipisicing dolore et magna consequat magna anim sunt. Officia fugiat Lorem sunt pariatur incididunt Lorem reprehenderit proident irure. Dolore ipsum aliqua mollit ad officia fugiat sit eu aliquip cupidatat ipsum duis laborum laborum fugiat esse. Voluptate anim ex dolore deserunt ea ex eiusmod irure. Occaecat excepteur aliqua exercitation aliquip dolor esse eu eu."
    }), "\n", createVNode(_components.p, {
      children: "Officia dolore laborum aute incididunt commodo nisi velit est est elit et dolore elit exercitation. Enim aliquip magna id ipsum aliquip consectetur ad nulla quis. Incididunt pariatur dolor consectetur cillum enim velit cupidatat laborum quis ex."
    }), "\n", createVNode(_components.p, {
      children: "Officia irure in non voluptate adipisicing sit amet tempor duis dolore deserunt enim ut. Reprehenderit incididunt in ad anim et deserunt deserunt Lorem laborum quis. Enim aute anim labore proident laboris voluptate elit excepteur in. Ex labore nulla velit officia ullamco Lorem Lorem id do. Dolore ullamco ipsum magna dolor pariatur voluptate ipsum id occaecat ipsum. Dolore tempor quis duis commodo quis quis enim."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "blockquotes",
      children: [createVNode("a", {
        name: "Blockquotes"
      }), "Blockquotes"]
    }), "\n", createVNode(_components.p, {
      children: "Ad nisi laborum aute cupidatat magna deserunt eu id laboris id. Aliquip nulla cupidatat sint ex Lorem mollit laborum dolor amet est ut esse aute. Nostrud ex consequat id incididunt proident ipsum minim duis aliqua ut ex et ad quis. Laborum sint esse cillum anim nulla cillum consectetur aliqua sit. Nisi excepteur cillum labore amet excepteur commodo enim occaecat consequat ipsum proident exercitation duis id in."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Ipsum et cupidatat mollit exercitation enim duis sunt irure aliqua reprehenderit mollit. Pariatur Lorem pariatur laboris do culpa do elit irure. Eiusmod amet nulla voluptate velit culpa et aliqua ad reprehenderit sit ut."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Labore ea magna Lorem consequat aliquip consectetur cillum duis dolore. Et veniam dolor qui incididunt minim amet laboris sit. Dolore ad esse commodo et dolore amet est velit ut nisi ea. Excepteur ea nulla commodo dolore anim dolore adipisicing eiusmod labore id enim esse quis mollit deserunt est. Minim ea culpa voluptate nostrud commodo proident in duis aliquip minim."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Qui est sit et reprehenderit aute est esse enim aliqua id aliquip ea anim. Pariatur sint reprehenderit mollit velit voluptate enim consectetur sint enim. Quis exercitation proident elit non id qui culpa dolore esse aliquip consequat."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Ipsum excepteur cupidatat sunt minim ad eiusmod tempor sit."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Deserunt excepteur adipisicing culpa pariatur cillum laboris ullamco nisi fugiat cillum officia. In cupidatat nulla aliquip tempor ad Lorem Lorem quis voluptate officia consectetur pariatur ex in est duis. Mollit id esse est elit exercitation voluptate nostrud nisi laborum magna dolore dolore tempor in est consectetur."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Adipisicing voluptate ipsum culpa voluptate id aute laboris labore esse fugiat veniam ullamco occaecat do ut. Tempor et esse reprehenderit veniam proident ipsum irure sit ullamco et labore ea excepteur nulla labore ut. Ex aute minim quis tempor in eu id id irure ea nostrud dolor esse."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "lists",
      children: [createVNode("a", {
        name: "Lists"
      }), "Lists"]
    }), "\n", createVNode(_components.h3, {
      id: "ordered-list",
      children: "Ordered List"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: "Longan"
      }), "\n", createVNode(_components.li, {
        children: "Lychee"
      }), "\n", createVNode(_components.li, {
        children: "Excepteur ad cupidatat do elit laborum amet cillum reprehenderit consequat quis.\r\nDeserunt officia esse aliquip consectetur duis ut labore laborum commodo aliquip aliquip velit pariatur dolore."
      }), "\n", createVNode(_components.li, {
        children: "Marionberry"
      }), "\n", createVNode(_components.li, {
        children: ["Melon\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Cantaloupe"
          }), "\n", createVNode(_components.li, {
            children: "Honeydew"
          }), "\n", createVNode(_components.li, {
            children: "Watermelon"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Miracle fruit"
      }), "\n", createVNode(_components.li, {
        children: "Mulberry"
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "unordered-list",
      children: "Unordered List"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Olive"
      }), "\n", createVNode(_components.li, {
        children: ["Orange\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Blood orange"
          }), "\n", createVNode(_components.li, {
            children: "Clementine"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Papaya"
      }), "\n", createVNode(_components.li, {
        children: "Ut aute ipsum occaecat nisi culpa Lorem id occaecat cupidatat id id magna laboris ad duis. Fugiat cillum dolore veniam nostrud proident sint consectetur eiusmod irure adipisicing."
      }), "\n", createVNode(_components.li, {
        children: "Passionfruit"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "horizontal-rule",
      children: [createVNode("a", {
        name: "Horizontal"
      }), "Horizontal rule"]
    }), "\n", createVNode(_components.p, {
      children: "In dolore velit aliquip labore mollit minim tempor veniam eu veniam ad in sint aliquip mollit mollit. Ex occaecat non deserunt elit laborum sunt tempor sint consequat culpa culpa qui sit. Irure ad commodo eu voluptate mollit cillum cupidatat veniam proident amet minim reprehenderit."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: "In laboris eiusmod reprehenderit aliquip sit proident occaecat. Non sit labore anim elit veniam Lorem minim commodo eiusmod irure do minim nisi. Dolor amet cillum excepteur consequat sint non sint."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "table",
      children: [createVNode("a", {
        name: "Table"
      }), "Table"]
    }), "\n", createVNode(_components.p, {
      children: "Duis sunt ut pariatur reprehenderit mollit mollit magna dolore in pariatur nulla commodo sit dolor ad fugiat. Laboris amet ea occaecat duis eu enim exercitation deserunt ea laborum occaecat reprehenderit. Et incididunt dolor commodo consequat mollit nisi proident non pariatur in et incididunt id. Eu ut et Lorem ea ex magna minim ipsum ipsum do."
    }), "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, {
      children: [createVNode(_components.thead, {
        children: createVNode(_components.tr, {
          children: [createVNode(_components.th, {
            align: "left",
            children: "Table Heading 1"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 2"
          }), createVNode(_components.th, {
            align: "center",
            children: "Center align"
          }), createVNode(_components.th, {
            align: "right",
            children: "Right align"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 5"
          })]
        })
      }), createVNode(_components.tbody, {
        children: [createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        })]
      })]
    }), "\n", createVNode(_components.p, {
      children: "Minim id consequat adipisicing cupidatat laborum culpa veniam non consectetur et duis pariatur reprehenderit eu ex consectetur. Sunt nisi qui eiusmod ut cillum laborum Lorem officia aliquip laboris ullamco nostrud laboris non irure laboris. Cillum dolore labore Lorem deserunt mollit voluptate esse incididunt ex dolor."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "code",
      children: [createVNode("a", {
        name: "Code"
      }), "Code"]
    }), "\n", createVNode(_components.h3, {
      id: "inline-code",
      children: "Inline code"
    }), "\n", createVNode(_components.p, {
      children: ["Ad amet irure est magna id mollit Lorem in do duis enim. Excepteur velit nisi magna ea pariatur pariatur ullamco fugiat deserunt sint non sint. Duis duis est ", createVNode(_components.code, {
        children: "code in text"
      }), " velit velit aute culpa ex quis pariatur pariatur laborum aute pariatur duis tempor sunt ad. Irure magna voluptate dolore consectetur consectetur irure esse. Anim magna ", createVNode(_components.code, {
        children: "<strong>in culpa qui officia</strong>"
      }), " dolor eiusmod esse amet aute cupidatat aliqua do id voluptate cupidatat reprehenderit amet labore deserunt."]
    }), "\n", createVNode(_components.h3, {
      id: "highlighted",
      children: "Highlighted"
    }), "\n", createVNode(_components.p, {
      children: "Et fugiat ad nisi amet magna labore do cillum fugiat occaecat cillum Lorem proident. In sint dolor ullamco ad do adipisicing amet id excepteur Lorem aliquip sit irure veniam laborum duis cillum. Aliqua occaecat minim cillum deserunt magna sunt laboris do do irure ea nostrud consequat ut voluptate ex."
    }), "\n", createVNode(_components.pre, {
      className: "astro-code",
      style: {
        backgroundColor: "#0d1117",
        overflowX: "auto"
      },
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "package"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "main"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "fmt"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "net/http"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "handler"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w http.ResponseWriter, r "
          }), createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "*"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "http.Request) {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    fmt."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "Fprintf"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w, "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"Hi there, I love "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "%s"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "!\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", r.URL.Path["
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ":])"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "main"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "() {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "HandleFunc"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"/\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", handler)"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "ListenAndServe"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\":8080\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "nil"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Ex amet id ex aliquip id do laborum excepteur exercitation elit sint commodo occaecat nostrud est. Nostrud pariatur esse veniam laborum non sint magna sit laboris minim in id. Aliqua pariatur pariatur excepteur adipisicing irure culpa consequat commodo et ex id ad."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "inline-elements",
      children: [createVNode("a", {
        name: "Inline"
      }), "Inline elements"]
    }), "\n", createVNode(_components.p, {
      children: ["Sint ea anim ipsum ad commodo cupidatat do ", createVNode(_components.strong, {
        children: "exercitation"
      }), " incididunt et minim ad labore sunt. Minim deserunt labore laboris velit nulla incididunt ipsum nulla. Ullamco ad laborum ea qui et anim in laboris exercitation tempor sit officia laborum reprehenderit culpa velit quis. ", createVNode(_components.strong, {
        children: "Consequat commodo"
      }), " reprehenderit duis ", createVNode(_components.a, {
        href: "#!",
        children: "irure"
      }), " esse esse exercitation minim enim Lorem dolore duis irure. Nisi Lorem reprehenderit ea amet excepteur dolor excepteur magna labore proident voluptate ipsum. Reprehenderit ex esse deserunt aliqua ea officia mollit Lorem nulla magna enim. Et ad ipsum labore enim ipsum ", createVNode(_components.strong, {
        children: "cupidatat consequat"
      }), ". Commodo non ea cupidatat magna deserunt dolore ipsum velit nulla elit veniam nulla eiusmod proident officia."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://images.unsplash.com/photo-1471128466710-c26ff0d26143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY2MDc4MTk3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
        alt: "Super wide"
      })
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.em, {
        children: "Proident sit veniam in est proident officia adipisicing"
      }), " ea tempor cillum non cillum velit deserunt. Voluptate laborum incididunt sit consectetur Lorem irure incididunt voluptate nostrud. Commodo ut eiusmod tempor cupidatat esse enim minim ex anim consequat. Mollit sint culpa qui laboris quis consectetur ad sint esse. Amet anim anim minim ullamco et duis non irure. Sit tempor adipisicing ea laboris ", createVNode(_components.code, {
        children: "culpa ex duis sint"
      }), " anim aute reprehenderit id eu ea. Aute ", createVNode(_components.a, {
        href: "#!",
        children: "excepteur proident"
      }), " Lorem minim adipisicing nostrud mollit ad ut voluptate do nulla esse occaecat aliqua sint anim."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://placekitten.com/480/400",
        alt: "Not so big"
      })
    }), "\n", createVNode(_components.p, {
      children: ["Incididunt in culpa cupidatat mollit cillum qui proident sit. In cillum aliquip incididunt voluptate magna amet cupidatat cillum pariatur sint aliqua est ", createVNode(_components.em, {
        children: ["enim ", createVNode(_components.strong, {
          children: "anim"
        }), " voluptate"]
      }), ". Magna aliquip proident incididunt id duis pariatur eiusmod incididunt commodo culpa dolore sit. Culpa do nostrud elit ad exercitation anim pariatur non minim nisi ", createVNode(_components.strong, {
        children: ["adipisicing sunt ", createVNode(_components.em, {
          children: "officia"
        })]
      }), ". Do deserunt magna mollit Lorem commodo ipsum do cupidatat mollit enim ut elit veniam ea voluptate."]
    }), "\n", createVNode(_components.p, {
      children: ["Reprehenderit non eu quis in ad elit esse qui aute id ", createVNode(_components.a, {
        href: "#!",
        children: "incididunt"
      }), " dolore cillum. Esse laboris consequat dolor anim exercitation tempor aliqua deserunt velit magna laboris. Culpa culpa minim duis amet mollit do quis amet commodo nulla irure."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "mdx",
      children: "MDX"
    }), "\n", createVNode(_components.pre, {
      className: "astro-code",
      style: {
        backgroundColor: "#0d1117",
        overflowX: "auto"
      },
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "---"
          })
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "publishDate"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "'Aug 02 2022'"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "title"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "'Markdown elements demo post'"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "---"
          })
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " Logo "
          }), createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"@components/ui/button.astro\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ";"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "## "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "MDX"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "<"
          }), createVNode(_components.span, {
            style: {
              color: "#7EE787"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ">Click</"
          }), createVNode(_components.span, {
            style: {
              color: "#7EE787"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ">"
          })]
        })]
      })
    }), "\n", createVNode("div", {
      children: createVNode($$Button, {
        children: "Click Me"
      })
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    })]
  });
}
function MDXContent(props = {}) {
  return createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
const url = "/qua-trinh-phat-trien/kitchensink";
const file = "D:/demo/test/src/pages/qua-trinh-phat-trien/kitchensink.mdx";
function rawContent() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content = MDXContent;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Content,
  compiledContent,
  default: MDXContent,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$r = createAstro("https://stargazers.club");
const $$Sectionhead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$Sectionhead;
  const { align = "center" } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["mt-16", align === "center" && "text-center"], "class:list")}>
  <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight dark:text-white">
    ${renderSlot($$result, $$slots["title"], renderTemplate`Title`)}
  </h1>
  <p class="text-lg mt-4 text-slate-600">
    ${renderSlot($$result, $$slots["desc"], renderTemplate`Some description goes here`)}
  </p>
</div>`;
}, "D:/demo/test/src/components/sectionhead.astro");

const $$Astro$q = createAstro("https://stargazers.club");
const $$LichSuHinhThanhVaPhatTrien = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$LichSuHinhThanhVaPhatTrien;
  const Img1 = "/public/_image (1).heif";
  const Img2 = "/public/_image (2).heif";
  const Img3 = "/public/_image (3).heif";
  const Img = "/public/_image.heif";
  const posts = [
    {
      title: "COURSES",
      content: "Introduction to the Essential Data Structures & Algorithms",
      avatar: {
        src: Img1
      }
    },
    {
      title: "TUTORIALS",
      content: "The Complete Guide to Full Stack Web Development",
      avatar: {
        src: Img2
      }
    },
    {
      title: "TUTORIALS",
      content: "How to become a Frontend Master",
      avatar: {
        src: Img3
      }
    },
    {
      title: "TECHNOLOGY",
      content: "Typography Example Post",
      url: "",
      avatar: {
        src: Img
      }
    }
  ];
  return renderTemplate`${maybeRenderHead($$result)}<main class="mt-16 astro-PSXRQUDQ">
    <ul class="grid grid-flow-col grid-rows-4 grid-cols-2 gap-10 mx-auto max-w-4xl astro-PSXRQUDQ">
      ${posts.map((item) => renderTemplate`<li class="astro-PSXRQUDQ">
              <div class="grid md:grid-cols-1 gap-5 md:gap-10 items-center astro-PSXRQUDQ">
                ${renderComponent($$result, "Picture", $$Picture, { ...item.avatar, "format": "avif", "alt": "Team", "widths": [500, 300], "aspectRatio": "1:1", "sizes": "100px 100px", "format": "avif", "class": "astro-PSXRQUDQ" })}
              </div>
          </li><div class="col-start-2 astro-PSXRQUDQ">
                  <p class="astro-PSXRQUDQ">${item.title}</p>
                  <a${addAttribute(item.url, "href")} class="astro-PSXRQUDQ">
                    ${item.content}
                  </a>
                </div>`)}
    </ul>
  </main>`;
}, "D:/demo/test/src/components/lich-su-hinh-thanh-va-phat-trien.astro");

const $$Astro$p = createAstro("https://stargazers.club");
const $$QuaTrinhPhatTrien = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$QuaTrinhPhatTrien;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "qua-trinh-phat-trien" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Lịch sử hình thành và phát triển` })}` })}${renderComponent($$result3, "Features", $$LichSuHinhThanhVaPhatTrien, {})}` })}` })}`;
}, "D:/demo/test/src/pages/qua-trinh-phat-trien.astro");

const $$file$c = "D:/demo/test/src/pages/qua-trinh-phat-trien.astro";
const $$url$c = "/qua-trinh-phat-trien";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QuaTrinhPhatTrien,
  file: $$file$c,
  url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$o = createAstro("https://stargazers.club");
const $$MoiTruongLamViec = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$MoiTruongLamViec;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "M\xF4i Tr\u01B0\u1EDDng l\xE0m vi\u1EC7c chuy\xEAn nghi\u1EC7p" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Môi Trường` })}` })}` })}` })}`;
}, "D:/demo/test/src/pages/moi-truong-lam-viec.astro");

const $$file$b = "D:/demo/test/src/pages/moi-truong-lam-viec.astro";
const $$url$b = "/moi-truong-lam-viec";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MoiTruongLamViec,
  file: $$file$b,
  url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$n = createAstro("https://stargazers.club");
const $$ThongTin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$ThongTin;
  const TeamImg1 = "data:image/jpeg;base64,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";
  const TeamImg2 = "https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2021/05/3ea97456-meo-golden-thumb.jpeg";
  const TeamImg3 = "data:image/jpeg;base64,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";
  const team = [
    {
      name: "Li\u1EC7t C\u01B0\u1EDDng",
      title: "Senior Director",
      avatar: {
        src: TeamImg1,
        width: 480,
        height: 560
      }
    },
    {
      name: "Tu\u1EA5n Tr\u1EA7n",
      title: "Principaategist",
      avatar: {
        src: TeamImg2,
        width: 580,
        height: 580
      }
    },
    {
      name: "Minh \u0110\u1EB7ng",
      title: "Marketing Engineer",
      avatar: {
        src: TeamImg3,
        width: 580,
        height: 580
      }
    }
  ];
  return renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-col gap-3 mx-auto max-w-4xl mt-16 astro-K32BCUJ4">
    <h2 class="font-bold text-3xl text-gray-800 astro-K32BCUJ4">Hãy đặt niềm tin vào chúng tôi.
    </h2>
    <p class="text-lg leading-relaxed text-slate-500 astro-K32BCUJ4">
      Chúng tôi là một nhóm đa văn hóa từ khắp nơi trên thế giới! Chúng tôi đến từ nhiều nền tảng khác nhau, mang đến những tính cách, kinh nghiệm và kỹ năng khác nhau cho công việc. Đây là những gì làm cho nhóm của chúng tôi rất đặc biệt.
    </p>
  </div>
  <div class="grid md:grid-cols-3 gap-10 mx-auto max-w-4xl mt-12 astro-K32BCUJ4">
    ${team.map((item) => renderTemplate`<div class="group astro-K32BCUJ4">
          <div class="w-full aspect-square astro-K32BCUJ4">
            ${renderComponent($$result, "Picture", $$Picture, { ...item.avatar, "format": "avif", "alt": "Team", "widths": [200, 400], "aspectRatio": "1:1", "sizes": "(max-width: 800px) 100vw, 400px", "class": "w-full h-full object-cover rounded transition  group-hover:-translate-y-1 group-hover:shadow-xl astro-K32BCUJ4", "format": "avif" })}
          </div>

          <div class="mt-4 text-center astro-K32BCUJ4">
            <h2 class="text-lg text-gray-800 astro-K32BCUJ4"> ${item.name}</h2>
            <h3 class="text-sm text-slate-500 astro-K32BCUJ4"> ${item.title}</h3>
          </div>
        </div>`)}
  </div>
  <br class="astro-K32BCUJ4">
  <h2 style="text-align: center;" class="font-bold text-3xl text-gray-800 astro-K32BCUJ4">
    Nơi bạn có thể tìm thấy chúng tôi.
  </h2>
  <br class="astro-K32BCUJ4">

  <!-- <p><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8938.37795071606!2d105.43798030014538!3d10.38089005134429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1675222382441!5m2!1svi!2s" width="1245" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></p> -->
  
  <!-- <div class="body">
  <div class="container"> -->
   
  <!-- </div>
</div> -->`;
}, "D:/demo/test/src/components/thong-tin.astro");

const $$Astro$m = createAstro("https://stargazers.club");
const $$Map = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$Map;
  return renderTemplate`${maybeRenderHead($$result)}<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d570.8499968637032!2d105.41399375294583!3d10.39811215520125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a72b6025a16f9%3A0x13a689bf9fc9f7f8!2sSao%20Mai!5e0!3m2!1svi!2s!4v1675751006738!5m2!1svi!2s" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}, "D:/demo/test/src/components/map.astro");

const $$Astro$l = createAstro("https://stargazers.club");
const $$ThongTinCongTy = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$ThongTinCongTy;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Th\xF4ng tin" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" }, { "default": ($$result5) => renderTemplate`-----` })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Thông tin về công ty` })}` })}${renderComponent($$result3, "Features", $$ThongTin, {})}${maybeRenderHead($$result3)}<div class="mt-5">
      ${renderComponent($$result3, "Map", $$Map, {})}
    </div>` })}` })}`;
}, "D:/demo/test/src/pages/thong-tin-cong-ty.astro");

const $$file$a = "D:/demo/test/src/pages/thong-tin-cong-ty.astro";
const $$url$a = "/thong-tin-cong-ty";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ThongTinCongTy,
  file: $$file$a,
  url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$k = createAstro("https://stargazers.club");
const $$DichVu = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$DichVu;
  return renderTemplate`${maybeRenderHead($$result)}<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 :text-gray-400 ">
        <thead class="text-xs text-gray-700 uppercase :text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3 dark:bg-gray-500 dark:text-black">
                    Color
                </th>
                <th scope="col" class="px-6 py-3 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Category
                </th>
                <th scope="col" class="px-6 py-3 dark:bg-gray-500 dark:text-black">
                    Price
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="border-b border-gray-200 :border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 :text-white :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    Sliver
                </td>
                <td class="px-6 py-4 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Laptop
                </td>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    $2999
                </td>
            </tr>
            <tr class="border-b border-gray-200 :border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 :text-white :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    White
                </td>
                <td class="px-6 py-4 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Laptop PC
                </td>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    $1999
                </td>
            </tr>
            <tr class="border-b border-gray-200 :border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 :text-white :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    Black
                </td>
                <td class="px-6 py-4 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Accessories
                </td>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    $99
                </td>
            </tr>
            <tr class="border-b border-gray-200 :border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 :text-white :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Google Pixel Phone
                </th>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    Gray
                </td>
                <td class="px-6 py-4 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Phone
                </td>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    $799
                </td>
            </tr>
            <tr>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 :text-white :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Apple Watch 5
                </th>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    Red
                </td>
                <td class="px-6 py-4 bg-gray-50 :bg-gray-800 dark:bg-gray-900 dark:text-white">
                    Wearables
                </td>
                <td class="px-6 py-4 dark:bg-gray-500 dark:text-black">
                    $999
                </td>
            </tr>
        </tbody>
    </table>
</div>`;
}, "D:/demo/test/src/components/dich-vu.astro");

const $$Astro$j = createAstro("https://stargazers.club");
const $$DoiTac = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$DoiTac;
  return renderTemplate`${maybeRenderHead($$result)}<div class="body astro-BPBAGTMM">
  <div class="planet planetEarth astro-BPBAGTMM">
    <div class="container dark:bg-[url('/star.jpg')] astro-BPBAGTMM">
      <div class="text astro-BPBAGTMM">
        Thuận Gió hiện là đối tác tin cậy có nhiều năm kinh nghiệm thực hiện
        những dự án lớn & phức tạp với những công nghệ mới nhất với hơn 100
        khách hàng đến từ 30 quốc gia trên thế giới.
      </div>
      <div class="loader astro-BPBAGTMM">
        <div class="bh astro-BPBAGTMM">
          
        </div>
      </div>
      <div class="earth dark:bg-white astro-BPBAGTMM"></div>
    </div>
  </div>
</div>`;
}, "D:/demo/test/src/components/doi-tac.astro");

const $$Astro$i = createAstro("https://stargazers.club");
const $$DichVuDoiTac = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$DichVuDoiTac;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "D\u1ECBch V\u1EE5 \u0110\u1ED1i T\xE1c" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Dịch Vụ` })}` })}${renderComponent($$result3, "Service", $$DichVu, {})}${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Đối Tác` })}` })}${renderComponent($$result3, "Partner", $$DoiTac, {})}` })}` })}`;
}, "D:/demo/test/src/pages/dich-vu-doi-tac.astro");

const $$file$9 = "D:/demo/test/src/pages/dich-vu-doi-tac.astro";
const $$url$9 = "/dich-vu-doi-tac";

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DichVuDoiTac,
  file: $$file$9,
  url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$h = createAstro("https://stargazers.club");
const $$DangNhap$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$DangNhap$1;
  return renderTemplate`<!-- <form 
  action="https://api.web3forms.com/submit"
  method="POST"
  id="form"
  class="needs-validation"
  novalidate>
  
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
  <input type="checkbox" class="hidden" style="display:none" name="botcheck" />
  <div class="mb-5">
    <input
      type="text"
      placeholder="Nhập tên đăng nhập..."
      required
      class="w-full px-4 py-3 border-2 placeholder:text-gray-300 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 text-center"
      name="name"
    />
    <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
      Nhập tên đăng nhập
    </div>
  </div>
  <div class="mb-5">
    <label for="email_address" class="sr-only">Nhập Password</label><input
      id="email_address"
      type="email"
      placeholder="Nhập password..."
      name="email"
      required
      class="w-full px-4 py-3 border-2 placeholder:text-gray-300 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 text-center"
    />
    <div class="empty-feedback text-red-400 text-sm mt-1">
      Vui lòng nhập đúng định dạng Email
    </div>
    <div class="invalid-feedback text-red-400 text-sm mt-1">
      Please provide a valid email address.
    </div>
  </div>
  <Button type="submit" size="lg" block>Đăng nhập</Button>
  <br><br>
<label class="checkbox">
  <input type="checkbox" name="remember2">
  <span>Nhớ mật khẩu</span>
</label>
<div>
<a href="#"><u>Quên mật khẩu</u></a>
</div>
  <div id="result" class="mt-3 text-center"></div>
</form> -->
    ${maybeRenderHead($$result)}<div class="container astro-JTV5WAUM">
      <div class="drop astro-JTV5WAUM">
        <div class="content astro-JTV5WAUM">
          <h2 class="astro-JTV5WAUM">Đăng nhập</h2>
          <form name="form1" method="post" action="" onsubmit="return validateform()" class="astro-JTV5WAUM">
            <div class="inputBox astro-JTV5WAUM">
              <input name="name" type="text" placeholder="Tên đăng nhập" required="" class="astro-JTV5WAUM">
            </div>
            <div class="inputBox astro-JTV5WAUM">
              <input name="password" type="password" placeholder="Mật khẩu" required="" class="astro-JTV5WAUM">
            </div>
            <div class="inputBox astro-JTV5WAUM">
              <input type="submit" value="Xác nhận" class="astro-JTV5WAUM">
            </div>
          </form>
        </div>
      </div>
      <a href="#" class="btns astro-JTV5WAUM">Quên mât khẩu</a>
      <a href="#" class="signup astro-JTV5WAUM">Đăng ký</a>
    </div>`;
}, "D:/demo/test/src/components/dang-nhap.astro");

const $$Astro$g = createAstro("https://stargazers.club");
const $$DangNhap = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$DangNhap;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" })}` })}${renderComponent($$result3, "Contactform", $$DangNhap$1, {})}` })}` })}`;
}, "D:/demo/test/src/pages/dang-nhap.astro");

const $$file$8 = "D:/demo/test/src/pages/dang-nhap.astro";
const $$url$8 = "/dang-nhap";

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DangNhap,
  file: $$file$8,
  url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$f = createAstro("https://stargazers.club");
const $$Pagination2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Pagination2;
  const { next, prev } = Astro2.props;
  return renderTemplate`${prev && renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(prev, "href")} class="inline-flex items-center px-4 py-2 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
      <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
      </svg>
      Previous
    </a>`}

${next && renderTemplate`<a${addAttribute(next, "href")} class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
      Next
      <svg aria-hidden="true" class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
      </svg>
    </a>`}`;
}, "D:/demo/test/src/components/Pagination_2.astro");

const $$Astro$e = createAstro("https://stargazers.club");
const $$CategoryCloud = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$CategoryCloud;
  const res = await fetch("http://tailwind-tvg6.onrender.com/api/posts?populate=*");
  const allPosts = await res.json();
  const allCategory = allPosts.data.map((cat) => cat.attributes.category.data.attributes.slug).flat();
  const catPost = allCategory.reduce((item, index) => {
    const count = item[index] || 0;
    return {
      ...item,
      [index]: count + 1
    };
  }, {});
  Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<h1 class="text-3xl font-bold text-center mt-5">Category</h1>
<ul class="flex flex-wrap items-center justify-center mb-6 text-white mt-5">
    
  ${Object.entries(catPost).map(([key, value]) => renderTemplate`<li>
        <a class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"${addAttribute(`/category/${key}/`, "href")}>
          ${key.toLocaleUpperCase()} (${value})
        </a>
      </li>`)}
</ul>`;
}, "D:/demo/test/src/components/CategoryCloud.astro");

const $$Astro$d = createAstro("https://stargazers.club");
const $$Error404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Error404;
  return renderTemplate`${maybeRenderHead($$result)}<section class="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="max-w-md text-center">
			<h2 class="mb-8 font-extrabold text-9xl dark:text-gray-600">
				<span class="sr-only">Error</span>404
			</h2>
			<p class="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
			<p class="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
			<a rel="noopener noreferrer" href="/" class="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900">Back to homepage</a>
		</div>
	</div>
</section>`;
}, "D:/demo/test/src/components/error404.astro");

const $$Astro$c = createAstro("https://stargazers.club");
const $$$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$$2;
  const d = Astro2.params.page;
  var t = "1";
  var err = false;
  var temp = null;
  if (d != null) {
    const findStr = d.indexOf("/");
    if (d) {
      t = d.slice(findStr + 1);
    }
  }
  const res = await fetch(`http://tailwind-tvg6.onrender.com/api/posts?filters[category][slug][$eq]=${Astro2.params.category}&sort[0]=createdAt%3Adesc&populate=*&pagination[page]=${t}&pagination[pageSize]=1`);
  const page = await res.json();
  if (page.data != null) {
    const pageCount = page.meta.pagination.pageCount;
    const currentPage = page.meta.pagination.page;
    const img = page.data.map((item) => {
      return item.attributes.image;
    });
    const filter = img.filter((item) => {
      if (item.data != null) {
        return item.data;
      }
    });
    temp = filter.map((item) => {
      return item.data.attributes;
    });
    if (currentPage == pageCount && currentPage > 1) {
      var temp_prev = currentPage - 1;
      var prev = "/category/" + Astro2.params.category + "/page/" + temp_prev;
    }
    if (currentPage < pageCount) {
      var temp_next = currentPage + 1;
      var next = "/category/" + Astro2.params.category + "/page/" + temp_next;
    }
  } else {
    err = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "blog" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<div class="grid sm:grid-cols-3 md:grid-cols-3 gap-3">
      ${page.data && page.data.map((item, index) => renderTemplate`${renderComponent($$result3, "Features", $$Features, { "href": `/blog/${item.attributes.slug}`, "description": item.attributes.description, "title": item.attributes.title, "img": temp[index].url })}`)}
    </div>${page.data && renderTemplate`<div class="gird sm:grid-cols-3 md:grid-cols-2 lg:gird-cols-2 gap-2 items-center text-center mt-5">
        ${renderComponent($$result3, "Pagination2", $$Pagination2, { "prev": prev, "next": next })}
        </div>`}${err && renderTemplate`<div class="text-center"> 
          ${renderComponent($$result3, "Error404", $$Error404, {})}
         </div>`}${renderComponent($$result3, "CategoryCloud", $$CategoryCloud, {})}` })}` })}`;
}, "D:/demo/test/src/pages/category/[category]/[...page].astro");

const $$file$7 = "D:/demo/test/src/pages/category/[category]/[...page].astro";
const $$url$7 = "/category/[category]/[...page]";

const _page11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$2,
  file: $$file$7,
  url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$b = createAstro("https://stargazers.club");
const $$DaCoKinhNghiem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$DaCoKinhNghiem;
  return renderTemplate`${maybeRenderHead($$result)}<section id="slider-banner"></section>
<div class="entry-content"> 
  <div style="text-align: center;">
    <a href="" title="Jobs for Cửa hàng">Mới tốt nghiệp</a>, 
    <a href="" title="Jobs for Kỹ thuật">Thực tập</a> <br>
  </div>
    <form action="" method="post">
    <div class="table-responsive">
      <table class="table" style="margin-top:20px;">
        <thead>
          <tr>
            <th colspan="3" style="border-bottom:2px solid #00ABFF; padding-bottom:10px; border-top:2px solid #00ABFF;">
                <i class="fa fa-star"></i>THÔNG TIN TUYỂN DỤNG</th></tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">
                KẾ TOÁN VIÊN (2)
            </a>
            </td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;">
                <i class="fa fa-usd"></i> 
                Trên 8 triệu
            </td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> 
                Đang tuyển
            </td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> 
                Văn phòng
                </td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 
                2
                </td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">NHÂN VIÊN THU NGÂN (4)
            </a></td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> 
                Trên 8 triệu
                </td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển
                </td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Cửa hàng
                </td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:
                </span></i> 4
                </td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">NHÂN VIÊN QUAY PHIM (1)
                </a>
                </td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> Trên 8 triệu</td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển</td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Văn phòng</td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 1</td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">VIDEO EDITOR (2)</a></td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> Thỏa thuận</td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển</td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Văn phòng</td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 2</td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">NHÂN VIÊN MUA HÀNG (4)</a></td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> Trên 8 Triệu</td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển</td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Văn phòng</td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 4</td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">NHÂN VIÊN BÁN HÀNG TẠI SHOP (CA 10H-21H) (8)</a></td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> Trên 9 triệu</td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển</td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Cửa hàng</td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 8</td>
          </tr>

          <tr>
            <td colspan="3" style="border:none; padding-top:20px;">
              <a href="">NHÂN VIÊN KĨ THUẬT PHẦN MỀM (2)</a></td>
          </tr>
          <tr style="border-bottom:1px solid #ccc;">
            <td style="border:none;"><i class="fa fa-usd"></i> Trên 8 triệu</td>
            <td style="border:none;"><i class="fa fa-heartbeat"></i> Đang tuyển</td>

            <td style="border:none;"><i class="fa fa-briefcase"></i> Kỹ thuật</td>

            <td style="border:none;"><i class="fa fa-user"><span style="font-family:inherit;">Số lượng tuyển:</span></i> 2</td>
          </tr>
        </tbody>
        <tfoot>
<tr><td colspan="3" style="border:none; padding-top:20px;">

<div class="job-nav">
<div class="previous"></div>
<div class="next"></div>
</div>

</td></tr>
</tfoot>
      </table>
    </div>
  </form>
</div>`;
}, "D:/demo/test/src/components/da-co-kinh-nghiem.astro");

const $$Astro$a = createAstro("https://stargazers.club");
const $$ViecLam = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$ViecLam;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u0110\xE3 c\xF3 kinh nghi\u1EC7m" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" }, { "default": ($$result5) => renderTemplate`Thể loại liên quan` })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Tuyển Dụng` })}` })}${maybeRenderHead($$result3)}<br><div class="dark:text-white">
        ${renderComponent($$result3, "Contactform", $$DaCoKinhNghiem, {})}
    </div>` })}` })}`;
}, "D:/demo/test/src/pages/viec-lam.astro");

const $$file$6 = "D:/demo/test/src/pages/viec-lam.astro";
const $$url$6 = "/viec-lam";

const _page12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ViecLam,
  file: $$file$6,
  url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$9 = createAstro("https://stargazers.club");
const $$Tick = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Tick;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(className, "class")} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".16"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 12a8.25 8.25 0 0 1 11.916-7.393.75.75 0 1 0 .668-1.343A9.713 9.713 0 0 0 12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75c0-.366-.02-.727-.06-1.082a.75.75 0 1 0-1.49.164A8.25 8.25 0 1 1 3.75 12Zm17.78-6.47a.75.75 0 0 0-1.06-1.06L12 12.94l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l9-9Z" fill="currentColor"></path>
</svg>`;
}, "D:/demo/test/src/components/ui/icons/tick.astro");

const $$Astro$8 = createAstro("https://stargazers.club");
const $$Link = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Link;
  const {
    href,
    block,
    size = "lg",
    style = "primary",
    class: className,
    ...rest
  } = Astro2.props;
  const sizes = {
    lg: "px-5 py-2.5",
    md: "px-4 py-2"
  };
  const styles = {
    outline: "bg-white border-2 border-black hover:bg-gray-100 text-black ",
    primary: "bg-black text-white hover:bg-gray-800  border-2 border-transparent",
    inverted: "bg-white text-black   border-2 border-transparent",
    muted: "bg-gray-100 hover:bg-gray-200   border-2 border-transparent"
  };
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${spreadAttributes(rest)}${addAttribute([
    "rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200",
    block && "w-full",
    sizes[size],
    styles[style],
    className
  ], "class:list")}>${renderSlot($$result, $$slots["default"])}
</a>`;
}, "D:/demo/test/src/components/ui/link.astro");

const $$Astro$7 = createAstro("https://stargazers.club");
const $$HoiDap$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$HoiDap$1;
  const { plan } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div>
  <div class="flex flex-col w-full order-first lg:order-none border-2 border-[#D8DEE9] border-opacity-50 py-5 px-6 rounded-md">
    <div class="text-center">
      <h4 class="text-lg font-medium text-gray-400">${plan.name}</h4><p class="mt-3 text-4xl font-bold text-black md:text-4xl">
        ${plan.price && typeof plan.price === "object" ? plan.price.monthly : plan.price}
      </p>
      <!-- {
        plan.price.original && (
          <p class="mt-1 text-xl font-medium text-gray-400 line-through md:text-2xl">
            {plan.price.original}
          </p>
        )
      } -->
    </div><ul class="grid mt-8 text-left gap-y-4">
      ${plan.features.map((item) => renderTemplate`<li class="flex items-start gap-3 text-gray-800">
            ${renderComponent($$result, "Tick", $$Tick, { "class": "w-6 h-6" })}
            <span>${item}</span>
          </li>`)}
    </ul><div class="flex mt-8">
      ${renderComponent($$result, "Link", $$Link, { "href": plan.button.link || "#", "block": true, "style": plan.popular ? "primary" : "outline" }, { "default": ($$result2) => renderTemplate`${plan.button.text || "Get Started"}` })}
    </div>
  </div>
</div>`;
}, "D:/demo/test/src/components/hoi-dap.astro");

const $$Astro$6 = createAstro("https://stargazers.club");
const $$HoiDap = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$HoiDap;
  const pricing = [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "H\u1ECFi \u0110\xE1p" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" }, { "default": ($$result5) => renderTemplate`Mọi Thắc mắc của bạn sẽ được giải quyết nhanh nhất` })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Nơi giải quyết vấn đề thắc mắt của bạn` })}` })}${maybeRenderHead($$result3)}<div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
      ${pricing.map((item) => renderTemplate`${renderComponent($$result3, "Pricing", $$HoiDap$1, { "plan": item })}`)}
    </div>` })}` })}`;
}, "D:/demo/test/src/pages/hoi-dap.astro");

const $$file$5 = "D:/demo/test/src/pages/hoi-dap.astro";
const $$url$5 = "/hoi-dap";

const _page13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HoiDap,
  file: $$file$5,
  url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$5 = createAstro("https://stargazers.club");
const $$Contactform = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Contactform;
  return renderTemplate(_a || (_a = __template(["<!-- To make this contact form work, create your free access key from https://web3forms.com/\n     Then you will get all form submissions in your email inbox. -->", '<form action="https://api.web3forms.com/submit" method="POST" id="form" class="needs-validation astro-UWNXE3I2" novalidate>\n  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" class="astro-UWNXE3I2">\n  <!-- Create your free access key from https://web3forms.com/ -->\n  <input type="checkbox" class="hidden astro-UWNXE3I2" style="display:none" name="botcheck">\n  <div class="mb-5 astro-UWNXE3I2">\n    <input type="text" placeholder="Nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 h\u1ECD t\xEAn" required class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-UWNXE3I2" name="name">\n    <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1 astro-UWNXE3I2">\n      Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 h\u1ECD t\xEAn\n    </div>\n  </div>\n  <div class="mb-5 astro-UWNXE3I2">\n    <label for="email_address" class="sr-only astro-UWNXE3I2">Email Address</label><input id="email_address" type="email" placeholder="Email Address" name="email" required class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-UWNXE3I2">\n    <div class="empty-feedback text-red-400 text-sm mt-1 astro-UWNXE3I2">\n      Vui l\xF2ng nh\u1EADp \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng Email\n    </div>\n    <div class="invalid-feedback text-red-400 text-sm mt-1 astro-UWNXE3I2">\n      Please provide a valid email address.\n    </div>\n  </div>\n  <div class="mb-3 astro-UWNXE3I2">\n    <textarea name="message" required placeholder="N\u1ED9i dung c\u1EA7n h\u1EE3p t\xE1c" class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none h-36 focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-UWNXE3I2"></textarea>\n    <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1 astro-UWNXE3I2">\n      Vui l\xF2ng nh\u1EADp n\u1ED9i dung...\n    </div>\n  </div>\n  ', '\n  <div id="result" class="mt-3 text-center astro-UWNXE3I2"></div>\n</form>\n\n\n\n<script>\n  const form = document.getElementById("form");\n  const result = document.getElementById("result");\n\n  form.addEventListener("submit", function (e) {\n    e.preventDefault();\n    form.classList.add("was-validated");\n    if (!form.checkValidity()) {\n      form.querySelectorAll(":invalid")[0].focus();\n      return;\n    }\n    const formData = new FormData(form);\n    const object = Object.fromEntries(formData);\n    const json = JSON.stringify(object);\n\n    result.innerHTML = "Sending...";\n\n    fetch("https://api.web3forms.com/submit", {\n      method: "POST",\n      headers: {\n        "Content-Type": "application/json",\n        Accept: "application/json",\n      },\n      body: json,\n    })\n      .then(async (response) => {\n        let json = await response.json();\n        if (response.status == 200) {\n          result.classList.add("text-green-500");\n          result.innerHTML = json.message;\n        } else {\n          console.log(response);\n          result.classList.add("text-red-500");\n          result.innerHTML = json.message;\n        }\n      })\n      .catch((error) => {\n        console.log(error);\n        result.innerHTML = "Something went wrong!";\n      })\n      .then(function () {\n        form.reset();\n        form.classList.remove("was-validated");\n        setTimeout(() => {\n          result.style.display = "none";\n        }, 5000);\n      });\n  });\n<\/script>'])), maybeRenderHead($$result), renderComponent($$result, "Button", $$Button, { "type": "submit", "size": "lg", "block": true, "class": "astro-UWNXE3I2" }, { "default": ($$result2) => renderTemplate`Send Message` }));
}, "D:/demo/test/src/components/contactform.astro");

const $$Astro$4 = createAstro("https://stargazers.club");
const $$HopTac = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$HopTac;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" }, { "default": ($$result5) => renderTemplate`We are a here to help.` })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Liên hệ hợp tác` })}` })}${maybeRenderHead($$result3)}<div class="grid md:grid-cols-2 gap-10 mx-auto max-w-4xl mt-16">
      <div>
        <h2 class="font-medium text-2xl text-gray-800">Contact Thuận Gió</h2>
        <p class="text-lg leading-relaxed text-slate-500 mt-3">
          Have something to say? We are here to help. Fill up the form or send
          email or call phone.
        </p>
        <div class="mt-5">
          <div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result3, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:map-marker" })}
            <span>1734 Sanfransico, CA 93063</span>
          </div><div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result3, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:envelope" })}<a href="mailto:hello@astroshipstarter.com">hello@astroshipstarter.com</a>
          </div><div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result3, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:phone" })}<a href="tel:+1 (987) 4587 899">+1 (987) 4587 899</a>
          </div>
        </div>
      </div>
      <div>
        ${renderComponent($$result3, "Contactform", $$Contactform, {})}
      </div>
    </div>` })}` })}`;
}, "D:/demo/test/src/pages/hop-tac.astro");

const $$file$4 = "D:/demo/test/src/pages/hop-tac.astro";
const $$url$4 = "/hop-tac";

const _page14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HopTac,
  file: $$file$4,
  url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("https://stargazers.club");
const $$$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$$1;
  const d = Astro2.params.page;
  var t = "1";
  var err = false;
  var temp = null;
  if (d != null) {
    const findStr = d.indexOf("/");
    if (d) {
      t = d.slice(findStr + 1);
    }
  }
  const res = await fetch(`http://tailwind-tvg6.onrender.com/api/posts?filters[createdBy][username][$eq]=${Astro2.params.author}&sort[0]=createdAt%3Adesc&populate=*&pagination[page]=${t}&pagination[pageSize]=1`);
  const page = await res.json();
  if (page.data != null) {
    const pageCount = page.meta.pagination.pageCount;
    const currentPage = page.meta.pagination.page;
    const img = page.data.map((item) => {
      return item.attributes.image;
    });
    const filter = img.filter((item) => {
      if (item.data != null) {
        return item.data;
      }
    });
    temp = filter.map((item) => {
      return item.data.attributes;
    });
    if (currentPage == pageCount || currentPage > 1) {
      var temp_prev = currentPage - 1;
      var prev = "/author/" + Astro2.params.author + "/page/" + temp_prev;
    }
    if (currentPage < pageCount) {
      var temp_next = currentPage + 1;
      var next = "/author/" + Astro2.params.author + "/page/" + temp_next;
    }
  } else {
    err = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "blog" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<div class="grid sm:grid-cols-3 md:grid-cols-3 gap-3">
      ${page.data && page.data.map((item, index) => renderTemplate`${renderComponent($$result3, "Features", $$Features, { "href": `/blog/${item.attributes.slug}`, "description": item.attributes.description, "title": item.attributes.title, "img": temp[index].url })}`)}
    </div>${page.data && renderTemplate`<div class="gird sm:grid-cols-3 md:grid-cols-2 lg:gird-cols-2 gap-2 items-center text-center mt-5">
          ${renderComponent($$result3, "Pagination2", $$Pagination2, { "prev": prev, "next": next })}
        </div>`}${err && renderTemplate`<div class="text-center"> 
          ${renderComponent($$result3, "Error404", $$Error404, {})}
         </div>`}${renderComponent($$result3, "CategoryCloud", $$CategoryCloud, {})}` })}` })}`;
}, "D:/demo/test/src/pages/author/[author]/[...page].astro");

const $$file$3 = "D:/demo/test/src/pages/author/[author]/[...page].astro";
const $$url$3 = "/author/[author]/[...page]";

const _page15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$$1,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("https://stargazers.club");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  const res = await fetch(`http://tailwind-tvg6.onrender.com/api/posts?sort[0]=createdAt%3Adesc&populate=*&&filters[slug][$eq]=${slug}`);
  const data = await res.json();
  if (data.data == null) {
    const props = { status: 404 };
    return new Response((props), {});
  }
  const item = data.data[0];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<p class="text-5xl text-center">${item.attributes.title}</p><div class="flex space-x-2 justify-center mt-5">
      <span class="text-xl inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded"> <a${addAttribute(`/category/${item.attributes.category.data.attributes.slug}`, "href")}>${item.attributes.category.data.attributes.name}</a></span>
    </div><div class="mt-5">${unescapeHTML(item.attributes.content)}</div><div class="text-center ">
      <p class="px-2">Created by</p>
      <a class="text-blue-700"${addAttribute(`/author/${item.attributes.createdBy.data.attributes.username}`, "href")}>${item.attributes.createdBy.data.attributes.firstname} ${item.attributes.createdBy.data.attributes.lastname}</a>
    </div>` })}${renderComponent($$result2, "CategoryCloud", $$CategoryCloud, {})}` })}`;
}, "D:/demo/test/src/pages/blog/[slug].astro");

const $$file$2 = "D:/demo/test/src/pages/blog/[slug].astro";
const $$url$2 = "/blog/[slug]";

const _page16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro("https://stargazers.club");
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$;
  const d = Astro2.params.page;
  var t = "1";
  if (d != null) {
    const findStr = d.indexOf("/");
    if (d) {
      t = d.slice(findStr + 1);
    }
  }
  const res = await fetch(
    `http://tailwind-tvg6.onrender.com/api/posts?sort[0]=createdAt%3Adesc&populate=*&pagination[page]=${t}&pagination[pageSize]=3`
  );
  var err = false;
  var temp = null;
  const page = await res.json();
  if (page.data != null) {
    const pageCount = page.meta.pagination.pageCount;
    const currentPage = page.meta.pagination.page;
    const img = page.data.map((item) => {
      return item.attributes.image;
    });
    const filter = img.filter((item) => {
      if (item.data != null) {
        return item.data;
      }
    });
    temp = filter.map((item) => {
      return item.data.attributes;
    });
    if (currentPage == pageCount) {
      var temp_prev = currentPage - 1;
      var prev = "/blog/page/" + temp_prev;
    } else {
      var temp_next = currentPage + 1;
      var next = "/blog/page/" + temp_next;
    }
  } else {
    err = true;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "blog" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead($$result3)}<div class="grid sm:grid-cols-3 md:grid-cols-3 gap-3">
      ${page.data && page.data.map((item, index) => renderTemplate`${renderComponent($$result3, "Features", $$Features, { "href": `/blog/${item.attributes.slug}`, "description": item.attributes.description, "title": item.attributes.title, "img": temp[index].url })}`)}
    </div>${page.data && renderTemplate`<div class="gird sm:grid-cols-3 md:grid-cols-2 lg:gird-cols-2 gap-2 items-center text-center mt-5">
        ${renderComponent($$result3, "Pagination2", $$Pagination2, { "prev": prev, "next": next })}
        </div>`}${err && renderTemplate`<div class="text-center"> 
          ${renderComponent($$result3, "Error404", $$Error404, {})}
         </div>`}` })}` })}`;
}, "D:/demo/test/src/pages/blog/[...page].astro");

const $$file$1 = "D:/demo/test/src/pages/blog/[...page].astro";
const $$url$1 = "/blog/[...page]";

const _page17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("https://stargazers.club");
const $$Demo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Demo;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Trang ch\u1EE7" }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Trang chủ` })}` })}` })}` })}`;
}, "D:/demo/test/src/pages/demo.astro");

const $$file = "D:/demo/test/src/pages/demo.astro";
const $$url = "/demo";

const _page18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Demo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d, _page5 as e, _page6 as f, _page7 as g, _page8 as h, _page9 as i, _page10 as j, _page11 as k, _page12 as l, _page13 as m, _page14 as n, _page15 as o, _page16 as p, _page17 as q, _page18 as r };
