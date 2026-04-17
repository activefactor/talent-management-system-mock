# Step 7: 管理者ダッシュボード設計書

**対象ファイル**: `mock/admin.html`
**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**画面ID**: S11（管理者ダッシュボード）/ S06（スキルマップ）
**Chart.js**: 必要（スキル保有人数棒グラフ）
**アクセス制限**: `admin` ロールのみ（`TH.auth.guardAdmin()` 使用）

---

## 1. 画面構成（ワイヤーフレーム）

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  管理者ダッシュボード                              │
│         │  ─────────────────────────────────────────────   │
│         │                                                   │
│         │  [ユーザー数][スキル総数][今月ログ数][バッジ総数]  │
│         │  ┌──────┐   ┌──────┐  ┌──────┐  ┌──────┐    │
│         │  │  8名  │   │  47  │  │  92  │  │  23  │    │
│         │  └──────┘   └──────┘  └──────┘  └──────┘    │
│         │                                                   │
│         │  ── スキルマップ ──────────────────────────────  │
│         │  [言語][FW][インフラ][全て] タブ                   │
│         │                                                   │
│         │     山田  佐藤  田中  鈴木  高橋  伊藤  渡辺  中村  │
│         │  TS  ■5   ■5    -    ■3   ■2    -     -    ■2   │
│         │  Go  ■4   ■4   ■3    -     -     -     -     -   │
│         │  Py  ■3   ■3   ■4   ■3   ■4   ■3   ■2    -   │
│         │  AWS ■4    -   ■5    -     -     -    ■3    -   │
│         │  ...                                              │
│         │                                                   │
│         │  ── スキル別保有人数 ─────────────────────────   │
│         │  [横棒グラフ: TypeScript 5人, AWS 4人, ...]       │
│         │                                                   │
│         │  ── 最近のアクティビティ ─────────────────────   │
│         │  [ユーザー] [バッジ取得 / 資格追加] [日時]        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. サマリーカード仕様

| カード | データ | アイコン色 |
|---|---|---|
| 総ユーザー数 | `TH.data.getUsers().length` | indigo |
| 総スキル登録数 | 全ユーザーのスキル合計数 | blue |
| 今月のログ記録数 | 今月分のログ件数（全ユーザー） | emerald |
| 総バッジ取得数 | 全ユーザーの獲得バッジ合計 | amber |

---

## 3. スキルマップテーブル仕様

### レイアウト

- **行**: 各スキル名（全ユーザーが持つスキルを重複除外でリストアップ）
- **列**: 各ユーザー名（短縮: 姓のみ）
- **セル**: そのユーザーがそのスキルを持っている場合はレベル表示、持っていない場合は `-`

### セルのスタイル（習熟度別色）

| レベル | 表示 | 背景色 | テキスト色 |
|---|---|---|---|
| - | なし | `bg-gray-50` | `text-gray-300` |
| 1〜2 | `1` / `2` | `bg-blue-50` | `text-blue-600` |
| 3 | `3` | `bg-blue-100` | `text-blue-700` |
| 4 | `4` | `bg-indigo-100` | `text-indigo-700` |
| 5 | `5` | `bg-indigo-200` | `text-indigo-800` |

### カテゴリタブ

- `language` / `framework` / `infra` / `全て`
- タブ切り替えで表示行を絞り込む

### テーブル実装方針

```javascript
// スキルマップデータ生成
buildSkillMap(categoryFilter) {
  const users = TH.data.getUsers();
  // フィルタリングされたカテゴリのスキル名を全ユーザーから収集
  const allSkillNames = [...new Set(
    users.flatMap(u => u.skills
      .filter(s => !categoryFilter || s.category === categoryFilter)
      .map(s => s.name)
    )
  )].sort();

  // 各スキル × 各ユーザーのレベルを2次元配列で構築
  return allSkillNames.map(skillName => ({
    skillName,
    levels: users.map(u => {
      const s = u.skills.find(sk => sk.name === skillName);
      return s ? s.level : 0;
    })
  }));
}
```

