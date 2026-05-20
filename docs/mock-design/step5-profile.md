# Step 5: プロフィール表示・編集画面設計書

**対象ファイル**:
- `mock/profile-view.html` （S04: プロフィール詳細）
- `mock/profile-edit.html` （S03: プロフィール編集）

**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**Chart.js**: 必要（profile-view.html の StrengthsFinder レーダーチャート）

> ゲーム風のCanvasスキルマップを追加する場合は、拡張仕様として
> [Step 9: スキルギャラクシー企画書・仕様書](./step9-skill-galaxy.md) を参照する。

---

## 1. profile-view.html（プロフィール詳細）

### 1.1 画面構成

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  ← メンバー一覧                                    │
│         │                                                   │
│         │  ┌── プロフィールヘッダー ──────────────────────┐  │
│         │  │  [Avatar 64px]  佐藤 花子                    │  │
│         │  │                 開発部 · テックリード          │  │
│         │  │                 [senior バッジ]               │  │
│         │  │                 入社: 2017年  GitHub: @xxx    │  │
│         │  │                 [相談受付中 💬]               │  │
│         │  │  自己紹介テキスト...                          │  │
│         │  │  取り組み中: マイクロサービスアーキテクチャ    │  │
│         │  │  [自分のプロフィールの場合: 編集ボタン]        │  │
│         │  └────────────────────────────────────────────┘  │
│         │                                                   │
│         │  [スキル][資格][パーソナリティ][活動] タブ         │
│         │  ※Step 9適用時は [スキル星図][スキル一覧] に分割   │
│         │                                                   │
│         │  === スキルタブ ===                               │
│         │  [言語]    TypeScript ●●●●●  Next.js ●●●●●     │
│         │  [FW]      React ●●●●●  GraphQL ●●●●○          │
│         │  [インフラ] AWS ●●●●○  Docker ●●●●○             │
│         │                                                   │
│         │  === 資格タブ ===                                 │
│         │  [資格名] 取得年月 ~ 有効期限                      │
│         │                                                   │
│         │  === パーソナリティタブ ===                        │
│         │  StrengthsFinder [レーダーチャート] + TOP5        │
│         │  MBTI [INTJ バッジ] + 4軸バーグラフ               │
│         │                                                   │
│         │  === 活動タブ ===                                 │
│         │  ヒートマップ + 獲得バッジ一覧                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 データ取得

```javascript
// URLパラメータまたは localStorage から閲覧対象ユーザーIDを取得
const targetUserId = localStorage.getItem('th_viewing_user_id')
                  || new URLSearchParams(location.search).get('userId');
const targetUser = TH.data.getUserById(targetUserId);
```

### 1.3 プロフィールヘッダー仕様

| 要素 | 仕様 |
|---|---|
| アバター | 64px円形, `avatarColor` 背景, `avatarInitial` テキスト |
| 氏名 | `text-2xl font-bold text-gray-900` |
| 部署・役職 | `text-gray-500 text-sm` |
| ロールバッジ | `roleBadgeClass(role)` + `roleLabel(role)` |
| 入社年 | `YYYY年入社` |
| GitHub | `@github_account` (クリック不可ダミーリンク) |
| 相談受付中 | `isAcceptingConsultation` が true の場合のみ表示。緑のバッジ |
| 自己紹介 | `text-gray-700 text-sm` |
| 取り組み中 | ラベル + テキスト |
| 編集ボタン | ログインユーザーIDと一致する場合のみ表示 → `profile-edit.html` へ遷移 |

### 1.4 スキルタブ

カテゴリ（言語/FW/インフラ/ドメイン）ごとにグループ化して表示。

```
[カテゴリラベル]
  [スキル名]  ●●●●●  レベル 5/5
  [スキル名]  ●●●●○  レベル 4/5
```

HTMLでの実装:
```html
<template x-for="cat in ['language','framework','infra','domain']" :key="cat">
  <div x-show="getSkillsByCategory(cat).length > 0">
    <h3 x-text="categoryLabel(cat)" class="text-xs font-semibold text-gray-400 uppercase mb-2"></h3>
    <div class="space-y-2">
      <template x-for="skill in getSkillsByCategory(cat)" :key="skill.id">
        <div class="flex items-center justify-between">
          <span class="skill-tag" :class="skillTagClass(skill.category)" x-text="skill.name"></span>
          <div x-html="skillDotsHtml(skill.level, skill.category)"></div>
        </div>
      </template>
    </div>
  </div>
</template>
```

### 1.5 資格タブ

```
┌─────────────────────────────────────────────────┐
│ [📜] AWS Solutions Architect Professional        │
│      AWS · 取得: 2023年6月 · 有効期限: 2026年6月  │
├─────────────────────────────────────────────────┤
│ [📜] 情報処理安全確保支援士                         │
│      IPA · 取得: 2022年10月 · 有効期限: なし       │
└─────────────────────────────────────────────────┘
```

有効期限の警告: 現在から3ヶ月以内に期限切れになる場合は `text-amber-600` で強調表示。

