# スキルギャラクシー実装確認報告書

**確認日**: 2026-05-19  
**対象**: Step 9 スキルギャラクシー実装  
**確認者**: Codex

---

## 1. 確認対象

今回確認した主な変更は以下。

| ファイル | 内容 |
|---|---|
| `mock/js/skill-galaxy.js` | Canvas 2D のスキル星図描画、ノード定義、パン・ズーム、選択、ロール達成度計算 |
| `mock/profile-view.html` | プロフィール詳細に「スキル星図」タブを追加 |
| `mock/profile-edit.html` | プロフィール編集に「スキル星図」タブと習熟度スライダーを追加 |
| `mock/css/style.css` | スキル星図のCanvas、ツールバー、凡例、詳細パネルのスタイル追加 |
| `docs/mock-design/step9-skill-galaxy.md` | 企画書・仕様書 |
| `docs/mock-design/overview.md` / `step5-profile.md` | Step 9 への参照追加 |

---

## 2. 確認方法

- `git status --short` / `git diff --stat` による差分確認
- `mock/js/skill-galaxy.js` の構文確認
- Node.js による `TH.skillGalaxy.buildUserGalaxyState()` / `updateSkillLevel()` の簡易ロジック確認
- HTML / CSS / Alpine.js の静的レビュー

実行結果:

```text
node --check mock/js/skill-galaxy.js
=> 構文エラーなし

buildUserGalaxyState / updateSkillLevel の簡易実行
=> スキル追加ロジックは動作
```

注意: Playwright / Puppeteer がローカルに入っていなかったため、ブラウザ自動操作によるスクリーンショット確認は未実施。

---

## 3. 実装確認結果

### 3.1 実装済みと判断できる項目

- `profile-view.html` に「スキル星図」タブが追加されている
- `profile-edit.html` に「スキル星図」タブが追加されている
- `mock/js/skill-galaxy.js` が追加され、静的ノードマスターが定義されている
- スキル、資格、ロールノードが定義されている
- 既存の `user.skills` / `user.certifications` とマスターを照合して星図状態を作っている
- Canvas 2D で背景、星、リンク、ロール星雲、ラベル、選択リングを描画する構成になっている
- 星以外をドラッグした場合のパン操作が実装されている
- ホイールズーム、ダブルクリックズームが実装されている
- 星クリックで詳細パネルに選択ノードを反映する構成になっている
- 編集画面ではスライダーから `editForm.skills` を更新できる
- 既存の `saveProfile()` を使って保存する設計になっている
- 資格ノードは直接ON/OFFではなく、資格タブへ誘導する仕様になっている

### 3.2 総合判定

**条件付きOK。**

企画・仕様の主要な体験はかなり実装されている。ただし、下記2点はユーザー体験に直接影響するため、リリース前に修正推奨。

---

## 4. 指摘事項

### 4.1 Canvas高さが仕様通りに出ない可能性が高い

**重要度**: 高  
**対象**:
- `mock/css/style.css:424`
- `mock/css/style.css:434`
- `mock/profile-view.html:176`
- `mock/profile-edit.html:173`

`.skill-galaxy-canvas-wrap` は `min-height: 520px` だが、子要素の `canvas` は `height: 100%` のみ。親の高さが `height` ではなく `min-height` なので、ブラウザによってCanvasの実表示高さがデフォルトの150px相当になり、仕様上の 520px / 420px を満たせない可能性が高い。

影響:

- Canvas描画領域が想定より浅くなる
- 背景や凡例は広いが、実際の星図だけが上部に寄る可能性がある
- `getBoundingClientRect()` が小さい高さを拾い、描画位置・クリック判定も狭い領域で計算される

推奨修正:

```css
.skill-galaxy-canvas-wrap {
  height: 520px;
  min-height: 520px;
}

.skill-galaxy-canvas {
  width: 100%;
  height: 100%;
}

@media (max-width: 900px) {
  .skill-galaxy-canvas-wrap {
    height: 420px;
    min-height: 420px;
  }
}
```

