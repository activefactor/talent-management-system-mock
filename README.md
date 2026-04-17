# TalentHub — タレントマネジメントシステム モック

社内エンジニアのスキル・学習・成長を可視化するタレントマネジメントシステムのインタラクティブモックです。  
バックエンド不要の静的 HTML で動作し、データは `localStorage` に保存されます。

---

## デモ画面 (GitHub Pages)

| 画面 | リンク |
|---|---|
| ログイン | [![Login](https://img.shields.io/badge/画面-ログイン-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/index.html) |
| ダッシュボード | [![Dashboard](https://img.shields.io/badge/画面-ダッシュボード-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/dashboard.html) |
| メンバー検索 | [![Members](https://img.shields.io/badge/画面-メンバー検索-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/members.html) |
| プロフィール詳細 | [![Profile View](https://img.shields.io/badge/画面-プロフィール詳細-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/profile-view.html) |
| プロフィール編集 | [![Profile Edit](https://img.shields.io/badge/画面-プロフィール編集-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/profile-edit.html) |
| 学習ログ | [![Learning Log](https://img.shields.io/badge/画面-学習ログ-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/learning-log.html) |
| 管理者ダッシュボード | [![Admin](https://img.shields.io/badge/画面-管理者-DC2626?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/admin.html) |
| 相談窓口 | [![Consultation](https://img.shields.io/badge/画面-相談窓口-4F46E5?style=for-the-badge&logo=html5&logoColor=white)](https://activefactor.github.io/talent-management-system-mock/mock/consultation.html) |

> **入口はログイン画面から。** デモ用ロール選択で「管理者 / シニア / 一般」を切り替えて確認できます。

---

## ロール別の確認ポイント

| ロール | 確認できること |
|---|---|
| **管理者 (admin)** | 全画面アクセス可 / 管理者ダッシュボード（スキルマップ・統計） |
| **シニア (senior)** | 相談窓口の受付設定 ON/OFF / 相談タグの編集 |
| **一般 (engineer)** | ダッシュボード・学習ログ記録・メンバー検索・プロフィール編集 |

---

## 技術スタック

| ライブラリ | バージョン | 用途 |
|---|---|---|
| [Alpine.js](https://alpinejs.dev/) | v3.14.1 | リアクティブ UI（ビルド不要） |
| [Tailwind CSS](https://tailwindcss.com/) | v4 (CDN) | ユーティリティ CSS |
| [Chart.js](https://www.chartjs.org/) | v4.4.0 | グラフ描画 |
| [Heroicons](https://heroicons.com/) | v2 (inline SVG) | アイコン |

---

## ファイル構成

```
talent-management-system-mock/
│
├── mock/                         # モック画面
│   ├── index.html                # S01: ログイン画面
│   ├── dashboard.html            # S02: 個人ダッシュボード
│   ├── profile-edit.html         # S03: プロフィール編集
│   ├── profile-view.html         # S04: プロフィール詳細
│   ├── members.html              # S05: メンバー検索
│   ├── learning-log.html         # S07/S08: 学習ログ入力・履歴
│   ├── admin.html                # S11: 管理者ダッシュボード
│   ├── consultation.html         # S10: 相談窓口
│   │
│   ├── css/
│   │   └── style.css             # カスタムスタイル（Tailwind補完）
│   │
│   └── js/
│       ├── data.js               # データ層（localStorage CRUD・シードデータ）
│       ├── auth.js               # 認証ヘルパー（ロール切替・guard関数）
│       └── common.js             # 共通ユーティリティ（ナビ・フォーマット・UI）
│
└── docs/                         # 設計ドキュメント
    ├── requirements.md           # 要件定義書
    ├── app-spec.md               # アプリケーション仕様書
    ├── DESIGN.md                 # デザインシステム
    ├── mock-rules.md             # モック開発ルール
    └── mock-design/              # 画面別設計書
        ├── overview.md           # 全体概要・データ型定義
        ├── step1-shared.md       # 共通基盤設計
        ├── step2-login.md        # ログイン画面設計
        ├── step3-dashboard.md    # ダッシュボード設計
        ├── step4-members.md      # メンバー検索設計
        ├── step5-profile.md      # プロフィール設計
        ├── step6-learning-log.md # 学習ログ設計
        ├── step7-admin.md        # 管理者画面設計
        └── step8-consultation.md # 相談窓口設計
```

---

## 画面説明

### S01 ログイン (`index.html`)
Microsoft SSO を想定したログイン画面。モックでは何を入力してもログイン可能。  
デモ用ロール選択（管理者 / シニア / 一般）でログイン後の表示が切り替わる。

### S02 ダッシュボード (`dashboard.html`)
ログインユーザーの学習サマリーを表示するホーム画面。
- 今週の活動時間・累計時間・ストリーク・バッジ数のサマリーカード
- GitHub スタイルの学習ヒートマップ（26週分）
- クイック記録フォーム（カテゴリ選択 → タイトル入力 → 記録）
- 次のバッジまでの進捗バー
- カテゴリ別学習時間のドーナツチャート
- 共通スキルを持つメンバーのレコメンド
- 相談受付中のシニアエンジニア一覧

### S05 メンバー検索 (`members.html`)
全メンバーをカード形式で一覧表示。スキル・氏名・部署での横断検索に対応。
- キーワード検索（スキル名・資格名・インタレストタグを横断）
- 部署・ロール・相談受付中でのフィルタリング
- 共通スキルの自動ハイライト（緑の枠 + フッターにスキル名表示）
- 件数リアルタイム更新

### S03/S04 プロフィール (`profile-view.html` / `profile-edit.html`)
エンジニアのスキル・資格・パーソナリティを表示・編集する画面。
- **スキルタブ**: カテゴリ別（言語 / FW / インフラ / ドメイン）のスキルレベルをドット表示
- **資格タブ**: 取得資格一覧。有効期限 3 ヶ月以内は amber で警告
- **パーソナリティタブ**: StrengthsFinder® レーダーチャート + MBTI 4 軸スライダー。公開範囲設定（全体 / senior以上 / 非公開）
- **活動タブ**: ヒートマップ + バッジコレクション（未取得はグレーアウト）
- 編集画面では未保存変更の離脱確認ダイアログあり

### S07/S08 学習ログ (`learning-log.html`)
学習記録の入力・履歴管理・集計を行う画面。
- カテゴリボタン（読書 / 資格勉強 / 個人開発 / 勉強会 / OJT / その他）
- 活動日・時間・メモ・タグの記録
- 過去 6 ヶ月のカテゴリ別積み上げ棒グラフ
- カテゴリ・期間（今月 / 先月 / 過去3ヶ月）でのフィルタリング
- ログ削除（確認ダイアログあり）

### S11 管理者ダッシュボード (`admin.html`)
`admin` ロール専用画面。組織全体のスキル状況を俯瞰する。
- 総ユーザー数・スキル登録数・今月のログ数・バッジ取得数のサマリー
- **スキルマップテーブル**: ユーザー × スキルのマトリクス表。カテゴリタブで絞り込み可能。レベルを色の濃淡で表現
- スキル別保有人数の横棒グラフ（Top 15）
- 直近 7 日間のアクティビティフィード
- メンバー一覧テーブル（スキル数・累計時間・バッジ数・相談状況）

### S10 相談窓口 (`consultation.html`)
相談受付中のシニアエンジニアを一覧表示する画面。
- 受付中のシニアを大カードで表示（得意分野タグ・自己紹介・累計時間）
- シニアロールでログイン時：受付 ON/OFF トグル + 相談タグ管理
- シニア全員のグリッド表示（受付停止中はグレーアウト）

---

## モック共通仕様

### データ永続化
- すべてのデータは `localStorage` に保存
- 初回アクセス時にシードデータ（8名・約840件の学習ログ）が自動生成される
- データリセット: ブラウザコンソールで `localStorage.clear(); location.reload()` を実行

### シードデータ（ダミーユーザー）

| ID | 氏名 | ロール | 部署 |
|---|---|---|---|
| u001 | 山田 太郎 | admin | 開発部 |
| u002 | 佐藤 花子 | senior | 開発部 |
| u003 | 田中 健一 | senior | インフラ部 |
| u004 | 鈴木 美咲 | engineer | 開発部 |
| u005 | 高橋 誠 | engineer | 開発部 |
| u006 | 伊藤 明 | engineer | QA部 |
| u007 | 渡辺 さくら | engineer | インフラ部 |
| u008 | 中村 大輔 | engineer | 開発部 |

### グローバル API（`window.TH`）

```javascript
TH.data     // データ CRUD（getUsers / saveUser / getLogs / addLog / deleteLog など）
TH.auth     // 認証（login / logout / getCurrentUser / guard / guardAdmin）
TH.nav      // ナビゲーション（go(screen, userId)）
TH.fmt      // フォーマット（totalHours / roleLabel / categoryLabel / categoryColor など）
TH.ui       // UI ヘルパー（renderSidebar / renderHeatmap / skillDotsHtml / toast）
TH.icons    // Heroicons SVG 文字列セット
```

---

## ローカルでの確認方法

ビルド不要です。`mock/index.html` をブラウザで直接開くか、簡易サーバーを使ってください。

```bash
# Python の場合
cd talent-management-system-mock
python3 -m http.server 8080
# → http://localhost:8080/mock/index.html

# Node.js の場合
npx serve .
# → http://localhost:3000/mock/index.html
```

---

## 設計ドキュメント

| ドキュメント | 内容 |
|---|---|
| [要件定義書](docs/requirements.md) | ユーザーストーリー・機能要件・画面一覧 |
| [アプリ仕様書](docs/app-spec.md) | 技術スタック・API設計・ERD・セキュリティ要件 |
| [デザインシステム](docs/DESIGN.md) | カラーパレット・コンポーネント仕様・アイコンセット |
| [モック開発ルール](docs/mock-rules.md) | localStorage キー定義・命名規則・更新ルール |
| [画面別設計書](docs/mock-design/overview.md) | Step 1〜8 の詳細設計（データ構造・HTML骨格・実装チェックリスト） |

---

## ライセンス

社内検討用モックです。外部公開・商用利用はご遠慮ください。