### 1.6 パーソナリティタブ

**公開設定チェック**:
- `visibility === 'private'`: 「非公開に設定されています」と表示
- `visibility === 'role_limited'`: admin と senior のみ表示
- `visibility === 'public'`: 全員に表示

**StrengthsFinder セクション**:
```
TOP 5 資質:
[戦略性] [着想] [分析思考] [学習欲] [収集心]

[レーダーチャート: 4領域]
領域別スコア表の下に「強みの傾向」テキスト（静的定型文）
```

レーダーチャート（Chart.js）:
```javascript
renderStrengthsChart(top5) {
  const scores = TH.data.getStrengthsDomainScores(top5);
  const labels = Object.keys(scores);
  const data   = Object.values(scores);
  // Chart.js radar で描画
  // color: rgba(79,70,229,0.3) / #4F46E5
}
```

**MBTI セクション**:
```
[INTJ] アーキテクト型
特徴: 独創的な考え方と、あらゆる事柄の根本にある原理を...（定型テキスト）

E ──────●─────── I  (Introvert寄り)
S ─────────────● N  (iNtuition強め)
T ───●─────────── F
J ●──────────────── P
```

MBTI 4軸バー実装:
```javascript
// mbtiType = 'INTJ' から各軸の値を算出（モック固定値でOK）
const MBTI_SCORES = {
  'INTJ': { EI: 25, SN: 85, TF: 20, JP: 15 }, // Iが75%, Nが85%, Tが80%, Jが85%
  'ENFP': { EI: 80, SN: 75, TF: 65, JP: 55 },
  // ... 全16タイプ分
}
// EI: 0=完全I, 100=完全E
// SN: 0=完全S, 100=完全N
```

**複合分析セクション**（両方登録済みの場合のみ）:
静的テキストマッピング（例: INTJ × 戦略性/分析思考TOP5 → 「独自の視点で課題を構造化し...」）

### 1.7 活動タブ

- ヒートマップ（26週）`TH.ui.renderHeatmap`
- 獲得バッジ一覧: `TH.data.getEarnedBadges(userId)` で取得
  - バッジカード: アイコン・名称・colorClass
  - まだ取得していないバッジは `opacity-40 grayscale` でグレーアウト表示（未取得感の演出）

---

## 2. profile-edit.html（プロフィール編集）

### 2.1 画面構成

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  プロフィール編集                                  │
│         │  ─────────────────────────────────────────────   │
│         │  [基本情報][スキル][資格][パーソナリティ][相談設定]  │
│         │                                                   │
│         │  === 基本情報タブ ===                              │
│         │  氏名 [__________]  部署 [__________]            │
│         │  役職 [__________]  入社年 [____]                 │
│         │  GitHub [__________]                              │
│         │  自己紹介 [_________________________________]     │
│         │          [_________________________________]     │
│         │  取り組み中 [________________________________]    │
│         │  インタレストタグ [+追加]  [React][AWS][✕]       │
│         │                                                   │
│         │              [保存する] ボタン                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 タブ構成

| タブ | フィールド |
|---|---|
| 基本情報 | 氏名・部署・役職・入社年・GitHub・自己紹介（500字）・取り組み中（200字）・インタレストタグ |
| スキル | 言語/FW/インフラ/ドメインのスキル追加・編集・削除（名称+レベル1-5） |
| 資格 | 資格名・発行機関・取得年月・有効期限の追加・編集・削除 |
| パーソナリティ | StrengthsFinder TOP5（プルダウン×5）・MBTIタイプ（16択プルダウン）・公開範囲 |
| 相談設定 | 相談受付フラグ（トグル）・相談タグ（+追加）※ seniorロールのみ表示 |

### 2.3 スキル入力仕様

```
[カテゴリ▼] [スキル名__________] [レベル ★★★☆☆] [削除🗑]
[カテゴリ▼] [スキル名__________] [レベル ★★★★☆] [削除🗑]
[ + スキルを追加 ]
```

レベル選択: 数値1-5を ★ アイコンで表示するセレクトボックスで代用。
```html
<select x-model="skill.level">
  <option value="1">★☆☆☆☆ 初学者</option>
  <option value="2">★★☆☆☆ 入門</option>
  <option value="3">★★★☆☆ 実務経験あり</option>
  <option value="4">★★★★☆ 上級</option>
  <option value="5">★★★★★ エキスパート</option>
</select>
```

カテゴリプルダウン:
```
言語 / フレームワーク / インフラ・クラウド / ドメイン経験
```

### 2.4 資格入力仕様

```
[資格名______________] [発行機関________] [取得年月____] [有効期限____] [削除🗑]
[ + 資格を追加 ]
```

取得年月・有効期限: `<input type="month">` （YYYY-MM 形式）

### 2.5 StrengthsFinder 入力

