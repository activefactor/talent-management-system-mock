# Step 6: 学習ログ画面設計書

**対象ファイル**: `mock/learning-log.html`
**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**画面ID**: S07（入力） / S08（履歴・集計）
**Chart.js**: 必要（カテゴリ別棒グラフ）

---

## 1. 画面構成（ワイヤーフレーム）

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  学習ログ                                          │
│         │  ─────────────────────────────────────────────   │
│         │                                                   │
│         │  ┌── サマリー ───────────────────────────────┐   │
│         │  │ 累計 87.5時間  今月 12時間  ストリーク 12日 │   │
│         │  └────────────────────────────────────────────┘   │
│         │                                                   │
│         │  ┌── 活動カレンダー (ヒートマップ 26週) ──────┐   │
│         │  │  ▒░░░▓▒░░▓▓▓░...                         │   │
│         │  └────────────────────────────────────────────┘   │
│         │                                                   │
│         │  ┌── 新規記録 ──────────┐  ┌── カテゴリ内訳 ──┐   │
│         │  │ [読書][資格][個人開発] │  │  [棒グラフ]      │   │
│         │  │ [勉強会][OJT][その他]  │  │                  │   │
│         │  │ タイトル [__________] │  │                  │   │
│         │  │ 日付 [今日▼] 時間[60] │  │                  │   │
│         │  │ メモ [_____________]  │  │                  │   │
│         │  │ タグ [+追加]          │  │                  │   │
│         │  │        [記録する]     │  │                  │   │
│         │  └──────────────────────┘  └──────────────────┘   │
│         │                                                   │
│         │  ─── 記録履歴 ────────────────────────────────   │
│         │  [全て▼] [今月▼]  フィルター                       │
│         │                                                   │
│         │  2026-04-16  📖 読書  60分                        │
│         │  Rustプログラミング入門を読んだ                    │
│         │                                                   │
│         │  2026-04-15  📜 資格勉強  90分                   │
│         │  AWS SAA 模擬試験を解いた  [AWS][資格]            │
│         │  ────────────────────────────────────────────   │
│         │  (続きのログ...)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. カテゴリ選択ボタン仕様

ラジオボタンの代わりにアイコン付きボタンで視覚的に選択。

```
┌──────┐ ┌──────┐ ┌──────┐
│  📖  │ │  📜  │ │  💻  │
│ 読書 │ │資格勉強│ │個人開発│
└──────┘ └──────┘ └──────┘
┌──────┐ ┌──────┐ ┌──────┐
│  🎓  │ │  👨‍💼  │ │  ➕  │
│ 勉強会 │ │  OJT │ │その他 │
└──────┘ └──────┘ └──────┘
```

- 未選択: `border-2 border-gray-200 bg-white text-gray-600`
- 選択中: `border-2 border-indigo-500 bg-indigo-50 text-indigo-700`
- ホバー: `border-gray-300 bg-gray-50`

```javascript
const CATEGORIES = [
  { value: 'reading',      label: '読書',    icon: '📖' },
  { value: 'certification',label: '資格勉強', icon: '📜' },
  { value: 'personal_dev', label: '個人開発', icon: '💻' },
  { value: 'study_group',  label: '勉強会',   icon: '🎓' },
  { value: 'ojt',          label: 'OJT',     icon: '👨‍💼' },
  { value: 'other',        label: 'その他',   icon: '➕' },
];
```

---

## 3. ログ記録フォーム仕様

| フィールド | 種別 | 制約・仕様 |
|---|---|---|
| カテゴリ | ボタン選択 | 必須、デフォルト: reading |
| タイトル | テキスト入力 | 必須、placeholder="何を学んだか一言で（例: Rust入門書を読んだ）" |
| 活動日 | `<input type="date">` | デフォルト: 今日 |
| 活動時間 | セレクトボックス | 15/30/45/60/90/120 分 |
| メモ | テキストエリア | 任意、3行、300文字以内 |
| タグ | テキスト入力 + Enter追加 | 任意、複数追加可。例: [TypeScript][AWS] |

タグ入力:
```html
<!-- タグを入力してEnterで追加 -->
<input @keydown.enter.prevent="addTag()" x-model="newTag" 
       placeholder="タグを追加（例: TypeScript）"
       class="...">
<!-- 追加済みタグ -->
<template x-for="tag in logForm.tags" :key="tag">
  <span class="skill-tag skill-tag-interest">
    <span x-text="tag"></span>
    <button @click="removeTag(tag)">✕</button>
  </span>
</template>
```

---

## 4. カテゴリ別棒グラフ（Chart.js）

月別×カテゴリ別の積み上げ棒グラフ（過去6ヶ月）。

```javascript
renderBarChart() {
  // 過去6ヶ月のデータを集計
  const months = []; // ['2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04']
  const categories = ['reading','certification','personal_dev','study_group','ojt','other'];
  const datasets = categories.map(cat => ({
    label: TH.fmt.categoryLabel(cat),
    data: months.map(m => /* その月のcatの累計時間(h) */ ),
    backgroundColor: TH.fmt.categoryColor(cat),
  }));

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: { labels: months.map(m => `${m.split('-')[1]}月`), datasets },
    options: {
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: '時間' } } },
      plugins: { legend: { position: 'bottom' } },
    }
  });
}
```