HTMLテーブル:
```html
<div class="overflow-x-auto">
  <table class="min-w-full text-sm">
    <thead>
      <tr>
        <th class="sticky left-0 bg-white text-left px-3 py-2 text-xs text-gray-500 border-b">スキル</th>
        <template x-for="u in allUsers" :key="u.id">
          <th class="px-2 py-2 text-center text-xs text-gray-500 border-b min-w-[52px]"
              x-text="u.name.split(' ')[0]"></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in skillMapData" :key="row.skillName">
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="sticky left-0 bg-white px-3 py-1.5 font-medium text-gray-700 text-xs"
              x-text="row.skillName"></td>
          <template x-for="(level, idx) in row.levels" :key="idx">
            <td class="px-2 py-1.5 text-center">
              <span x-show="level > 0"
                    :class="skillCellClass(level)"
                    class="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                    x-text="level"></span>
              <span x-show="level === 0" class="text-gray-200 text-xs">–</span>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

---

## 4. スキル別保有人数グラフ（Chart.js 横棒）

```javascript
renderSkillCountChart() {
  const users = TH.data.getUsers();
  // 全スキルの出現回数を集計
  const counts = {};
  users.forEach(u => {
    u.skills.forEach(s => {
      counts[s.name] = (counts[s.name] || 0) + 1;
    });
  });
  // 上位15件に絞る
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  const labels = sorted.map(([name]) => name);
  const data   = sorted.map(([, count]) => count);

  new Chart(document.getElementById('skillCountChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ data, backgroundColor: '#818CF8', borderRadius: 4 }]
    },
    options: {
      indexAxis: 'y',  // 横棒
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { stepSize: 1 }, max: users.length },
      }
    }
  });
}
```

---

## 5. 最近のアクティビティ

全ユーザーのログ・バッジ取得を時系列で表示（モックでは直近10件）。

```javascript
getRecentActivity() {
  const users = TH.data.getUsers();
  const allLogs = TH.data.getLogs();

  // 直近7日間のログを全ユーザー分集計
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return allLogs
    .filter(l => new Date(l.loggedAt) >= sevenDaysAgo)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
    .slice(0, 10)
    .map(l => {
      const user = users.find(u => u.id === l.userId);
      return { user, log: l };
    });
}
```

アクティビティ行デザイン:
```
[Avatar] 鈴木 美咲 が「Rustプログラミング入門を読んだ」を記録  60分  📖  2026-04-16
```

---

## 6. Alpine.js データ構造

```javascript
function adminApp() {
  return {
    user: null,
    allUsers: [],
    skillMapTab: 'language', // 'language'|'framework'|'infra'|'all'
    skillMapData: [],
    totalStats: {
      userCount: 0, skillCount: 0, monthLogCount: 0, totalBadgeCount: 0
    },
    recentActivity: [],

    init() {
      if (!TH.auth.guardAdmin()) return;
      this.user = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', 'admin');
      this.allUsers = TH.data.getUsers();
      this.calcStats();
      this.buildSkillMap('language');
      this.recentActivity = this.getRecentActivity();
      this.$nextTick(() => this.renderSkillCountChart());
    },

    calcStats() {
      const users = this.allUsers;
      this.totalStats = {
        userCount:     users.length,
        skillCount:    users.reduce((s, u) => s + u.skills.length, 0),
        monthLogCount: this._countMonthLogs(),
        totalBadgeCount: users.reduce((s, u) =>
          s + TH.data.getEarnedBadges(u.id).length, 0),
      };
    },

    buildSkillMap(cat) {
      this.skillMapTab = cat || 'all';
      const filter = this.skillMapTab === 'all' ? '' : this.skillMapTab;
      this.skillMapData = this._buildSkillMap(filter);
    },

    skillCellClass(level) {
      const classes = {
        1: 'bg-blue-50 text-blue-600',
        2: 'bg-blue-50 text-blue-700',
        3: 'bg-blue-100 text-blue-800',
        4: 'bg-indigo-100 text-indigo-700',
        5: 'bg-indigo-200 text-indigo-800',
      };
      return classes[level] || '';
    },

    goToProfile(userId) { TH.nav.go('profile-view', userId); },

    // private メソッド
    _countMonthLogs() { /* 今月分のログ数 */ },
    _buildSkillMap(filter) { /* 上記参照 */ },
    getRecentActivity() { /* 上記参照 */ },
    renderSkillCountChart() { /* 上記参照 */ },
  }
}
```

---

## 7. 実装後のチェック項目

- [ ] admin以外のロールでアクセスするとdashboard.htmlにリダイレクトされる
- [ ] サマリーカード4枚に正しい集計値が表示される
- [ ] スキルマップテーブルが表示され、カテゴリタブで絞り込める
- [ ] レベル別にセルの色が変わる
- [ ] スキル別保有人数の横棒グラフが表示される（上位15件）
- [ ] 最近のアクティビティが直近10件表示される
- [ ] ユーザー名クリックでprofile-view.htmlに遷移する
