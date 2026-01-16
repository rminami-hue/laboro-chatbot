# LABORO チャットボット

LABORO向けの多言語対応チャットボットUIです。

## 機能

- 多言語対応（ベトナム語、日本語、英語、ネパール語）
- カテゴリ別メニュー表示
- インタラクティブなUI
- レスポンシブデザイン
- Gemini APIによる自然言語理解（フォールバック機能）

## 技術スタック

- React 19
- TypeScript
- Vite
- Gemini API (@google/generative-ai)

## セットアップ

### ローカル開発

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定（オプション）
`.env`ファイルを作成し、以下を設定：
```
VITE_GEMINI_API_KEY=your_api_key_here
```

> **注意**: Gemini APIキーが設定されていない場合でも、基本的な機能（キーワードマッチング）は動作します。

3. 開発サーバーの起動
```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## 環境変数

### 開発環境

プロジェクトルートに`.env`ファイルを作成：
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Vercelでの環境変数設定

1. Vercelのプロジェクト設定ページにアクセス
2. 「Settings」→「Environment Variables」を選択
3. 以下の環境変数を追加：
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: あなたのGemini APIキー
   - **Environment**: Production, Preview, Development（すべてに適用）
4. 「Save」をクリック
5. 再デプロイを実行（環境変数を追加した後は再デプロイが必要です）

## Gemini API機能

### フォールバック機能

キーワードマッチングで判定できない質問に対して、Gemini APIが以下を実行します：

1. ユーザーの質問を分析
2. 適切なカテゴリとメニュー項目を提案
3. 該当するメニュー項目がない場合、デフォルトメッセージを表示

### 動作フロー

1. ユーザーが質問を入力
2. まずキーワードマッチングで判定を試行
3. キーワードマッチングで判定できない場合、Gemini APIを使用
4. Geminiが適切なカテゴリを提案した場合、そのメニュー項目を表示
5. 該当しない場合、デフォルトメッセージとアクションボタンを表示

## デプロイ

### Vercel

このプロジェクトはVercelにデプロイされています。

- 自動デプロイ: `main`ブランチにプッシュすると自動でデプロイされます
- 環境変数: Vercelの設定で`VITE_GEMINI_API_KEY`を設定してください

## ライセンス

LABORO社内利用
