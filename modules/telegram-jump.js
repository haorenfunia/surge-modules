/**
 * Telegram 链接跳转（多客户端）
 * Surge HTTP Request 脚本：
 *  - 将 t.me / telegram.me / telegram.dog 链接转换成目标客户端的深链并返回 302
 *  - 目标客户端由模块参数决定（1 启用 / 0 禁用），同时开启多个时按 CLIENTS 顺序取最先开启的一个
 *
 * 说明：
 *  - parseurl 客户端（swiftgram / nicegram）：直接传递原始链接
 *  - action 客户端：转换为标准 Telegram 动作深链（resolve / join / msg_url / proxy ...），再替换 scheme 前缀
 *  - 若某客户端的 scheme 前缀与你安装的版本不一致，修改下面 CLIENTS 里的 scheme 值即可
 */

var CLIENTS = [
  { id: 'swiftgram', label: 'Swiftgram', kind: 'parseurl', scheme: 'sg://parseurl?url=' },
  { id: 'nicegram',  label: 'Nicegram',  kind: 'parseurl', scheme: 'ng://parseurl?url=' },
  { id: 'turrit',    label: 'Turrit',    kind: 'action',   scheme: 'turrit://' },
  { id: 'nagram',    label: 'Nagram',    kind: 'action',   scheme: 'tg://' }
];

function parseQuery(str) {
  var out = {};
  if (!str) return out;
  var parts = String(str).split('&');
  for (var i = 0; i < parts.length; i++) {
    var pair = parts[i];
    if (!pair) continue;
    var eq = pair.indexOf('=');
    var k, v;
    if (eq >= 0) {
      k = pair.slice(0, eq);
      v = pair.slice(eq + 1);
    } else {
      k = pair;
      v = '';
    }
    try { k = decodeURIComponent(k); v = decodeURIComponent(v); } catch (e) {}
    out[k] = v;
  }
  return out;
}

function buildQuery(map) {
  var parts = [];
  for (var k in map) {
    if (!Object.prototype.hasOwnProperty.call(map, k)) continue;
    var v = map[k];
    if (v === undefined || v === null || v === '') continue;
    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
  }
  return parts.join('&');
}

function tmeToAction(url) {
  var m = String(url).match(/^https?:\/\/([^\/]+)(.*)$/i);
  if (!m) return null;
  var host = m[1].toLowerCase().replace(/^www\./, '');
  if (host !== 't.me' && host !== 'telegram.me' && host !== 'telegram.dog') return null;

  var rest = m[2] || '';
  var qi = rest.indexOf('?');
  var path = qi >= 0 ? rest.slice(0, qi) : rest;
  var queryStr = qi >= 0 ? rest.slice(qi + 1) : '';
  var q = parseQuery(queryStr);
  var segs = path.split('/').filter(function (s) { return s !== ''; });

  if (segs.length === 0) return 'tg://';

  switch (segs[0]) {
    case 'share':
      if (segs[1] === 'url') return 'tg://msg_url?' + buildQuery({ url: q.url, text: q.text });
      break;
    case 'proxy':
      return 'tg://proxy?' + buildQuery({ server: q.server, port: q.port, secret: q.secret });
    case 'socks':
      return 'tg://socks?' + buildQuery({ server: q.server, port: q.port });
    case 'iv':
      return 'tg://iv?' + buildQuery({ url: q.url, rhash: q.rhash });
    case 'addstickers':
      return 'tg://addstickers?' + buildQuery({ set: segs[1] || q.set });
    case 'addtheme':
      return 'tg://addtheme?' + buildQuery({ slug: segs[1] || q.slug });
    case 'setlanguage':
      return 'tg://setlanguage?' + buildQuery({ lang: segs[1] || q.lang });
    case 'bg':
      return 'tg://bg?' + buildQuery({ slug: segs[1] || q.slug });
    case 'freedom':
      return 'tg://freedom';
    case 'joinchat':
      return 'tg://join?' + buildQuery({ invite: segs[1] });
    case 'c':
      if (segs.length >= 3) return 'tg://privatepost?' + buildQuery({ channel: segs[1], post: segs[2] });
      break;
  }

  if (segs[0].charAt(0) === '+') {
    return 'tg://join?' + buildQuery({ invite: segs[0].slice(1) });
  }
  if (segs[0] === 's' && segs.length >= 2) {
    return 'tg://resolve?' + buildQuery({ domain: segs[1] });
  }
  if (segs.length >= 2) {
    return 'tg://resolve?' + buildQuery({ domain: segs[0], post: segs[1] });
  }

  var resolve = { domain: segs[0], start: q.start, startapp: q.startapp, startgroup: q.startgroup };
  return 'tg://resolve?' + buildQuery(resolve);
}

function main() {
  var url = $request.url;
  var args = parseQuery($argument);
  var enabled = null;
  for (var i = 0; i < CLIENTS.length; i++) {
    if (args[CLIENTS[i].id] === '1') {
      enabled = CLIENTS[i];
      break;
    }
  }
  if (!enabled) {
    $done();
    return;
  }

  var deep;
  if (enabled.kind === 'parseurl') {
    deep = enabled.scheme + encodeURIComponent(url);
  } else {
    var action = tmeToAction(url);
    if (!action) {
      $done();
      return;
    }
    deep = action.replace(/^tg:\/\//, enabled.scheme);
  }
  $done({ response: { status: 302, headers: { Location: deep } } });
}

main();