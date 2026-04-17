# Step 2: ログイン画面設計書

**対象ファイル**: `mock/index.html`
**依存ステップ**: Step 1（css/style.css, js/data.js, js/auth.js, js/common.js）
**画面ID**: S01

---

## 1. 画面概要

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│           (Indigo → Purple グラデーション背景)         │
│                                                     │
│   ┌───────────────────────────────────────────┐    │
│   │                                           │    │
│   │   [ロゴ] TalentHub                        │    │
│   │   エンジニアのスキルと成長を可視化する       │    │
│   │                                           │    │
│   │   ─────────────────────────────────────   │    │
│   │                                           │    │
│   │   メールアドレス [___________________]    │    │
│   │   パスワード    [___________________]    │    │
│   │                                           │    │
│   │   ─────────────────────────────────────   │    │
│   │                                           │    │
│   │   [MS アイコン] Microsoftアカウントでログイン │    │
│   │                                           │    │
│   │   ─────────────────────────────────────   │    │
│   │   【デモ用】確認するロール:                 │    │
│   │   ○ 管理者  ● シニア  ○ 一般              │    │
│   │                                           │    │
│   │   社内エンジニア専用システムです            │    │
│   └───────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. デザイン仕様

| 要素 | 仕様 |
|---|---|
| 背景 | `bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800` 全画面 |
| カード | `bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto` |
| ロゴ | 紺色の四角アイコン（`bg-indigo-600 rounded-xl p-2 w-10 h-10`）+ "TalentHub" テキスト |
| キャッチコピー | `text-gray-500 text-sm` |
| 入力フィールド | 通常のtextフィールド、何を入力してもOK（バリデーションなし） |
| ログインボタン | `bg-white border border-gray-200 rounded-lg py-3 px-4 w-full flex items-center gap-3 hover:bg-gray-50` |
| MSアイコン | SVGインライン（Microsoftロゴの4色グリッド）|
| デモ用セクション | 薄い黄色背景（`bg-amber-50 border border-amber-200 rounded-lg p-4`）で視覚的に区別 |
| ラジオボタン | `管理者 / シニアエンジニア / 一般エンジニア` の3択 |
| 注記テキスト | `text-gray-400 text-xs text-center` |

---

## 3. Alpine.js データ構造

```javascript
function loginApp() {
  return {
    email: '',
    password: '',
    selectedRole: 'engineer',  // 'admin' | 'senior' | 'engineer'
    isLoading: false,

    login() {
      this.isLoading = true;
      // 何を入力してもログイン成功（モック）
      setTimeout(() => {
        TH.auth.login(this.selectedRole);
        window.location.href = 'dashboard.html';
      }, 800); // ローディング演出のため少し待つ
    }
  }
}
```

---

## 4. HTMLテンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ログイン - TalentHub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js"></script>
  <script src="js/data.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/common.js"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800
             flex items-center justify-center p-4"
      x-data="loginApp()" x-cloak>

  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

    <!-- ロゴ -->
    <div class="flex items-center gap-3 mb-2">
      <div class="bg-indigo-600 rounded-xl w-10 h-10 flex items-center justify-center">
        <!-- 人アイコン（SVG） -->
        <svg class="w-6 h-6 text-white" ...></svg>
      </div>
      <span class="text-2xl font-bold text-gray-900">TalentHub</span>
    </div>
    <p class="text-gray-500 text-sm mb-8">エンジニアのスキルと成長を可視化する社内システム</p>

    <!-- 入力フィールド -->
    <div class="space-y-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
        <input type="email" x-model="email" placeholder="you@company.com"
               class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
        <input type="password" x-model="password" placeholder="••••••••"
               class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500">
      </div>
    </div>

    <!-- Microsoftログインボタン -->
    <button @click="login()" :disabled="isLoading"
            class="w-full flex items-center justify-center gap-3 border border-gray-200
                   rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors font-medium text-gray-700
                   disabled:opacity-60">
      <!-- Microsoft ロゴ SVG（4色グリッド） -->
      <svg width="20" height="20" viewBox="0 0 20 20">
        <rect x="1"  y="1"  width="8.5" height="8.5" fill="#F35325"/>
        <rect x="10.5" y="1"  width="8.5" height="8.5" fill="#81BC06"/>
        <rect x="1"  y="10.5" width="8.5" height="8.5" fill="#05A6F0"/>
        <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFBA08"/>
      </svg>
      <span x-text="isLoading ? '認証中...' : 'Microsoftアカウントでログイン'"></span>
    </button>

    <!-- デモ用ロール選択 -->
    <div class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <p class="text-xs font-semibold text-amber-800 mb-3">🎭 デモ用: 確認するロールを選択</p>
      <div class="flex gap-4">
        <template x-for="opt in [{value:'admin',label:'管理者'}, {value:'senior',label:'シニア'}, {value:'engineer',label:'一般'}]">
          <label class="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
            <input type="radio" :value="opt.value" x-model="selectedRole" class="accent-indigo-600">
            <span x-text="opt.label"></span>
          </label>
        </template>
      </div>
      <p class="text-xs text-amber-600 mt-2">
        ※ 何を入力してもログイン可能。ロールによって表示できる画面が変わります。
      </p>
    </div>

    <!-- 注記 -->
    <p class="text-xs text-gray-400 text-center mt-6">
      社内エンジニア専用システムです。<br>
      社外からのアクセスは許可されていません。
    </p>
  </div>

  <script>
    function loginApp() {
      return {
        email: '',
        password: '',
        selectedRole: 'engineer',
        isLoading: false,
        login() {
          this.isLoading = true;
          setTimeout(() => {
            TH.auth.login(this.selectedRole);
            window.location.href = 'dashboard.html';
          }, 800);
        }
      }
    }
  </script>
</body>
</html>
```

---

## 5. 実装後のチェック項目

- [ ] グラデーション背景が表示される
- [ ] カードが中央寄せで表示される
- [ ] ロールラジオボタンで3択が選べる
- [ ] ボタン押下後に「認証中...」と表示され0.8秒後にdashboard.htmlへ遷移する
- [ ] `TH.auth.getCurrentUser()` でログインユーザーが返る
- [ ] dashboard.html側で auth.guard() が通過できる
