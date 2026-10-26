# Changelog

このファイルには、完了し検証された変更を記録する。計画だけの項目は記録しない。

## 2026-10-27

### Added

- 初版の製品仕様、画面遷移、技術設計、設計判断を文書化。
- Codexを含む作業者が毎回読む`AGENTS.md`を追加。
- 承認制の段階的な実装計画を追加。
- React + TypeScript + Vite、GitHub、Vercel、オフライン対応の方針を記録。
- React + TypeScript + ViteのPhase 1プロジェクト基盤を追加。
- Strict TypeScript、ESLint、Vitest、Testing Libraryを設定。
- 赤黒の共通デザイントークンと起動確認画面を追加。
- 型検査、Lint、単体テスト、本番ビルドを実行し、すべて成功。
- レスポンシブなPCホーム画面と監視カメラ・入退室ログのアプリアイコンを追加。
- 共通ヘッダー、システム時刻、端末ステータス、ホーム確認ダイアログを追加。
- 監視カメラ入口と入退室ログの仮画面を追加。
- 画面遷移を型付きreducerで管理し、遷移とホーム復帰のテストを追加。
- Phase 2完了時点で型検査、Lint、5件の単体・UIテスト、本番ビルドを再検証。
- GitHub Actionsで型検査、Lint、単体テスト、本番ビルドを実行する品質チェックを追加。
- Pull Request用の確認テンプレートと、検証後にGitHub/Vercelへ反映する運用ルールを追加。
- 非公開GitHubリポジトリを作成し、Phase 2までの検証済み初回版をpush。
- GitHub Actionsの品質チェック成功を確認。
- GitHubリポジトリをVercelへ接続し、`main`からの自動本番デプロイを設定。
- Vercel本番サイトへ固定URLを設定し、ブラウザで表示を確認。
- VercelがGitHubのcommit作成者を照合できるよう、リポジトリ専用のGit作者情報をGitHubアカウントへ統一。

### Not implemented

- 監視カメラの謎認証・映像閲覧、入退室ログの実機能、放置リセット、オフライン対応はまだ実装していない。
