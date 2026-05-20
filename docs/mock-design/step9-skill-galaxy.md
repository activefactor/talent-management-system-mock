# Step 9: スキルギャラクシー企画書・仕様書

**対象ファイル**:
- `mock/profile-view.html`
- `mock/profile-edit.html`
- `mock/js/data.js`
- `mock/js/common.js`
- `mock/css/style.css`
- 新規: `mock/js/skill-galaxy.js`

**依存ステップ**: Step 1（共通基盤）/ Step 5（プロフィール表示・編集）
**画面ID**: S03（プロフィール編集）/ S04（プロフィール詳細）の拡張
**Canvas**: 必要（2D Canvas）
**位置付け**: 個人のスキル・資格・目指す専門領域を、ゲームのスキルツリーのように楽しく入力・閲覧するためのモック

> 放射型ロードマップ、DevOpsライン、全画面表示、インライン編集の改善仕様は
> [Step 9 v2: 放射型スキルロードマップ仕様書](./step9-skill-galaxy-v2-roadmap.md) を参照する。

---

## 1. 企画概要

### 1.1 コンセプト

「スキルを一覧で管理する」のではなく、「その人の成長が宇宙に星座として広がっていく」体験にする。

スキルや資格を星として配置し、クリックすると星が点灯する。習熟度を上げると星が明るくなり、関連スキル同士が線でつながる。一定条件を満たすと、その先にあるエンジニアの専門ロールが明るく表示される。

通常のゲームでは、スキルを獲得すると職業や上位クラスが見えてくる。このモックでは、それを社内エンジニアのキャリア理解に置き換える。

- TypeScript / React / UI設計が育つと「フロントエンドスペシャリスト」が見える
- AWS / Docker / Kubernetes / Terraformが育つと「クラウドアーキテクト」が見える
- Playwright / Pytest / CI/CDが育つと「QAオートメーションスペシャリスト」が見える
- Go / Python / DB設計 / API設計が育つと「バックエンドスペシャリスト」が見える

本人には「今どこにいるか」と「次に何を伸ばすと、どんな道が開けるか」を直感的に見せる。
管理者には、既存の表形式スキルマップとは別に、プロフィール閲覧時の会話材料として使える状態にする。

### 1.2 目的

| 目的 | 内容 |
|---|---|
| 入力体験を楽しくする | スキル登録を事務作業ではなく、星を埋める体験にする |
| 自己理解を促す | 自分のスキル分布、強み、未開拓領域を視覚的に把握できる |
| キャリアの会話をしやすくする | 「次はどこを伸ばすか」を本人・先輩・管理者が同じ画面で話せる |
| 既存データを活かす | 現在の `skills` / `certifications` を主データとして利用する |
| モックとして印象に残す | ステークホルダーに「このシステムを使いたい」と感じてもらう |

### 1.3 推奨スコープ

MVPでは「個人プロフィール内のスキルギャラクシー」を作る。

既存の `admin.html` のスキルマップは組織全体を俯瞰する表形式として残す。今回の機能は、個人の成長・入力・キャリア目標の可視化に集中する。

---

## 2. UX提案

### 2.1 画面上の扱い

プロフィール詳細画面に新しいタブを追加する。

```
[スキル星図][スキル一覧][資格][パーソナリティ][活動]
```

プロフィール編集画面にも新しいタブを追加する。

```
[基本情報][スキル星図][スキル一覧][資格][パーソナリティ][相談設定]
```

提案として、通常のスキル一覧は残す。スキル星図は魅力的だが、一覧で素早く確認したい業務用途もあるため、両方を持つ構成が安全。

### 2.2 主要体験

#### 閲覧モード

- 宇宙空間にスキル星が浮かんでいる
- ドラッグするとマップ全体が移動する
- ホイールまたはピンチで拡大縮小できる
- 星をクリックすると右側の詳細パネルに説明、習熟度、関連ロールが表示される
- 習熟度が高い星ほど大きく、明るく、美しく表示される
- 未登録スキルは暗い星として表示される
- 取得済み資格は金色の星として表示される
- 目標ロールは大きな星雲のように表示され、達成度に応じて輪郭が明るくなる

#### 編集モード

