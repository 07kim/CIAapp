# CIA Internet Co. Event Terminal

謎解きイベントで使用する、架空の社内PCを模したWebアプリケーションです。PCホーム画面から監視カメラシステムと入退室ログ記録アプリを起動します。

Phase 2まで完了しています。PCホーム、2つのアプリ入口、共通ヘッダー、ホーム確認を操作できます。監視カメラの謎認証と映像閲覧はまだ実装していません。

## 公開先

- 本番サイト: https://cia-internet-event-terminal.vercel.app
- GitHub: https://github.com/07kim/cia-internet-event-terminal（非公開）

`main`への反映でVercel本番環境が自動更新されます。Pull Requestと`main`へのpushではGitHub Actionsが型検査、Lint、単体テスト、本番ビルドを実行します。

## 採用予定の構成

- React
- TypeScript
- Vite
- CSS Modules
- GitHubによるバージョン管理
- Vercelへの公開
- オフライン利用への対応

## 設計資料

- `docs/PRODUCT_SPEC.md` — 確定した製品仕様と未決定事項
- `docs/SCREEN_FLOW.md` — 画面遷移、ロック、リセット条件
- `docs/ARCHITECTURE.md` — 技術構成、状態管理、データ・オフライン方針
- `docs/DECISIONS.md` — 設計判断の記録
- `PLANS.md` — 実装フェーズと承認状況
- `CHANGELOG.md` — 完了した変更の記録
- `AGENTS.md` — Codexを含む作業者向けの永続ルール

## 現在の範囲

初版ではPCホーム画面と監視カメラアプリを完成させます。入退室ログアプリの詳細挙動、実データ、Google Sheets / Google Apps Script連携は後続フェーズで決定します。

## ローカル確認

```sh
npm install
npm run dev
```

品質確認には次を使用します。

```sh
npm run typecheck
npm run lint
npm run test
npm run build
```
