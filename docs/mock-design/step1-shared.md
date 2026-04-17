# Step 1: 共通基盤設計書

**対象ファイル**:
- `mock/css/style.css`
- `mock/js/data.js`
- `mock/js/auth.js`
- `mock/js/common.js`

**前提**: なし（最初に実装するステップ）
**次のステップ**: Step 2（index.html）以降すべてがこのステップに依存する

---

## 1. `mock/css/style.css`

Tailwind CDN で補えないカスタムスタイルを定義する。

```css
/* ============================================================
   TalentHub Mock - Custom Styles
   Tailwindで表現できないもののみここに書く
   ============================================================ */

/* Alpine.js 初期化前の非表示 */
[x-cloak] { display: none !important; }

/* ============================================================
   レイアウト
   ============================================================ */

/* サイドバー固定レイアウト */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #F9FAFB; /* gray-50 */
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* ============================================================
   サイドバー
   ============================================================ */

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6B7280;
  transition: background-color 0.15s, color 0.15s;
  text-decoration: none;
  user-select: none;
}

.sidebar-nav-item:hover {
  background-color: #F3F4F6;
  color: #111827;
}

.sidebar-nav-item.active {
  background-color: #EEF2FF;
  color: #4F46E5;
  font-weight: 500;
}

.sidebar-nav-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ============================================================
   学習ヒートマップ
   ============================================================ */

.heatmap-wrapper {
  overflow-x: auto;
}

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 3px;
  width: fit-content;
}

.heatmap-cell {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  cursor: default;
}

.heatmap-cell:hover {
  opacity: 0.8;
  outline: 1px solid rgba(0,0,0,0.2);
}

/* レベル別色（DESIGN.md 準拠） */
.hm-0 { background-color: #ebedf0; }
.hm-1 { background-color: #9be9a8; }
.hm-2 { background-color: #40c463; }
.hm-3 { background-color: #30a14e; }
.hm-4 { background-color: #216e39; }

/* ============================================================
   スキルレベルドット
   ============================================================ */

.skill-dots {
  display: inline-flex;
  gap: 3px;
}

.skill-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.skill-dot-filled-language  { background-color: #4F46E5; } /* indigo */
.skill-dot-filled-framework { background-color: #7C3AED; } /* purple */
.skill-dot-filled-infra     { background-color: #EA580C; } /* orange */
.skill-dot-filled-domain    { background-color: #0D9488; } /* teal */
.skill-dot-filled-default   { background-color: #6B7280; } /* gray */
.skill-dot-empty            { background-color: #E5E7EB; }

/* ============================================================
   タグ・バッジ
   ============================================================ */

.skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.skill-tag-language  { background-color: #EEF2FF; color: #4338CA; }
.skill-tag-framework { background-color: #F5F3FF; color: #6D28D9; }
.skill-tag-infra     { background-color: #FFF7ED; color: #C2410C; }
.skill-tag-domain    { background-color: #F0FDFA; color: #0F766E; }
.skill-tag-interest  { background-color: #F0F9FF; color: #0369A1; }

.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.badge-amber  { background-color: #FEF3C7; color: #92400E; }
.badge-orange { background-color: #FFEDD5; color: #9A3412; }
.badge-blue   { background-color: #DBEAFE; color: #1E40AF; }
.badge-indigo { background-color: #E0E7FF; color: #3730A3; }
.badge-purple { background-color: #F3E8FF; color: #6B21A8; }
.badge-green  { background-color: #D1FAE5; color: #065F46; }
.badge-red    { background-color: #FEE2E2; color: #991B1B; }

/* ============================================================
   カード
   ============================================================ */

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 20px;
}

/* ============================================================
   タブ
   ============================================================ */

.tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #E5E7EB;
  overflow-x: auto;
}

.tab-btn {
  padding: 10px 16px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: #6B7280;
  white-space: nowrap;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  transition: color 0.15s;
  margin-bottom: -1px;
}

.tab-btn:hover { color: #374151; }

.tab-btn.active {
  border-bottom-color: #4F46E5;
  color: #4F46E5;
  font-weight: 500;
}

/* ============================================================
   トースト通知
   ============================================================ */

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: toast-in 0.3s ease;
  max-width: 320px;
}

.toast-success { background-color: #059669; color: #ffffff; }
.toast-error   { background-color: #DC2626; color: #ffffff; }
.toast-info    { background-color: #2563EB; color: #ffffff; }

@keyframes toast-in {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* ============================================================
   アニメーション
   ============================================================ */

.fade-in {
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   スクロールバー（Webkit）
   ============================================================ */

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

/* ============================================================
   ユーティリティ
   ============================================================ */

/* アバター（イニシャル表示） */
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

/* ロールバッジ */
.role-badge-admin   { background-color: #FEF3C7; color: #92400E; }
.role-badge-senior  { background-color: #E0E7FF; color: #3730A3; }
.role-badge-engineer{ background-color: #F0FDF4; color: #166534; }
```