- 星をクリックするとスキルを追加または選択できる
- 詳細パネルのスライダーで習熟度を 1〜5 に変更できる
- 0にすると未登録状態に戻せる
- 資格ノードはクリックで「資格追加フォーム」に誘導する
- 保存ボタンで `localStorage` のユーザーデータに反映する
- 自分以外のプロフィールでは編集できない

#### 喜びの演出

以下のタイミングで短い演出を出す。

| タイミング | 演出 |
|---|---|
| スキルを新規点灯 | 星が一度だけふわっと発光する |
| 習熟度が上がる | 星の外周リングが広がる |
| ロール達成度が 80% を超える | ロール星雲が明るくなり、線がつながる |
| ロール条件を満たす | 小さな粒子が広がり「ルート開通」メッセージを表示 |
| マップ全体の登録率が一定値を超える | 背景の星密度が少し上がり、埋まってきた感を出す |

演出は 1〜1.5秒程度。業務ツールなので、長すぎるアニメーションや派手すぎる演出は避ける。

---

## 3. 情報設計

### 3.1 ノード種別

| 種別 | 表示 | データ元 |
|---|---|---|
| `skill` | 通常の星 | `user.skills` |
| `certification` | 金色の星 | `user.certifications` |
| `role` | 目標ロールの大きな星雲 | 静的マスター |
| `milestone` | 中間到達点 | 静的マスター |

### 3.2 カテゴリ

既存の `SkillCategory` は保ちながら、表示用カテゴリを少し細かく分ける。

| 表示カテゴリ | 既存カテゴリ | 例 | 色 |
|---|---|---|---|
| Language | `language` | TypeScript, Python, Go, Rust | cyan |
| Frontend | `framework` | React, Next.js, UI/UX | violet |
| Backend | `framework` / `domain` | API設計, FastAPI, Django | emerald |
| Cloud/Infra | `infra` | AWS, Docker, Kubernetes, Terraform | sky / blue |
| QA | `framework` / `domain` | Playwright, Pytest, JSTQB | lime |
| Security | `infra` / `domain` | セキュリティ, IAM, 脆弱性診断 | rose |
| Data/AI | `language` / `domain` | Python, SQL, 機械学習 | amber |
| Certification | `certification` | AWS SAA, CKA, 基本情報 | gold |

### 3.3 目標ロール候補

MVPでは以下のロール星雲を配置する。

| ID | 表示名 | 説明 |
|---|---|---|
| `frontend-specialist` | フロントエンドスペシャリスト | UI実装、設計、パフォーマンス改善をリードする |
| `backend-specialist` | バックエンドスペシャリスト | API、DB、業務ロジックの設計を担う |
| `cloud-architect` | クラウドアーキテクト | クラウド基盤、IaC、運用設計をリードする |
| `sre-specialist` | SREスペシャリスト | 可観測性、信頼性、運用改善を担う |
| `qa-automation-specialist` | QAオートメーションスペシャリスト | テスト設計と自動化基盤を推進する |
| `security-specialist` | セキュリティスペシャリスト | セキュア設計、認証認可、脆弱性対策を担う |
| `data-ai-engineer` | データ・AIエンジニア | データ処理、分析、AI活用を推進する |
| `tech-lead` | テックリード | 設計判断、レビュー、チームの技術成長を支える |
| `fullstack-product-engineer` | フルスタックプロダクトエンジニア | フロントからバックエンドまで横断して価値提供する |

---

## 4. データ仕様

### 4.1 既存データは壊さない

既存の `User.skills` と `User.certifications` を主データとして使う。
新しい保存形式を大きく追加すると既存画面への影響が大きいため、スキルギャラクシーは静的マスターと既存ユーザーデータを結合して描画する。

### 4.2 スキルマスター

`mock/js/skill-galaxy.js` に静的マスターとして定義する。

