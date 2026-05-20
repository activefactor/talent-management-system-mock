# Step 9 v2: 放射型スキルロードマップ仕様書

**作成日**: 2026-05-19  
**対象**: `mock/profile-view.html` / `mock/profile-edit.html` / `mock/js/skill-galaxy.js` / `mock/css/style.css`  
**位置付け**: 既存スキルギャラクシーの改善仕様。実装前の検討版。

---

## 1. 方向性

現行のスキルギャラクシーは「宇宙にスキルの星が浮かぶ」体験として成立している。一方で、実際に使っていくには「どの順番で伸ばすのか」「DevOpsなどの専門ルートでは何を辿るのか」が見える必要がある。

v2では、Roadmap.sh のようなロール別・スキル別ロードマップの考え方を取り入れ、中心から外側に向かってスキルが広がる構造にする。

狙い:

- 全スキルが最初から見える
- スキルの順番、前提、関連性が線で分かる
- DevOps / Frontend / Backend など、専門ルートごとの通り道が見える
- その場で習熟度を編集できる
- 必要に応じて全画面でじっくり見られる

---

## 2. コンセプト

名称案: **Skill Roadmap Galaxy**

中心に「Engineering Core」を置き、そこから放射線状にスキルが伸びる。各方向は専門領域のレーンになる。

```
                         Data / AI
                            ↑
          Frontend      Engineering Core      Backend
             ↖               ●                ↗
               ↖                              ↗
       QA / Test  ←                       →  Cloud / Infra
               ↙                              ↘
             DevOps                      Security
```

中心に近いほど基礎スキル、外側に行くほど実践・応用・専門スキルになる。

DevOpsボタンを押すと、全体の星は残したまま、DevOpsに必要なラインだけが強く発光する。利用者は「自分は今どこまで来ているか」「次にどの星を伸ばすべきか」を見られる。

---

## 3. 参考UI

Roadmap.sh は、開発者向けにロール別ロードマップとスキル別ロードマップを提供している。DevOps、DevSecOps、Frontend、Backendなどのロール別パスに加え、Docker、Kubernetes、AWS、Terraform、Linuxなどのスキル別ロードマップもある。

このモックでは、Roadmap.sh の「学ぶ順番がある」「関連トピックが線でつながる」「ロールごとに道筋が違う」という構造を参考にする。ただし、そのまま職業学習サイトに寄せるのではなく、社内プロフィール編集・可視化のためのUIにする。

参考:
- https://roadmap.sh/
- https://roadmap.sh/get-started

---

## 4. UI仕様

### 4.1 基本レイアウト

プロフィール詳細・編集の「スキル星図」タブを、以下の構成に変更する。