---

## 2. `mock/js/data.js`

シードデータ定義と localStorage CRUD を一元管理するファイル。
グローバル名前空間 `TH` に `data` オブジェクトをアタッチする。

```javascript
/* ============================================================
   TalentHub Mock - data.js
   シードデータ + localStorage CRUD
   ============================================================ */

window.TH = window.TH || {};

TH.data = (function () {

  // ── バッジ定義 ────────────────────────────────────────────
  const BADGE_DEFINITIONS = [
    { code: 'hours_10',   name: '10時間達成',    icon: '⏱',  colorClass: 'badge-amber',  type: 'hours',   threshold: 600   },
    { code: 'hours_50',   name: '50時間達成',    icon: '⏱',  colorClass: 'badge-amber',  type: 'hours',   threshold: 3000  },
    { code: 'hours_100',  name: '100時間達成',   icon: '🏅',  colorClass: 'badge-amber',  type: 'hours',   threshold: 6000  },
    { code: 'hours_300',  name: '300時間達成',   icon: '🥇',  colorClass: 'badge-orange', type: 'hours',   threshold: 18000 },
    { code: 'hours_500',  name: '500時間達成',   icon: '🏆',  colorClass: 'badge-orange', type: 'hours',   threshold: 30000 },
    { code: 'hours_1000', name: '1000時間達成',  icon: '👑',  colorClass: 'badge-red',    type: 'hours',   threshold: 60000 },
    { code: 'certs_1',    name: 'はじめての資格', icon: '📜',  colorClass: 'badge-blue',   type: 'certs',   threshold: 1     },
    { code: 'certs_3',    name: '資格コレクター', icon: '📚',  colorClass: 'badge-blue',   type: 'certs',   threshold: 3     },
    { code: 'certs_5',    name: '資格マスター',   icon: '🎓',  colorClass: 'badge-indigo', type: 'certs',   threshold: 5     },
    { code: 'certs_10',   name: '資格レジェンド', icon: '🌟',  colorClass: 'badge-purple', type: 'certs',   threshold: 10    },
    { code: 'streak_7',   name: '7日ストリーク',  icon: '🔥',  colorClass: 'badge-orange', type: 'streak',  threshold: 7     },
    { code: 'streak_30',  name: '30日ストリーク', icon: '🔥',  colorClass: 'badge-red',    type: 'streak',  threshold: 30    },
    { code: 'streak_100', name: '100日ストリーク',icon: '💎',  colorClass: 'badge-red',    type: 'streak',  threshold: 100   },
    { code: 'profile_complete',   name: 'プロフィール完成',   icon: '✅', colorClass: 'badge-green',  type: 'profile' },
    { code: 'personality_public', name: 'パーソナリティ公開', icon: '💡', colorClass: 'badge-purple', type: 'profile' },
  ];

  // ── StrengthsFinder 領域マッピング ────────────────────────
  const STRENGTHS_DOMAIN_MAP = {
    '実行力':         ['達成欲','調和性','信念','公平性','慎重さ','規律性','集中力','責任感','回復志向'],
    '影響力':         ['活発性','指令性','コミュニケーション','競争性','最上志向','自己確信','自我','社交性'],
    '人間関係構築力': ['適応性','親密性','開発志向','共感性','包含','個別化','ポジティブ','関係性'],
    '戦略的思考力':   ['分析思考','未来志向','着想','知的好奇心','学習欲','戦略性','収集心'],
  };

  // ── シードユーザー ────────────────────────────────────────
  function _getSeedUsers() {
    return [
      {
        id: 'u001', name: '山田 太郎', email: 'yamada@example.com',
        role: 'admin', department: '開発部', grade: '部長', joinYear: 2015,
        avatarColor: '#4F46E5', avatarInitial: '山',
        bio: 'フルスタック開発とチームマネジメントが専門。社内の技術基盤強化に注力しています。',
        github: 'yamada-taro', currentFocus: 'アーキテクチャ改善とチームの生産性向上',
        interestTags: ['アーキテクチャ', 'DevOps', 'チームビルディング'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's001', category: 'language',  name: 'TypeScript', level: 5 },
          { id: 's002', category: 'language',  name: 'Go',         level: 4 },
          { id: 's003', category: 'language',  name: 'Python',     level: 3 },
          { id: 's004', category: 'framework', name: 'Next.js',    level: 5 },
          { id: 's005', category: 'framework', name: 'React',      level: 5 },
          { id: 's006', category: 'infra',     name: 'AWS',        level: 4 },
          { id: 's007', category: 'infra',     name: 'Kubernetes', level: 3 },
          { id: 's008', category: 'domain',    name: 'フィンテック', level: 3 },
        ],
        certifications: [
          { id: 'c001', name: 'AWS Solutions Architect Professional', issuer: 'AWS',    acquiredAt: '2022-06', expiresAt: '2025-06' },
          { id: 'c002', name: '情報処理安全確保支援士',                 issuer: 'IPA',    acquiredAt: '2020-10', expiresAt: null       },
          { id: 'c003', name: 'Google Cloud Professional Data Engineer',issuer: 'Google',acquiredAt: '2023-03', expiresAt: '2026-03' },
        ],
        personality: { strengthsTop5: ['戦略性','着想','分析思考','学習欲','収集心'], mbtiType: 'ENTJ', visibility: 'public' },
      },
      {
        id: 'u002', name: '佐藤 花子', email: 'sato@example.com',
        role: 'senior', department: '開発部', grade: 'テックリード', joinYear: 2017,
        avatarColor: '#0891B2', avatarInitial: '佐',
        bio: 'フロントエンドとAPIデザインが専門。チームのコードレビューとアーキテクチャ設計をリードしています。',
        github: 'hanako-sato', currentFocus: 'マイクロサービスアーキテクチャへの移行',
        interestTags: ['フロントエンド', 'APIデザイン', 'パフォーマンス最適化'],
        isAcceptingConsultation: true,
        consultationTags: ['TypeScript', 'React', 'Next.js', 'キャリア相談', 'コードレビュー'],
        skills: [
          { id: 's010', category: 'language',  name: 'TypeScript', level: 5 },
          { id: 's011', category: 'language',  name: 'Go',         level: 4 },
          { id: 's012', category: 'language',  name: 'Python',     level: 3 },
          { id: 's013', category: 'framework', name: 'Next.js',    level: 5 },
          { id: 's014', category: 'framework', name: 'React',      level: 5 },
          { id: 's015', category: 'framework', name: 'GraphQL',    level: 4 },
          { id: 's016', category: 'infra',     name: 'AWS',        level: 4 },
          { id: 's017', category: 'infra',     name: 'Docker',     level: 4 },
        ],
        certifications: [
          { id: 'c010', name: 'AWS Solutions Architect Professional', issuer: 'AWS', acquiredAt: '2023-06', expiresAt: '2026-06' },
          { id: 'c011', name: '情報処理安全確保支援士',                issuer: 'IPA', acquiredAt: '2022-10', expiresAt: null      },
        ],
        personality: { strengthsTop5: ['戦略性','着想','分析思考','学習欲','収集心'], mbtiType: 'INTJ', visibility: 'public' },
      },
      {
        id: 'u003', name: '田中 健一', email: 'tanaka@example.com',
        role: 'senior', department: 'インフラ部', grade: 'シニアエンジニア', joinYear: 2018,
        avatarColor: '#059669', avatarInitial: '田',
        bio: 'クラウドインフラとSREが専門。可観測性とコスト最適化に取り組んでいます。',
        github: 'kenichi-tanaka', currentFocus: 'Kubernetes クラスタの可観測性向上',
        interestTags: ['SRE', 'Kubernetes', 'コスト最適化'],
        isAcceptingConsultation: true,
        consultationTags: ['AWS', 'Kubernetes', 'Docker', 'インフラ設計', 'SRE'],
        skills: [
          { id: 's020', category: 'language',  name: 'Python',     level: 4 },
          { id: 's021', category: 'language',  name: 'Go',         level: 3 },
          { id: 's022', category: 'infra',     name: 'AWS',        level: 5 },
          { id: 's023', category: 'infra',     name: 'Kubernetes', level: 5 },
          { id: 's024', category: 'infra',     name: 'Terraform',  level: 4 },
          { id: 's025', category: 'infra',     name: 'Docker',     level: 5 },
          { id: 's026', category: 'framework', name: 'Prometheus', level: 4 },
        ],
        certifications: [
          { id: 'c020', name: 'AWS Solutions Architect Professional', issuer: 'AWS',  acquiredAt: '2021-09', expiresAt: '2024-09' },
          { id: 'c021', name: 'Certified Kubernetes Administrator',   issuer: 'CNCF', acquiredAt: '2022-05', expiresAt: '2025-05' },
          { id: 'c022', name: 'AWS DevOps Engineer Professional',     issuer: 'AWS',  acquiredAt: '2023-01', expiresAt: '2026-01' },
          { id: 'c023', name: 'HashiCorp Terraform Associate',        issuer: 'HashiCorp', acquiredAt: '2023-08', expiresAt: '2026-08' },
        ],
        personality: { strengthsTop5: ['責任感','慎重さ','規律性','分析思考','収集心'], mbtiType: 'ISTJ', visibility: 'public' },
      },
      {
        id: 'u004', name: '鈴木 美咲', email: 'suzuki@example.com',
        role: 'engineer', department: '開発部', grade: 'エンジニア', joinYear: 2021,
        avatarColor: '#DB2777', avatarInitial: '鈴',
        bio: 'フロントエンド開発が好きで、UXにこだわったUI実装が得意です。最近バックエンドも勉強中。',
        github: 'misaki-suzuki', currentFocus: 'Rust の習得とフロントエンドパフォーマンス改善',
        interestTags: ['フロントエンド', 'UX', 'Rust'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's030', category: 'language',  name: 'TypeScript', level: 3 },
          { id: 's031', category: 'language',  name: 'Python',     level: 3 },
          { id: 's032', category: 'language',  name: 'Rust',       level: 1 },
          { id: 's033', category: 'framework', name: 'React',      level: 3 },
          { id: 's034', category: 'framework', name: 'FastAPI',    level: 2 },
          { id: 's035', category: 'infra',     name: 'Docker',     level: 2 },
        ],
        certifications: [
          { id: 'c030', name: '基本情報技術者試験',   issuer: 'IPA', acquiredAt: '2020-10', expiresAt: null },
          { id: 'c031', name: 'AWS Cloud Practitioner', issuer: 'AWS', acquiredAt: '2023-03', expiresAt: '2026-03' },
        ],
        personality: { strengthsTop5: ['個別化','共感性','ポジティブ','活発性','コミュニケーション'], mbtiType: 'ENFP', visibility: 'public' },
      },
      {
        id: 'u005', name: '高橋 拓也', email: 'takahashi@example.com',
        role: 'engineer', department: '開発部', grade: 'エンジニア', joinYear: 2022,
        avatarColor: '#7C3AED', avatarInitial: '高',
        bio: 'バックエンド開発とデータベース設計が得意。最近ML/AIにも興味を持ち始めました。',
        github: 'takuya-t', currentFocus: 'Python でのデータ分析と機械学習の基礎学習',
        interestTags: ['バックエンド', 'DB設計', '機械学習'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's040', category: 'language',  name: 'Python',      level: 4 },
          { id: 's041', category: 'language',  name: 'TypeScript',  level: 2 },
          { id: 's042', category: 'framework', name: 'Django',      level: 4 },
          { id: 's043', category: 'framework', name: 'FastAPI',     level: 3 },
          { id: 's044', category: 'infra',     name: 'PostgreSQL',  level: 4 },
          { id: 's045', category: 'infra',     name: 'Docker',      level: 3 },
        ],
        certifications: [
          { id: 'c040', name: '基本情報技術者試験', issuer: 'IPA', acquiredAt: '2021-05', expiresAt: null },
        ],
        personality: { strengthsTop5: ['分析思考','学習欲','収集心','着想','戦略性'], mbtiType: 'INTP', visibility: 'public' },
      },
      {
        id: 'u006', name: '伊藤 さくら', email: 'ito@example.com',
        role: 'engineer', department: 'QA部', grade: 'QAエンジニア', joinYear: 2023,
        avatarColor: '#0D9488', avatarInitial: '伊',
        bio: 'QAエンジニアとしてテスト設計・自動化を担当。品質向上のための取り組みに情熱を持っています。',
        github: 'sakura-ito', currentFocus: 'E2Eテスト自動化基盤の構築',
        interestTags: ['テスト自動化', 'QA', 'CI/CD'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's050', category: 'language',  name: 'Python',     level: 3 },
          { id: 's051', category: 'language',  name: 'JavaScript', level: 2 },
          { id: 's052', category: 'framework', name: 'Playwright', level: 4 },
          { id: 's053', category: 'framework', name: 'Pytest',     level: 3 },
          { id: 's054', category: 'infra',     name: 'GitHub Actions', level: 3 },
        ],
        certifications: [
          { id: 'c050', name: '基本情報技術者試験',    issuer: 'IPA', acquiredAt: '2022-05', expiresAt: null },
          { id: 'c051', name: 'JSTQB Foundation Level', issuer: 'JSTQB', acquiredAt: '2024-03', expiresAt: null },
        ],
        personality: { strengthsTop5: ['責任感','共感性','調和性','慎重さ','包含'], mbtiType: 'ISFJ', visibility: 'role_limited' },
      },
      {
        id: 'u007', name: '渡辺 龍一', email: 'watanabe@example.com',
        role: 'engineer', department: 'インフラ部', grade: 'エンジニア', joinYear: 2023,
        avatarColor: '#B45309', avatarInitial: '渡',
        bio: 'インフラエンジニアとしてAWSとオンプレを担当。ネットワークとセキュリティの勉強中。',
        github: 'ryuichi-w', currentFocus: 'AWS Security Specialty の取得準備',
        interestTags: ['インフラ', 'セキュリティ', 'ネットワーク'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's060', category: 'language',  name: 'Python',    level: 2 },
          { id: 's061', category: 'language',  name: 'Bash',      level: 3 },
          { id: 's062', category: 'infra',     name: 'AWS',       level: 3 },
          { id: 's063', category: 'infra',     name: 'Docker',    level: 3 },
          { id: 's064', category: 'infra',     name: 'Linux',     level: 4 },
        ],
        certifications: [
          { id: 'c060', name: 'AWS Solutions Architect Associate', issuer: 'AWS', acquiredAt: '2024-01', expiresAt: '2027-01' },
        ],
        personality: { strengthsTop5: ['責任感','規律性','集中力','慎重さ','信念'], mbtiType: 'ISTP', visibility: 'private' },
      },
      {
        id: 'u008', name: '中村 朱音', email: 'nakamura@example.com',
        role: 'engineer', department: '開発部', grade: 'エンジニア', joinYear: 2024,
        avatarColor: '#9333EA', avatarInitial: '中',
        bio: '新卒でフルスタック開発を目指しています。TypeScriptとReactを中心に毎日勉強中！',
        github: 'akane-n', currentFocus: 'TypeScript とNext.jsのキャッチアップ',
        interestTags: ['フロントエンド', 'TypeScript', 'チームワーク'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's070', category: 'language',  name: 'TypeScript', level: 2 },
          { id: 's071', category: 'language',  name: 'JavaScript', level: 2 },
          { id: 's072', category: 'framework', name: 'React',      level: 2 },
          { id: 's073', category: 'framework', name: 'Next.js',    level: 1 },
        ],
        certifications: [
          { id: 'c070', name: '基本情報技術者試験', issuer: 'IPA', acquiredAt: '2024-05', expiresAt: null },
        ],
        personality: { strengthsTop5: ['ポジティブ','活発性','コミュニケーション','開発志向','共感性'], mbtiType: 'ENFJ', visibility: 'public' },
      },
    ];
  }

  // ── シードログ生成 ─────────────────────────────────────────
  // 過去180日分のログをランダム生成（ユーザーごとに活動パターンを変える）
  function _getSeedLogs() {
    const logs = [];
    const today = new Date();
    const categories = ['reading', 'certification', 'personal_dev', 'study_group', 'ojt', 'other'];
    const sampleTitles = {
      reading:        ['技術書を読んだ', 'ブログ記事を学習', 'ドキュメントを読み込んだ'],
      certification:  ['資格試験の模擬問題を解いた', '試験対策の勉強をした', '過去問演習'],
      personal_dev:   ['個人プロダクトの開発', 'OSSにコントリビューション', 'サイドプロジェクトの設計'],
      study_group:    ['社内勉強会に参加', '外部勉強会に参加', 'ハンズオンセミナー'],
      ojt:            ['業務での新技術を習得', 'ペアプロで学んだ', 'コードレビューで学んだ'],
      other:          ['技術的な調査', 'アーキテクチャ検討', '新しいツールを試した'],
    };

    // ユーザーごとの活動頻度（0〜1、高いほど頻繁に記録）
    const activityRate = {
      u001: 0.5, u002: 0.7, u003: 0.6,
      u004: 0.65, u005: 0.55, u006: 0.5,
      u007: 0.4, u008: 0.75,
    };

    const userIds = ['u001','u002','u003','u004','u005','u006','u007','u008'];

    userIds.forEach(userId => {
      const rate = activityRate[userId] || 0.5;
      for (let i = 180; i >= 0; i--) {
        if (Math.random() > rate) continue;
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const cat = categories[Math.floor(Math.random() * categories.length)];
        const titles = sampleTitles[cat];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const duration = [15, 30, 45, 60, 90, 120][Math.floor(Math.random() * 6)];

        logs.push({
          id: `log_${userId}_${i}_${Math.random().toString(36).slice(2,7)}`,
          userId,
          category: cat,
          title,
          durationMinutes: duration,
          loggedAt: dateStr,
          memo: '',
          tags: [],
        });
      }
    });

    return logs;
  }

  // ── 公開API ───────────────────────────────────────────────

  function _load(key, seedFn) {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    const seed = seedFn();
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  function getUsers()          { return _load('th_users', _getSeedUsers); }
  function getLogs(userId)     {
    const all = _load('th_logs', _getSeedLogs);
    return userId ? all.filter(l => l.userId === userId) : all;
  }

  function getUserById(id)     { return getUsers().find(u => u.id === id) || null; }

  function saveUser(updated) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx >= 0) users[idx] = updated; else users.push(updated);
    localStorage.setItem('th_users', JSON.stringify(users));
  }

  function addLog(log) {
    const logs = getLogs();
    logs.push(log);
    localStorage.setItem('th_logs', JSON.stringify(logs));
  }

  function deleteLog(logId) {
    const logs = getLogs().filter(l => l.id !== logId);
    localStorage.setItem('th_logs', JSON.stringify(logs));
  }

  function reset() {
    localStorage.removeItem('th_users');
    localStorage.removeItem('th_logs');
    localStorage.removeItem('th_current_user_id');
    localStorage.removeItem('th_viewing_user_id');
  }

  // ── 集計ヘルパー ──────────────────────────────────────────

  function getTotalMinutes(userId) {
    return getLogs(userId).reduce((sum, l) => sum + l.durationMinutes, 0);
  }

  function getStreak(userId) {
    const logs = getLogs(userId);
    const dates = new Set(logs.map(l => l.loggedAt));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (dates.has(ds)) streak++;
      else if (i > 0) break; // 今日が未記録でも連続カウントは続ける（i===0は除外）
    }
    return streak;
  }

  function getEarnedBadgeCodes(userId) {
    const user = getUserById(userId);
    if (!user) return [];
    const totalMin = getTotalMinutes(userId);
    const certCount = user.certifications.length;
    const streak = getStreak(userId);
    const earned = [];

    BADGE_DEFINITIONS.forEach(b => {
      if (b.type === 'hours'   && totalMin  >= b.threshold) earned.push(b.code);
      if (b.type === 'certs'   && certCount >= b.threshold) earned.push(b.code);
      if (b.type === 'streak'  && streak    >= b.threshold) earned.push(b.code);
      if (b.type === 'profile' && b.code === 'profile_complete') {
        if (user.bio && user.skills.length > 0) earned.push(b.code);
      }
      if (b.type === 'profile' && b.code === 'personality_public') {
        if (user.personality.mbtiType || user.personality.strengthsTop5.length > 0) earned.push(b.code);
      }
    });
    return earned;
  }

  function getEarnedBadges(userId) {
    const codes = getEarnedBadgeCodes(userId);
    return BADGE_DEFINITIONS.filter(b => codes.includes(b.code));
  }

  function getHeatmapData(userId, weeks) {
    const logs = getLogs(userId);
    const minutesByDate = {};
    logs.forEach(l => {
      minutesByDate[l.loggedAt] = (minutesByDate[l.loggedAt] || 0) + l.durationMinutes;
    });

    const days = (weeks || 26) * 7;
    const cells = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const min = minutesByDate[ds] || 0;
      let level = 0;
      if (min >= 120) level = 4;
      else if (min >= 90) level = 3;
      else if (min >= 45) level = 2;
      else if (min > 0)   level = 1;
      cells.push({ date: ds, minutes: min, level });
    }
    return cells;
  }

  function getCategoryBreakdown(userId) {
    const logs = getLogs(userId);
    const map = {};
    logs.forEach(l => {
      map[l.category] = (map[l.category] || 0) + l.durationMinutes;
    });
    return map;
  }

  function getStrengthsDomainScores(top5) {
    const scores = { '実行力': 0, '影響力': 0, '人間関係構築力': 0, '戦略的思考力': 0 };
    top5.forEach(s => {
      for (const [domain, list] of Object.entries(STRENGTHS_DOMAIN_MAP)) {
        if (list.includes(s)) { scores[domain]++; break; }
      }
    });
    return scores;
  }

  return {
    BADGE_DEFINITIONS,
    STRENGTHS_DOMAIN_MAP,
    getUsers, getUserById, saveUser,
    getLogs, addLog, deleteLog,
    getTotalMinutes, getStreak,
    getEarnedBadges, getEarnedBadgeCodes,
    getHeatmapData, getCategoryBreakdown,
    getStrengthsDomainScores,
    reset,
  };
})();
```