```javascript
const SKILL_GALAXY_MASTER = {
  nodes: [
    {
      id: 'typescript',
      kind: 'skill',
      name: 'TypeScript',
      category: 'language',
      galaxyCategory: 'language',
      x: -180,
      y: -80,
      ring: 1,
      description: '型安全なフロントエンド・バックエンド開発の基礎',
      aliases: ['TS']
    },
    {
      id: 'aws-saa',
      kind: 'certification',
      name: 'AWS SAA',
      category: 'certification',
      galaxyCategory: 'certification',
      x: 220,
      y: 80,
      ring: 2,
      description: 'AWS設計の基礎資格',
      aliases: ['AWS Solutions Architect Associate']
    },
    {
      id: 'cloud-architect',
      kind: 'role',
      name: 'クラウドアーキテクト',
      x: 420,
      y: 30,
      ring: 4,
      requiredNodeIds: ['aws', 'docker', 'kubernetes', 'terraform'],
      recommendedNodeIds: ['linux', 'security', 'sre']
    }
  ],
  links: [
    { from: 'typescript', to: 'react' },
    { from: 'react', to: 'nextjs' },
    { from: 'aws', to: 'docker' },
    { from: 'docker', to: 'kubernetes' },
    { from: 'kubernetes', to: 'cloud-architect' }
  ]
};
```

### 4.3 ユーザー状態への変換

描画時に `user.skills` / `user.certifications` をマスターにマージする。

```javascript
function buildUserGalaxyState(user) {
  return SKILL_GALAXY_MASTER.nodes.map(node => {
    const skill = findMatchingSkill(user.skills, node);
    const cert = findMatchingCertification(user.certifications, node);
    const level = skill ? Number(skill.level || 1) : 0;
    const owned = node.kind === 'certification' ? Boolean(cert) : level > 0;

    return {
      ...node,
      owned,
      level,
      sourceSkillId: skill?.id || null,
      sourceCertificationId: cert?.id || null,
      progress: node.kind === 'role' ? calcRoleProgress(user, node) : null
    };
  });
}
```

### 4.4 スキル照合ルール

完全一致だけでは既存データとの相性が悪いため、以下の順に照合する。

1. `node.name === skill.name`
2. `node.aliases` に `skill.name` が含まれる
3. 大文字小文字を無視した一致

日本語資格名もあるため、資格ノードには `aliases` を必ず設定する。

### 4.5 保存ルール

編集モードでスキルノードのレベルを変更した場合:

| 操作 | 保存内容 |
|---|---|
| 0 → 1〜5 | `user.skills` にスキルを追加 |
| 1〜5 → 1〜5 | 既存 `skill.level` を更新 |
| 1〜5 → 0 | `user.skills` から削除 |

追加されるスキル:

```javascript
{
  id: `skill_${Date.now()}`,
  category: node.category,
  name: node.name,
  level: selectedLevel
}
```

資格ノードはMVPでは直接ON/OFFにしない。クリック時に詳細パネルから「資格を追加」ボタンを表示し、既存の資格タブへ誘導する。
理由は、資格には取得年月・有効期限・発行機関が必要で、星のON/OFFだけでは情報が不足するため。

---

## 5. Canvas仕様

### 5.1 レイアウト

プロフィール詳細:

```
┌─────────────────────────────────────────────────────────────┐
│ スキル星図                                                   │
│ ┌─────────────────────────────────────┐ ┌─────────────────┐ │
│ │                                     │ │ 選択中の星       │ │
│ │        Canvas: Skill Galaxy          │ │ 名前 / 説明      │ │
│ │                                     │ │ 習熟度 / 関連    │ │
│ │                                     │ │ 次に伸ばす候補   │ │
│ └─────────────────────────────────────┘ └─────────────────┘ │
│ [表示切替: 全体 / 目標ルート / 未登録のみ]                    │
└─────────────────────────────────────────────────────────────┘
```

プロフィール編集:

```
┌─────────────────────────────────────────────────────────────┐
│ スキル星図                                                   │
│ [目標ロール選択] [カテゴリフィルター] [検索]                  │
│ ┌─────────────────────────────────────┐ ┌─────────────────┐ │
│ │                                     │ │ 選択中の星       │ │
│ │        Canvas: Skill Galaxy          │ │ 習熟度スライダー │ │
│ │                                     │ │ 追加/削除/保存   │ │
│ └─────────────────────────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

デスクトップではCanvasを左、詳細パネルを右に置く。
モバイルではCanvasを上、詳細パネルを下に縦積みにする。

### 5.2 サイズ

| 項目 | 値 |
|---|---|
| Canvas高さ（desktop） | 520px |
| Canvas高さ（mobile） | 420px |
| 最小幅 | 親要素いっぱい |
| 背景 | `#080B16` ベース |
| デバイスピクセル比 | `window.devicePixelRatio` 対応 |

### 5.3 操作

