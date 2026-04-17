# TalentHub アプリケーション仕様書

**バージョン**: 1.0.0
**作成日**: 2026-04-17
**ステータス**: 提案・レビュー中

---

## 目次

1. [システム構成](#1-システム構成)
2. [認証仕様（Microsoft SSO）](#2-認証仕様microsoft-sso)
3. [画面仕様](#3-画面仕様)
4. [API設計方針](#4-api設計方針)
5. [データモデル詳細](#5-データモデル詳細)
6. [セキュリティ要件](#6-セキュリティ要件)
7. [モック仕様（ダミーデータ）](#7-モック仕様ダミーデータ)
8. [あると良い機能・UX提案](#8-あると良い機能ux提案)
9. [技術スタック詳細](#9-技術スタック詳細)
10. [開発フェーズ計画](#10-開発フェーズ計画)
11. [運用・保守方針](#11-運用保守方針)

---

## 1. システム構成

### 1.1 アーキテクチャ概要

```
┌──────────────────────────────────────────────────────┐
│                    クライアント                         │
│          ブラウザ (PC / スマートフォン)                  │
└────────────────────┬─────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼─────────────────────────────────┐
│               Next.js (App Router)                    │
│     フロントエンド + BFF (API Routes / Server Actions) │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Pages/UI │  │  State   │  │  Auth (NextAuth)  │   │
│  │ (React)  │  │ (Zustand)│  │  MS Entra ID SSO  │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└────────────────────┬─────────────────────────────────┘
                     │ Internal
┌────────────────────▼─────────────────────────────────┐
│                  バックエンド                           │
│              (Next.js API Routes)                     │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │  REST API    │  │  Prisma ORM  │                  │
│  │  (tRPC検討)  │  │              │                  │
│  └──────────────┘  └──────┬───────┘                  │
└─────────────────────────── │ ───────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────┐
│                  データ層                              │
│   PostgreSQL (Supabase)  │  Cloudflare R2 (画像)      │
└──────────────────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│               外部サービス                              │
│   Microsoft Entra ID (旧Azure AD) - SSO認証            │
└──────────────────────────────────────────────────────┘
```

### 1.2 構成の選定理由

| 選定項目 | 理由 |
|---|---|
| Next.js モノレポ | フロントとAPIを1リポジトリで管理でき、小規模チームで効率的 |
| Supabase (PostgreSQL) | マネージドDB＋Row Level Security で細粒度のアクセス制御が容易 |
| NextAuth.js | Microsoft Entra ID SSO との統合が公式サポートされている |
| Tailwind CSS | 短期間での一貫したUIデザイン実装に適している |
| Cloudflare R2 | S3互換・低コストのオブジェクトストレージ |

---

## 2. 認証仕様（Microsoft SSO）

### 2.1 認証フロー

```
ユーザー                  TalentHub                 Microsoft Entra ID
   │                         │                              │
   │  ① ログインボタン押下    │                              │
   │─────────────────────────▶│                              │
   │                         │  ② 認証リクエスト（OAuth2）   │
   │                         │──────────────────────────────▶│
   │                         │                              │
   │  ③ MSログイン画面にリダイレクト                          │
   │◀────────────────────────────────────────────────────────│
   │                         │                              │
   │  ④ MS認証（MFA含む）     │                              │
   │─────────────────────────────────────────────────────────▶│
   │                         │                              │
   │                         │  ⑤ 認可コード返却             │
   │                         │◀─────────────────────────────│
   │                         │                              │
   │                         │  ⑥ アクセストークン取得       │
   │                         │──────────────────────────────▶│
   │                         │                              │
   │                         │  ⑦ ユーザー情報（email等）返却 │
   │                         │◀─────────────────────────────│
   │                         │                              │
   │                         │  ⑧ DB照合・セッション発行     │
   │  ⑨ ダッシュボードへ遷移  │                              │
   │◀─────────────────────────│                              │
```

### 2.2 実装仕様

#### 使用ライブラリ
- **NextAuth.js v5** (Auth.js)
- プロバイダー: `MicrosoftEntraID` (旧 AzureAD Provider)

#### 必要な Azure / Entra ID 設定

| 設定項目 | 内容 |
|---|---|
| アプリ登録 | Azure Portal でアプリ登録、クライアントID・シークレット取得 |
| リダイレクトURI | `https://<domain>/api/auth/callback/microsoft-entra-id` |
| APIアクセス許可 | `openid`, `profile`, `email`, `User.Read` |
| テナント設定 | 自社テナントIDを指定（社内ユーザーのみ許可） |

#### 初回ログイン時の処理

1. Entra ID からのユーザー情報（email, name, id）でDBにユーザーレコード作成
2. デフォルトロールは `engineer` で作成
3. 管理者がロールを後から変更可能
4. 同一メールアドレスでの重複登録を防止

#### セッション管理

| 項目 | 設定値 | 備考 |
|---|---|---|
| セッション方式 | JWT（stateless） | スケールアウト対応 |
| アクセストークン有効期限 | 1時間 | |
| リフレッシュトークン有効期限 | 24時間 | 操作継続中は自動更新 |
| 非操作タイムアウト | 8時間 | 業務時間外での自動ログアウト |

### 2.3 モックでの認証回避

モック動作確認用として、以下の「開発用バイパス」を環境変数で切り替え可能にする。

```bash
# .env.local (開発環境のみ)
NEXT_PUBLIC_MOCK_AUTH=true
MOCK_USER_ROLE=admin  # admin / senior / engineer を切り替え可能
```

- `MOCK_AUTH=true` の場合、SSOをスキップしてダミーユーザーでログイン
- 本番ビルドでは `MOCK_AUTH` は無効化（ビルド時に除去）

---

## 3. 画面仕様

### 3.1 画面遷移図

```
[ログイン画面 S01]
        │ SSO認証成功
        ├──── admin ────────▶ [管理者ダッシュボード S11]
        │                           ├──▶ [スキルマップ S06]
        │                           ├──▶ [ユーザー管理 S12]
        │                           └──▶ [マスターデータ管理 S13]
        │
        └──── engineer/senior ──▶ [個人ダッシュボード S02]
                                        ├──▶ [プロフィール詳細 S04]
                                        │         └──▶ [プロフィール編集 S03]
                                        ├──▶ [メンバー一覧・検索 S05]
                                        │         └──▶ [プロフィール詳細 S04]
                                        ├──▶ [学習ログ入力 S07]
                                        ├──▶ [学習ログ履歴 S08]
                                        ├──▶ [バッジ一覧 S09]
                                        └──▶ [相談窓口一覧 S10]
```

### 3.2 共通レイアウト

#### ナビゲーション（サイドバー）

```
┌─────────────────┐
│  🏢 TalentHub   │
├─────────────────┤
│ [avatar] 山田太郎 │
│ エンジニア / 開発部│
├─────────────────┤
│ ■ ダッシュボード  │
│ ■ メンバー検索   │
│ ■ 学習ログ       │
│ ■ 相談窓口       │
│ ■ バッジ         │
├─────────────────┤
│ ─── 管理者のみ ── │
│ ■ スキルマップ   │
│ ■ ユーザー管理   │
├─────────────────┤
│ 設定 / ログアウト │
└─────────────────┘
```

### 3.3 主要画面の仕様

#### S01: ログイン画面

- TalentHub ロゴ・システム名
- 「Microsoftアカウントでログイン」ボタン（1ボタンのみ）
- ローディング表示（認証中のスピナー）
- 社内システムである旨の注記（「社内エンジニア専用」）

#### S02: 個人ダッシュボード

| ウィジェット | 内容 |
|---|---|
| 今週のサマリー | 今週の活動時間・ログ記録日数・ストリーク日数 |
| クイック記録 | 学習ログの簡易入力フォーム（カテゴリ・時間・タイトルのみ） |
| 累計時間カード | 総累計時間・今月累計時間をカード表示 |
| 活動ヒートマップ | 直近52週分のカレンダーヒートマップ |
| 獲得バッジ | 直近取得バッジ + 次のバッジまでの進捗バー |
| おすすめメンバー | 共通スキル・興味タグが一致する社員カード（3〜5件） |
| 相談できる先輩 | 相談受付中のシニアエンジニアカード（3件） |

#### S03: プロフィール編集画面

タブで情報種別を切り替える構成：

| タブ | 編集内容 |
|---|---|
| 基本情報 | 氏名・部署・役職・入社年・自己紹介・GitHub・取り組み中のこと |
| スキル | 言語・FW・インフラ・習熟度（追加・削除・スター評価） |
| 資格 | 資格名・取得年月・有効期限（追加・編集・削除） |
| パーソナリティ | ストレングスファインダー TOP5・MBTI・公開範囲設定 |
| 相談設定 | 相談受付フラグ・受付分野タグ（seniorロールのみ表示） |

- 変更は「保存」ボタン押下時にAPIコール
- バリデーションエラーはインラインで表示
- 未保存の変更がある場合、ページ離脱時に確認ダイアログを表示

#### S04: プロフィール詳細画面

- ヘッダー: アバター・氏名・部署・役職・GitHubリンク
- スキルタグ一覧（習熟度別色分け）
- 資格一覧
- パーソナリティセクション（公開設定に応じて表示制御）
  - ストレングスファインダー: 4領域レーダーチャート + 傾向コメント
  - MBTI: タイプバッジ + 4軸バーグラフ + 特徴サマリー
  - 複合分析コメント（両方登録時のみ）
- 活動サマリー: 累計時間・バッジ（公開設定に応じる）
- 自分のプロフィールの場合は「編集」ボタンを表示

#### S05: メンバー一覧・検索画面

- 検索バー（スキル名・資格名・氏名・部署で横断検索）
- フィルター: 部署 / スキル / ロール / 相談受付中
- ソート: 入社年 / スキル数 / 累計学習時間
- カード形式で一覧表示
  - アバター・氏名・部署・役職
  - スキルタグ上位3件
  - 累計学習時間・バッジ数
- 共通点ハイライト: 自分と共通するスキル・興味にマーカー表示

#### S07: 学習ログ入力

- カテゴリ選択（アイコン付きボタン形式）
- タイトル入力（テキスト）
- 活動時間（スライダー or 数値入力、15分刻み）
- 活動日（デフォルト今日、カレンダーピッカー）
- タグ入力（サジェスト付き）
- メモ（テキストエリア、任意）
- 保存後にダッシュボードへ戻り、ヒートマップが更新される

#### S06: スキルマップ（管理者）

- 部署セレクター
- スキル種別タブ（言語 / FW / インフラ）
- ヒートマップ: 縦軸=社員名、横軸=スキル、セル=習熟度（色濃度）
- サマリーグラフ: スキル別保有人数の棒グラフ
- CSV エクスポートボタン

---

## 4. API設計方針

### 4.1 エンドポイント一覧（主要）

| メソッド | パス | 説明 | 認可 |
|---|---|---|---|
| GET | `/api/users` | ユーザー一覧取得（検索・フィルター） | 全ロール |
| GET | `/api/users/[id]` | ユーザー詳細取得 | 全ロール |
| PATCH | `/api/users/[id]` | ユーザー情報更新 | 本人 or admin |
| GET | `/api/users/me` | 自分のユーザー情報 | 全ロール |
| GET | `/api/users/[id]/skills` | スキル一覧 | 全ロール |
| POST | `/api/users/[id]/skills` | スキル追加 | 本人 |
| DELETE | `/api/users/[id]/skills/[skillId]` | スキル削除 | 本人 |
| GET | `/api/users/[id]/certifications` | 資格一覧 | 全ロール |
| POST | `/api/users/[id]/certifications` | 資格追加 | 本人 |
| PATCH | `/api/users/[id]/certifications/[certId]` | 資格更新 | 本人 |
| DELETE | `/api/users/[id]/certifications/[certId]` | 資格削除 | 本人 |
| GET | `/api/users/[id]/personality` | パーソナリティ情報 | 公開設定に準拠 |
| PATCH | `/api/users/[id]/personality` | パーソナリティ情報更新 | 本人 |
| GET | `/api/learning-logs` | 自分のログ一覧 | 本人 |
| POST | `/api/learning-logs` | ログ記録 | 全ロール |
| DELETE | `/api/learning-logs/[logId]` | ログ削除 | 本人 |
| GET | `/api/learning-logs/summary` | ログ集計（累計・ヒートマップ用） | 本人 |
| GET | `/api/badges` | バッジマスター一覧 | 全ロール |
| GET | `/api/users/[id]/badges` | ユーザーの獲得バッジ | 全ロール |
| GET | `/api/admin/skill-map` | スキルマップデータ | admin |
| GET | `/api/admin/users` | 全ユーザー一覧（管理者用） | admin |
| PATCH | `/api/admin/users/[id]/role` | ロール変更 | admin |

### 4.2 レスポンス形式

```json
// 成功
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}

// エラー
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "この操作を行う権限がありません"
  }
}
```

### 4.3 認可チェック方針

- すべてのAPIエンドポイントはミドルウェアでセッション確認
- リソースへのアクセスは「本人か admin のみ更新可」をサーバー側で検証
- パーソナリティ情報は `visibility_setting` に従ってフィールドを返却

---

## 5. データモデル詳細

### 5.1 ERD（概念）

```
users
  id (UUID PK)
  ms_entra_id (VARCHAR UNIQUE) ← Microsoft Entra IDのobjId
  email (VARCHAR UNIQUE)
  name (VARCHAR)
  avatar_url (VARCHAR)
  role (ENUM: admin/senior/engineer)
  department (VARCHAR)
  grade (VARCHAR)
  join_year (INT)
  bio (TEXT)
  github_account (VARCHAR)
  current_focus (VARCHAR)
  is_accepting_consultation (BOOLEAN) ← seniorのみ有効
  consultation_tags (TEXT[])
  created_at, updated_at

skills
  id (UUID PK)
  user_id (FK → users)
  category (ENUM: language/framework/infra/methodology/domain)
  name (VARCHAR)
  level (INT 1-5)
  created_at, updated_at

certifications
  id (UUID PK)
  user_id (FK → users)
  name (VARCHAR)
  issuer (VARCHAR)
  acquired_at (DATE)
  expires_at (DATE nullable)
  cert_image_url (VARCHAR nullable)
  created_at, updated_at

personality_profiles
  id (UUID PK)
  user_id (FK → users UNIQUE)
  strengths_top5 (TEXT[5])
  mbti_type (VARCHAR nullable)
  visibility (ENUM: public/role_limited/private)
  created_at, updated_at

learning_logs
  id (UUID PK)
  user_id (FK → users)
  category (ENUM: reading/certification/personal_dev/study_group/ojt/other)
  title (VARCHAR)
  duration_minutes (INT)
  logged_at (DATE)
  memo (TEXT nullable)
  created_at, updated_at

log_tags
  log_id (FK → learning_logs)
  tag (VARCHAR)
  PRIMARY KEY (log_id, tag)

badges
  id (UUID PK)
  code (VARCHAR UNIQUE) ← "hours_10", "certs_1" 等
  name (VARCHAR)
  description (TEXT)
  category (ENUM: hours/certifications/streak/profile)
  threshold (INT)
  icon_url (VARCHAR)

user_badges
  user_id (FK → users)
  badge_id (FK → badges)
  earned_at (TIMESTAMP)
  PRIMARY KEY (user_id, badge_id)
```

---

## 6. セキュリティ要件

### 6.1 認証・認可

| 要件 | 実装方法 | 優先度 |
|---|---|---|
| Microsoft SSO のみを認証手段とする | NextAuth.js MicrosoftEntraID プロバイダー | 必須 |
| テナント制限（自社のみ許可） | Entra ID アプリ設定でテナントID指定 | 必須 |
| JWTの署名検証 | NextAuth.js が自動処理 | 必須 |
| ロールベースアクセス制御（RBAC） | APIミドルウェアでのロール検証 | 必須 |
| 本人確認（自分のデータのみ更新可） | APIでセッションユーザーIDとリソースIDを照合 | 必須 |
| 管理者操作ログ | adminが行った変更を audit_logs テーブルに記録 | 推奨 |

### 6.2 通信・データ保護

| 要件 | 実装方法 | 優先度 |
|---|---|---|
| HTTPS強制 | ホスティング側でHTTPSリダイレクト | 必須 |
| SQLインジェクション対策 | Prisma のパラメータ化クエリ | 必須 |
| XSS対策 | Next.js のデフォルトエスケープ + DOMPurify（任意入力箇所） | 必須 |
| CSRF対策 | Next.js App Router + Server Actions（組み込み保護） | 必須 |
| 機密フィールドのアクセス制御 | パーソナリティ情報はvisibility設定をサーバー側で判定 | 必須 |
| ファイルアップロード検証 | MIMEタイプ・ファイルサイズ上限チェック（画像: 5MB以内） | 必須 |
| 環境変数の秘匿 | `.env` をGit管理外、本番は環境変数で注入 | 必須 |

### 6.3 プライバシー・個人情報保護

| 要件 | 内容 |
|---|---|
| パーソナリティ情報の公開制御 | ユーザー自身が「全体公開 / ロール限定 / 非公開」を選択可能 |
| データ削除権 | ユーザーが自アカウントのデータ削除をリクエスト可能（admin が実行） |
| 表示範囲の明示 | プロフィール編集時に各情報の公開範囲を視覚的に明示 |
| 第三者への提供禁止 | 本システム内でのみ使用する旨を利用規約・初回ログイン時に明示 |

### 6.4 監査ログ

```sql
-- 管理者操作ログテーブル
audit_logs
  id (UUID PK)
  actor_user_id (FK → users)
  action (VARCHAR)  -- "role_changed", "user_disabled", etc.
  target_user_id (FK → users nullable)
  old_value (JSONB nullable)
  new_value (JSONB nullable)
  ip_address (VARCHAR)
  created_at (TIMESTAMP)
```

---

## 7. モック仕様（ダミーデータ）

### 7.1 ダミーユーザー一覧

モックでは以下のサンプルユーザーを事前に用意する。

| ID | 氏名 | ロール | 部署 | 役職 | 入社年 | MBTI |
|---|---|---|---|---|---|---|
| u001 | 山田 太郎 | admin | 開発部 | 部長 | 2015 | ENTJ |
| u002 | 佐藤 花子 | senior | 開発部 | テックリード | 2017 | INTJ |
| u003 | 田中 健一 | senior | インフラ部 | シニアエンジニア | 2018 | ISTJ |
| u004 | 鈴木 美咲 | engineer | 開発部 | エンジニア | 2021 | ENFP |
| u005 | 高橋 拓也 | engineer | 開発部 | エンジニア | 2022 | INTP |
| u006 | 伊藤 さくら | engineer | QA部 | QAエンジニア | 2023 | ISFJ |
| u007 | 渡辺 龍一 | engineer | インフラ部 | エンジニア | 2023 | ISTP |
| u008 | 中村 朱音 | engineer | 開発部 | エンジニア | 2024 | ENFJ |

### 7.2 ダミースキルデータ

**佐藤 花子（テックリード）のスキル例**

```json
{
  "skills": [
    { "category": "language", "name": "TypeScript", "level": 5 },
    { "category": "language", "name": "Go", "level": 4 },
    { "category": "language", "name": "Python", "level": 3 },
    { "category": "framework", "name": "Next.js", "level": 5 },
    { "category": "framework", "name": "React", "level": 5 },
    { "category": "infra", "name": "AWS", "level": 4 },
    { "category": "infra", "name": "Docker", "level": 4 },
    { "category": "domain", "name": "フィンテック", "level": 3 }
  ],
  "certifications": [
    { "name": "AWS Solutions Architect Professional", "acquired_at": "2023-06" },
    { "name": "情報処理安全確保支援士", "acquired_at": "2022-10" }
  ],
  "personality": {
    "strengths_top5": ["戦略性", "着想", "分析思考", "学習欲", "収集心"],
    "mbti_type": "INTJ",
    "visibility": "public"
  }
}
```

**鈴木 美咲（若手エンジニア）のスキル例**

```json
{
  "skills": [
    { "category": "language", "name": "TypeScript", "level": 3 },
    { "category": "language", "name": "Python", "level": 3 },
    { "category": "framework", "name": "React", "level": 3 },
    { "category": "framework", "name": "FastAPI", "level": 2 },
    { "category": "infra", "name": "Docker", "level": 2 }
  ],
  "certifications": [
    { "name": "基本情報技術者試験", "acquired_at": "2020-10" },
    { "name": "AWS Cloud Practitioner", "acquired_at": "2023-03" }
  ],
  "personality": {
    "strengths_top5": ["個別化", "共感性", "ポジティブ", "活発性", "コミュニケーション"],
    "mbti_type": "ENFP",
    "visibility": "public"
  }
}
```

### 7.3 ダミー学習ログ

各ユーザーに対し過去3ヶ月分のログを生成する。

```json
[
  { "user_id": "u004", "category": "reading", "title": "Rustプログラミング入門を読んだ", "duration_minutes": 60, "logged_at": "2026-04-16", "tags": ["Rust"] },
  { "user_id": "u004", "category": "certification", "title": "AWS SAA 模擬試験を解いた", "duration_minutes": 90, "logged_at": "2026-04-15", "tags": ["AWS", "資格"] },
  { "user_id": "u004", "category": "study_group", "title": "社内勉強会「Next.js App Router 入門」に参加", "duration_minutes": 120, "logged_at": "2026-04-14", "tags": ["Next.js"] },
  { "user_id": "u004", "category": "personal_dev", "title": "個人プロダクトのDB設計", "duration_minutes": 45, "logged_at": "2026-04-13", "tags": ["PostgreSQL"] }
]
```

### 7.4 ダミーバッジ取得状況

| ユーザー | バッジ |
|---|---|
| 佐藤 花子 | 100時間達成・300時間達成・資格マスター・30日ストリーク・プロフィール完成・パーソナリティ公開 |
| 田中 健一 | 100時間達成・資格コレクター・7日ストリーク・プロフィール完成 |
| 鈴木 美咲 | 50時間達成・はじめての資格・資格コレクター・7日ストリーク・パーソナリティ公開 |
| 高橋 拓也 | 10時間達成・はじめての資格 |

---

## 8. あると良い機能・UX提案

### 8.1 UX改善提案

| 提案 | 内容 | 優先度 |
|---|---|---|
| **オンボーディングウィザード** | 初回ログイン時にプロフィール入力を誘導する5ステップのウィザード | 高 |
| **プロフィール入力率インジケーター** | プロフィール完成度を%で表示し、未入力項目へのショートカットを提示 | 高 |
| **次のバッジ進捗バー** | 「あと○時間で次のバッジ！」のような進捗を常時表示 | 高 |
| **ログ記録の習慣化リマインダー** | 2日以上ログ未記録の場合、ダッシュボードにやわらかい通知を表示 | 中 |
| **クイック記録（+ボタン）** | 全画面から固定フローティングボタンで学習ログ記録モーダルを起動 | 中 |
| **「今日のひとこと」機能** | ダッシュボードに一言共有できるフィールドを設置し、チームの雰囲気を可視化 | 低 |

### 8.2 コミュニケーション促進機能

| 提案 | 内容 | フェーズ |
|---|---|---|
| **「いいね」/ 共感リアクション** | 他ユーザーのログ・バッジ取得に絵文字リアクションできる | Phase2 |
| **相談スレッド** | シニアエンジニアへの相談をシステム内で管理できる（Slack通知連携） | Phase2 |
| **週間ランキング** | 週の学習時間ランキングをダッシュボードに表示（任意参加） | Phase2 |
| **スキル交換掲示板** | 「TypeScriptを教えます ⇄ AWSを教えてほしい」のような告知板 | Phase3 |

### 8.3 管理者向け機能強化

| 提案 | 内容 | フェーズ |
|---|---|---|
| **定期レポート自動生成** | 月次でスキルサマリーレポートをPDF生成・管理者メール送信 | Phase2 |
| **スキルギャップ警告** | 必要スキルの保有者が少ない場合にダッシュボードで警告表示 | Phase2 |
| **研修・資格取得推薦** | スキルギャップをもとに、社員個人に対し推薦資格を提示 | Phase3 |

### 8.4 アクセシビリティ対応

| 対応項目 | 内容 |
|---|---|
| キーボード操作 | すべての主要操作をキーボードのみで完結可能 |
| スクリーンリーダー対応 | ARIA属性の適切な付与 |
| カラーコントラスト | WCAG 2.1 AA 基準への準拠 |
| フォントサイズ | ユーザー設定のブラウザフォントサイズを尊重 |

---

## 9. 技術スタック詳細

### 9.1 確定技術スタック

| 領域 | 技術 | バージョン | 選定理由 |
|---|---|---|---|
| フレームワーク | Next.js (App Router) | 15.x | SSR/SSG・API Routes・Server Actions を統合管理 |
| 言語 | TypeScript | 5.x | 型安全・チーム開発での品質維持 |
| スタイリング | Tailwind CSS | 4.x | 高速UI実装・設計の一貫性 |
| UIコンポーネント | shadcn/ui | latest | Tailwind基盤・アクセシブル・カスタマイズ容易 |
| グラフ | Recharts | 2.x | React統合が容易・レスポンシブ対応 |
| 認証 | NextAuth.js (Auth.js) | v5 | MS Entra ID SSO の公式サポート |
| ORM | Prisma | 6.x | 型安全なDB操作・マイグレーション管理 |
| DB | PostgreSQL (Supabase) | 16.x | マネージド・RLS対応・無料枠あり |
| バリデーション | Zod | 3.x | スキーマ定義の共有（フロント・バック） |
| 状態管理 | Zustand | 5.x | 軽量・シンプルなグローバル状態管理 |
| ファイルストレージ | Cloudflare R2 | - | S3互換・低コスト・無料枠大 |
| テスト | Vitest + Playwright | latest | ユニット + E2E テスト |
| CI/CD | GitHub Actions | - | 自動テスト・Vercelへのデプロイ |
| ホスティング | Vercel | - | Next.js最適化・プレビューデプロイ |

### 9.2 開発環境セットアップ

```bash
# リポジトリ構成（モノレポ）
talent-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 認証関連ページ
│   │   ├── (dashboard)/        # ダッシュボード
│   │   ├── members/            # メンバー一覧・詳細
│   │   ├── profile/            # プロフィール編集
│   │   ├── learning-logs/      # 学習ログ
│   │   ├── admin/              # 管理者画面
│   │   └── api/                # API Routes
│   ├── components/             # 共通コンポーネント
│   ├── lib/                    # ユーティリティ・クライアント
│   ├── hooks/                  # カスタムフック
│   └── types/                  # 型定義
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # ダミーデータ投入スクリプト
├── docs/                       # 本ドキュメント群
├── .env.example
└── package.json
```

---

## 10. 開発フェーズ計画

### 10.1 フェーズ概要

```
Phase 0: 環境構築・モック
    ↓
Phase 1: MVP（コア機能）
    ↓
Phase 2: エンゲージメント強化
    ↓
Phase 3: 高度化・連携
```

### 10.2 Phase 0: 環境構築・インタラクティブモック（2〜3週間）

**目標**: ステークホルダーへのデモができる動くモックの完成

| タスク | 詳細 | 工数目安 |
|---|---|---|
| プロジェクト初期構築 | Next.js / Prisma / Tailwind のセットアップ | 0.5日 |
| DBスキーマ設計・適用 | Prismaスキーマ作成 + Supabaseへのマイグレーション | 1日 |
| ダミーデータ投入 | seed.ts でダミーユーザー・スキル・ログを投入 | 0.5日 |
| モック認証 | 環境変数でSSO回避・ロール切り替え対応 | 0.5日 |
| 個人ダッシュボード | ウィジェット配置・ヒートマップ・バッジ表示 | 2日 |
| プロフィール画面 | 詳細表示 + 編集（基本情報・スキル・資格） | 2日 |
| メンバー一覧 | 検索・フィルター・カード表示 | 1日 |
| 学習ログ入力 | フォーム + 保存後更新 | 1日 |
| 管理者スキルマップ | ヒートマップ表示 | 1日 |
| **合計** | | **約9〜10日** |

### 10.3 Phase 1: MVP（6〜8週間）

**目標**: 社内での実運用開始（限定リリース）

| カテゴリ | タスク |
|---|---|
| 認証 | Microsoft Entra ID SSO 本番接続 |
| ユーザー管理 | 招待・有効化・ロール変更（管理者画面） |
| プロフィール | アバター画像アップロード（R2連携） |
| パーソナリティ | ストレングスファインダー・MBTI 登録・表示・レーダーチャート |
| バッジ | バッジ自動付与ロジック・取得時通知 |
| スキルマップ | CSVエクスポート |
| テスト | 主要機能のユニットテスト・E2Eテスト |
| セキュリティ | RBAC・XSS・CSRF 対策の最終確認 |
| デプロイ | 本番環境構築（Vercel + Supabase） |

### 10.4 Phase 2: エンゲージメント強化（Phase1完了後 2〜3ヶ月）

| タスク |
|---|
| リアクション機能（いいね・共感） |
| 相談リクエスト（Slack通知連携） |
| 週間学習ランキング |
| AI分析コメント（Claude API 連携） |
| 月次レポート自動生成 |
| Google SSO 追加 |

### 10.5 Phase 3: 高度化・連携（長期ロードマップ）

| タスク |
|---|
| 1on1記録・フォローアップ |
| 目標設定・OKR管理 |
| キャリアパス可視化 |
| スキル交換掲示板 |
| 研修・資格推薦エンジン |

### 10.6 リリース判定基準

| フェーズ | 判定基準 |
|---|---|
| Phase 0 → Phase 1 | ステークホルダーデモで承認を得られること |
| Phase 1 リリース | E2Eテスト全件パス・セキュリティレビュー完了・管理者によるUATパス |
| Phase 2 リリース | Phase 1 の利用率 60%以上・ユーザーフィードバック対応完了 |

---

## 11. 運用・保守方針

### 11.1 環境構成

| 環境 | 用途 | URL例 |
|---|---|---|
| development | ローカル開発 | `localhost:3000` |
| staging | 結合テスト・デモ | `staging.talenthub.internal` |
| production | 本番 | `talenthub.internal` |

### 11.2 デプロイフロー

```
feature/* ブランチ
        │
        │ PR作成
        ▼
    GitHub Actions
    ├── lint / type-check
    ├── unit test (Vitest)
    └── E2E test (Playwright)
        │
        │ テストパス後
        ▼
      develop ブランチ → staging 自動デプロイ
        │
        │ リリース承認後
        ▼
       main ブランチ → production デプロイ
```

### 11.3 モニタリング

| 項目 | ツール |
|---|---|
| エラー監視 | Sentry |
| パフォーマンス | Vercel Analytics |
| アップタイム監視 | Better Uptime（または Vercel の自動アラート） |
| DBモニタリング | Supabase ダッシュボード |

### 11.4 バックアップ

- Supabase の自動バックアップ（日次）を利用
- 画像（R2）は Cloudflare の冗長構成に依存
- 重要な設定変更前に手動バックアップを取得

---

*本仕様書はモック開発〜Phase 1 を主な対象としている。フェーズ進行に伴い随時更新すること。*
