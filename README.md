# Surge Modules

个人使用的 Surge 模块集合。

## Telegram 链接跳转（多客户端）

将 Telegram 链接（`t.me` / `telegram.me` / `telegram.dog`）统一跳转到指定的第三方客户端打开，支持：

- Swiftgram、Nicegram、Turrit、Nagram
- 在 Surge 模块编辑界面中，每个客户端参数填 `1` 开启、`0` 关闭
- 同时开启多个时，按优先级取最先开启的一个：Swiftgram > Nicegram > Turrit > Nagram
- 支持裸域名（如 `https://t.me`）与 `www.` 子域，并保留查询参数

模块文件：[`modules/telegram-to-swiftgram.sgmodule`](modules/telegram-to-swiftgram.sgmodule)

转换脚本：[`modules/telegram-jump.js`](modules/telegram-jump.js)

发布到公开 GitHub 仓库后，可在模块文件页面点击 **Raw**，复制地址并添加到 Surge：

```text
https://raw.githubusercontent.com/haorenfunia/surge-modules/main/modules/telegram-to-swiftgram.sgmodule
```

启用模块后，需要允许 Surge 对 `t.me`、`telegram.me` 和 `telegram.dog` 执行 MITM。

## 菜鸟包裹去广告

过滤菜鸟包裹首页、搜索栏、寄件入口、发现页和开屏等广告内容。

模块文件：[`modules/cainiao-adblock.sgmodule`](modules/cainiao-adblock.sgmodule)

```text
https://raw.githubusercontent.com/haorenfunia/surge-modules/main/modules/cainiao-adblock.sgmodule
```

该模块使用 URL Rewrite、Body Rewrite 和 MITM；请确认当前 Surge 版本支持 `http-response-jq`。

## 书源直连规则集

用于书源相关域名直连。在 Surge 的 `[Rule]` 中添加：

```text
RULE-SET,https://raw.githubusercontent.com/haorenfunia/surge-modules/main/rules/book-sources.list,DIRECT,update-interval=86400
```

规则文件：[`rules/book-sources.list`](rules/book-sources.list)

## Mono 直连规则集

用于 Mono 软件相关域名直连。在 Surge 的 `[Rule]` 中添加：

```text
RULE-SET,https://raw.githubusercontent.com/haorenfunia/surge-modules/main/rules/mono.list,DIRECT,update-interval=86400
```

规则文件：[`rules/mono.list`](rules/mono.list)

## 说明

- 仓库中的模块不包含账号、密码、Token 或证书。
- 仅供个人使用与测试。