| 操作 | 挙動 |
|---|---|
| ノードクリック | ノードを選択し、詳細パネルを更新 |
| 空白ドラッグ | マップをパン |
| ホイール | ズーム |
| ダブルクリック | クリック位置へ軽くズーム |
| 検索結果クリック | 対象ノードへパン・選択 |
| リセットボタン | 初期位置・初期ズームへ戻す |

星以外をドラッグした場合だけマップを移動する。星をドラッグしてもノード位置は変えない。

### 5.4 描画レイヤー

下から順に描画する。

1. 背景グラデーション
2. 小さな背景星
3. カテゴリ別の淡い星雲
4. ノード間リンク
5. スキル・資格ノード
6. ロールノード
7. ホバー・選択中リング
8. ラベル
9. 達成演出パーティクル

### 5.5 星の明るさ

習熟度で明るさ、半径、発光を変える。

| レベル | 状態 | 半径 | 明るさ |
|---|---|---:|---:|
| 0 | 未登録 | 3px | 20% |
| 1 | 初学者 | 5px | 45% |
| 2 | 入門 | 6px | 60% |
| 3 | 実務経験あり | 8px | 75% |
| 4 | 上級 | 10px | 90% |
| 5 | エキスパート | 12px | 100% |

描画例:

```javascript
const brightness = node.level === 0 ? 0.2 : 0.35 + node.level * 0.13;
const radius = node.level === 0 ? 3 : 4 + node.level * 1.6;
const glow = node.level === 0 ? 0 : node.level * 6;
```

### 5.6 色

| カテゴリ | 中心色 | 発光色 |
|---|---|---|
| Language | `#22D3EE` | `rgba(34, 211, 238, alpha)` |
| Frontend | `#A78BFA` | `rgba(167, 139, 250, alpha)` |
| Backend | `#34D399` | `rgba(52, 211, 153, alpha)` |
| Cloud/Infra | `#60A5FA` | `rgba(96, 165, 250, alpha)` |
| QA | `#A3E635` | `rgba(163, 230, 53, alpha)` |
| Security | `#FB7185` | `rgba(251, 113, 133, alpha)` |
| Data/AI | `#FBBF24` | `rgba(251, 191, 36, alpha)` |
| Certification | `#FDE68A` | `rgba(253, 230, 138, alpha)` |
| Role | `#F8FAFC` | `rgba(248, 250, 252, alpha)` |

単色の紫・青だけに寄せない。カテゴリごとに色相を分け、宇宙感は背景と発光で表現する。

---

## 6. ロール達成度

### 6.1 計算式

ロールノードの達成度は、必須スキルと推奨スキルから計算する。

```javascript
function calcRoleProgress(user, roleNode) {
  const required = roleNode.requiredNodeIds || [];
  const recommended = roleNode.recommendedNodeIds || [];

  const requiredScore = average(required.map(id => getNodeLevel(user, id) / 5));
  const recommendedScore = average(recommended.map(id => getNodeLevel(user, id) / 5));

  return Math.round((requiredScore * 0.75 + recommendedScore * 0.25) * 100);
}
```

`average([])` は `0` を返す。`getNodeLevel(user, id)` は未登録の場合 `0` を返す。

### 6.2 表示

| 達成度 | 表示 |
|---|---|
| 0〜29% | ほぼ非表示。近づくとラベルだけ見える |
| 30〜59% | 薄く表示。「候補」状態 |
| 60〜79% | ラベル常時表示。「近づいている」状態 |
| 80〜99% | 明るく表示。「ルート開通目前」状態 |
| 100% | 強く発光。「到達」状態 |

### 6.3 到達条件

MVPでは以下を100%到達条件にする。

- 必須ノードがすべて登録済み
- 必須ノードの平均レベルが 4 以上

資格は必須にしすぎると入力の心理的ハードルが高いため、基本は推奨扱いにする。

---

## 7. 詳細パネル仕様

### 7.1 スキルノード

閲覧モード:

```
TypeScript
Language
現在の習熟度: 5 / 5

型安全なフロントエンド・バックエンド開発の基礎。

関連する目標:
[フロントエンドスペシャリスト 85%]
[フルスタックプロダクトエンジニア 72%]

次に伸ばすとよい星:
React / Next.js / API設計
```

編集モード:

```
TypeScript
習熟度 [0 --- 5] 5
[保存する]

0にするとスキル一覧から削除されます
```

