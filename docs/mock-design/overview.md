# TalentHub モック 全体設計書

**バージョン**: 1.0.0
**作成日**: 2026-04-17
**参照元**: requirements.md / app-spec.md / DESIGN.md

---

## 1. 目的

ステークホルダーとのUIイメージすり合わせ用のインタラクティブモック。
セッションをまたいで段階的に実装できるよう、ステップごとに設計書を分割している。

---

## 2. ファイル構成（完成形）

```
mock/
├── index.html            # S01: ログイン画面
├── dashboard.html        # S02: 個人ダッシュボード
├── members.html          # S05: メンバー一覧・検索
├── profile-view.html     # S04: プロフィール詳細（他ユーザー閲覧）
├── profile-edit.html     # S03: プロフィール編集（自分）
├── learning-log.html     # S07/S08: 学習ログ入力・履歴
├── consultation.html     # S10: 相談窓口一覧
├── admin.html            # S11/S06: 管理者ダッシュボード＋スキルマップ
├── css/
│   └── style.css         # 共通スタイル（Tailwindで補えないもの）
└── js/
    ├── data.js           # シードデータ定義 + localStorage CRUD
    ├── auth.js           # モック認証ヘルパー
    └── common.js         # 共通ユーティリティ・ナビ生成
```

---

## 3. 技術スタック（全ファイル共通）

各HTMLファイルの `<head>` には以下を必ず含める：

```html
<!-- Tailwind CSS (CDN) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Alpine.js (CDN) - defer必須 -->
<script defer src="https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js"></script>

<!-- Chart.js (CDN) - チャートを使う画面のみ -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- 共通JS (順番重要) -->
<script src="js/data.js"></script>
<script src="js/auth.js"></script>
<script src="js/common.js"></script>

<!-- 共通CSS -->
<link rel="stylesheet" href="css/style.css">
```

**Tailwind設定（各ファイルのhead内）**:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: { primary: '#4F46E5' }
      }
    }
  }
</script>
```

---

## 4. データ共有方式（localStorage）

画面間のデータ共有はすべて `localStorage` を通じて行う。

### キー一覧

| キー | 型 | 内容 |
|---|---|---|
| `th_users` | `User[]` | 全ユーザー情報（スキル・資格・パーソナリティ含む） |
| `th_logs` | `LearningLog[]` | 全学習ログ |
| `th_current_user_id` | `string` | 現在ログイン中のユーザーID |
| `th_viewing_user_id` | `string` | プロフィール表示中のユーザーID |

### 操作関数（`js/data.js` に実装）

```javascript
TH.data.getUsers()               // User[] 全ユーザー取得
TH.data.getUserById(id)          // User 単体取得
TH.data.saveUser(user)           // User 更新（IDで上書き）
TH.data.getLogs(userId?)         // LearningLog[] 取得（userIdで絞り込み可）
TH.data.addLog(log)              // LearningLog 追加
TH.data.deleteLog(logId)         // LearningLog 削除
TH.data.reset()                  // 全データをシードに戻す
```

---

## 5. 画面間ナビゲーション

各ページからの遷移はすべて `window.location.href` による通常遷移。

```javascript
// common.js に定義
TH.nav.go('dashboard')           // → dashboard.html
TH.nav.go('members')             // → members.html
TH.nav.go('profile-view', id)    // → profile-view.html?userId=u002
TH.nav.go('profile-edit')        // → profile-edit.html
TH.nav.go('learning-log')        // → learning-log.html
TH.nav.go('consultation')        // → consultation.html
TH.nav.go('admin')               // → admin.html
TH.nav.go('login')               // → index.html
```

---

## 6. 共通UIパーツ（common.js で生成）

### サイドバー

`TH.ui.renderSidebar(containerId, activeScreen)` を呼ぶことで共通サイドバーを挿入。
```javascript
// 各ページのAlpine init内で呼ぶ
TH.ui.renderSidebar('sidebar', 'dashboard')
```

**サイドバー構成**:
```
[ロゴ]
[ユーザー名・部署・ロール]
─────────────
■ ダッシュボード   → dashboard.html
■ メンバー検索     → members.html
■ 学習ログ        → learning-log.html
■ 相談窓口        → consultation.html
─────────────
(adminのみ)
■ スキルマップ     → admin.html
■ ユーザー管理     → admin.html#users
─────────────
[ログアウト]       → index.html
```

### トースト通知

```javascript
TH.ui.toast('保存しました', 'success')  // 緑
TH.ui.toast('エラーが発生しました', 'error')  // 赤
```

---

## 7. 認証フロー（モック）

```
index.html (ログイン)
  ↓ ボタン押下（何を入力してもOK）
  ↓ 選択されたロールのユーザーを currentUser にセット
  ↓ th_current_user_id を localStorage に保存
dashboard.html
```

**ロール別デフォルトユーザー**:
- `admin` → u001（山田 太郎）
- `senior` → u002（佐藤 花子）
- `engineer` → u004（鈴木 美咲）

**認証ガード（auth.js）**:
各ページの init 時に `TH.auth.guard()` を呼ぶ。
ログインしていない場合（`th_current_user_id` が空）は `index.html` にリダイレクト。

---

## 8. ステップ一覧と実装順序

| ステップ | 設計書 | 対象ファイル | 優先度 |
|---|---|---|---|
| Step 1 | step1-shared.md | `css/style.css` / `js/data.js` / `js/auth.js` / `js/common.js` | 最高（他すべての前提） |
| Step 2 | step2-login.md | `index.html` | 最高 |
| Step 3 | step3-dashboard.md | `dashboard.html` | 高 |
| Step 4 | step4-members.md | `members.html` | 高 |
| Step 5 | step5-profile.md | `profile-view.html` / `profile-edit.html` | 高 |
| Step 6 | step6-learning-log.md | `learning-log.html` | 中 |
| Step 7 | step7-admin.md | `admin.html` | 中 |
| Step 8 | step8-consultation.md | `consultation.html` | 低 |

**推奨実装順**: Step1 → Step2 → Step3 → Step5 → Step4 → Step6 → Step7 → Step8

---

## 9. データ型定義

```typescript
type Role = 'admin' | 'senior' | 'engineer'
type SkillCategory = 'language' | 'framework' | 'infra' | 'methodology' | 'domain'
type LogCategory = 'reading' | 'certification' | 'personal_dev' | 'study_group' | 'ojt' | 'other'
type Visibility = 'public' | 'role_limited' | 'private'