34資質の完全リスト（プルダウン選択、5個まで）:
```javascript
const ALL_STRENGTHS = [
  // 実行力
  '達成欲','調和性','信念','公平性','慎重さ','規律性','集中力','責任感','回復志向',
  // 影響力
  '活発性','指令性','コミュニケーション','競争性','最上志向','自己確信','自我','社交性',
  // 人間関係構築力
  '適応性','親密性','開発志向','共感性','包含','個別化','ポジティブ','関係性',
  // 戦略的思考力
  '分析思考','未来志向','着想','知的好奇心','学習欲','戦略性','収集心',
];
```

### 2.6 保存処理

```javascript
saveProfile() {
  // バリデーション（氏名・部署・役職は必須）
  if (!this.editForm.name) { TH.ui.toast('氏名は必須です', 'error'); return; }

  // ユーザーオブジェクトを更新
  const updated = {
    ...this.user,
    name:         this.editForm.name,
    department:   this.editForm.department,
    grade:        this.editForm.grade,
    joinYear:     Number(this.editForm.joinYear),
    bio:          this.editForm.bio,
    github:       this.editForm.github,
    currentFocus: this.editForm.currentFocus,
    interestTags: this.editForm.interestTags,
    skills:       this.editForm.skills,
    certifications: this.editForm.certifications,
    personality:  this.editForm.personality,
    isAcceptingConsultation: this.editForm.isAcceptingConsultation,
    consultationTags: this.editForm.consultationTags,
  };
  TH.data.saveUser(updated);
  TH.ui.toast('プロフィールを保存しました', 'success');
  // 保存後 profile-view に遷移（自分のプロフィール）
  setTimeout(() => {
    localStorage.setItem('th_viewing_user_id', this.user.id);
    window.location.href = 'profile-view.html';
  }, 500);
}
```

### 2.7 Alpine.js データ構造（profile-edit.html）

```javascript
function profileEditApp() {
  return {
    user: null,
    activeTab: 'basic', // 'basic'|'skills'|'certs'|'personality'|'consultation'
    editForm: {
      name: '', department: '', grade: '', joinYear: 2020,
      bio: '', github: '', currentFocus: '',
      interestTags: [],
      skills: [],
      certifications: [],
      personality: { strengthsTop5: ['','','','',''], mbtiType: '', visibility: 'public' },
      isAcceptingConsultation: false,
      consultationTags: [],
    },
    newTagInput: '',
    newConsultTagInput: '',
    newSkill: { category: 'language', name: '', level: 3 },
    newCert: { name: '', issuer: '', acquiredAt: '', expiresAt: '' },

    init() {
      if (!TH.auth.guard()) return;
      this.user = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', '');
      // editFormにユーザーデータをコピー
      this.editForm = {
        name: this.user.name,
        department: this.user.department,
        grade: this.user.grade,
        joinYear: this.user.joinYear,
        bio: this.user.bio || '',
        github: this.user.github || '',
        currentFocus: this.user.currentFocus || '',
        interestTags: [...(this.user.interestTags || [])],
        skills: this.user.skills.map(s => ({...s})),
        certifications: this.user.certifications.map(c => ({...c})),
        personality: {
          strengthsTop5: [...(this.user.personality.strengthsTop5 || ['','','','','']).concat(['','','','','']).slice(0,5)],
          mbtiType: this.user.personality.mbtiType || '',
          visibility: this.user.personality.visibility || 'public',
        },
        isAcceptingConsultation: this.user.isAcceptingConsultation || false,
        consultationTags: [...(this.user.consultationTags || [])],
      };
    },
    // ... save / addSkill / removeSkill / addCert / removeCert メソッド
  }
}
```

---

## 3. 共通事項

### 「戻る」ボタン動作

- `profile-view.html`: `history.back()` または `TH.nav.go('members')`
- `profile-edit.html`: 未保存変更がある場合は確認ダイアログ（`confirm()`）→ 問題なければ `history.back()`

---

## 4. 実装後のチェック項目（profile-view.html）

- [ ] 対象ユーザーのプロフィールヘッダーが正しく表示される
- [ ] スキルタブでカテゴリ別グループ化・ドット表示が正しい
- [ ] 資格タブで資格一覧が表示される（有効期限警告含む）
- [ ] パーソナリティタブでStrengthsレーダーチャートが表示される
- [ ] パーソナリティタブでMBTI 4軸バーが表示される
- [ ] `visibility: 'private'` のユーザーはパーソナリティが非表示になる
- [ ] 活動タブでヒートマップとバッジが表示される
- [ ] 自分のプロフィール閲覧時のみ「編集」ボタンが表示される

## 5. 実装後のチェック項目（profile-edit.html）

- [ ] 自分以外のユーザーでアクセスした場合はdashboard.htmlにリダイレクトされる
- [ ] 既存データが各フォームに初期値として表示される
- [ ] スキルの追加・削除ができる
- [ ] 資格の追加・削除ができる
- [ ] StrengthsFinderのTOP5プルダウンで34資質が選択できる
- [ ] 保存後にlocalStorageが更新されprofile-view.htmlに遷移する
- [ ] ページリロード後も保存したデータが反映されている
