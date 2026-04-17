# Step 3: 個人ダッシュボード設計書

**対象ファイル**: `mock/dashboard.html`
**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**画面ID**: S02
**Chart.js**: 必要（カテゴリ別ドーナツチャート）

---

## 1. 画面構成（ワイヤーフレーム）

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  おはようございます、鈴木 美咲さん ☀️              │
│         │  ─────────────────────────────────────────────   │
│         │                                                   │
│         │  [今週の活動] [累計時間] [ストリーク] [バッジ数]  │
│         │  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   │
│         │  │ 3.5h │   │ 87h  │   │ 12日 │   │  3個  │   │
│         │  └──────┘   └──────┘   └──────┘   └──────┘   │
│         │                                                   │
│         │  ┌── 活動ヒートマップ (26週) ──────────────────┐  │
│         │  │  Mon █ █ _ █ █ _ ...                      │  │
│         │  │  Tue _ █ █ _ █ █ ...                      │  │
│         │  └────────────────────────────────────────────┘  │
│         │                                                   │
│         │  ┌── クイック記録 ───────┐  ┌── 次のバッジ ────┐  │
│         │  │  [カテゴリ選択]       │  │  🏅 100時間達成   │  │
│         │  │  [タイトル入力]       │  │  ████░░░ 87/100  │  │
│         │  │  [時間 60分] [記録]   │  │                  │  │
│         │  └──────────────────────┘  └──────────────────┘  │
│         │                                                   │
│         │  ┌── カテゴリ内訳 ──────┐  ┌── おすすめメンバー ┐  │
│         │  │  [ドーナツチャート]   │  │  [ユーザーカード]  │  │
│         │  └──────────────────────┘  └──────────────────┘  │
│         │                                                   │
│         │  ┌── 相談できる先輩 ────────────────────────────┐  │
│         │  │  [シニアカード × 3]                          │  │
│         │  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. ウィジェット詳細仕様

### 2.1 サマリーカード（4枚）

| カード | データソース | 表示形式 |
|---|---|---|
| 今週の活動時間 | 今週月〜今日の logs を集計 | `x.x時間` |
| 累計時間 | `TH.data.getTotalMinutes(userId)` | `xxx.x時間` |
| ストリーク | `TH.data.getStreak(userId)` | `xx日` |
| バッジ数 | `TH.data.getEarnedBadges(userId).length` | `xx個` |

**カードデザイン**:
- `card` クラス
- アイコン（絵文字） + 数値（`text-2xl font-bold text-gray-900`） + ラベル（`text-xs text-gray-500`）
- 今週の活動: emerald accent、累計: indigo、ストリーク: amber、バッジ: purple

### 2.2 活動ヒートマップ

- `TH.ui.renderHeatmap('heatmap', userId, 26)` で描画
- 月ラベル（Jan, Feb...）を上部に表示
- 凡例を右下に表示（少 → 多）

月ラベル生成ロジック:
```javascript
// 26週分のセルのうち、月初（1日）に当たるセルの上に月名を表示
// heatmap-gridはCSSグリッドで列=週なので、列インデックスで月を判定する
```

### 2.3 クイック記録フォーム

| フィールド | 種別 | 選択肢 / 制約 |
|---|---|---|
| カテゴリ | ボタン選択（アイコン+ラベル） | 読書/資格勉強/個人開発/勉強会/OJT/その他 |
| タイトル | テキスト入力 | 必須、placeholder="何を学んだ？" |
| 時間 | `select` | 15/30/45/60/90/120 分 |
| 記録ボタン | button | 押下後ヒートマップとサマリーを再描画 |

保存後: `TH.ui.toast('記録しました！', 'success')` 表示

### 2.4 次のバッジ進捗

- 現在取得済みバッジの次のバッジを表示
- `時間系`: 現在時間 / 次のしきい値でプログレスバー
- `資格系`: 現在資格数 / 次のしきい値
- プログレスバー: `bg-indigo-600` の幅を % で設定

### 2.5 カテゴリ別円グラフ（Chart.js doughnut）

```javascript
// カテゴリ別累計分数を集計してドーナツチャートを描画
const breakdown = TH.data.getCategoryBreakdown(userId);
// Chart.js で canvas#categoryChart に描画
// 色: TH.fmt.categoryColor(cat) を使用
```

### 2.6 おすすめメンバー

- 自分と共通スキルタグを持つユーザーを上位3件表示
- 共通スキル名を「共通点」として表示
- カード: アバター・氏名・部署・共通スキルタグ
- クリック → `TH.nav.go('profile-view', userId)`

### 2.7 相談できる先輩

- `isAcceptingConsultation === true` のシニアユーザーを全員表示（最大3件）
- カード: アバター・氏名・相談タグ・「相談する」ボタン（ダミー押下でトースト）

---

## 3. Alpine.js データ構造

