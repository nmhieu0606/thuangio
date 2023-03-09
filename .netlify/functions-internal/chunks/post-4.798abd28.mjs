import { g as createVNode, F as Fragment } from './astro.26a47162.mjs';
import 'cookie';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'mime';
import 'html-escaper';
import 'string-width';

const html = "<p>Nisi duis ex aliqua eu officia eiusmod duis magna pariatur. Irure laborum qui aliqua nulla esse cillum laborum aliquip nulla elit. Id id Lorem duis irure cillum culpa. Nulla sint et aliqua velit do. Nulla sit sit proident consectetur enim ullamco aliqua in reprehenderit ullamco officia.</p>\n<p>Ad ipsum velit sint enim exercitation mollit consequat elit mollit qui commodo aute. Laboris culpa voluptate aliquip incididunt duis. Cupidatat aliquip et sunt aute fugiat cupidatat irure voluptate. Occaecat officia et sunt.</p>\n<p>Officia tempor voluptate enim consequat cillum aute fugiat cupidatat incididunt magna labore in commodo. Eiusmod nostrud non deserunt. Incididunt excepteur pariatur magna. Proident aute ad in velit labore enim sit cillum ad mollit proident et qui. Esse sunt ullamco ullamco ipsum enim eu esse id eu exercitation laboris magna Lorem. Anim nostrud officia anim velit do exercitation labore mollit excepteur excepteur ex.</p>\n<p>Ipsum adipisicing exercitation dolor pariatur labore qui. Culpa cupidatat ea elit eiusmod tempor ea qui dolor Lorem laborum adipisicing. Ad ea laboris qui cupidatat deserunt culpa. Nulla ex velit adipisicing proident fugiat deserunt sunt eu adipisicing sint incididunt quis qui. Nulla fugiat labore duis ullamco reprehenderit excepteur laboris tempor ullamco aliquip laborum aliqua. Est tempor nisi magna ut elit pariatur commodo.</p>\n<p>Labore commodo do incididunt amet ad et exercitation magna veniam veniam aute laboris excepteur occaecat Lorem. Fugiat in magna commodo magna nulla eu. Fugiat nulla aliqua sunt duis enim irure aliquip fugiat aliqua Lorem ad tempor incididunt proident incididunt. Labore fugiat tempor esse cillum voluptate culpa anim sunt consequat. Ipsum minim nostrud laborum sit aliquip duis officia consequat est. Fugiat mollit elit nulla. Sit minim est elit labore. Sunt eu pariatur pariatur ut deserunt nulla labore in non sit tempor voluptate ex.</p>";

				const frontmatter = {"title":"A Post about Important Items Of Life","date":"2022-11-20T00:00:00.000Z","author":"hieu1","image":{"src":"https://www.tma.vn/Media/Default/BaiDang/321375062_485335767044273_5031241667870671755_n.jpg","alt":"A picture of a coder"},"description":"Have you ever wondered what the most important items of life are? Well, wonder no more!","draft":false,"category":"HTML"};
				const file = "D:/demo/test/src/content/blog/post-4.md";
				const url = undefined;
				function rawContent() {
					return "\r\nNisi duis ex aliqua eu officia eiusmod duis magna pariatur. Irure laborum qui aliqua nulla esse cillum laborum aliquip nulla elit. Id id Lorem duis irure cillum culpa. Nulla sint et aliqua velit do. Nulla sit sit proident consectetur enim ullamco aliqua in reprehenderit ullamco officia.\r\n\r\nAd ipsum velit sint enim exercitation mollit consequat elit mollit qui commodo aute. Laboris culpa voluptate aliquip incididunt duis. Cupidatat aliquip et sunt aute fugiat cupidatat irure voluptate. Occaecat officia et sunt.\r\n\r\nOfficia tempor voluptate enim consequat cillum aute fugiat cupidatat incididunt magna labore in commodo. Eiusmod nostrud non deserunt. Incididunt excepteur pariatur magna. Proident aute ad in velit labore enim sit cillum ad mollit proident et qui. Esse sunt ullamco ullamco ipsum enim eu esse id eu exercitation laboris magna Lorem. Anim nostrud officia anim velit do exercitation labore mollit excepteur excepteur ex.\r\n\r\nIpsum adipisicing exercitation dolor pariatur labore qui. Culpa cupidatat ea elit eiusmod tempor ea qui dolor Lorem laborum adipisicing. Ad ea laboris qui cupidatat deserunt culpa. Nulla ex velit adipisicing proident fugiat deserunt sunt eu adipisicing sint incididunt quis qui. Nulla fugiat labore duis ullamco reprehenderit excepteur laboris tempor ullamco aliquip laborum aliqua. Est tempor nisi magna ut elit pariatur commodo.\r\n\r\nLabore commodo do incididunt amet ad et exercitation magna veniam veniam aute laboris excepteur occaecat Lorem. Fugiat in magna commodo magna nulla eu. Fugiat nulla aliqua sunt duis enim irure aliquip fugiat aliqua Lorem ad tempor incididunt proident incididunt. Labore fugiat tempor esse cillum voluptate culpa anim sunt consequat. Ipsum minim nostrud laborum sit aliquip duis officia consequat est. Fugiat mollit elit nulla. Sit minim est elit labore. Sunt eu pariatur pariatur ut deserunt nulla labore in non sit tempor voluptate ex.";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