または `canvas` を `position:absolute; inset:0;` にする。

### 4.2 ロール到達条件が仕様とズレている

**重要度**: 中  
**対象**:
- `mock/js/skill-galaxy.js:245`
- `mock/js/skill-galaxy.js:850`

仕様書では「必須ノードがすべて登録済み、かつ必須ノードの平均レベルが4以上」で100%到達と定義している。一方、実装では推奨ノードも25%の重みで常に加味しているため、必須スキルを満たしていても推奨スキルが低いと100%にならない。

確認例:

```text
TypeScript Lv5 / React Lv4 / Next.js Lv4
=> フロントエンドスペシャリストの必須条件は満たす
=> 現実装の progress は 65%
```

影響:

- 「ルート到達」の喜び演出が出にくい
- 必須スキルを十分伸ばしても、目標ロールが未到達に見える
- 仕様の「資格や推奨スキルを必須にしすぎない」考えと少しズレる

推奨修正:

- 必須スキルが全登録済み、平均レベル4以上なら `100` を返す
- それ以外の途中経過だけ、必須75% + 推奨25% の式を使う

---

## 5. 軽微な改善候補

| 項目 | 内容 |
|---|---|
| 検索とフィルターの連動 | 現在の検索結果はフィルター外ノードも対象になるため、選択した星が表示されない可能性がある |
| Canvas破棄処理 | `pointerleave` の匿名関数は `destroy()` で解除されない。現状ページ遷移主体なので影響は小さい |
| ロール種類 | 仕様書にある `sre-specialist` / `security-specialist` / `tech-lead` / `fullstack-product-engineer` は未実装。MVPとしては許容 |
| 自動ブラウザ検証 | 画面確認用にPlaywrightがあると、Canvas非空・クリック・保存反映まで自動確認できる |

---

## 6. 仕様との対応状況

| 要件 | 状態 | コメント |
|---|---|---|
| 2D Canvasで宇宙空間にスキルの星を表示 | 実装済み | `skill-galaxy.js` で描画 |
| 星以外をドラッグするとパン | 実装済み | `findNodeAt()` で星判定 |
| ホイールでズーム | 実装済み | `0.55〜2.2` に制限 |
| 星クリックで詳細パネル更新 | 実装済み | `onSelect` でAlpineへ反映 |
| 習熟度0〜5で明るさ・サイズ変更 | 実装済み | `nodeRadius()` / `nodeBrightness()` |
| 閲覧モード | 実装済み | `profile-view.html` |
| 編集モード | 実装済み | `profile-edit.html` |
| スライダーで `editForm.skills` 更新 | 実装済み | `updateSkillLevel()` |
| 既存スキル一覧・資格一覧を残す | 実装済み | タブ名を「スキル一覧」に変更 |
| ロール達成度表示 | 実装済み | ただし到達条件にズレあり |
| localStorage保存 | 実装済み | 既存 `saveProfile()` 利用 |
| モバイル対応 | 一部実装 | CSSメディアクエリあり。実機確認は未実施 |

---

## 7. 推奨対応順

1. Canvas高さを明示して、描画領域を仕様通りにする
2. ロール達成度計算を仕様の到達条件に合わせる
3. ブラウザで `profile-view.html` と `profile-edit.html` を開き、星図の表示・クリック・パン・保存反映を確認する
4. 余裕があればPlaywright等でCanvas表示の回帰チェックを追加する

---

## 8. 結論

スキルギャラクシーは、企画意図に沿ってかなり具体的に実装されている。特に、既存の `skills` / `certifications` を壊さずにCanvas可視化へつなげている点、編集画面でスライダーから既存保存フローへ接続している点は良い。

一方で、Canvas高さのCSSは見た目に直撃する可能性があるため最優先で修正したい。ロール達成度も「埋まった喜び」が見える機能の核なので、仕様通りの到達判定に寄せるのが望ましい。