---

## 5. ログ履歴リスト仕様

### フィルター

| フィルター | 選択肢 |
|---|---|
| カテゴリ | 全て / 読書 / 資格勉強 / ... |
| 期間 | 全期間 / 今月 / 先月 / 過去3ヶ月 |

### ログ行デザイン

```
┌────────────────────────────────────────────────────────┐
│ [カテゴリアイコン+色]  タイトル                  [🗑]  │
│ 2026-04-16  ·  60分                                    │
│ [TypeScript][AWS] ← タグ                               │
│ メモ（あれば小さく表示）                                │
└────────────────────────────────────────────────────────┘
```

- カテゴリの左ボーダー色: `TH.fmt.categoryColor(cat)` に対応した色帯
- 削除ボタン: クリックで `confirm()` 確認 → `TH.data.deleteLog(id)` → 再描画

### ソート順: `loggedAt` 降順（新しいものが上）

---

## 6. Alpine.js データ構造

```javascript
function learningLogApp() {
  return {
    user: null,
    allLogs: [],
    filterCategory: '',
    filterPeriod: 'all', // 'all'|'this_month'|'last_month'|'3months'

    // 新規記録フォーム
    logForm: {
      category: 'reading',
      title: '',
      loggedAt: new Date().toISOString().split('T')[0],
      durationMinutes: 60,
      memo: '',
      tags: [],
    },
    newTag: '',

    get filteredLogs() {
      return this.allLogs
        .filter(l => {
          if (this.filterCategory && l.category !== this.filterCategory) return false;
          if (this.filterPeriod !== 'all') {
            const now = new Date();
            const logDate = new Date(l.loggedAt);
            if (this.filterPeriod === 'this_month') {
              if (logDate.getFullYear() !== now.getFullYear() ||
                  logDate.getMonth() !== now.getMonth()) return false;
            }
            // 先月・3ヶ月も同様
          }
          return true;
        })
        .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
    },

    get totalMinutes() { return TH.data.getTotalMinutes(this.user?.id); },
    get streak() { return TH.data.getStreak(this.user?.id); },
    get thisMonthMinutes() { /* 今月のログを集計 */ },

    init() {
      if (!TH.auth.guard()) return;
      this.user = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', 'learning-log');
      this.allLogs = TH.data.getLogs(this.user.id);
      this.$nextTick(() => {
        TH.ui.renderHeatmap('heatmap', this.user.id, 26);
        this.renderBarChart();
      });
    },

    addLog() {
      if (!this.logForm.title.trim()) {
        TH.ui.toast('タイトルを入力してください', 'error'); return;
      }
      const log = {
        id: `log_${Date.now()}`,
        userId: this.user.id,
        ...this.logForm,
        durationMinutes: Number(this.logForm.durationMinutes),
      };
      TH.data.addLog(log);
      this.allLogs = TH.data.getLogs(this.user.id);
      this.logForm.title = '';
      this.logForm.memo = '';
      this.logForm.tags = [];
      TH.ui.toast('記録しました！', 'success');
      TH.ui.renderHeatmap('heatmap', this.user.id, 26);
      this.renderBarChart();
    },

    deleteLog(logId) {
      if (!confirm('このログを削除しますか？')) return;
      TH.data.deleteLog(logId);
      this.allLogs = TH.data.getLogs(this.user.id);
      TH.ui.toast('削除しました', 'info');
      TH.ui.renderHeatmap('heatmap', this.user.id, 26);
    },

    addTag() {
      const t = this.newTag.trim();
      if (t && !this.logForm.tags.includes(t)) this.logForm.tags.push(t);
      this.newTag = '';
    },

    removeTag(tag) {
      this.logForm.tags = this.logForm.tags.filter(t => t !== tag);
    },

    renderBarChart() { /* Chart.js 積み上げ棒グラフ */ },
    formatDate(ds) { return ds.replace(/-/g, '/'); },
    categoryIcon(cat) {
      const icons = { reading:'📖', certification:'📜', personal_dev:'💻',
                      study_group:'🎓', ojt:'👨‍💼', other:'➕' };
      return icons[cat] || '📝';
    },
  }
}
```

---

## 7. 実装後のチェック項目

- [ ] サマリー（累計・今月・ストリーク）が正しく表示される
- [ ] ヒートマップが26週分描画される
- [ ] カテゴリボタンの選択状態が正しく表示される
- [ ] ログを記録するとヒートマップが即時更新される
- [ ] タグ入力でEnterを押すとタグが追加される
- [ ] カテゴリ別棒グラフが過去6ヶ月分表示される
- [ ] フィルターで期間・カテゴリを絞り込める
- [ ] ログ削除で確認ダイアログが表示され、削除後にリストが更新される
- [ ] ページリロード後も記録・削除結果が維持される