### 7.2 資格ノード

閲覧モード:

```
AWS Solutions Architect Associate
Certification
状態: 未取得 / 取得済み

関連する目標:
[クラウドアーキテクト]
[SREスペシャリスト]
```

編集モード:

```
AWS Solutions Architect Associate
[資格タブで追加する]
```

資格タブに移動すると、資格追加フォームの資格名に初期値を入れるとよい。
MVPではタブ移動のみでも可。

### 7.3 ロールノード

```
クラウドアーキテクト
達成度 78%

強い星:
AWS Lv4 / Docker Lv4

次に伸ばす星:
Kubernetes Lv0 / Terraform Lv0

このロールのイメージ:
クラウド基盤、IaC、運用設計をリードする専門家。
```

---

## 8. アクセシビリティ・フォールバック

Canvasは視覚的な主役だが、情報はCanvasだけに閉じ込めない。

- Canvasの右または下に、選択中ノードのテキスト詳細を必ず表示する
- キーボード操作用に検索欄とノード一覧を用意する
- Canvasには `aria-label="スキル星図"` を付ける
- 詳細パネルのスライダーは通常の `<input type="range">` を使う
- モバイルではパン操作とページスクロールが競合しすぎないよう、Canvas領域内のみ `touch-action: none` を指定する
- Canvasが初期化できない場合は、既存のスキル一覧タブが情報の代替になる

---

## 9. 実装仕様

### 9.1 新規ファイル

`mock/js/skill-galaxy.js` を追加する。

公開API:

```javascript
window.TH = window.TH || {};

TH.skillGalaxy = {
  master: SKILL_GALAXY_MASTER,
  createRenderer,
  buildUserGalaxyState,
  updateSkillLevel,
  calcRoleProgress,
  getSuggestedNextNodes,
};
```

### 9.2 レンダラー

```javascript
function createRenderer(canvas, options) {
  return {
    mount(),
    destroy(),
    setUser(user),
    setMode(mode), // 'view' | 'edit'
    setFilter(filter),
    focusNode(nodeId),
    resetView(),
    onSelect(callback),
    onChange(callback)
  };
}
```

`options`:

```javascript
{
  mode: 'view',
  user,
  editable: false,
  onSelect(node) {},
  onChange(change) {},
  onCelebrate(event) {}
}
```

### 9.3 イベント処理

`pointerdown`:

- クリック位置をワールド座標に変換する
- ノードに当たっていれば `selectedNode` をセット
- ノード以外なら `isPanning = true`

`pointermove`:

- `isPanning` なら `offsetX` / `offsetY` を更新
- それ以外ならホバー中ノードを更新

`pointerup`:

- `isPanning = false`

`wheel`:

- マウス位置を中心にズーム
- `scale` は `0.55〜2.2` に制限する

### 9.4 Alpine.js連携（profile-view.html）

追加する状態:

```javascript
skillGalaxyRenderer: null,
selectedGalaxyNode: null,
galaxyFilter: 'all',
```

タブ切り替え:

```javascript
switchToSkillGalaxy() {
  this.activeTab = 'skill-galaxy';
  this.$nextTick(() => this.mountSkillGalaxy());
}
```

マウント:

```javascript
mountSkillGalaxy() {
  const canvas = document.getElementById('skillGalaxyCanvas');
  if (!canvas || this.skillGalaxyRenderer) return;

  this.skillGalaxyRenderer = TH.skillGalaxy.createRenderer(canvas, {
    mode: 'view',
    user: this.targetUser,
    editable: false,
    onSelect: node => { this.selectedGalaxyNode = node; }
  });
  this.skillGalaxyRenderer.mount();
}
```

### 9.5 Alpine.js連携（profile-edit.html）

追加する状態:

```javascript
skillGalaxyRenderer: null,
selectedGalaxyNode: null,
selectedGalaxyLevel: 0,
```

レベル変更:

```javascript
setSelectedGalaxyLevel(level) {
  if (!this.selectedGalaxyNode || this.selectedGalaxyNode.kind !== 'skill') return;
  this.selectedGalaxyLevel = Number(level);
  TH.skillGalaxy.updateSkillLevel(
    this.editForm,
    this.selectedGalaxyNode,
    this.selectedGalaxyLevel
  );
  this.isDirty = true;
  this.skillGalaxyRenderer.setUser(this.editForm);
}
```