interface User {
  id: string                      // 'u001'
  name: string
  email: string
  role: Role
  department: string
  grade: string
  joinYear: number
  bio: string
  github: string
  currentFocus: string
  interestTags: string[]
  isAcceptingConsultation: boolean
  consultationTags: string[]
  skills: Skill[]
  certifications: Certification[]
  personality: PersonalityProfile
}

interface Skill {
  id: string                      // 's001'
  category: SkillCategory
  name: string
  level: number                   // 1〜5
}

interface Certification {
  id: string                      // 'c001'
  name: string
  issuer: string
  acquiredAt: string              // 'YYYY-MM'
  expiresAt: string | null
}

interface PersonalityProfile {
  strengthsTop5: string[]         // 最大5件
  mbtiType: string | null         // 'INTJ' など
  visibility: Visibility
}

interface LearningLog {
  id: string                      // 'log_1713360000000'
  userId: string
  category: LogCategory
  title: string
  durationMinutes: number
  loggedAt: string                // 'YYYY-MM-DD'
  memo: string
  tags: string[]
}
```

---

## 10. バッジ定義（全ステップ共通）

`js/data.js` 内の `TH.data.BADGE_DEFINITIONS` に定義する。

```javascript
const BADGE_DEFINITIONS = [
  // 累計時間
  { code: 'hours_10',   name: '10時間達成',   icon: '⏱',  color: 'amber',   threshold: 600,   type: 'hours' },
  { code: 'hours_50',   name: '50時間達成',   icon: '⏱',  color: 'amber',   threshold: 3000,  type: 'hours' },
  { code: 'hours_100',  name: '100時間達成',  icon: '🏅',  color: 'amber',   threshold: 6000,  type: 'hours' },
  { code: 'hours_300',  name: '300時間達成',  icon: '🥇',  color: 'orange',  threshold: 18000, type: 'hours' },
  { code: 'hours_500',  name: '500時間達成',  icon: '🏆',  color: 'orange',  threshold: 30000, type: 'hours' },
  { code: 'hours_1000', name: '1000時間達成', icon: '👑',  color: 'red',     threshold: 60000, type: 'hours' },
  // 資格
  { code: 'certs_1',    name: 'はじめての資格', icon: '📜', color: 'blue',    threshold: 1,     type: 'certs' },
  { code: 'certs_3',    name: '資格コレクター', icon: '📚', color: 'blue',    threshold: 3,     type: 'certs' },
  { code: 'certs_5',    name: '資格マスター',   icon: '🎓', color: 'indigo',  threshold: 5,     type: 'certs' },
  { code: 'certs_10',   name: '資格レジェンド', icon: '🌟', color: 'purple',  threshold: 10,    type: 'certs' },
  // ストリーク
  { code: 'streak_7',   name: '7日間ストリーク',   icon: '🔥', color: 'orange', threshold: 7,   type: 'streak' },
  { code: 'streak_30',  name: '30日間ストリーク',  icon: '🔥', color: 'red',    threshold: 30,  type: 'streak' },
  { code: 'streak_100', name: '100日間ストリーク', icon: '💎', color: 'red',    threshold: 100, type: 'streak' },
  // プロフィール
  { code: 'profile_complete',     name: 'プロフィール完成',  icon: '✅', color: 'green',  type: 'profile' },
  { code: 'personality_public',   name: 'パーソナリティ公開', icon: '💡', color: 'purple', type: 'profile' },
]
```

---

## 11. StrengthsFinder 資質→領域マッピング

チャート描画時に使用する。`js/data.js` 内の `TH.data.STRENGTHS_DOMAIN_MAP` に定義。

```javascript
const STRENGTHS_DOMAIN_MAP = {
  '実行力':        ['達成欲','調和性','信念','公平性','慎重さ','規律性','集中力','責任感','回復志向'],
  '影響力':        ['活発性','指令性','コミュニケーション','競争性','最上志向','自己確信','自我','社交性'],
  '人間関係構築力': ['適応性','親密性','開発志向','共感性','包含','個別化','ポジティブ','関係性'],
  '戦略的思考力':  ['分析思考','未来志向','着想','知的好奇心','学習欲','戦略性','収集心'],
}
```

---

## 12. 実装チェックリスト

各ステップ完了時にチェックを入れる。

- [ ] Step 1: 共通基盤（data.js / auth.js / common.js / style.css）
- [ ] Step 2: ログイン画面（index.html）
- [ ] Step 3: 個人ダッシュボード（dashboard.html）
- [ ] Step 4: メンバー一覧（members.html）
- [ ] Step 5: プロフィール表示・編集（profile-view.html / profile-edit.html）
- [ ] Step 6: 学習ログ（learning-log.html）
- [ ] Step 7: 管理者ダッシュボード（admin.html）
- [ ] Step 8: 相談窓口（consultation.html）