```
┌─────────────────────────────────────────────────────────────┐
│ スキルロードマップ                                           │
│ [全体] [DevOps] [Frontend] [Backend] [Cloud] [QA] [Security] │
│ [検索________] [未習得のみ] [全画面]                         │
│                                                             │
│ ┌──────────────────────────────────────┐ ┌────────────────┐ │
│ │                                      │ │ 選択中ノード    │ │
│ │   Canvas: 放射型ロードマップ          │ │ 説明            │ │
│ │                                      │ │ 習熟度編集      │ │
│ │                                      │ │ 次の候補        │ │
│ └──────────────────────────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Canvas表示

常に全スキルを表示する。

表示ルール:

- 中心から外側に向かって、基礎 → 実践 → 応用 → 専門の順に配置する
- 各専門領域は角度で分ける
- 同じ専門領域のスキルは、中心から放射線状に並ぶ
- 関連スキル・前提スキルは線でつなぐ
- 選択中のルート以外は薄く表示するが、非表示にはしない

ステージ:

| Stage | 意味 | 半径 |
|---|---|---:|
| 0 | Core | 0 |
| 1 | Foundation | 120 |
| 2 | Practice | 230 |
| 3 | Advanced | 340 |
| 4 | Specialist | 470 |

### 4.3 レーン

| レーン | 角度目安 | 主なスキル |
|---|---:|---|
| Core | 中心 | Git, Linux基礎, HTTP, CLI, Computer Science |
| Frontend | 210〜270度 | JavaScript, TypeScript, React, Next.js, UI/UX |
| Backend | 300〜350度 | API設計, DB, Python, Go, FastAPI, Django |
| Cloud / Infra | 20〜70度 | AWS, Docker, Kubernetes, Terraform |
| DevOps | 70〜120度 | CI/CD, IaC, Observability, SRE, Automation |
| QA / Test | 130〜170度 | Pytest, Playwright, テスト設計, GitHub Actions |
| Security | 0〜20度 | IAM, セキュリティ, DevSecOps, 脆弱性診断 |
| Data / AI | 180〜210度 | Python, SQL, 機械学習, Data Engineering |

角度は厳密な数学より視認性を優先する。重なる場合は `laneOffset` で少し左右に逃がす。

### 4.4 表示切替

星図は楽しい一方で、スキル数が増えると一覧性が弱くなる。v2では、同じデータを以下の2つのビューで切り替える。

```
[星図] [リスト]
```

| ビュー | 役割 |
|---|---|
| 星図 | 全体像、道筋、関連性、到達感を見る |
| リスト | 検索、比較、入力、細かい編集をする |

リスト表示でも世界観は維持する。通常の業務テーブルではなく、「星域カタログ」「航路ログ」のように、暗色背景・カテゴリ色・レベル発光を使ったカードリストにする。

---

## 5. ルート表示仕様

### 5.1 ルート選択

上部にルートボタンを置く。

```
[全体] [DevOps] [Frontend] [Backend] [Cloud Architect] [QA Automation] [Security] [Data/AI]
```

選択時の表示:

| 状態 | 表示 |
|---|---|
| 選択ルート上のノード | 明るく表示 |
| 選択ルート上の線 | 太く、発光して表示 |
| 次に推奨されるノード | 外周リングを点滅または脈動 |
| ルート外ノード | 25〜40%の透明度で残す |
| ロール到達ノード | 達成度に応じて外側で発光 |

### 5.2 DevOpsルート例

DevOpsは「開発と運用をつなげる道」として、以下の順番で表示する。

```
Engineering Core
  ↓
Git / GitHub
  ↓
Linux
  ↓
Shell / Bash
  ↓
Networking / HTTP
  ↓
Cloud Basics / AWS
  ↓
Docker
  ↓
CI/CD / GitHub Actions
  ↓
Terraform
  ↓
Kubernetes
  ↓
Observability
  ↓
SRE
  ↓
DevOps Specialist
```

補助ルート:

- Security / IAM → DevSecOps寄り
- Python / Go → Automation寄り
- AWS SAA / CKA → 資格ノードとして近くに表示

### 5.3 パス進捗

ルート選択時に右パネルへ進捗を表示する。

```
DevOps Specialist
進捗 58%

通過済み:
Git / Linux / AWS / Docker

次に伸ばす:
GitHub Actions / Terraform / Kubernetes