`updateSkillLevel` は `editForm.skills` を更新する。保存は既存の `saveProfile()` に任せる。

### 9.6 CSS追加

`mock/css/style.css` に追加する。

```css
.skill-galaxy-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
}

.skill-galaxy-canvas-wrap {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  border-radius: 12px;
  background: #080b16;
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.skill-galaxy-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  touch-action: none;
}

.skill-galaxy-canvas:active {
  cursor: grabbing;
}

.skill-galaxy-panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
}

@media (max-width: 900px) {
  .skill-galaxy-shell {
    grid-template-columns: 1fr;
  }

  .skill-galaxy-canvas-wrap {
    min-height: 420px;
  }
}
```

既存デザインではカード角丸が12pxだが、今後8pxへ寄せる場合はこのコンポーネントも合わせる。

---

## 10. マップ構成案

### 10.1 座標ルール

中心を「基礎」とし、外側に専門領域を置く。

```
                    QA / Test
                       ↑
     Frontend ← 基礎スキル → Backend
                       ↓
                Cloud / Infra

  外周: Specialist / Lead / Architect
```

### 10.2 初期ノード候補

| ノード | 種別 | カテゴリ | 座標目安 |
|---|---|---|---|
| JavaScript | skill | language | -220, -40 |
| TypeScript | skill | language | -170, -80 |
| React | skill | frontend | -300, -150 |
| Next.js | skill | frontend | -420, -180 |
| UI/UX | skill | frontend | -360, -40 |
| Python | skill | language | 60, -40 |
| Go | skill | language | 110, -80 |
| API設計 | skill | backend | 250, -80 |
| FastAPI | skill | backend | 210, -160 |
| Django | skill | backend | 300, -160 |
| PostgreSQL | skill | backend | 340, -20 |
| AWS | skill | cloud | 160, 120 |
| Docker | skill | cloud | 250, 170 |
| Kubernetes | skill | cloud | 360, 190 |
| Terraform | skill | cloud | 320, 90 |
| Linux | skill | cloud | 110, 210 |
| Playwright | skill | qa | -120, 180 |
| Pytest | skill | qa | -20, 220 |
| GitHub Actions | skill | qa | 70, 180 |
| セキュリティ | skill | security | 480, 20 |
| 機械学習 | skill | data | 40, -240 |
| AWS SAA | certification | certification | 420, 120 |
| CKA | certification | certification | 470, 210 |
| 基本情報技術者 | certification | certification | -40, 40 |

### 10.3 リンク例

| From | To |
|---|---|
| JavaScript | TypeScript |
| TypeScript | React |
| React | Next.js |
| TypeScript | API設計 |
| Python | FastAPI |
| Python | Pytest |
| Go | API設計 |
| AWS | Docker |
| Docker | Kubernetes |
| AWS | Terraform |
| Playwright | QAオートメーションスペシャリスト |
| Kubernetes | クラウドアーキテクト |
| API設計 | バックエンドスペシャリスト |
| Next.js | フロントエンドスペシャリスト |

---

## 11. 実装ステップ（Claude Code向け）

### Step 1: 静的マスターと描画エンジン

- `mock/js/skill-galaxy.js` を作成
- `SKILL_GALAXY_MASTER` を定義
- `buildUserGalaxyState(user)` を実装
- Canvasに背景、リンク、ノードを描画
- パン・ズーム・クリック選択を実装

### Step 2: プロフィール詳細への組み込み

- `profile-view.html` に `js/skill-galaxy.js` を読み込む
- タブに「スキル星図」を追加
- Canvasと詳細パネルを追加
- 既存のスキル一覧は「スキル一覧」タブとして残す
- 星クリックで詳細パネルが切り替わる

### Step 3: プロフィール編集への組み込み

- `profile-edit.html` に `js/skill-galaxy.js` を読み込む
- タブに「スキル星図」を追加
- 詳細パネルに習熟度スライダーを追加
- `editForm.skills` と連動する
- 既存の `saveProfile()` で保存されるようにする

### Step 4: 達成度・喜びの演出

- `calcRoleProgress` を実装
- ロールノードの明るさを達成度で変える
- 達成度が80%以上になった瞬間に短い演出を出す
- 演出はCanvas内で完結させる

### Step 5: 仕上げ