---

## 3. `mock/js/auth.js`

```javascript
/* ============================================================
   TalentHub Mock - auth.js
   モック認証ヘルパー
   ============================================================ */

window.TH = window.TH || {};

TH.auth = (function () {

  const KEY = 'th_current_user_id';

  // デモロール → デフォルトユーザーIDのマッピング
  const ROLE_DEFAULT_USER = {
    admin:    'u001',
    senior:   'u002',
    engineer: 'u004',
  };

  function login(role) {
    const userId = ROLE_DEFAULT_USER[role] || 'u004';
    localStorage.setItem(KEY, userId);
  }

  function logout() {
    localStorage.removeItem(KEY);
    localStorage.removeItem('th_viewing_user_id');
    window.location.href = 'index.html';
  }

  function getCurrentUserId() {
    return localStorage.getItem(KEY);
  }

  function getCurrentUser() {
    const id = getCurrentUserId();
    return id ? TH.data.getUserById(id) : null;
  }

  // 未ログインなら index.html にリダイレクト
  function guard() {
    if (!getCurrentUserId()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  // admin ロールでなければリダイレクト
  function guardAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  }

  return { login, logout, getCurrentUserId, getCurrentUser, guard, guardAdmin };
})();
```

---

## 4. `mock/js/common.js`

