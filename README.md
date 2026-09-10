# IDEAMAKER

普段していること、お金になりそうなこと、やってみたいことを混ぜてアイデアを出すアプリ。

Safari からホーム画面に追加して使う PWA。単語は端末の localStorage に保存される。

## ローカルで開く

```bash
npm install
npm run dev
```

## iPhone に入れる

1. GitHub リポジトリの **Settings → Pages** で Source を **GitHub Actions** にする
2. `main` に push すると Pages にデプロイされる
3. iPhone の Safari で Pages の URL を開く（`https://zzzKazzz.github.io/IDEAMAKER/`）
4. 共有 → **ホーム画面に追加**
5. 以降はアイコンから起動する

サイトデータを消すと保存した単語も消える。