推奨アクション:
CI/CDの基礎を登録し、GitHub Actionsの習熟度を2以上にする
```

計算:

```javascript
pathProgress = average(pathNodeLevels.map(level => level / requiredLevel)) * 100
```

初期値では `requiredLevel = 3`。専門ロール到達条件は、主要ノードの平均レベル4以上にする。

---

## 6. データ仕様

### 6.1 ノード定義

既存の `SKILL_GALAXY_MASTER.nodes` を、ロードマップ向けに拡張する。

```javascript
{
  id: 'docker',
  kind: 'skill',
  name: 'Docker',
  category: 'infra',
  lane: 'cloud',
  stage: 2,
  order: 30,
  description: 'コンテナ化の基礎技術',
  aliases: ['Container'],
  prerequisiteIds: ['linux'],
  relatedIds: ['kubernetes', 'github-actions'],
  pathIds: ['devops', 'cloud-architect', 'sre']
}
```

追加フィールド:

| フィールド | 内容 |
|---|---|
| `lane` | 放射レーン。`frontend`, `backend`, `devops` など |
| `stage` | 中心からの距離。0〜4 |
| `order` | 同じレーン内での表示順 |
| `prerequisiteIds` | 前提スキル |
| `relatedIds` | 関連スキル |
| `pathIds` | 所属する専門ルート |
| `requiredLevelByPath` | ルートごとの推奨レベル。任意 |

### 6.2 エッジ定義

線は3種類に分ける。

```javascript
{
  from: 'docker',
  to: 'kubernetes',
  type: 'required',
  pathIds: ['devops', 'cloud-architect']
}
```

| type | 表示 | 意味 |
|---|---|---|
| `required` | 太い実線 | 前提として辿る |
| `recommended` | 細い実線 | 推奨 |
| `related` | 点線 | 関連・横断 |

### 6.3 パス定義

```javascript
const SPECIALIST_PATHS = [
  {
    id: 'devops',
    name: 'DevOps Specialist',
    label: 'DevOps',
    color: '#60A5FA',
    description: '開発と運用をつなぎ、継続的な価値提供を支える専門ルート',
    nodeIds: [
      'engineering-core',
      'git-github',
      'linux',
      'shell-bash',
      'networking-http',
      'aws',
      'docker',
      'github-actions',
      'terraform',
      'kubernetes',
      'observability',
      'sre'
    ],
    targetNodeId: 'devops-specialist',
    requiredAverageLevel: 4
  }
];
```

### 6.4 詳細スキルカタログ

スキル数を増やすため、`SKILL_GALAXY_MASTER` は単なる星の座標リストではなく、社内スキルカタログとして扱う。

カテゴリは最低限以下を用意する。

| 大分類 | 小分類例 | スキル例 |
|---|---|---|
| Engineering Core | 基礎・共通 | Git, GitHub, Linux, Shell, HTTP, CLI, CS基礎 |
| Language | 言語 | JavaScript, TypeScript, Python, Go, Rust, Java, SQL |
| Frontend | UI開発 | HTML, CSS, React, Next.js, Accessibility, UI/UX, Performance |
| Backend | API・サーバー | REST, GraphQL, API設計, FastAPI, Django, Node.js, 認証認可 |
| Database | データ永続化 | PostgreSQL, MySQL, Redis, DB設計, Index設計, Migration |
| Cloud | クラウド | AWS, GCP, Azure, VPC, IAM, CDN, Serverless |
| Container / Platform | 実行基盤 | Docker, Kubernetes, Helm, ECS, EKS |
| IaC / DevOps | 自動化 | Terraform, CI/CD, GitHub Actions, Release, Automation |
| Observability / SRE | 運用 | Logging, Metrics, Tracing, SLO, Incident Response, On-call |
| Security | セキュリティ | IAM, OWASP, Vulnerability, Secrets, DevSecOps |
| QA / Test | 品質 | Test Design, Unit Test, Integration Test, Playwright, Pytest, JSTQB |
| Data / AI | データ・AI | Python, SQL, Data Pipeline, ML, LLM, Prompt Engineering |
| Architecture | 設計 | DDD, Microservices, Event Driven, Clean Architecture, ADR |
| Collaboration | 開発プロセス | Code Review, Agile, Scrum, Documentation, Facilitation |
| Leadership | リード | Mentoring, Tech Lead, Hiring, Project Lead, Stakeholder Communication |
| Domain | 業務知識 | HR, FinTech, EC, B2B SaaS, Accounting, Security Domain |
| Certification | 資格 | 基本情報, 応用情報, AWS SAA, AWS SAP, CKA, JSTQB |

MVPでは40〜60件程度、将来的には100〜200件程度まで増やせる前提にする。

### 6.5 スキル詳細フィールド

各スキルは、表示と編集に必要な情報を持つ。

```javascript
{
  id: 'github-actions',
  kind: 'skill',
  name: 'GitHub Actions',
  shortName: 'Actions',
  category: 'devops',
  subcategory: 'CI/CD',
  lane: 'devops',
  stage: 2,
  order: 50,
  description: 'GitHub上でCI/CDパイプラインを構築・運用するスキル',
  levelGuide: {
    1: '既存workflowを読める',
    2: '簡単なworkflowを修正できる',
    3: 'テスト・ビルド・デプロイを自分で組める',
    4: '再利用可能なworkflowや権限設計を整備できる',
    5: '組織標準のCI/CD設計をリードできる'
  },
  evidenceExamples: [
    'テスト自動実行を追加した',
    'デプロイworkflowを改善した',
    '権限やSecrets管理を見直した'
  ],
  prerequisiteIds: ['git-github', 'shell-bash'],
  relatedIds: ['docker', 'terraform', 'deployment'],
  pathIds: ['devops', 'qa-automation', 'sre'],
  aliases: ['CI/CD', 'CI', 'CD']
}
```

追加したい考え方:

- `levelGuide` で習熟度の意味を明確にする
- `evidenceExamples` で本人が自己申告しやすくする
- `subcategory` でリスト表示時にグルーピングできるようにする
- `shortName` でCanvasラベルが長くなりすぎる問題を避ける

---

## 7. レイアウトアルゴリズム

手動座標ではなく、`lane` と `stage` から座標を生成する。

```javascript
const LANE_ANGLES = {
  frontend: 240,
  backend: 325,
  cloud: 45,
  devops: 95,
  qa: 150,
  security: 15,
  data: 195,
};