```javascript
function dashboardApp() {
  return {
    user: null,
    totalMinutes: 0,
    weekMinutes: 0,
    streak: 0,
    earnedBadges: [],
    recommendedUsers: [],
    seniorUsers: [],
    nextBadge: null,
    nextBadgeProgress: 0,

    // クイック記録フォーム
    logForm: {
      category: 'reading',
      title: '',
      durationMinutes: 60,
    },

    init() {
      if (!TH.auth.guard()) return;
      this.user = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', 'dashboard');
      this.loadStats();
      this.$nextTick(() => {
        TH.ui.renderHeatmap('heatmap', this.user.id, 26);
        this.renderCategoryChart();
      });
    },

    loadStats() {
      const uid = this.user.id;
      this.totalMinutes = TH.data.getTotalMinutes(uid);
      this.streak        = TH.data.getStreak(uid);
      this.earnedBadges  = TH.data.getEarnedBadges(uid);
      this.weekMinutes   = this._calcWeekMinutes(uid);
      this.recommendedUsers = this._getRecommended();
      this.seniorUsers   = TH.data.getUsers().filter(u =>
        u.role === 'senior' && u.isAcceptingConsultation && u.id !== this.user.id
      ).slice(0, 3);
      this._calcNextBadge();
    },

    addLog() {
      if (!this.logForm.title.trim()) {
        TH.ui.toast('タイトルを入力してください', 'error'); return;
      }
      const today = new Date().toISOString().split('T')[0];
      TH.data.addLog({
        id: `log_${Date.now()}`,
        userId: this.user.id,
        category: this.logForm.category,
        title: this.logForm.title,
        durationMinutes: Number(this.logForm.durationMinutes),
        loggedAt: today,
        memo: '', tags: [],
      });
      this.logForm.title = '';
      TH.ui.toast('記録しました！', 'success');
      this.loadStats();
      TH.ui.renderHeatmap('heatmap', this.user.id, 26);
      this.renderCategoryChart();
    },

    renderCategoryChart() { /* Chart.js ドーナツ */ },
    _calcWeekMinutes(uid) { /* 今週分のログを集計 */ },
    _getRecommended() { /* 共通スキルが多い順 上位3件 */ },
    _calcNextBadge() { /* 次に取得できるバッジを計算 */ },

    formatHours(min) { return TH.fmt.totalHours(min); },
    categoryLabel(cat) { return TH.fmt.categoryLabel(cat); },
    goToProfile(userId) { TH.nav.go('profile-view', userId); },
  }
}
```

---

## 4. レイアウト HTML 骨格

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <!-- 共通ヘッダー（Tailwind / Alpine / Chart.js / 共通JS/CSS） -->
</head>
<body x-data="dashboardApp()" x-init="init()" x-cloak>
<div class="app-layout">

  <!-- サイドバー -->
  <aside class="sidebar" id="sidebar"></aside>

  <!-- メインコンテンツ -->
  <main class="main-content">
    <div class="max-w-6xl mx-auto fade-in">

      <!-- ページヘッダー -->
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        おはようございます、<span x-text="user?.name?.split(' ')[1]"></span>さん ☀️
      </h1>

      <!-- サマリーカード 4枚 -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <!-- 各カード ... -->
      </div>

      <!-- ヒートマップ -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900">活動カレンダー</h2>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <span>少</span>
            <div class="heatmap-cell hm-0"></div>
            <div class="heatmap-cell hm-1"></div>
            <div class="heatmap-cell hm-2"></div>
            <div class="heatmap-cell hm-3"></div>
            <div class="heatmap-cell hm-4"></div>
            <span>多</span>
          </div>
        </div>
        <div class="heatmap-wrapper">
          <div id="heatmap"></div>
        </div>
      </div>

      <!-- 2カラム: クイック記録 + 次のバッジ -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- クイック記録 -->
        <div class="card">
          <h2 class="text-base font-semibold text-gray-900 mb-4">今日の記録 ✏️</h2>
          <!-- カテゴリボタン群 -->
          <!-- タイトル入力 -->
          <!-- 時間セレクト + 記録ボタン -->
        </div>

        <!-- 次のバッジ -->
        <div class="card">
          <h2 class="text-base font-semibold text-gray-900 mb-4">次のバッジまで 🏅</h2>
          <!-- バッジ名 -->
          <!-- プログレスバー -->
          <!-- xx / yy時間 テキスト -->
        </div>
      </div>

      <!-- 2カラム: カテゴリ内訳 + おすすめメンバー -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="card">
          <h2 class="text-base font-semibold text-gray-900 mb-4">カテゴリ別内訳</h2>
          <canvas id="categoryChart" height="200"></canvas>
        </div>
        <div class="card">
          <h2 class="text-base font-semibold text-gray-900 mb-4">共通点のあるメンバー 👥</h2>
          <!-- ユーザーカード × 3 -->
        </div>
      </div>

      <!-- 相談できる先輩 -->
      <div class="card">
        <h2 class="text-base font-semibold text-gray-900 mb-4">相談できる先輩 💬</h2>
        <div class="grid grid-cols-3 gap-4">
          <!-- シニアカード × N -->
        </div>
      </div>

    </div>
  </main>
</div>
</body>
</html>
```

---

## 5. Chart.js 実装メモ

```javascript
renderCategoryChart() {
  const uid = this.user.id;
  const breakdown = TH.data.getCategoryBreakdown(uid);
  const labels  = Object.keys(breakdown).map(c => TH.fmt.categoryLabel(c));
  const data    = Object.values(breakdown);
  const colors  = Object.keys(breakdown).map(c => TH.fmt.categoryColor(c));

  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  if (window._categoryChart) window._categoryChart.destroy();
  window._categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 12 }, boxWidth: 12 } }
      },
      cutout: '65%',
    }
  });
}
```

---

## 6. 実装後のチェック項目

- [ ] 未ログイン状態でアクセスするとindex.htmlにリダイレクトされる
- [ ] サイドバーにログインユーザーの名前・部署が表示される
- [ ] 4枚のサマリーカードに正しい数値が表示される
- [ ] ヒートマップが26週分描画される
- [ ] クイック記録フォームから記録するとヒートマップが更新される
- [ ] カテゴリ別ドーナツチャートが表示される
- [ ] おすすめメンバーカードのクリックでprofile-view.htmlに遷移する
- [ ] ログアウトボタンでindex.htmlに遷移する
