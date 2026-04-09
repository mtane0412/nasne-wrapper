# nasne-wrapper

nasne（ソニーのネットワークレコーダー）の HTTP API ラッパーライブラリ。

## 要件

- Node.js 20+

## インストール

```bash
npm install github:mtane0412/nasne-wrapper
```

## 使い方

```typescript
import { Nasne } from 'nasne-wrapper';

// nasne の IP アドレスでインスタンスを作成
const nasne = new Nasne('192.168.0.1');

// fetch() でエンドポイントを呼び出す
const titleList = await nasne.fetch('titleListGet');
const hddInfo = await nasne.fetch('HDDInfoGet');          // 内蔵HDD（デフォルト）
const externalHdd = await nasne.fetch('HDDInfoGet', 1);  // 外付けHDD

console.log(titleList);
```

### エンドポイントのチェック

```typescript
// 個別チェック
const result = await nasne.checkEndpoint('titleListGet');
console.log(result.success);  // ['titleListGet']

// 全エンドポイントを並列チェック
const allResults = await nasne.checkEndpoint();
console.log(allResults.success);       // 200 OK のエンドポイント一覧
console.log(allResults.clientError);   // 4xx エラーのエンドポイント一覧
console.log(allResults.serverError);   // 5xx エラーのエンドポイント一覧
console.log(allResults.unknownError);  // ネットワークエラー等のエンドポイント一覧
```

### 特殊文字の変換

nasne のレスポンスに含まれる Private Use Area 文字を読みやすい形式に変換します。

```typescript
nasne.formatText('\uE195ドラマタイトル');  // => '[終]ドラマタイトル'

// またはスタンドアロンで使用
import { formatText } from 'nasne-wrapper';
formatText('\uE193\uE195映画タイトル');   // => '[新][終]映画タイトル'
```

## API

### `new Nasne(ip: string)`

| 引数 | 型 | 説明 |
|------|----|------|
| `ip` | `string` | nasne 本体の IP アドレス |

### `nasne.fetch(endpoint, option?)`

| 引数 | 型 | 説明 |
|------|----|------|
| `endpoint` | `EndpointName` | API エンドポイント名 |
| `option` | `number` | `HDDInfoGet` 用オプション（0: 内蔵HDD, 1: 外付けHDD） |

### `nasne.checkEndpoint(endpoint?)`

| 引数 | 型 | 説明 |
|------|----|------|
| `endpoint` | `EndpointName` &#124; `undefined` | 省略時は全エンドポイントをチェック |

戻り値: `Promise<CheckEndpointResult>`

| フィールド | 型 | 説明 |
|------------|-----|------|
| `success` | `EndpointName[]` | 200 OK のエンドポイント |
| `clientError` | `EndpointName[]` | 4xx エラーのエンドポイント |
| `serverError` | `EndpointName[]` | 5xx エラーのエンドポイント |
| `unknownError` | `EndpointName[]` | ネットワークエラー等のエンドポイント |

## 謝辞

エンドポイントの参考:
- http://pocketstudio.jp/log3/2014/12/07/nasune_api/
- http://tateren.hateblo.jp/entry/2016/03/03/005415
- https://github.com/naokiy/node-nasne
