# Step 4: メンバー一覧・検索画面設計書

**対象ファイル**: `mock/members.html`
**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**画面ID**: S05

---

## 1. 画面構成（ワイヤーフレーム）

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  メンバー検索                                      │
│         │  ─────────────────────────────────────────────   │
│         │  [🔍 スキル名・氏名・部署で検索___________]        │
│         │                                                   │
│         │  [部署▼] [ロール▼] [相談受付中のみ□]  8件         │
│         │                                                   │
│         │  ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│         │  │ [👤] 佐藤花子 │ │ [👤] 田中健一│ │[👤]鈴木美咲│ │
│         │  │ 開発部       │ │ インフラ部   │ │ 開発部    │ │
│         │  │ テックリード  │ │ シニアEng   │ │ Eng      │ │
│         │  │ [💬相談受付中]│ │ [💬相談受付中│ │          │ │
│         │  │ TS Next.js   │ │ AWS K8s    │ │ TS React │ │
│         │  │ 共通: TypeScript│ │            │ │ 共通: TS │ │
│         │  │ 累計 312時間  │ │ 累計 287時間 │ │ 累計 87h │ │
│         │  └─────────────┘ └─────────────┘ └──────────┘ │
│         │  ... (残りのカード)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 検索・フィルター仕様

| フィルター | 種別 | 選択肢 |
|---|---|---|
| キーワード検索 | テキスト入力 | 氏名・スキル名・資格名・部署・インタレストタグで横断検索 |
| 部署フィルター | セレクトボックス | 全部署 / 開発部 / インフラ部 / QA部 |
| ロールフィルター | セレクトボックス | 全ロール / 管理者 / シニア / エンジニア |
| 相談受付中のみ | チェックボックス | `isAcceptingConsultation === true` |

**検索ロジック（Alpine.js computed）**:
```javascript
get filteredUsers() {
  const q = this.searchQuery.toLowerCase();
  return TH.data.getUsers().filter(u => {
    if (u.id === this.currentUser.id) return false; // 自分を除外
    if (this.filterDept && u.department !== this.filterDept) return false;
    if (this.filterRole && u.role !== this.filterRole) return false;
    if (this.onlyConsultation && !u.isAcceptingConsultation) return false;
    if (!q) return true;
    // キーワードマッチ
    const targets = [
      u.name, u.department, u.grade,
      ...u.skills.map(s => s.name),
      ...u.certifications.map(c => c.name),
      ...u.interestTags,
    ].join(' ').toLowerCase();
    return targets.includes(q);
  });
}
```

ソート順: デフォルトは joinYear 降順（新しい人が上）

---

## 3. ユーザーカード仕様

```
┌─────────────────────────────────────────────────┐
│ ┌──┐  氏名 (font-semibold)   [ロールバッジ]      │
│ │Av│  部署 · 役職 (text-gray-500 text-sm)        │
│ └──┘  [💬 相談受付中] (isAcceptingConsultation時) │
├─────────────────────────────────────────────────┤
│ [スキルタグ × 最大4件] (あふれる場合は +N と表示) │
├─────────────────────────────────────────────────┤
│ ⏱ 累計 xxx.x時間  🏅 バッジ x個                  │
│ [共通スキルタグ] ← 検索キーワードと一致した場合   │
└─────────────────────────────────────────────────┘
```

**共通点ハイライト**:
- 検索キーワードに一致したスキル名・タグには `ring-2 ring-indigo-400` を追加
- ログインユーザーと共通のスキル名は緑の枠で強調

**カードクリック**: `TH.nav.go('profile-view', user.id)`

**件数表示**: フィルター後の件数を検索バー右横に表示
```
「8件中 3件を表示」
```

---

## 4. Alpine.js データ構造

```javascript
function membersApp() {
  return {
    currentUser: null,
    searchQuery: '',
    filterDept: '',
    filterRole: '',
    onlyConsultation: false,

    get filteredUsers() {
      // 上記検索ロジック
    },

    get departments() {
      const depts = [...new Set(TH.data.getUsers().map(u => u.department))];
      return depts.sort();
    },

    init() {
      if (!TH.auth.guard()) return;
      this.currentUser = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', 'members');
    },

    getCommonSkills(targetUser) {
      const mySkills = new Set(this.currentUser.skills.map(s => s.name));
      return targetUser.skills
        .filter(s => mySkills.has(s.name))
        .map(s => s.name);
    },

    getTopSkills(user, n) {
      return user.skills
        .sort((a, b) => b.level - a.level)
        .slice(0, n || 4);
    },

    getTotalHours(userId) {
      return TH.fmt.totalHours(TH.data.getTotalMinutes(userId));
    },

    getBadgeCount(userId) {
      return TH.data.getEarnedBadges(userId).length;
    },

    goToProfile(userId) {
      TH.nav.go('profile-view', userId);
    },
  }
}
```

---

## 5. HTML骨格

```html
<body x-data="membersApp()" x-init="init()" x-cloak>
<div class="app-layout">
  <aside class="sidebar" id="sidebar"></aside>
  <main class="main-content">
    <div class="max-w-6xl mx-auto fade-in">

      <!-- ページタイトル -->
      <h1 class="text-2xl font-bold text-gray-900 mb-6">メンバー検索 👥</h1>

      <!-- 検索・フィルターバー -->
      <div class="card mb-6">
        <div class="flex gap-3 items-center flex-wrap">
          <!-- キーワード検索 -->
          <div class="flex-1 min-w-64 relative">
            <input type="text" x-model="searchQuery"
                   placeholder="スキル名・氏名・部署で検索..."
                   class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <!-- 検索アイコン SVG -->
          </div>
          <!-- 部署フィルター -->
          <select x-model="filterDept" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">全部署</option>
            <template x-for="dept in departments" :key="dept">
              <option :value="dept" x-text="dept"></option>
            </template>
          </select>
          <!-- ロールフィルター -->
          <select x-model="filterRole" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">全ロール</option>
            <option value="admin">管理者</option>
            <option value="senior">シニア</option>
            <option value="engineer">エンジニア</option>
          </select>
          <!-- 相談受付チェックボックス -->
          <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" x-model="onlyConsultation" class="accent-indigo-600">
            相談受付中のみ
          </label>
          <!-- 件数表示 -->
          <span class="text-sm text-gray-500 ml-auto"
                x-text="`${filteredUsers.length}件`"></span>
        </div>
      </div>

      <!-- ユーザーカードグリッド -->
      <div class="grid grid-cols-3 gap-4">
        <template x-for="u in filteredUsers" :key="u.id">
          <div class="card cursor-pointer hover:shadow-md transition-shadow"
               @click="goToProfile(u.id)">
            <!-- カード内容（上記仕様に沿って実装） -->
          </div>
        </template>

        <!-- 0件時 -->
        <div x-show="filteredUsers.length === 0" class="col-span-3 text-center py-16 text-gray-400">
          <p class="text-4xl mb-3">🔍</p>
          <p class="text-sm">該当するメンバーが見つかりませんでした</p>
        </div>
      </div>

    </div>
  </main>
</div>
</body>
```

---

## 6. 実装後のチェック項目

- [ ] 全ユーザー（自分除く）がカードで表示される
- [ ] キーワード検索でスキル名・氏名・部署で絞り込める
- [ ] 部署・ロールフィルターが機能する
- [ ] 相談受付中チェックで絞り込める
- [ ] カードクリックでprofile-view.htmlに遷移する
- [ ] 件数が正しく表示される
- [ ] 0件時に「見つかりませんでした」が表示される
