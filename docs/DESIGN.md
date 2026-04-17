# TalentHub デザインシステム

**バージョン**: 1.0.0
**最終更新**: 2026-04-17
**ステータス**: モック反映中（随時更新）

> モックで確認・決定したデザインは「モック反映済み」マークを付けてこのドキュメントに追記すること。
> 更新ルールは [mock-rules.md](./mock-rules.md) を参照。

---

## 1. カラーパレット

### プライマリカラー

| 用途 | 変数名（Tailwind） | Hex | 使用場面 |
|---|---|---|---|
| Primary | `indigo-600` | `#4F46E5` | ボタン・アクティブ状態・リンク・ブランドカラー |
| Primary Light | `indigo-50` | `#EEF2FF` | アクティブ背景・選択状態の背景 |
| Primary Border | `indigo-200` | `#C7D2FE` | フォーカス枠・選択中タグの枠 |

### セマンティックカラー

| 用途 | 変数名 | Hex | 使用場面 |
|---|---|---|---|
| Success | `emerald-500` | `#10B981` | 完了バッジ・ストリーク・正常状態 |
| Warning | `amber-500` | `#F59E0B` | バッジ（時間系）・注意・ストリーク強調 |
| Danger | `red-500` | `#EF4444` | エラー・有効期限切れ |
| Info | `blue-500` | `#3B82F6` | 情報・資格バッジ |

### グレースケール

| 用途 | 変数名 | 使用場面 |
|---|---|---|
| Heading | `gray-900` | 見出しテキスト |
| Body | `gray-700` | 本文テキスト |
| Secondary | `gray-500` | サブテキスト・ラベル |
| Muted | `gray-400` | プレースホルダー・無効状態 |
| Border | `gray-200` | カード枠・区切り線 |
| Surface | `gray-100` | ホバー背景・入力背景 |
| Background | `gray-50` | ページ背景 |

### 学習ヒートマップ専用カラー

| レベル | 条件 | 色 | Hex |
|---|---|---|---|
| 0 | 未記録 | Light gray | `#ebedf0` |
| 1 | 1〜44分 | Light green | `#9be9a8` |
| 2 | 45〜89分 | Medium green | `#40c463` |
| 3 | 90〜119分 | Dark green | `#30a14e` |
| 4 | 120分以上 | Darkest green | `#216e39` |

### スキルレベルカラー

| レベル | ラベル | 色 | Tailwind |
|---|---|---|---|
| 1〜2 | 初級 | Gray | `gray-400` |
| 3 | 中級 | Blue | `blue-500` |
| 4 | 上級 | Indigo | `indigo-500` |
| 5 | エキスパート | Purple | `purple-600` |

---

## 2. タイポグラフィ

### フォント

- **フォントファミリー**: システムフォントスタック（`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`）
- **言語**: 日本語 + 英語混在

### テキストスケール

| 種別 | サイズ | Weight | Tailwind | 使用場面 |
|---|---|---|---|---|
| Page Title | 24px | 700 | `text-2xl font-bold` | ページ見出し |
| Section Title | 18px | 600 | `text-lg font-semibold` | セクション見出し |
| Card Title | 16px | 600 | `text-base font-semibold` | カード見出し |
| Body | 14px | 400 | `text-sm` | 本文・ラベル |
| Small | 12px | 400 | `text-xs` | キャプション・メタ情報 |
| Badge/Tag | 12px | 500 | `text-xs font-medium` | タグ・バッジラベル |

---

## 3. スペーシング・レイアウト

### グリッドシステム

- **サイドバー幅**: 240px（`w-60`）
- **メインコンテンツ**: 残り幅、最大幅 `max-w-6xl`
- **カードグリッド**: 2カラム（タブレット以上）、1カラム（モバイル）
- **コンテンツパディング**: 24px（`p-6`）

### カード

```
背景: white
角丸: 12px (rounded-xl)
シャドウ: 0 1px 3px rgba(0,0,0,0.10) (shadow-sm)
パディング: 20px (p-5) または 24px (p-6)
```

### ボタン

| 種別 | スタイル |
|---|---|
| Primary | `bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700` |
| Secondary | `bg-white text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50` |
| Danger | `bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700` |
| Ghost | `text-indigo-600 hover:bg-indigo-50 rounded-lg px-4 py-2` |

### フォーム要素

