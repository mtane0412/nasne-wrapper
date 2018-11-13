# nasne-wrapper

## 使い方

### 使用例

```JavaScript
const Nasne = require('./nasne.js');

// nasneのIPでインスタンスを作成
const nasne = new Nasne('192.168.11.2');

// fetchメソッドでnasneのエンドポイントを指定するとPromiseが返ってくる
nasne.fetch("titleListGet")
    .then(async titleList => {
        let HDDInfo = await nasne.fetch("HDDInfoGet");
        let boxStatusList = await nasne.fetch("boxStatusListGet");
        console.log(titleList);
        console.log(HDDInfo);
        console.log(boxStatusList);
    })
    .catch(error => {
        throw error;
    })
```

### エンドポイントのチェック

`checkEndpoints`メソッドでエンドポイントを指定するとステータスコードを返します。

```JavaScript
nasne.checkEndpoints('titleListGet');
// 200 - titleListGet
```

引数なしで全チェックします。
```JavaScript
nasne.checkEndpoints();
// 400 - channelLogoDataGet
// 400 - EPGStoreStart
// 400 - EPGGet
// 500 - connectionOnlineIdGet
// ...
```

エンドポイントは[node-nasne](https://github.com/naokiy/node-nasne)を参考にさせていただきました。

## Thanks
- http://pocketstudio.jp/log3/2014/12/07/nasune_api/
- http://tateren.hateblo.jp/entry/2016/03/03/005415
- https://github.com/naokiy/node-nasne