function calcNodePosition(node, nodesInLane) {
  const baseAngle = LANE_ANGLES[node.lane] || 0;
  const siblings = nodesInLane.filter(n => n.stage === node.stage);
  const index = siblings.findIndex(n => n.id === node.id);
  const spread = 26;
  const offset = siblings.length <= 1
    ? 0
    : -spread / 2 + (spread * index) / (siblings.length - 1);

  const angle = toRad(baseAngle + offset);
  const radius = node.stage * 115;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
}
```

補足:

- `stage: 0` は常に中心
- 同じstageに複数ノードがある場合は角度を少し広げる
- 線が重なりすぎる場合、ラベルだけ外側へずらす
- ルート選択時は対象ルートが見やすい位置へ自動パン・ズームする

---

## 8. リスト表示

### 8.1 コンセプト

リスト表示は、星図の弱点である一覧性を補うためのビュー。世界観は維持しつつ、業務画面としての検索性・編集性を高める。

名称案:

- **Star Catalog**
- **Skill Codex**
- **スキル星域リスト**

UI文言は日本語で「スキルカタログ」が分かりやすい。内部コンポーネント名は `skill-catalog` とする。

### 8.2 レイアウト

```
┌─────────────────────────────────────────────────────────────┐
│ スキルカタログ                                               │
│ [星図に戻る] [全体] [DevOps] [Frontend] [未習得] [検索____]   │
│                                                             │
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │ カテゴリ     │ │ TypeScript       Frontend / Language    │ │
│ │ Core         │ │ Lv4  [slider]   関連: React / API設計   │ │
│ │ Frontend     │ ├─────────────────────────────────────────┤ │
│ │ Backend      │ │ Docker           Cloud / DevOps          │ │
│ │ DevOps       │ │ Lv3  [slider]   次: Kubernetes           │ │
│ │ QA           │ └─────────────────────────────────────────┘ │
│ └─────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 表示単位

リストの1行は「星カード」として表示する。

```
Docker
Cloud / DevOps / Stage 2

コンテナ化の基礎技術

Lv 3 / 5   [0 ─────── 5]
前提: Linux
次: Kubernetes / GitHub Actions
含まれるルート: DevOps / Cloud Architect / SRE
```

視覚ルール:

| 状態 | 見た目 |
|---|---|
| 習得済み | 左端にカテゴリ色の発光ライン |
| 未習得 | 暗めの背景、星はアウトライン |
| 選択中ルート上 | 背景にルート色の薄いグロー |
| 次に推奨 | 外枠を点滅または明るい線 |
| レベル5 | 星アイコンとゲージを強く発光 |

### 8.4 編集

リスト上でもスキルを編集できる。

操作:

- スライダーで0〜5変更
- `+` / `-` で1段階変更
- レベルガイドを開閉表示
- 変更済み行に「未保存」表示
- 複数変更後にまとめて保存

既存の `updateSkillLevel()` を使い、星図とリストで同じ編集ロジックを共有する。

### 8.5 フィルター

| フィルター | 内容 |
|---|---|
| キーワード | スキル名、別名、説明、カテゴリを横断検索 |
| ルート | DevOps / Frontend / Backend など |
| カテゴリ | Core / Cloud / QA など |
| 習熟度 | 未習得、Lv1〜2、Lv3以上、Lv5 |
| 次に伸ばす | 選択ルート上で次に推奨されるもの |
| 資格 | 資格ノードのみ |

### 8.6 並び順

初期表示:

1. 選択中ルート上のスキル
2. `stage` 昇順
3. `order` 昇順
4. 習得済みを少し上に寄せる

カテゴリ選択時は `subcategory` でグループ化する。

### 8.7 星図との連動

