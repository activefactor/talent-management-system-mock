# Step 8: 相談窓口一覧画面設計書

**対象ファイル**: `mock/consultation.html`
**依存ステップ**: Step 1（共通基盤）/ Step 2（認証）
**画面ID**: S10

---

## 1. 画面構成（ワイヤーフレーム）

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  相談窓口                                          │
│         │  ─────────────────────────────────────────────   │
│         │                                                   │
│         │  先輩エンジニアに相談してみよう。                   │
│         │  気軽に声をかけてください。                        │
│         │                                                   │
│         │  ──── 相談受付中 ─────────────────────────────   │
│         │                                                   │
│         │  ┌──────────────────────────────────────────┐   │
│         │  │ [Avatar]  佐藤 花子                        │   │
│         │  │           開発部 · テックリード             │   │
│         │  │           ✅ 相談受付中                    │   │
│         │  │                                           │   │
│         │  │ 得意分野:                                  │   │
│         │  │ [TypeScript][React][Next.js]              │   │
│         │  │ [キャリア相談][コードレビュー]               │   │
│         │  │                                           │   │
│         │  │ 自己紹介: フロントエンドとAPI...             │   │
│         │  │                                           │   │
│         │  │ [プロフィールを見る]  [相談リクエスト(準備中)]│   │
│         │  └──────────────────────────────────────────┘   │
│         │                                                   │
│         │  ┌──────────────────────────────────────────┐   │
│         │  │ [Avatar]  田中 健一  ...（同様）           │   │
│         │  └──────────────────────────────────────────┘   │
│         │                                                   │
│         │  ──── シニアエンジニア全員 ───────────────────   │
│         │  ┌──────────┐  ┌──────────┐                    │
│         │  │ [Avatar]  │  │ [Avatar]  │ ← 受付停止中は    │
│         │  │ 山田 太郎  │  │ （他）   │    グレーアウト    │
│         │  └──────────┘  └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. セクション構成

### セクション1: 相談受付中カード（大カード）

`isAcceptingConsultation === true` かつ `role === 'senior'` のユーザーを大きいカードで表示。

**カードデザイン**:
```
┌──────────────────────────────────────────────────────────┐
│ 左: Avatar (64px)  右: ユーザー情報                        │
│                    氏名 (font-semibold text-lg)           │
│                    部署 · 役職 (text-gray-500 text-sm)    │
│                    [✅ 相談受付中] (green badge)          │
│                                                          │
│ 得意分野タグ: [tag1][tag2][tag3]...                       │
│                                                          │
│ 自己紹介テキスト（2行クランプ）                             │
│                                                          │
│ [プロフィールを見る] [相談リクエスト(準備中)]               │
└──────────────────────────────────────────────────────────┘
```

**ボタン仕様**:
- `プロフィールを見る`: `TH.nav.go('profile-view', userId)`
- `相談リクエスト`: ダミーボタン。クリックすると `TH.ui.toast('相談リクエスト機能は準備中です。直接Slackでメッセージしてください！', 'info')` を表示

### セクション2: シニアエンジニア全員（小カード グリッド）

`role === 'senior'` 全員を小カードで表示（受付中/停止中 両方）。

```
┌────────────────────────┐
│ [Avatar 48px]          │
│ 氏名 font-semibold text-sm │
│ 部署 · 役職 text-xs     │
│ [受付中 ✅] or [受付停止 ⛔]│
└────────────────────────┘
```

受付停止中の場合: カード全体に `opacity-60` + `grayscale` CSS クラスを追加。

---

## 3. シニアロール向け: 自分の相談設定表示（条件付き）

ログインユーザーが `senior` ロールの場合、ページ上部に「あなたの相談受付設定」セクションを表示する。

```
┌── あなたの相談受付設定 ─────────────────────────────────┐
│                                                        │
│  相談受付: [ON / OFF トグル]                             │
│                                                        │
│  受付中の相談分野:                                       │
│  [TypeScript][React][✕]  [+ タグを追加]                 │
│                                                        │
│                               [設定を保存]              │
└────────────────────────────────────────────────────────┘
```

保存処理:
```javascript
saveConsultationSettings() {
  const updated = {
    ...this.currentUser,
    isAcceptingConsultation: this.mySettings.isAccepting,
    consultationTags: this.mySettings.tags,
  };
  TH.data.saveUser(updated);
  TH.auth.login(this.currentUser.role); // currentUserのキャッシュを更新
  TH.ui.toast('相談設定を保存しました', 'success');
  // ページリロードして反映
  setTimeout(() => location.reload(), 500);
}
```

---

## 4. Alpine.js データ構造