- `style.css` に専用スタイルを追加
- モバイル表示を確認
- `localStorage.clear(); location.reload();` 後も初期データで表示されることを確認
- コンソールエラーがないことを確認

---

## 12. Claude Codeに渡す実装プロンプト案

以下をそのままClaude Codeに渡せる。

```text
TalentHubモックに、個人プロフィール用の「スキルギャラクシー」を追加してください。

参照仕様:
- docs/mock-design/step9-skill-galaxy.md
- docs/mock-design/step5-profile.md
- docs/mock-design/overview.md
- docs/DESIGN.md

実装対象:
- 新規: mock/js/skill-galaxy.js
- 更新: mock/profile-view.html
- 更新: mock/profile-edit.html
- 更新: mock/css/style.css

要件:
1. 2D Canvasで宇宙空間にスキルの星を表示する。
2. 星以外をドラッグするとマップをパンできる。
3. ホイールでズームできる。
4. 星クリックで詳細パネルを更新する。
5. 習熟度0〜5で星の明るさとサイズが変わる。
6. profile-view.htmlでは閲覧モードとして表示する。
7. profile-edit.htmlでは編集モードとして表示し、詳細パネルのスライダーで editForm.skills を更新する。
8. 既存のスキル一覧・資格一覧は壊さず残す。
9. ロールノード（例: フロントエンドスペシャリスト、クラウドアーキテクト）を表示し、必要スキルの充足率で明るさを変える。
10. 保存は既存の saveProfile() を利用し、localStorageに反映する。
11. モックなので外部ライブラリは追加せず、既存のTailwind/Alpine.js構成に合わせる。
12. デスクトップとモバイルの両方でテキストやUIが重ならないようにする。

完了条件:
- profile-view.html の「スキル星図」タブでCanvasが表示される。
- profile-edit.html の「スキル星図」タブでスライダー変更後、保存して再表示するとレベルが反映される。
- 既存のスキル一覧、資格、パーソナリティ、活動タブが引き続き動く。
- ブラウザコンソールにエラーが出ない。
```

---

## 13. 実装後のチェック項目

- [ ] `profile-view.html` に「スキル星図」タブが表示される
- [ ] `profile-edit.html` に「スキル星図」タブが表示される
- [ ] Canvasが空白にならず、初期表示で星が見える
- [ ] 星以外をドラッグするとマップが移動する
- [ ] 星クリックで詳細パネルが更新される
- [ ] スキルレベルが星の明るさ・サイズに反映される
- [ ] 編集画面でスライダー変更後、保存すると `localStorage` に反映される
- [ ] 未登録スキルをレベル1以上にするとスキル一覧にも追加される
- [ ] レベル0に戻すとスキル一覧から削除される
- [ ] 資格ノードは既存資格データと照合して取得済み表示になる
- [ ] ロールノードの達成度が表示される
- [ ] 達成度80%以上でロールノードが明るくなる
- [ ] モバイル幅でもCanvasと詳細パネルが重ならない
- [ ] 既存タブ（スキル一覧・資格・パーソナリティ・活動）が壊れていない
- [ ] コンソールエラーがない

---

## 14. 今後の拡張案

| 案 | 内容 | 優先度 |
|---|---|---|
| 目標ロール選択 | 本人が「目指す星座」を1〜2個選ぶ | 高 |
| 次の一手レコメンド | 足りないスキルを3つ提示する | 高 |
| 学習ログ連動 | 学習ログのタグから星を少しずつ明るくする | 中 |
| 先輩比較 | 選んだ先輩の星図を薄く重ねる | 中 |
| 相談導線 | 不足スキルを持つ相談受付中メンバーを表示する | 中 |
| 管理者ビュー連携 | 組織全体を銀河群として見る | 低 |
| 称号バッジ | ロール到達時にプロフィールバッジを付与する | 中 |

---

## 15. 注意点

- Canvasだけに情報を閉じ込めない。詳細パネルと既存一覧を必ず残す。
- ロール名は評価・等級に見えないようにする。「称号」ではなく「目指せる専門領域」として扱う。
- 資格を必須条件にしすぎない。若手が「資格がないと進めない」と感じないようにする。
- 習熟度は自己申告なので、断定的な評価表現を避ける。
- 演出は嬉しさを出すためのものに留め、業務画面として使い続けられる落ち着きも保つ。