- リストでスキルをクリックすると星図側でも同じノードを選択する
- 星図でノードを選ぶとリスト側でも該当行へスクロールする
- ルート選択、検索、未習得フィルターは両ビューで共有する
- 全画面表示でもリストパネルへ切り替えられるようにする

### 8.8 モバイル

モバイルではサイドカテゴリを上部の横スクロールチップにする。

```
[Core] [Frontend] [Backend] [Cloud] [DevOps] [QA]
[検索________]
[TypeScript card]
[Docker card]
```

リストモードはモバイルで特に重要。Canvasが狭い場合でも、リストならスキル編集がしやすい。

---

## 9. 全画面表示

### 9.1 起動

Canvas右上に全画面ボタンを置く。

```
[⛶ 全画面]
```

押下すると、ページ内モーダルとして全画面表示する。ネイティブFullscreen APIはブラウザ差があるため、MVPではCSSモーダルを推奨する。

### 9.2 全画面レイアウト

```
┌─────────────────────────────────────────────────────────────┐
│ Skill Roadmap Galaxy       [全体][DevOps][...] [保存] [閉じる]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                 Canvas Fullscreen                           │
│                                                             │
│                                      ┌──────────────────┐   │
│                                      │ 選択中ノード      │   │
│                                      │ 習熟度編集        │   │
│                                      │ 次の候補          │   │
│                                      └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

仕様:

- `position: fixed; inset: 0; z-index: 10000;`
- 背景は暗色
- 右パネルは折りたたみ可能
- `Esc` で閉じる
- 閉じた後も選択状態・ズーム状態は維持する
- 編集画面では全画面内でも習熟度を変更できる
- 未保存変更がある場合は「未保存」表示を出す
- 全画面内でも `[星図] [リスト]` を切り替えられる

---

## 10. インライン編集

### 10.1 編集可能条件

| 画面 | 条件 | 編集可否 |
|---|---|---|
| `profile-edit.html` | 常に本人の編集画面 | 可 |
| `profile-view.html` | 自分のプロフィール表示中 | 可にしてよい |
| `profile-view.html` | 他人のプロフィール | 不可 |

現行は編集画面のみ編集可。v2では、自分のプロフィール詳細からもその場で習熟度変更できると体験が良い。

### 10.2 編集UI

ノード選択時、右パネルに習熟度編集を出す。

```
Docker
Cloud / Infra

習熟度
[ - ] 3 / 5 [ + ]
[0 ───────────── 5]

[保存] [取り消し]
```

操作:

- `+` / `-` ボタンで1段階変更
- スライダーで0〜5変更
- 0は未習得
- 1以上にすると `skills` に追加
- 既存スキルなら `level` を更新
- 0に戻すと `skills` から削除

### 10.3 保存

MVPでは手動保存。

理由:

- スライダー操作のたびに保存すると誤操作が戻しにくい
- 既存の `saveProfile()` と整合する

表示:

- 変更後、右上に「未保存」バッジ
- 保存成功時にトースト
- 閉じる/戻る時に未保存確認

---

## 11. 詳細パネル

### 11.1 スキルノード

```
Docker
Cloud / Infra / Stage 2

コンテナ化の基礎技術。

習熟度: 3 / 5
[スライダー]

前提:
Linux

次:
Kubernetes / GitHub Actions

含まれるルート:
DevOps / Cloud Architect / SRE
```

### 11.2 ルート選択中

```
DevOpsライン上の Docker

このルートでの位置:
7 / 12

次の推奨:
GitHub Actions
Terraform
```

### 11.3 ロールノード

```
DevOps Specialist
到達度 58%

通過済み:
Git / Linux / Docker

不足:
Terraform / Kubernetes / Observability

