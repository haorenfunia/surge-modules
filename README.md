# Surge Modules

个人使用的 Surge 模块集合。

## Telegram 链接跳转 Swiftgram

将以下 Telegram 链接交给 Swiftgram 打开：

- `t.me`
- `telegram.me`
- `telegram.dog`

模块文件：[`modules/telegram-to-swiftgram.sgmodule`](modules/telegram-to-swiftgram.sgmodule)

发布到公开 GitHub 仓库后，可在模块文件页面点击 **Raw**，复制地址并添加到 Surge：

```text
https://raw.githubusercontent.com/<你的 GitHub 用户名>/surge-modules/main/modules/telegram-to-swiftgram.sgmodule
```

启用模块后，需要允许 Surge 对 `t.me`、`telegram.me` 和 `telegram.dog` 执行 MITM。

## 说明

- 模块仅重写 Telegram 链接，不包含账号、密码、Token 或证书。
- 仅供个人使用与测试。