```javascript
function consultationApp() {
  return {
    currentUser: null,
    acceptingSeniors: [],
    allSeniors: [],

    // 自分がseniorの場合の設定フォーム
    mySettings: {
      isAccepting: false,
      tags: [],
    },
    newTagInput: '',

    init() {
      if (!TH.auth.guard()) return;
      this.currentUser = TH.auth.getCurrentUser();
      TH.ui.renderSidebar('sidebar', 'consultation');

      const users = TH.data.getUsers();
      // 自分を除いたシニア
      this.allSeniors = users.filter(u =>
        (u.role === 'senior' || u.role === 'admin') && u.id !== this.currentUser.id
      );
      this.acceptingSeniors = this.allSeniors.filter(u => u.isAcceptingConsultation);

      // 自分がseniorなら設定フォーム初期化
      if (this.currentUser.role === 'senior') {
        this.mySettings = {
          isAccepting: this.currentUser.isAcceptingConsultation || false,
          tags: [...(this.currentUser.consultationTags || [])],
        };
      }
    },

    showConsultationRequest(userName) {
      TH.ui.toast(
        `相談リクエスト機能は準備中です。${userName}さんにSlackで直接メッセージしてください！`,
        'info'
      );
    },

    saveConsultationSettings() { /* 上記参照 */ },

    addTag() {
      const t = this.newTagInput.trim();
      if (t && !this.mySettings.tags.includes(t)) this.mySettings.tags.push(t);
      this.newTagInput = '';
    },

    removeTag(tag) {
      this.mySettings.tags = this.mySettings.tags.filter(t => t !== tag);
    },

    goToProfile(userId) { TH.nav.go('profile-view', userId); },
    totalHours(userId) { return TH.fmt.totalHours(TH.data.getTotalMinutes(userId)); },
  }
}
```

---

## 5. HTMLスケルトン

```html
<body x-data="consultationApp()" x-init="init()" x-cloak>
<div class="app-layout">
  <aside class="sidebar" id="sidebar"></aside>
  <main class="main-content">
    <div class="max-w-4xl mx-auto fade-in">

      <!-- ページタイトル -->
      <h1 class="text-2xl font-bold text-gray-900 mb-2">相談窓口 💬</h1>
      <p class="text-gray-500 text-sm mb-6">
        先輩エンジニアに気軽に相談してみましょう。技術的な質問からキャリア相談まで受け付けています。
      </p>

      <!-- 自分の設定 (seniorのみ) -->
      <template x-if="currentUser?.role === 'senior'">
        <div class="card mb-8 border-l-4 border-indigo-500">
          <h2 class="text-base font-semibold text-gray-900 mb-4">あなたの相談受付設定</h2>
          <!-- トグル + タグ + 保存ボタン -->
        </div>
      </template>

      <!-- 相談受付中 -->
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        相談受付中 <span class="badge-chip badge-green text-xs ml-2"
                        x-text="`${acceptingSeniors.length}名`"></span>
      </h2>

      <div class="space-y-4 mb-10">
        <template x-for="u in acceptingSeniors" :key="u.id">
          <div class="card">
            <div class="flex gap-4">
              <!-- Avatar -->
              <div class="avatar w-16 h-16 text-xl flex-shrink-0"
                   :style="`background:${u.avatarColor}`"
                   x-text="u.avatarInitial"></div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <!-- ヘッダー行 -->
                <!-- タグ行 -->
                <!-- 自己紹介 -->
                <!-- ボタン行 -->
              </div>
            </div>
          </div>
        </template>
        <!-- 0件 -->
        <div x-show="acceptingSeniors.length === 0" class="text-center py-8 text-gray-400">
          <p class="text-3xl mb-2">🌿</p>
          <p class="text-sm">現在、相談受付中のエンジニアはいません</p>
        </div>
      </div>

      <!-- シニア全員 -->
      <h2 class="text-lg font-semibold text-gray-900 mb-4">シニアエンジニア一覧</h2>
      <div class="grid grid-cols-4 gap-4">
        <template x-for="u in allSeniors" :key="u.id">
          <div class="card text-center cursor-pointer hover:shadow-md transition-shadow"
               :class="u.isAcceptingConsultation ? '' : 'opacity-60 grayscale'"
               @click="goToProfile(u.id)">
            <!-- 小カード -->
          </div>
        </template>
      </div>

    </div>
  </main>
</div>
</body>
```

---

## 6. 実装後のチェック項目

- [ ] 相談受付中のシニアエンジニアが大カードで表示される
- [ ] 相談受付停止中のシニアはグレーアウト表示される
- [ ] 「相談リクエスト」ボタンでトースト通知が表示される
- [ ] 「プロフィールを見る」ボタンでprofile-view.htmlに遷移する
- [ ] seniorロールでログインしている場合、相談設定フォームが表示される
- [ ] 相談受付設定のON/OFFをトグルして保存するとリストに反映される
- [ ] 相談タグの追加・削除・保存が正しく動作する
