# nasne-wrapper 開発ガイド

## プロジェクト概要

nasne APIのラッパーライブラリ。Node.js 20+ のネイティブ fetch を使用。

## 開発コマンド

```bash
npm test              # テスト実行
npm run test:watch    # テスト監視モード
npm run test:coverage # カバレッジ付きテスト
npm run lint          # Lint（警告ゼロ必須）
npm run type-check    # 型チェック
npm run build         # ビルド（ESM + CJS）
```

## 技術スタック

- **言語**: TypeScript (ESM)
- **HTTP**: Node.js ネイティブ fetch（Node.js 20+）
- **テスト**: Vitest
- **ビルド**: tsup（ESM + CJS デュアル出力）
- **Lint/Format**: Biome

## ディレクトリ構成

```text
src/
├── index.ts        # エントリポイント（public API）
├── nasne.ts        # Nasneクラス
├── endpoints.ts    # エンドポイント定義・URL構築・クエリ構築
├── format-text.ts  # 特殊Unicode→日本語変換
├── constants.ts    # 定数（ポート番号・タイムアウト）
└── types.ts        # 型定義
tests/
├── nasne.test.ts
├── endpoints.test.ts
└── format-text.test.ts
```

## 注意事項

- `remoteAcces`（sが1つ）はnasne API側の仕様。タイポではない
- ネイティブ fetchはNode.js 20+が必要
- `AbortSignal.timeout()` でタイムアウトを制御する