```javascript
/* ============================================================
   TalentHub Mock - common.js
   ナビゲーション、共通UIヘルパー、フォーマット関数
   ============================================================ */

window.TH = window.TH || {};

// ── ナビゲーション ─────────────────────────────────────────
TH.nav = {
  go(screen, userId) {
    const map = {
      'login':         'index.html',
      'dashboard':     'dashboard.html',
      'members':       'members.html',
      'profile-view':  'profile-view.html',
      'profile-edit':  'profile-edit.html',
      'learning-log':  'learning-log.html',
      'consultation':  'consultation.html',
      'admin':         'admin.html',
    };
    if (userId) {
      localStorage.setItem('th_viewing_user_id', userId);
    }
    const path = map[screen];
    if (path) window.location.href = path;
  },
};

// ── フォーマット ────────────────────────────────────────────
TH.fmt = {
  minutes(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
  },
  totalHours(min) {
    return (min / 60).toFixed(1) + '時間';
  },
  date(dateStr) {
    if (!dateStr) return '';
    const [y, m] = dateStr.split('-');
    return `${y}年${parseInt(m)}月`;
  },
  categoryLabel(cat) {
    const map = {
      reading:      '読書',
      certification:'資格勉強',
      personal_dev: '個人開発',
      study_group:  '勉強会',
      ojt:          'OJT',
      other:        'その他',
    };
    return map[cat] || cat;
  },
  categoryColor(cat) {
    const map = {
      reading:      '#6366F1',
      certification:'#F59E0B',
      personal_dev: '#10B981',
      study_group:  '#3B82F6',
      ojt:          '#8B5CF6',
      other:        '#6B7280',
    };
    return map[cat] || '#6B7280';
  },
  roleLabel(role) {
    const map = { admin: '管理者', senior: 'シニアエンジニア', engineer: 'エンジニア' };
    return map[role] || role;
  },
  roleBadgeClass(role) {
    const map = { admin: 'role-badge-admin', senior: 'role-badge-senior', engineer: 'role-badge-engineer' };
    return map[role] || '';
  },
  skillTagClass(category) {
    const map = {
      language:    'skill-tag-language',
      framework:   'skill-tag-framework',
      infra:       'skill-tag-infra',
      domain:      'skill-tag-domain',
    };
    return 'skill-tag ' + (map[category] || '');
  },
  levelDotFilledClass(category) {
    const map = {
      language:    'skill-dot-filled-language',
      framework:   'skill-dot-filled-framework',
      infra:       'skill-dot-filled-infra',
      domain:      'skill-dot-filled-domain',
    };
    return 'skill-dot ' + (map[category] || 'skill-dot-filled-default');
  },
};

// ── ヒートマップ描画 ────────────────────────────────────────
TH.ui = {
  // containerId の要素にヒートマップを描画する
  renderHeatmap(containerId, userId, weeks) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cells = TH.data.getHeatmapData(userId, weeks || 26);
    container.innerHTML = '';
    container.className = 'heatmap-grid';
    cells.forEach(cell => {
      const div = document.createElement('div');
      div.className = `heatmap-cell hm-${cell.level}`;
      div.title = `${cell.date}: ${cell.minutes}分`;
      container.appendChild(div);
    });
  },

  // スキルレベルのドット表示を返す（HTML文字列）
  skillDotsHtml(level, category) {
    const filledClass = TH.fmt.levelDotFilledClass(category);
    let html = '<span class="skill-dots">';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="skill-dot ${i <= level ? filledClass : 'skill-dot-empty'}"></span>`;
    }
    html += '</span>';
    return html;
  },

  // トースト通知を表示する
  toast(message, type) {
    type = type || 'success';
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },

  // 共通サイドバーHTMLを生成してコンテナに挿入する
  renderSidebar(containerId, activeScreen) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const user = TH.auth.getCurrentUser();
    if (!user) return;

    const navItems = [
      { screen: 'dashboard',    label: 'ダッシュボード', icon: _icons.home },
      { screen: 'members',      label: 'メンバー検索',   icon: _icons.users },
      { screen: 'learning-log', label: '学習ログ',       icon: _icons.book },
      { screen: 'consultation', label: '相談窓口',       icon: _icons.chat },
    ];
    const adminItems = [
      { screen: 'admin', label: 'スキルマップ', icon: _icons.chart },
    ];

    let nav = navItems.map(item => `
      <div class="sidebar-nav-item ${activeScreen === item.screen ? 'active' : ''}"
           onclick="TH.nav.go('${item.screen}')">
        ${item.icon} <span>${item.label}</span>
      </div>`).join('');

    if (user.role === 'admin') {
      nav += `<div class="border-t border-gray-100 my-2 mx-3"></div>`;
      nav += adminItems.map(item => `
        <div class="sidebar-nav-item ${activeScreen === item.screen ? 'active' : ''}"
             onclick="TH.nav.go('${item.screen}')">
          ${item.icon} <span>${item.label}</span>
        </div>`).join('');
    }

    const totalMin  = TH.data.getTotalMinutes(user.id);
    const initials  = user.avatarInitial || user.name.charAt(0);
    const roleLabel = TH.fmt.roleLabel(user.role);

    container.innerHTML = `
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center gap-2 mb-1">
          <div class="avatar w-7 h-7 text-sm" style="background:${user.avatarColor}">${initials}</div>
          <span class="font-bold text-indigo-600 text-base">TalentHub</span>
        </div>
      </div>
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="avatar w-10 h-10 text-base" style="background:${user.avatarColor}">${initials}</div>
          <div class="min-w-0">
            <div class="font-semibold text-gray-900 text-sm truncate">${user.name}</div>
            <div class="text-xs text-gray-500">${user.department} · ${roleLabel}</div>
          </div>
        </div>
        <div class="mt-2 text-xs text-gray-500">累計 <span class="font-semibold text-gray-700">${TH.fmt.totalHours(totalMin)}</span></div>
      </div>
      <nav class="flex-1 p-3 space-y-1">${nav}</nav>
      <div class="p-3 border-t border-gray-100">
        <div class="sidebar-nav-item text-red-500 hover:text-red-600" onclick="TH.auth.logout()">
          ${_icons.logout} <span>ログアウト</span>
        </div>
      </div>
    `;
  },
};

// ── アイコン（Heroicons - SVG inline） ────────────────────
const _icons = {
  home:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
  users:  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>`,
  book:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>`,
  chat:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>`,
  chart:  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>`,
};
```

---

## 実装後のチェック項目

- [ ] `mock/css/style.css` が作成され、全カスタムスタイルが定義されている
- [ ] `mock/js/data.js` が作成され、8ユーザー分のシードデータが投入される
- [ ] `mock/js/auth.js` が作成され、ロール別ログイン・ガードが動作する
- [ ] `mock/js/common.js` が作成され、ナビゲーション・ヒートマップ描画・トーストが動作する
- [ ] ブラウザコンソールで `TH.data.getUsers()` が8件返ること
- [ ] ブラウザコンソールで `TH.data.getLogs().length` が100件以上返ること
