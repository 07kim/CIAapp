# CIAapp

謎解きイベントで使用する、架空の社内PCを模したWebアプリケーションです。PCホーム画面から監視カメラシステムと入退室ログ記録アプリを起動します。

Phase 8までのアプリ基盤を実装しています。PCホーム、監視カメラの3段階の謎認証、5本の交換可能な映像枠、システムログ、放置リセット、暫定入退室ログ、オフライン用アプリシェルを操作できます。実映像と謎画像は最終素材の受領後に差し替えます。

## 公開先

- 本番サイト: https://ciaapp.vercel.app
- GitHub: https://github.com/07kim/CIAapp（非公開）

`main`への反映でVercel本番環境が自動更新されます。Pull Requestと`main`へのpushではGitHub Actionsが型検査、Lint、単体テスト、本番ビルドを実行します。

## 採用構成

- React
- TypeScript
- Vite
- CSS Modules
- GitHubによるバージョン管理
- Vercelへの公開
- オフライン利用への対応

## 設計資料

- `docs/HANDOFF_GUIDE.md` — 2プロジェクト共通の目的、最新ルール、禁止事項、引き継ぎ手順
- `docs/DESIGN_RULES_AND_PROHIBITIONS.md` — デザイン4原則、一般UI基準、過去に却下された表現の再導入禁止台帳
- `docs/PRODUCT_SPEC.md` — 確定した製品仕様と未決定事項
- `docs/SCREEN_FLOW.md` — 画面遷移、ロック、リセット条件
- `docs/ARCHITECTURE.md` — 技術構成、状態管理、データ・オフライン方針
- `docs/DECISIONS.md` — 設計判断の記録
- `PLANS.md` — 実装フェーズと承認状況
- `CHANGELOG.md` — 完了した変更の記録
- `AGENTS.md` — Codexを含む作業者向けの永続ルール

## 現在の範囲

初版ではPCホーム画面と監視カメラアプリを中心に実装しています。入退室ログには謎解きに使える固定ヒントを表示していますが、詳細挙動、実データ、Google Sheets / Google Apps Script連携はPhase 9で決定します。

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