```
入力フィールド: border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent
セレクトボックス: 同上
テキストエリア: 同上、resize-none
```

---

## 4. コンポーネントパターン

### 4.1 ユーザーカード（メンバー一覧）

```
┌─────────────────────────────────┐
│ [Avatar] 氏名         ロールバッジ│
│          部署・役職               │
│ ─────────────────────────────── │
│ スキルタグ × 3〜5件               │
│ ─────────────────────────────── │
│ 累計 ○○時間  🏅 バッジ ×N件      │
└─────────────────────────────────┘
```

### 4.2 スキルタグ

```
言語系: bg-indigo-100 text-indigo-700 (レベル5)
       bg-blue-100 text-blue-700   (レベル3-4)
       bg-gray-100 text-gray-600   (レベル1-2)
FW系:   bg-purple-100 text-purple-700
インフラ: bg-orange-100 text-orange-700
ドメイン: bg-teal-100 text-teal-700
```

### 4.3 スキルレベルインジケーター（ドット5個）

```
● ● ● ○ ○  レベル3/5
塗りつぶし: スキルカテゴリに応じた色
空白: gray-200
```

### 4.4 バッジ表示

```
時間系バッジ: amber背景 + 時計アイコン
資格系バッジ: blue背景 + 証書アイコン
ストリーク系: orange背景 + 炎アイコン
プロフィール: purple背景 + スター アイコン
```

### 4.5 活動ヒートマップ

- GitHub のコントリビューショングラフ準拠
- 表示期間: 直近26週（6ヶ月）
- セルサイズ: 11×11px、間隔 3px
- 月ラベルを上部に表示

### 4.6 タブナビゲーション

```
アクティブ: border-bottom 2px solid indigo-600 + text-indigo-600
非アクティブ: text-gray-500 + hover:text-gray-700
```

### 4.7 ページネーションなしの「もっと見る」

- 初期表示: 6件
- 「もっと見る」ボタンで全件表示

### 4.8 トースト通知

```
位置: 右下固定 (bottom-6 right-6)
成功: bg-emerald-600 text-white
エラー: bg-red-600 text-white
表示時間: 3秒後自動消去
アニメーション: 下からスライドイン
```

---

## 5. アイコン使用方針

- **アイコンセット**: Heroicons（SVGインライン）
- **サイズ**: 20px（`w-5 h-5`）基本、16px（`w-4 h-4`）小表示用
- **色**: 親要素のテキスト色を継承（`currentColor`）

### 主要アイコン割り当て

| 機能 | アイコン |
|---|---|
| ダッシュボード | home |
| メンバー検索 | users |
| 学習ログ | book-open |
| 相談窓口 | chat-bubble-left-right |
| バッジ | trophy |
| スキルマップ | chart-bar |
| ユーザー管理 | cog-6-tooth |
| プロフィール編集 | pencil |
| 追加 | plus |
| 削除 | trash |
| 保存 | check |
| ログアウト | arrow-right-on-rectangle |

---

## 6. アニメーション・トランジション

| 種別 | 設定 |
|---|---|
| 画面遷移 | fadeIn + translateY(4px→0), duration 200ms |
| ホバー | background-color transition 150ms |
| モーダル | scale(0.95→1) + opacity(0→1), duration 200ms |
| トースト | translateY(20px→0) + opacity, duration 300ms |

---

## 7. レスポンシブ方針

| ブレークポイント | 対応 |
|---|---|
| デスクトップ (1024px+) | サイドバー固定表示、2カラムレイアウト |
| タブレット (768px+) | サイドバー折りたたみ可能、1〜2カラム |
| モバイル (< 768px) | ボトムナビゲーション、1カラム |

> モックはデスクトップ表示を優先して実装する。

---

## 8. パーソナリティ表示

### ストレングスファインダー レーダーチャート

- 4軸: 実行力 / 影響力 / 人間関係構築力 / 戦略的思考力
- スコア: TOP5のうち各領域に属する資質の数（0〜5）
- Chart.js Radar を使用
- カラー: `rgba(79, 70, 229, 0.3)` fill + `#4F46E5` border

### MBTI 表示

- タイプバッジ: 16タイプをカラーコード付きで表示
- 4軸バー: E/I, S/N, T/F, J/P を横バーグラフで表示

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2026-04-17 | 1.0.0 | 初版作成（モック実装ベース） |
