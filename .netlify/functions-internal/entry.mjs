import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { h as server_default, i as deserializeManifest } from './chunks/astro.61083b84.mjs';
import { _ as _page0, a as _page1, b as _page2, c as _page3, d as _page4, e as _page5, f as _page6, g as _page7, h as _page8, i as _page9, j as _page10, k as _page11, l as _page12, m as _page13, n as _page14, o as _page15, p as _page16, q as _page17, r as _page18 } from './chunks/pages/all.7f075c7a.mjs';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'html-escaper';
import 'string-width';
import 'sharp';
/* empty css                                     */import 'node:fs/promises';
import 'node:path';
import 'node:url';
import 'http-cache-semantics';
import 'node:os';
import 'image-size';
import 'magic-string';
import 'node:stream';
/* empty css                                 *//* empty css                                     *//* empty css                                                *//* empty css                                             *//* empty css                                           *//* empty css                                     */import 'svgo';
/* empty css                                   *//* empty css                                                                */
const pageMap = new Map([["node_modules/@astrojs/image/dist/endpoint.js", _page0],["src/pages/index.astro", _page1],["src/pages/qua-trinh-phat-trien/complete-guide-fullstack-development.md", _page2],["src/pages/qua-trinh-phat-trien/essential-data-structures-algorithms.md", _page3],["src/pages/qua-trinh-phat-trien/how-to-become-frontend-master.md", _page4],["src/pages/qua-trinh-phat-trien/kitchensink.mdx", _page5],["src/pages/category/[category]/[...page].astro", _page6],["src/pages/author/[author]/[...page].astro", _page7],["src/pages/blog/[slug].astro", _page8],["src/pages/blog/[...page].astro", _page9],["src/pages/temp/qua-trinh-phat-trien.astro", _page10],["src/pages/temp/moi-truong-lam-viec.astro", _page11],["src/pages/temp/thong-tin-cong-ty.astro", _page12],["src/pages/temp/dich-vu-doi-tac.astro", _page13],["src/pages/temp/dang-nhap.astro", _page14],["src/pages/temp/viec-lam.astro", _page15],["src/pages/temp/hoi-dap.astro", _page16],["src/pages/temp/hop-tac.astro", _page17],["src/pages/temp/demo.astro", _page18],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/index.d3a72de4.css","_astro/_...page_.6a30744f.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.b5460adf.js"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/qua-trinh-phat-trien/complete-guide-fullstack-development","type":"page","pattern":"^\\/qua-trinh-phat-trien\\/complete-guide-fullstack-development\\/?$","segments":[[{"content":"qua-trinh-phat-trien","dynamic":false,"spread":false}],[{"content":"complete-guide-fullstack-development","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/qua-trinh-phat-trien/complete-guide-fullstack-development.md","pathname":"/qua-trinh-phat-trien/complete-guide-fullstack-development","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/qua-trinh-phat-trien/essential-data-structures-algorithms","type":"page","pattern":"^\\/qua-trinh-phat-trien\\/essential-data-structures-algorithms\\/?$","segments":[[{"content":"qua-trinh-phat-trien","dynamic":false,"spread":false}],[{"content":"essential-data-structures-algorithms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/qua-trinh-phat-trien/essential-data-structures-algorithms.md","pathname":"/qua-trinh-phat-trien/essential-data-structures-algorithms","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/qua-trinh-phat-trien/how-to-become-frontend-master","type":"page","pattern":"^\\/qua-trinh-phat-trien\\/how-to-become-frontend-master\\/?$","segments":[[{"content":"qua-trinh-phat-trien","dynamic":false,"spread":false}],[{"content":"how-to-become-frontend-master","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/qua-trinh-phat-trien/how-to-become-frontend-master.md","pathname":"/qua-trinh-phat-trien/how-to-become-frontend-master","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/qua-trinh-phat-trien/kitchensink","type":"page","pattern":"^\\/qua-trinh-phat-trien\\/kitchensink\\/?$","segments":[[{"content":"qua-trinh-phat-trien","dynamic":false,"spread":false}],[{"content":"kitchensink","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/qua-trinh-phat-trien/kitchensink.mdx","pathname":"/qua-trinh-phat-trien/kitchensink","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/_...page_.6a30744f.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/category/[category]/[...page]","type":"page","pattern":"^\\/category\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["category","...page"],"component":"src/pages/category/[category]/[...page].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/_...page_.6a30744f.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/author/[author]/[...page]","type":"page","pattern":"^\\/author\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"author","dynamic":false,"spread":false}],[{"content":"author","dynamic":true,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["author","...page"],"component":"src/pages/author/[author]/[...page].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/blog/[slug]","type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/[slug].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/_...page_.6a30744f.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/blog/[...page]","type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/blog/[...page].astro","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/qua-trinh-phat-trien.c0bba94e.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/qua-trinh-phat-trien","type":"page","pattern":"^\\/temp\\/qua-trinh-phat-trien\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"qua-trinh-phat-trien","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/qua-trinh-phat-trien.astro","pathname":"/temp/qua-trinh-phat-trien","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/moi-truong-lam-viec","type":"page","pattern":"^\\/temp\\/moi-truong-lam-viec\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"moi-truong-lam-viec","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/moi-truong-lam-viec.astro","pathname":"/temp/moi-truong-lam-viec","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/thong-tin-cong-ty.ae956aea.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/thong-tin-cong-ty","type":"page","pattern":"^\\/temp\\/thong-tin-cong-ty\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"thong-tin-cong-ty","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/thong-tin-cong-ty.astro","pathname":"/temp/thong-tin-cong-ty","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/dich-vu-doi-tac.3e492584.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/dich-vu-doi-tac","type":"page","pattern":"^\\/temp\\/dich-vu-doi-tac\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"dich-vu-doi-tac","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/dich-vu-doi-tac.astro","pathname":"/temp/dich-vu-doi-tac","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/dang-nhap.6fb2908e.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/dang-nhap","type":"page","pattern":"^\\/temp\\/dang-nhap\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"dang-nhap","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/dang-nhap.astro","pathname":"/temp/dang-nhap","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/viec-lam","type":"page","pattern":"^\\/temp\\/viec-lam\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"viec-lam","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/viec-lam.astro","pathname":"/temp/viec-lam","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/hoi-dap","type":"page","pattern":"^\\/temp\\/hoi-dap\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"hoi-dap","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/hoi-dap.astro","pathname":"/temp/hoi-dap","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css","_astro/hop-tac.a259e1be.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/hop-tac","type":"page","pattern":"^\\/temp\\/hop-tac\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"hop-tac","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/hop-tac.astro","pathname":"/temp/hop-tac","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["_astro/_...page_.754726c5.css","_astro/complete-guide-fullstack-development.8f53c71c.css"],"scripts":[{"type":"external","value":"_astro/hoisted.35106e3b.js"}],"routeData":{"route":"/temp/demo","type":"page","pattern":"^\\/temp\\/demo\\/?$","segments":[[{"content":"temp","dynamic":false,"spread":false}],[{"content":"demo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/temp/demo.astro","pathname":"/temp/demo","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"site":"https://stargazers.club","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true,"contentDir":"file:///D:/demo/test/src/content/"},"pageMap":null,"propagation":[],"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"_@astrojs-ssr-virtual-entry.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.35106e3b.js","/astro/hoisted.js?q=1":"_astro/hoisted.b5460adf.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/inter-cyrillic-variable-wghtOnly-normal.262a1054.woff2","/_astro/inter-greek-ext-variable-wghtOnly-normal.fe977ddb.woff2","/_astro/inter-cyrillic-ext-variable-wghtOnly-normal.848492d3.woff2","/_astro/inter-latin-variable-wghtOnly-normal.450f3ba4.woff2","/_astro/inter-greek-variable-wghtOnly-normal.89b4a3fe.woff2","/_astro/inter-latin-ext-variable-wghtOnly-normal.45606f83.woff2","/_astro/inter-vietnamese-variable-wghtOnly-normal.ac4e131c.woff2","/_astro/_...page_.6a30744f.css","/_astro/_...page_.754726c5.css","/_astro/complete-guide-fullstack-development.8f53c71c.css","/_astro/dang-nhap.6fb2908e.css","/_astro/dich-vu-doi-tac.3e492584.css","/_astro/hop-tac.a259e1be.css","/_astro/index.d3a72de4.css","/_astro/qua-trinh-phat-trien.c0bba94e.css","/_astro/thong-tin-cong-ty.ae956aea.css","/1.avif","/app.js","/city-1.jpg","/city-2.jpg","/city-3.jpg","/city-4.jpg","/city-5.jpg","/favicon.svg","/frame2.png","/img-1.jpg","/img-2.jpg","/img-3.jpg","/img-bg.webp","/img-L.png","/img-M.jpg","/img-map.jpg","/intro.mp4","/map-bg.png","/map_aboutus1.png","/moon.png","/nubi.png","/particles.js","/script.js","/spin.svg","/star.jpg","/sun.png","/tw.png","/wave.png","/wavw.png","/wine-1600.jpg","/wine-atlantic-ocean.png","/wine-badge.png","/yamamoto.jpg","/_image (1).heif","/_image (2).heif","/_image (3).heif","/_image.heif","/_astro/Astronav.astro_astro_type_script_index_0_lang.5cc4e8bb.js","/_astro/hoisted.35106e3b.js","/_astro/hoisted.b5460adf.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
