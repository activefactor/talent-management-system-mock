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

  // ── StrengthsFinder 全34資質リスト ───────────────────────
  const ALL_STRENGTHS = [
    '達成欲','調和性','信念','公平性','慎重さ','規律性','集中力','責任感','回復志向',
    '活発性','指令性','コミュニケーション','競争性','最上志向','自己確信','自我','社交性',
    '適応性','親密性','開発志向','共感性','包含','個別化','ポジティブ','関係性',
    '分析思考','未来志向','着想','知的好奇心','学習欲','戦略性','収集心',
  ];

  // ── MBTI 16タイプ ─────────────────────────────────────────
  const MBTI_TYPES = [
    'INTJ','INTP','ENTJ','ENTP',
    'INFJ','INFP','ENFJ','ENFP',
    'ISTJ','ISFJ','ESTJ','ESFJ',
    'ISTP','ISFP','ESTP','ESFP',
  ];

  // MBTI タイプ別の4軸スコア（0=I/S/T/J寄り、100=E/N/F/P寄り）
  const MBTI_AXIS_SCORES = {
    INTJ: { EI: 20, SN: 80, TF: 25, JP: 20 },
    INTP: { EI: 20, SN: 80, TF: 20, JP: 75 },
    ENTJ: { EI: 75, SN: 75, TF: 25, JP: 20 },
    ENTP: { EI: 75, SN: 80, TF: 25, JP: 75 },
    INFJ: { EI: 20, SN: 75, TF: 75, JP: 20 },
    INFP: { EI: 20, SN: 75, TF: 80, JP: 75 },
    ENFJ: { EI: 80, SN: 70, TF: 80, JP: 20 },
    ENFP: { EI: 80, SN: 80, TF: 75, JP: 75 },
    ISTJ: { EI: 20, SN: 20, TF: 25, JP: 20 },
    ISFJ: { EI: 20, SN: 20, TF: 75, JP: 20 },
    ESTJ: { EI: 75, SN: 20, TF: 25, JP: 20 },
    ESFJ: { EI: 75, SN: 20, TF: 80, JP: 20 },
    ISTP: { EI: 20, SN: 25, TF: 20, JP: 75 },
    ISFP: { EI: 20, SN: 25, TF: 75, JP: 75 },
    ESTP: { EI: 80, SN: 25, TF: 20, JP: 75 },
    ESFP: { EI: 80, SN: 25, TF: 80, JP: 75 },
  };

  // ── シードユーザー ────────────────────────────────────────
  function _getSeedUsers() {
    return [
      {
        id: 'u001', name: '山田 太郎', email: 'yamada@example.com',
        role: 'admin', department: '開発部', grade: '部長', joinYear: 2015,
        avatarColor: '#4F46E5', avatarInitial: '山',
        bio: 'フルスタック開発とチームマネジメントが専門。社内の技術基盤強化に注力しています。チームメンバーの成長を支援することにやりがいを感じています。',
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
          { id: 'c002', name: '情報処理安全確保支援士',                issuer: 'IPA',    acquiredAt: '2020-10', expiresAt: null       },
          { id: 'c003', name: 'Google Cloud Professional Data Engineer', issuer: 'Google', acquiredAt: '2023-03', expiresAt: '2026-03' },
        ],
        personality: { strengthsTop5: ['戦略性','着想','分析思考','学習欲','収集心'], mbtiType: 'ENTJ', visibility: 'public' },
      },
      {
        id: 'u002', name: '佐藤 花子', email: 'sato@example.com',
        role: 'senior', department: '開発部', grade: 'テックリード', joinYear: 2017,
        avatarColor: '#0891B2', avatarInitial: '佐',
        bio: 'フロントエンドとAPIデザインが専門。チームのコードレビューとアーキテクチャ設計をリードしています。若手エンジニアの成長サポートも大切にしています。',
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
        bio: 'クラウドインフラとSREが専門。可観測性とコスト最適化に取り組んでいます。インフラ設計から運用まで幅広く対応できます。',
        github: 'kenichi-tanaka', currentFocus: 'Kubernetesクラスタの可観測性向上',
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
          { id: 'c020', name: 'AWS Solutions Architect Professional', issuer: 'AWS',       acquiredAt: '2021-09', expiresAt: '2024-09' },
          { id: 'c021', name: 'Certified Kubernetes Administrator',   issuer: 'CNCF',      acquiredAt: '2022-05', expiresAt: '2025-05' },
          { id: 'c022', name: 'AWS DevOps Engineer Professional',     issuer: 'AWS',       acquiredAt: '2023-01', expiresAt: '2026-01' },
          { id: 'c023', name: 'HashiCorp Terraform Associate',        issuer: 'HashiCorp', acquiredAt: '2023-08', expiresAt: '2026-08' },
        ],
        personality: { strengthsTop5: ['責任感','慎重さ','規律性','分析思考','収集心'], mbtiType: 'ISTJ', visibility: 'public' },
      },
      {
        id: 'u004', name: '鈴木 美咲', email: 'suzuki@example.com',
        role: 'engineer', department: '開発部', grade: 'エンジニア', joinYear: 2021,
        avatarColor: '#DB2777', avatarInitial: '鈴',
        bio: 'フロントエンド開発が好きで、UXにこだわったUI実装が得意です。最近バックエンドも勉強中。Rustにも挑戦しています！',
        github: 'misaki-suzuki', currentFocus: 'Rustの習得とフロントエンドパフォーマンス改善',
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
          { id: 'c030', name: '基本情報技術者試験',   issuer: 'IPA', acquiredAt: '2020-10', expiresAt: null      },
          { id: 'c031', name: 'AWS Cloud Practitioner', issuer: 'AWS', acquiredAt: '2023-03', expiresAt: '2026-03' },
        ],
        personality: { strengthsTop5: ['個別化','共感性','ポジティブ','活発性','コミュニケーション'], mbtiType: 'ENFP', visibility: 'public' },
      },
      {
        id: 'u005', name: '高橋 拓也', email: 'takahashi@example.com',
        role: 'engineer', department: '開発部', grade: 'エンジニア', joinYear: 2022,
        avatarColor: '#7C3AED', avatarInitial: '高',
        bio: 'バックエンド開発とデータベース設計が得意。最近ML/AIにも興味を持ち始めました。Pythonを中心に幅広く学習しています。',
        github: 'takuya-t', currentFocus: 'Pythonでのデータ分析と機械学習の基礎学習',
        interestTags: ['バックエンド', 'DB設計', '機械学習'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's040', category: 'language',  name: 'Python',     level: 4 },
          { id: 's041', category: 'language',  name: 'TypeScript', level: 2 },
          { id: 's042', category: 'framework', name: 'Django',     level: 4 },
          { id: 's043', category: 'framework', name: 'FastAPI',    level: 3 },
          { id: 's044', category: 'infra',     name: 'PostgreSQL', level: 4 },
          { id: 's045', category: 'infra',     name: 'Docker',     level: 3 },
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
          { id: 's050', category: 'language',  name: 'Python',         level: 3 },
          { id: 's051', category: 'language',  name: 'JavaScript',     level: 2 },
          { id: 's052', category: 'framework', name: 'Playwright',     level: 4 },
          { id: 's053', category: 'framework', name: 'Pytest',         level: 3 },
          { id: 's054', category: 'infra',     name: 'GitHub Actions', level: 3 },
        ],
        certifications: [
          { id: 'c050', name: '基本情報技術者試験',     issuer: 'IPA',    acquiredAt: '2022-05', expiresAt: null },
          { id: 'c051', name: 'JSTQB Foundation Level', issuer: 'JSTQB', acquiredAt: '2024-03', expiresAt: null },
        ],
        personality: { strengthsTop5: ['責任感','共感性','調和性','慎重さ','包含'], mbtiType: 'ISFJ', visibility: 'role_limited' },
      },
      {
        id: 'u007', name: '渡辺 龍一', email: 'watanabe@example.com',
        role: 'engineer', department: 'インフラ部', grade: 'エンジニア', joinYear: 2023,
        avatarColor: '#B45309', avatarInitial: '渡',
        bio: 'インフラエンジニアとしてAWSとオンプレを担当。ネットワークとセキュリティを勉強中です。',
        github: 'ryuichi-w', currentFocus: 'AWS Security Specialtyの取得準備',
        interestTags: ['インフラ', 'セキュリティ', 'ネットワーク'],
        isAcceptingConsultation: false, consultationTags: [],
        skills: [
          { id: 's060', category: 'language', name: 'Python', level: 2 },
          { id: 's061', category: 'language', name: 'Bash',   level: 3 },
          { id: 's062', category: 'infra',    name: 'AWS',    level: 3 },
          { id: 's063', category: 'infra',    name: 'Docker', level: 3 },
          { id: 's064', category: 'infra',    name: 'Linux',  level: 4 },
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
        bio: '新卒でフルスタック開発を目指しています。TypeScriptとReactを中心に毎日勉強中！チームの皆さんから学ぶことが多く、刺激をもらっています。',
        github: 'akane-n', currentFocus: 'TypeScriptとNext.jsのキャッチアップ',
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
      reading:        [
        '技術書を読んだ', 'ブログ記事を学習', 'ドキュメントを読み込んだ',
        'O\'Reillyの書籍を読んだ', '論文を読んだ',
      ],
      certification:  [
        '資格試験の模擬問題を解いた', '試験対策の勉強をした', '過去問演習',
        'テキストを一章進めた', '暗記カードで復習した',
      ],
      personal_dev:   [
        '個人プロダクトの開発', 'OSSにコントリビューション', 'サイドプロジェクトの設計',
        'ハンズオンでコードを書いた', '新しいライブラリを試した',
      ],
      study_group:    [
        '社内勉強会に参加', '外部勉強会に参加', 'ハンズオンセミナー',
        'オンライン勉強会に参加', 'LT会に参加',
      ],
      ojt:            [
        '業務での新技術を習得', 'ペアプロで学んだ', 'コードレビューで学んだ',
        '設計レビューで知識を深めた', 'ベテランに教わった',
      ],
      other:          [
        '技術的な調査', 'アーキテクチャ検討', '新しいツールを試した',
        'カンファレンスのアーカイブを視聴', 'ポッドキャストを聴いた',
      ],
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
          id: `log_${userId}_${i}_${Math.random().toString(36).slice(2, 7)}`,
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

  // ── localStorage ヘルパー ─────────────────────────────────

  function _load(key, seedFn) {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    const seed = seedFn();
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  // ── 公開 CRUD API ─────────────────────────────────────────

  function getUsers() {
    return _load('th_users', _getSeedUsers);
  }

  function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
  }

  function saveUser(updated) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx >= 0) users[idx] = updated;
    else users.push(updated);
    localStorage.setItem('th_users', JSON.stringify(users));
  }

  function getLogs(userId) {
    const all = _load('th_logs', _getSeedLogs);
    return userId ? all.filter(l => l.userId === userId) : all;
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
      if (dates.has(ds)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  function getEarnedBadgeCodes(userId) {
    const user = getUserById(userId);
    if (!user) return [];
    const totalMin  = getTotalMinutes(userId);
    const certCount = user.certifications.length;
    const streak    = getStreak(userId);
    const earned    = [];

    BADGE_DEFINITIONS.forEach(b => {
      if (b.type === 'hours'  && totalMin  >= b.threshold) earned.push(b.code);
      if (b.type === 'certs'  && certCount >= b.threshold) earned.push(b.code);
      if (b.type === 'streak' && streak    >= b.threshold) earned.push(b.code);
      if (b.type === 'profile' && b.code === 'profile_complete') {
        if (user.bio && user.skills.length > 0) earned.push(b.code);
      }
      if (b.type === 'profile' && b.code === 'personality_public') {
        if (user.personality && (user.personality.mbtiType || (user.personality.strengthsTop5 && user.personality.strengthsTop5.filter(Boolean).length > 0))) {
          earned.push(b.code);
        }
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

    const days  = (weeks || 26) * 7;
    const cells = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d  = new Date(today);
      d.setDate(d.getDate() - i);
      const ds  = d.toISOString().split('T')[0];
      const min = minutesByDate[ds] || 0;
      let level = 0;
      if      (min >= 120) level = 4;
      else if (min >= 90)  level = 3;
      else if (min >= 45)  level = 2;
      else if (min > 0)    level = 1;
      cells.push({ date: ds, minutes: min, level });
    }
    return cells;
  }

  function getCategoryBreakdown(userId) {
    const logs = getLogs(userId);
    const map  = {};
    logs.forEach(l => {
      map[l.category] = (map[l.category] || 0) + l.durationMinutes;
    });
    return map;
  }

  function getStrengthsDomainScores(top5) {
    const scores = { '実行力': 0, '影響力': 0, '人間関係構築力': 0, '戦略的思考力': 0 };
    (top5 || []).forEach(s => {
      for (const [domain, list] of Object.entries(STRENGTHS_DOMAIN_MAP)) {
        if (list.includes(s)) { scores[domain]++; break; }
      }
    });
    return scores;
  }

  // ── 公開インターフェース ──────────────────────────────────
  return {
    BADGE_DEFINITIONS,
    STRENGTHS_DOMAIN_MAP,
    ALL_STRENGTHS,
    MBTI_TYPES,
    MBTI_AXIS_SCORES,
    // CRUD
    getUsers, getUserById, saveUser,
    getLogs, addLog, deleteLog,
    reset,
    // 集計
    getTotalMinutes, getStreak,
    getEarnedBadges, getEarnedBadgeCodes,
    getHeatmapData, getCategoryBreakdown,
    getStrengthsDomainScores,
  };

})();