次の一手:
GitHub ActionsをLv2以上にする
```

---

## 12. 表示モード

| モード | 内容 |
|---|---|
| `all` | 全スキルを通常表示 |
| `path` | 選択ルートを強調 |
| `missing` | 未習得ノードを強調 |
| `owned` | 習得済みノードを強調 |
| `next` | 次に伸ばす候補だけを強調 |

初期表示は `all`。自分のプロフィールでは、最後に選択したルートを `localStorage` に保持してもよい。

---

## 13. 実装ステップ案

### Step 1: データ構造更新

- `SKILL_GALAXY_MASTER.nodes` に `lane`, `stage`, `order`, `pathIds`, `prerequisiteIds` を追加
- `SPECIALIST_PATHS` を追加
- 詳細スキルカタログ用に `subcategory`, `levelGuide`, `evidenceExamples` を追加
- 既存の `x`, `y` は残してもよいが、v2では生成座標を優先する

### Step 2: 放射レイアウト

- `calcNodePosition()` を実装
- `layoutNodes(master)` で `x`, `y` を生成
- 中心・ステージリング・レーンラベルを描画

### Step 3: ルートハイライト

- `selectedPathId` を renderer の状態に追加
- `setPath(pathId)` APIを追加
- ルート上ノード・線を明るくし、それ以外を薄くする

### Step 4: 全画面表示

- `profile-view.html` / `profile-edit.html` に全画面モーダルを追加
- 通常Canvasと全画面Canvasで同じ renderer API を使えるようにする
- `Esc` / 閉じるボタン / 保存ボタンを実装

### Step 5: インライン編集

- 詳細パネルに `+` / `-` / スライダーを追加
- 自分のプロフィール詳細でも編集可能にする
- 未保存状態と保存処理を整理する

### Step 6: リスト表示

- `[星図] [リスト]` のビュー切り替えを追加
- `Skill Catalog` コンポーネントを追加
- カテゴリ、ルート、習熟度、キーワードで絞り込めるようにする
- リスト上のスライダー変更を星図と同じ編集状態に反映する
- リスト行クリックでCanvasノードへフォーカスする

---

## 14. Claude Code向け実装プロンプト案

```text
TalentHubのスキルギャラクシーを、放射型スキルロードマップに改善してください。

参照仕様:
- docs/mock-design/step9-skill-galaxy-v2-roadmap.md
- docs/mock-design/step9-skill-galaxy.md

要件:
1. 全スキルが中心から放射線状に見えるレイアウトにする。
2. lane / stage / order からCanvas座標を生成する。
3. Stageリング（Core / Foundation / Practice / Advanced / Specialist）を描画する。
4. スキル同士の prerequisite / recommended / related を線でつなぐ。
5. DevOpsなどのルートボタンを押すと、そのルート上のノードと線を強調する。
6. ルート外のノードは消さず、薄く表示する。
7. DevOpsルートは Git/GitHub → Linux → Shell/Bash → AWS → Docker → GitHub Actions → Terraform → Kubernetes → Observability → SRE の流れが見えるようにする。
8. Canvas右上に全画面ボタンを追加し、全画面モーダルで同じロードマップを見られるようにする。
9. 選択ノードの詳細パネルで習熟度を0〜5で編集できるようにする。
10. 自分のプロフィール詳細でも習熟度編集を可能にする。他人のプロフィールでは閲覧のみ。
11. `[星図] [リスト]` の表示切替を追加し、リスト表示でも同じ世界観でスキルを一覧・編集できるようにする。
12. スキルカタログを拡張し、Core / Language / Frontend / Backend / Database / Cloud / DevOps / SRE / Security / QA / Data / Architecture / Collaboration / Leadership / Domain / Certification を扱えるようにする。
13. 保存は既存の saveProfile() / TH.data.saveUser() と整合させ、localStorageに反映する。
14. 既存のスキル一覧、資格、パーソナリティ、活動タブは壊さない。

完了条件:
- profile-view.html / profile-edit.html のスキル星図で、全スキルが放射型に表示される。
- DevOpsボタンでDevOpsルートが明確にハイライトされる。
- 全画面ボタンでモーダル表示でき、Escまたは閉じるボタンで戻れる。
- リスト表示でスキルを検索・絞り込み・編集できる。
- 習熟度変更後に保存すると、通常のスキル一覧にも反映される。
- ブラウザコンソールにエラーがない。
```

---

## 15. 検討メモ

- 「星図」感は残すが、配置はロードマップとして読めることを優先する
- 全スキルは常に表示し、ルート選択はハイライトとして扱う
- 未習得スキルも暗く残すことで「先の道」が見える
- スキル数が多い場合は、リスト表示を主入力、星図を探索・理解用にする
- 社内評価に見えすぎないよう、ロール到達は「称号」ではなく「目指せる専門ルート」として表現する
- DevOpsなどのパスは会社の技術スタックに合わせて後から編集できる構造にする
