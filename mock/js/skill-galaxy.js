/* ============================================================
   TalentHub Mock - Skill Roadmap Galaxy (v2)
   放射型スキルロードマップ
   仕様: docs/mock-design/step9-skill-galaxy-v2-roadmap.md
   ============================================================ */

window.TH = window.TH || {};

(function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. レーン定義（lane → 角度。Y下向き=画面、deg）
  // ----------------------------------------------------------

  const LANE_ANGLES = {
    core:     null, // 中心
    security: 15,
    cloud:    45,
    devops:   95,
    qa:       150,
    data:     195,
    frontend: 240,
    backend:  325,
  };

  const LANE_LABELS = {
    core:     'Engineering Core',
    security: 'Security',
    cloud:    'Cloud / Infra',
    devops:   'DevOps',
    qa:       'QA / Test',
    data:     'Data / AI',
    frontend: 'Frontend',
    backend:  'Backend',
  };

  // Subcategory（リスト表示時のグルーピングで使う）
  const SUBCATEGORY_LABELS = {
    foundation:    'Foundation',
    language:      'Language',
    frontend:      'Frontend',
    backend:       'Backend',
    database:      'Database',
    cloud:         'Cloud',
    container:     'Container / Platform',
    iac:           'IaC / DevOps',
    observability: 'Observability / SRE',
    security:      'Security',
    qa:            'QA / Test',
    data:          'Data / AI',
    architecture:  'Architecture',
    collaboration: 'Collaboration',
    leadership:    'Leadership',
    domain:        'Domain',
    certification: 'Certification',
  };

  // Stage 半径
  const STAGE_RADIUS = [0, 140, 270, 400, 530];

  // ----------------------------------------------------------
  // 2. マスター定義（lane / stage / order / pathIds / prerequisiteIds 付き）
  // ----------------------------------------------------------

  const SKILL_GALAXY_MASTER = {
    nodes: [
      // ===== Core (stage 0/1) =====
      { id: 'engineering-core', kind: 'core', name: 'Engineering Core', shortName: 'Core',
        lane: 'core', stage: 0, order: 0, subcategory: 'foundation',
        description: 'すべてのエンジニアの土台。コンピュータ、ネットワーク、コラボレーションの基礎',
        aliases: [] },

      { id: 'git-github', kind: 'skill', name: 'Git / GitHub', shortName: 'Git',
        category: 'infra', lane: 'devops', stage: 1, order: 0,
        subcategory: 'foundation',
        description: 'バージョン管理とコード共有の基本。あらゆる開発の前提',
        aliases: ['Git', 'GitHub'],
        prerequisiteIds: ['engineering-core'],
        relatedIds: ['github-actions'],
        pathIds: ['devops', 'cloud-architect', 'sre', 'fullstack'],
        levelGuide: {
          1: 'コミット・プッシュ・ブランチ作成ができる',
          2: 'PRレビュー、リベース、コンフリクト解消ができる',
          3: 'ブランチ戦略・コミット粒度を設計できる',
          4: 'モノレポ運用・大規模ワークフローを整備できる',
          5: '組織横断のGit運用ポリシーをリードできる',
        },
        evidenceExamples: ['複雑なコンフリクトを解消した', 'ブランチ戦略を見直した'] },

      { id: 'linux', kind: 'skill', name: 'Linux', shortName: 'Linux',
        category: 'infra', lane: 'devops', stage: 1, order: 1,
        subcategory: 'foundation',
        description: 'サーバー・コンテナの基盤OS。コマンドライン操作の基礎',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['devops', 'cloud-architect', 'sre'],
        levelGuide: {
          1: '基本コマンド (ls/cd/grep) が使える',
          2: 'プロセス・パーミッション・systemd を理解している',
          3: 'シェルスクリプトで運用作業を自動化できる',
          4: 'カーネル・性能チューニングを行える',
          5: '本番サーバーの設計・運用をリードできる',
        } },

      { id: 'shell-bash', kind: 'skill', name: 'Shell / Bash', shortName: 'Shell',
        category: 'infra', lane: 'devops', stage: 1, order: 2,
        subcategory: 'foundation',
        description: 'シェルスクリプトと自動化の基本',
        aliases: ['Bash', 'Shell'],
        prerequisiteIds: ['linux'],
        pathIds: ['devops', 'sre'] },

      { id: 'cli', kind: 'skill', name: 'CLI / Terminal', shortName: 'CLI',
        category: 'infra', lane: 'core', stage: 1, order: 5,
        subcategory: 'foundation',
        description: 'ターミナル操作・キーバインド・ペイン分割など',
        aliases: ['Terminal'],
        prerequisiteIds: ['engineering-core'],
        pathIds: [] },

      { id: 'cs-basics', kind: 'skill', name: 'CS 基礎', shortName: 'CS',
        category: 'domain', lane: 'core', stage: 1, order: 6,
        subcategory: 'foundation',
        description: 'アルゴリズム・データ構造・計算量の基本',
        aliases: ['Computer Science', 'アルゴリズム'],
        prerequisiteIds: ['engineering-core'],
        pathIds: [] },

      { id: 'networking-http', kind: 'skill', name: 'Networking / HTTP', shortName: 'Network',
        category: 'domain', lane: 'core', stage: 1, order: 3,
        subcategory: 'foundation',
        description: 'TCP/IP、HTTP、DNS、TLS の基礎',
        aliases: ['Networking', 'HTTP', 'TCP/IP'],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['devops', 'backend-specialist', 'cloud-architect'] },

      // ===== Collaboration / Leadership (core lane) =====
      { id: 'code-review', kind: 'skill', name: 'コードレビュー', shortName: 'Review',
        category: 'domain', lane: 'core', stage: 2, order: 0,
        subcategory: 'collaboration',
        description: '建設的なレビュー・指摘・知識共有',
        aliases: ['Code Review', 'レビュー'],
        prerequisiteIds: ['git-github'],
        pathIds: [] },

      { id: 'documentation', kind: 'skill', name: 'ドキュメンテーション', shortName: 'Docs',
        category: 'domain', lane: 'core', stage: 2, order: 1,
        subcategory: 'collaboration',
        description: '設計書・運用ドキュメント・ADRの執筆',
        aliases: ['Documentation', 'ADR'],
        prerequisiteIds: ['engineering-core'],
        pathIds: [] },

      { id: 'mentoring', kind: 'skill', name: 'メンタリング', shortName: 'Mentor',
        category: 'domain', lane: 'core', stage: 3, order: 0,
        subcategory: 'leadership',
        description: 'メンバーの成長支援・1on1・キャリア相談',
        aliases: ['Mentoring', '1on1'],
        prerequisiteIds: [],
        pathIds: [] },

      { id: 'tech-lead', kind: 'skill', name: 'テックリード', shortName: 'Tech Lead',
        category: 'domain', lane: 'core', stage: 3, order: 1,
        subcategory: 'leadership',
        description: '設計判断・レビュー・チームの技術的方向性',
        aliases: ['Tech Lead'],
        prerequisiteIds: ['mentoring'],
        pathIds: [] },

      // ===== Frontend =====
      { id: 'html', kind: 'skill', name: 'HTML', shortName: 'HTML',
        category: 'language', lane: 'frontend', stage: 1, order: -1,
        subcategory: 'frontend',
        description: 'セマンティックなマークアップの基礎',
        aliases: ['HTML5'],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['frontend-specialist'] },

      { id: 'css', kind: 'skill', name: 'CSS', shortName: 'CSS',
        category: 'language', lane: 'frontend', stage: 1, order: -1,
        subcategory: 'frontend',
        description: 'レイアウト・スタイリングの基礎、レスポンシブ',
        aliases: ['CSS3', 'Tailwind'],
        prerequisiteIds: ['html'],
        pathIds: ['frontend-specialist'] },

      { id: 'javascript', kind: 'skill', name: 'JavaScript', shortName: 'JS',
        category: 'language', lane: 'frontend', stage: 1, order: 0,
        subcategory: 'language',
        description: 'Web開発の基礎言語',
        aliases: ['JS'],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['frontend-specialist', 'fullstack'] },

      { id: 'typescript', kind: 'skill', name: 'TypeScript', shortName: 'TS',
        category: 'language', lane: 'frontend', stage: 1, order: 1,
        subcategory: 'language',
        description: '型安全な JavaScript。フロント・バックの両方で使われる',
        aliases: ['TS'],
        prerequisiteIds: ['javascript'],
        pathIds: ['frontend-specialist', 'backend-specialist', 'fullstack'],
        levelGuide: {
          1: '型注釈つきの簡単なコードを読める',
          2: 'interface / generics の意図が理解できる',
          3: '型安全な設計を意識して実装できる',
          4: '高度な型を使ったライブラリを設計できる',
          5: '型システムのトレードオフを判断できる',
        } },

      { id: 'react', kind: 'skill', name: 'React', shortName: 'React',
        category: 'framework', lane: 'frontend', stage: 2, order: 0,
        subcategory: 'frontend',
        description: 'コンポーネントベースのUIライブラリ',
        aliases: [],
        prerequisiteIds: ['typescript'],
        pathIds: ['frontend-specialist', 'fullstack'] },

      { id: 'uiux', kind: 'skill', name: 'UI/UX', shortName: 'UI/UX',
        category: 'domain', lane: 'frontend', stage: 2, order: 1,
        subcategory: 'frontend',
        description: '使いやすい画面・体験を設計する力',
        aliases: ['UI', 'UX', 'UIデザイン'],
        prerequisiteIds: ['javascript'],
        pathIds: ['frontend-specialist'] },

      { id: 'accessibility', kind: 'skill', name: 'アクセシビリティ', shortName: 'A11y',
        category: 'domain', lane: 'frontend', stage: 2, order: 2,
        subcategory: 'frontend',
        description: 'WAI-ARIA、キーボード操作、スクリーンリーダー対応',
        aliases: ['Accessibility', 'A11y'],
        prerequisiteIds: ['html'],
        pathIds: ['frontend-specialist'] },

      { id: 'nextjs', kind: 'skill', name: 'Next.js', shortName: 'Next',
        category: 'framework', lane: 'frontend', stage: 3, order: 0,
        subcategory: 'frontend',
        description: 'React 製のフロントエンドフレームワーク',
        aliases: ['Next'],
        prerequisiteIds: ['react'],
        pathIds: ['frontend-specialist', 'fullstack'] },

      { id: 'web-performance', kind: 'skill', name: 'Web パフォーマンス', shortName: 'Perf',
        category: 'domain', lane: 'frontend', stage: 3, order: 1,
        subcategory: 'frontend',
        description: 'Core Web Vitals、バンドルサイズ、レンダリング最適化',
        aliases: ['Performance', 'Web Vitals'],
        prerequisiteIds: ['react'],
        pathIds: ['frontend-specialist'] },

      // ===== Backend =====
      { id: 'sql', kind: 'skill', name: 'SQL', shortName: 'SQL',
        category: 'language', lane: 'backend', stage: 1, order: -1,
        subcategory: 'database',
        description: 'リレーショナルDBのクエリ言語',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist', 'data-ai-engineer'] },

      { id: 'python', kind: 'skill', name: 'Python', shortName: 'Py',
        category: 'language', lane: 'backend', stage: 1, order: 0,
        subcategory: 'language',
        description: 'バックエンド・データ分析・AIで広く使われる言語',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist', 'data-ai-engineer', 'devops', 'qa-automation-specialist'] },

      { id: 'go', kind: 'skill', name: 'Go', shortName: 'Go',
        category: 'language', lane: 'backend', stage: 2, order: 0,
        subcategory: 'language',
        description: 'シンプル・高速なバックエンド向け言語',
        aliases: ['Golang'],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist', 'devops'] },

      { id: 'java', kind: 'skill', name: 'Java', shortName: 'Java',
        category: 'language', lane: 'backend', stage: 2, order: 3,
        subcategory: 'language',
        description: 'エンタープライズで広く使われるバックエンド言語',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist'] },

      { id: 'nodejs', kind: 'skill', name: 'Node.js', shortName: 'Node',
        category: 'framework', lane: 'backend', stage: 2, order: 4,
        subcategory: 'backend',
        description: 'JavaScript ランタイムでのサーバー実装',
        aliases: ['Node'],
        prerequisiteIds: ['typescript'],
        pathIds: ['backend-specialist', 'fullstack'] },

      { id: 'api-design', kind: 'skill', name: 'API設計', shortName: 'API',
        category: 'domain', lane: 'backend', stage: 2, order: 1,
        subcategory: 'backend',
        description: 'REST / GraphQL など API 仕様を設計する力',
        aliases: ['API', 'APIデザイン', 'REST'],
        prerequisiteIds: ['networking-http'],
        pathIds: ['backend-specialist', 'fullstack'] },

      { id: 'auth-authz', kind: 'skill', name: '認証認可', shortName: 'Auth',
        category: 'domain', lane: 'backend', stage: 2, order: 5,
        subcategory: 'backend',
        description: 'OAuth2 / OIDC / セッション / RBAC の設計と実装',
        aliases: ['Auth', 'OAuth', 'OIDC'],
        prerequisiteIds: ['api-design'],
        pathIds: ['backend-specialist', 'security-specialist'] },

      { id: 'postgresql', kind: 'skill', name: 'PostgreSQL', shortName: 'Postgres',
        category: 'infra', lane: 'backend', stage: 2, order: 2,
        subcategory: 'database',
        description: '高機能なオープンソース RDBMS',
        aliases: ['Postgres', 'DB設計'],
        prerequisiteIds: ['sql'],
        pathIds: ['backend-specialist', 'data-ai-engineer'] },

      { id: 'mysql', kind: 'skill', name: 'MySQL', shortName: 'MySQL',
        category: 'infra', lane: 'backend', stage: 2, order: 6,
        subcategory: 'database',
        description: '広く使われるオープンソース RDBMS',
        aliases: [],
        prerequisiteIds: ['sql'],
        pathIds: ['backend-specialist'] },

      { id: 'redis', kind: 'skill', name: 'Redis', shortName: 'Redis',
        category: 'infra', lane: 'backend', stage: 2, order: 7,
        subcategory: 'database',
        description: 'インメモリキャッシュ・KVS',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist', 'cloud-architect'] },

      { id: 'fastapi', kind: 'skill', name: 'FastAPI', shortName: 'FastAPI',
        category: 'framework', lane: 'backend', stage: 3, order: 0,
        subcategory: 'backend',
        description: 'Python の高速 Web フレームワーク',
        aliases: [],
        prerequisiteIds: ['python', 'api-design'],
        pathIds: ['backend-specialist'] },

      { id: 'django', kind: 'skill', name: 'Django', shortName: 'Django',
        category: 'framework', lane: 'backend', stage: 3, order: 1,
        subcategory: 'backend',
        description: 'Python のフルスタック Web フレームワーク',
        aliases: [],
        prerequisiteIds: ['python'],
        pathIds: ['backend-specialist'] },

      { id: 'graphql', kind: 'skill', name: 'GraphQL', shortName: 'GraphQL',
        category: 'framework', lane: 'backend', stage: 3, order: 2,
        subcategory: 'backend',
        description: 'クライアント駆動のクエリ言語・スキーマ',
        aliases: [],
        prerequisiteIds: ['api-design'],
        pathIds: ['backend-specialist', 'fullstack'] },

      { id: 'rust', kind: 'skill', name: 'Rust', shortName: 'Rust',
        category: 'language', lane: 'backend', stage: 3, order: 3,
        subcategory: 'language',
        description: '高性能・安全なシステムプログラミング言語',
        aliases: [],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['backend-specialist'] },

      { id: 'ddd', kind: 'skill', name: 'DDD', shortName: 'DDD',
        category: 'domain', lane: 'backend', stage: 3, order: 4,
        subcategory: 'architecture',
        description: 'ドメイン駆動設計・モデリング',
        aliases: ['Domain Driven Design', 'ドメイン駆動設計'],
        prerequisiteIds: ['api-design'],
        pathIds: ['backend-specialist'] },

      { id: 'microservices', kind: 'skill', name: 'マイクロサービス', shortName: 'MS',
        category: 'domain', lane: 'backend', stage: 3, order: 5,
        subcategory: 'architecture',
        description: 'サービス分割・境界設計・分散通信',
        aliases: ['Microservices', 'マイクロサービス設計'],
        prerequisiteIds: ['api-design'],
        pathIds: ['backend-specialist', 'cloud-architect'] },

      // ===== Cloud =====
      { id: 'aws', kind: 'skill', name: 'AWS', shortName: 'AWS',
        category: 'infra', lane: 'cloud', stage: 2, order: 0,
        subcategory: 'cloud',
        description: 'Amazon Web Services。クラウド基盤の代表格',
        aliases: [],
        prerequisiteIds: ['linux', 'networking-http'],
        pathIds: ['cloud-architect', 'devops', 'sre'],
        levelGuide: {
          1: 'EC2/S3 などの基礎サービスを触れる',
          2: 'VPC・IAM の設計が読める',
          3: '主要サービスを組み合わせて設計できる',
          4: '可用性・コスト・運用を意識した設計ができる',
          5: '大規模マルチアカウント設計をリードできる',
        } },

      { id: 'gcp', kind: 'skill', name: 'GCP', shortName: 'GCP',
        category: 'infra', lane: 'cloud', stage: 2, order: 4,
        subcategory: 'cloud',
        description: 'Google Cloud Platform',
        aliases: ['Google Cloud'],
        prerequisiteIds: ['linux'],
        pathIds: ['cloud-architect'] },

      { id: 'docker', kind: 'skill', name: 'Docker', shortName: 'Docker',
        category: 'infra', lane: 'cloud', stage: 2, order: 1,
        subcategory: 'container',
        description: 'コンテナ仮想化の標準ツール',
        aliases: ['Container'],
        prerequisiteIds: ['linux'],
        pathIds: ['cloud-architect', 'devops', 'sre'] },

      { id: 'kubernetes', kind: 'skill', name: 'Kubernetes', shortName: 'k8s',
        category: 'infra', lane: 'cloud', stage: 3, order: 0,
        subcategory: 'container',
        description: 'コンテナオーケストレーションの標準',
        aliases: ['k8s'],
        prerequisiteIds: ['docker'],
        pathIds: ['cloud-architect', 'devops', 'sre'] },

      { id: 'serverless', kind: 'skill', name: 'Serverless', shortName: 'Serverless',
        category: 'infra', lane: 'cloud', stage: 3, order: 4,
        subcategory: 'cloud',
        description: 'Lambda などのサーバーレス基盤',
        aliases: ['Lambda', 'Functions'],
        prerequisiteIds: ['aws'],
        pathIds: ['cloud-architect'] },

      // ===== DevOps =====
      { id: 'github-actions', kind: 'skill', name: 'GitHub Actions', shortName: 'GHA',
        category: 'infra', lane: 'devops', stage: 2, order: 3,
        subcategory: 'iac',
        description: 'CI/CD パイプラインを宣言的に書ける',
        aliases: ['CI/CD', 'CI', 'CD'],
        prerequisiteIds: ['git-github'],
        pathIds: ['devops', 'qa-automation-specialist', 'sre'],
        levelGuide: {
          1: '既存 workflow を読める',
          2: '簡単な workflow を修正できる',
          3: 'テスト・ビルド・デプロイを自分で組める',
          4: '再利用可能な workflow や権限設計を整備できる',
          5: '組織標準の CI/CD 設計をリードできる',
        },
        evidenceExamples: [
          'テスト自動実行を追加した',
          'デプロイ workflow を改善した',
          '権限や Secrets 管理を見直した',
        ] },

      { id: 'release-mgmt', kind: 'skill', name: 'リリース管理', shortName: 'Release',
        category: 'domain', lane: 'devops', stage: 2, order: 4,
        subcategory: 'iac',
        description: 'リリース計画・カナリア・ロールバック',
        aliases: ['Release', 'Deploy'],
        prerequisiteIds: ['github-actions'],
        pathIds: ['devops', 'sre'] },

      { id: 'terraform', kind: 'skill', name: 'Terraform', shortName: 'TF',
        category: 'infra', lane: 'devops', stage: 3, order: 0,
        subcategory: 'iac',
        description: 'IaC（Infrastructure as Code）の代表ツール',
        aliases: ['IaC'],
        prerequisiteIds: ['aws'],
        pathIds: ['devops', 'cloud-architect', 'sre'] },

      { id: 'observability', kind: 'skill', name: 'Observability', shortName: 'Obs',
        category: 'domain', lane: 'devops', stage: 3, order: 1,
        subcategory: 'observability',
        description: 'ログ、メトリクス、トレースで運用を観測する',
        aliases: ['監視', 'モニタリング'],
        prerequisiteIds: ['linux'],
        pathIds: ['devops', 'sre'] },

      { id: 'logging-metrics', kind: 'skill', name: 'Logging / Metrics', shortName: 'Logs',
        category: 'infra', lane: 'devops', stage: 3, order: 3,
        subcategory: 'observability',
        description: 'ログ収集・メトリクス可視化（Datadog/Prometheus等）',
        aliases: ['Logging', 'Metrics', 'Prometheus', 'Datadog'],
        prerequisiteIds: ['observability'],
        pathIds: ['devops', 'sre'] },

      { id: 'sre', kind: 'skill', name: 'SRE', shortName: 'SRE',
        category: 'domain', lane: 'devops', stage: 3, order: 2,
        subcategory: 'observability',
        description: 'Site Reliability Engineering。信頼性・運用改善',
        aliases: ['Site Reliability Engineering'],
        prerequisiteIds: ['observability'],
        pathIds: ['devops', 'sre'] },

      // ===== QA =====
      { id: 'test-design', kind: 'skill', name: 'テスト設計', shortName: 'Test',
        category: 'domain', lane: 'qa', stage: 2, order: -1,
        subcategory: 'qa',
        description: '同値分割・境界値・状態遷移などのテスト技法',
        aliases: ['Test Design', 'テスト技法'],
        prerequisiteIds: ['engineering-core'],
        pathIds: ['qa-automation-specialist'] },

      { id: 'pytest', kind: 'skill', name: 'Pytest', shortName: 'Pytest',
        category: 'framework', lane: 'qa', stage: 2, order: 0,
        subcategory: 'qa',
        description: 'Python のテストフレームワーク',
        aliases: [],
        prerequisiteIds: ['python'],
        pathIds: ['qa-automation-specialist', 'backend-specialist'] },

      { id: 'playwright', kind: 'skill', name: 'Playwright', shortName: 'Playwright',
        category: 'framework', lane: 'qa', stage: 2, order: 1,
        subcategory: 'qa',
        description: 'モダンE2Eテストフレームワーク',
        aliases: [],
        prerequisiteIds: ['typescript'],
        pathIds: ['qa-automation-specialist', 'frontend-specialist'] },

      // ===== Security =====
      { id: 'security', kind: 'skill', name: 'セキュリティ', shortName: 'Sec',
        category: 'domain', lane: 'security', stage: 2, order: 0,
        subcategory: 'security',
        description: 'セキュア設計・認証認可・脆弱性対策の基礎',
        aliases: ['Security', 'IAM', '脆弱性診断'],
        prerequisiteIds: ['networking-http'],
        pathIds: ['security-specialist', 'cloud-architect', 'devops'] },

      { id: 'owasp', kind: 'skill', name: 'OWASP / 脆弱性', shortName: 'OWASP',
        category: 'domain', lane: 'security', stage: 2, order: 1,
        subcategory: 'security',
        description: 'OWASP Top10 などの脆弱性と対策',
        aliases: ['Vulnerability'],
        prerequisiteIds: ['security'],
        pathIds: ['security-specialist'] },

      { id: 'devsecops', kind: 'skill', name: 'DevSecOps', shortName: 'DevSecOps',
        category: 'domain', lane: 'security', stage: 3, order: 0,
        subcategory: 'security',
        description: 'CI/CDにセキュリティを組み込む',
        aliases: ['Sec in DevOps'],
        prerequisiteIds: ['security', 'github-actions'],
        pathIds: ['security-specialist', 'devops'] },

      // ===== Data / AI =====
      { id: 'data-pipeline', kind: 'skill', name: 'データパイプライン', shortName: 'Pipeline',
        category: 'domain', lane: 'data', stage: 2, order: 0,
        subcategory: 'data',
        description: 'ETL/ELT、ワークフロー設計',
        aliases: ['ETL', 'Data Pipeline'],
        prerequisiteIds: ['python', 'sql'],
        pathIds: ['data-ai-engineer'] },

      { id: 'machine-learning', kind: 'skill', name: '機械学習', shortName: 'ML',
        category: 'domain', lane: 'data', stage: 3, order: 0,
        subcategory: 'data',
        description: 'モデル設計と学習・評価の基礎',
        aliases: ['ML', 'Machine Learning'],
        prerequisiteIds: ['python'],
        pathIds: ['data-ai-engineer'] },

      { id: 'llm', kind: 'skill', name: 'LLM / 生成AI', shortName: 'LLM',
        category: 'domain', lane: 'data', stage: 3, order: 1,
        subcategory: 'data',
        description: 'LLM・プロンプト設計・RAG',
        aliases: ['LLM', '生成AI', 'GenAI', 'Prompt Engineering'],
        prerequisiteIds: ['python'],
        pathIds: ['data-ai-engineer'] },

      // ===== Certification =====
      { id: 'aws-saa', kind: 'certification', name: 'AWS SAA', shortName: 'SAA',
        category: 'certification', lane: 'cloud', stage: 3, order: 2,
        subcategory: 'certification',
        description: 'AWS Solutions Architect Associate。AWS設計の基礎資格',
        aliases: ['AWS Solutions Architect Associate', 'AWS Certified Solutions Architect - Associate'],
        prerequisiteIds: ['aws'],
        pathIds: ['cloud-architect'] },

      { id: 'cka', kind: 'certification', name: 'CKA', shortName: 'CKA',
        category: 'certification', lane: 'cloud', stage: 3, order: 3,
        subcategory: 'certification',
        description: 'Certified Kubernetes Administrator',
        aliases: ['Certified Kubernetes Administrator'],
        prerequisiteIds: ['kubernetes'],
        pathIds: ['cloud-architect', 'devops'] },

      { id: 'fe-jp', kind: 'certification', name: '基本情報技術者', shortName: 'FE',
        category: 'certification', lane: 'core', stage: 1, order: 4,
        subcategory: 'certification',
        description: 'IT 基礎を体系的に証明する国家試験',
        aliases: ['基本情報', 'FE'],
        prerequisiteIds: ['engineering-core'],
        pathIds: [] },

      { id: 'ap-jp', kind: 'certification', name: '応用情報技術者', shortName: 'AP',
        category: 'certification', lane: 'core', stage: 2, order: 4,
        subcategory: 'certification',
        description: 'IT技術を応用できる国家試験',
        aliases: ['応用情報', 'AP'],
        prerequisiteIds: ['fe-jp'],
        pathIds: [] },

      { id: 'jstqb', kind: 'certification', name: 'JSTQB', shortName: 'JSTQB',
        category: 'certification', lane: 'qa', stage: 3, order: 4,
        subcategory: 'certification',
        description: 'ソフトウェアテスト技術者資格',
        aliases: ['ISTQB'],
        prerequisiteIds: ['test-design'],
        pathIds: ['qa-automation-specialist'] },

      // ===== Role (Specialist) =====
      { id: 'frontend-specialist', kind: 'role', name: 'フロントエンドスペシャリスト',
        lane: 'frontend', stage: 4, order: 0,
        description: 'UI実装、設計、パフォーマンス改善をリードする専門家',
        requiredNodeIds: ['typescript', 'react', 'nextjs'],
        recommendedNodeIds: ['uiux', 'javascript', 'playwright'] },

      { id: 'backend-specialist', kind: 'role', name: 'バックエンドスペシャリスト',
        lane: 'backend', stage: 4, order: 0,
        description: 'API、DB、業務ロジックの設計を担う専門家',
        requiredNodeIds: ['api-design', 'postgresql'],
        recommendedNodeIds: ['go', 'python', 'fastapi'] },

      { id: 'cloud-architect', kind: 'role', name: 'クラウドアーキテクト',
        lane: 'cloud', stage: 4, order: 0,
        description: 'クラウド基盤、IaC、運用設計をリードする専門家',
        requiredNodeIds: ['aws', 'docker', 'kubernetes', 'terraform'],
        recommendedNodeIds: ['linux', 'security'] },

      { id: 'devops-specialist', kind: 'role', name: 'DevOps Specialist',
        lane: 'devops', stage: 4, order: 0,
        description: '開発と運用をつなぎ、継続的な価値提供を支える専門家',
        requiredNodeIds: ['git-github', 'linux', 'docker', 'github-actions', 'terraform'],
        recommendedNodeIds: ['kubernetes', 'observability', 'sre', 'aws'] },

      { id: 'qa-automation-specialist', kind: 'role', name: 'QAオートメーションスペシャリスト',
        lane: 'qa', stage: 4, order: 0,
        description: 'テスト設計と自動化基盤を推進する専門家',
        requiredNodeIds: ['playwright', 'pytest', 'github-actions'],
        recommendedNodeIds: ['python', 'typescript'] },

      { id: 'security-specialist', kind: 'role', name: 'セキュリティスペシャリスト',
        lane: 'security', stage: 4, order: 0,
        description: 'セキュア設計、認証認可、脆弱性対策を担う専門家',
        requiredNodeIds: ['security', 'networking-http'],
        recommendedNodeIds: ['aws', 'linux'] },

      { id: 'data-ai-engineer', kind: 'role', name: 'データ・AIエンジニア',
        lane: 'data', stage: 4, order: 0,
        description: 'データ処理、分析、AI活用を推進する専門家',
        requiredNodeIds: ['python', 'machine-learning'],
        recommendedNodeIds: ['postgresql'] },
    ],

    edges: [
      // required: 前提（太い実線）
      { from: 'engineering-core', to: 'git-github',       type: 'required', pathIds: ['devops'] },
      { from: 'engineering-core', to: 'linux',            type: 'required', pathIds: ['devops', 'cloud-architect'] },
      { from: 'engineering-core', to: 'networking-http',  type: 'required', pathIds: ['devops', 'backend-specialist'] },
      { from: 'engineering-core', to: 'javascript',       type: 'required', pathIds: ['frontend-specialist'] },
      { from: 'engineering-core', to: 'python',           type: 'required', pathIds: ['backend-specialist', 'data-ai-engineer'] },
      { from: 'engineering-core', to: 'go',               type: 'required', pathIds: ['backend-specialist'] },

      { from: 'linux',            to: 'shell-bash',       type: 'required', pathIds: ['devops'] },
      { from: 'linux',            to: 'aws',              type: 'required', pathIds: ['cloud-architect', 'devops'] },
      { from: 'networking-http',  to: 'aws',              type: 'required', pathIds: ['cloud-architect'] },
      { from: 'git-github',       to: 'github-actions',   type: 'required', pathIds: ['devops', 'qa-automation-specialist'] },

      { from: 'aws',              to: 'docker',           type: 'required', pathIds: ['devops', 'cloud-architect'] },
      { from: 'docker',           to: 'kubernetes',       type: 'required', pathIds: ['devops', 'cloud-architect'] },
      { from: 'aws',              to: 'terraform',        type: 'required', pathIds: ['devops', 'cloud-architect'] },
      { from: 'linux',            to: 'observability',    type: 'required', pathIds: ['devops', 'sre'] },
      { from: 'observability',    to: 'sre',              type: 'required', pathIds: ['devops', 'sre'] },

      { from: 'javascript',       to: 'typescript',       type: 'required', pathIds: ['frontend-specialist'] },
      { from: 'typescript',       to: 'react',            type: 'required', pathIds: ['frontend-specialist'] },
      { from: 'react',            to: 'nextjs',           type: 'required', pathIds: ['frontend-specialist'] },
      { from: 'typescript',       to: 'api-design',       type: 'required', pathIds: ['fullstack'] },

      { from: 'networking-http',  to: 'api-design',       type: 'required', pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'postgresql',       type: 'recommended', pathIds: ['backend-specialist'] },
      { from: 'python',           to: 'fastapi',          type: 'required', pathIds: ['backend-specialist'] },
      { from: 'python',           to: 'django',           type: 'required', pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'fastapi',          type: 'recommended', pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'graphql',          type: 'recommended', pathIds: ['backend-specialist'] },
      { from: 'go',               to: 'api-design',       type: 'recommended', pathIds: ['backend-specialist'] },

      { from: 'python',           to: 'pytest',           type: 'required', pathIds: ['qa-automation-specialist'] },
      { from: 'typescript',       to: 'playwright',       type: 'required', pathIds: ['qa-automation-specialist'] },
      { from: 'github-actions',   to: 'playwright',       type: 'recommended', pathIds: ['qa-automation-specialist'] },
      { from: 'github-actions',   to: 'pytest',           type: 'recommended', pathIds: ['qa-automation-specialist'] },

      { from: 'networking-http',  to: 'security',         type: 'required', pathIds: ['security-specialist'] },
      { from: 'security',         to: 'aws',              type: 'related',  pathIds: ['security-specialist', 'cloud-architect'] },

      { from: 'python',           to: 'machine-learning', type: 'required', pathIds: ['data-ai-engineer'] },
      { from: 'postgresql',       to: 'machine-learning', type: 'recommended', pathIds: ['data-ai-engineer'] },

      // 新規追加分（v2.1）
      { from: 'html',             to: 'css',              type: 'required' },
      { from: 'css',              to: 'react',            type: 'recommended', pathIds: ['frontend-specialist'] },
      { from: 'html',             to: 'accessibility',    type: 'required',    pathIds: ['frontend-specialist'] },
      { from: 'react',            to: 'web-performance',  type: 'recommended', pathIds: ['frontend-specialist'] },

      { from: 'sql',              to: 'postgresql',       type: 'required',    pathIds: ['backend-specialist'] },
      { from: 'sql',              to: 'mysql',            type: 'required',    pathIds: ['backend-specialist'] },
      { from: 'typescript',       to: 'nodejs',           type: 'required',    pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'auth-authz',       type: 'required',    pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'ddd',              type: 'recommended', pathIds: ['backend-specialist'] },
      { from: 'api-design',       to: 'microservices',    type: 'recommended', pathIds: ['backend-specialist', 'cloud-architect'] },

      { from: 'linux',            to: 'gcp',              type: 'recommended', pathIds: ['cloud-architect'] },
      { from: 'aws',              to: 'serverless',       type: 'recommended', pathIds: ['cloud-architect'] },
      { from: 'aws',              to: 'redis',            type: 'related',     pathIds: ['cloud-architect'] },

      { from: 'github-actions',   to: 'release-mgmt',     type: 'required',    pathIds: ['devops'] },
      { from: 'observability',    to: 'logging-metrics',  type: 'required',    pathIds: ['devops', 'sre'] },

      { from: 'engineering-core', to: 'cli',              type: 'required' },
      { from: 'engineering-core', to: 'cs-basics',        type: 'related' },
      { from: 'git-github',       to: 'code-review',      type: 'required' },
      { from: 'engineering-core', to: 'documentation',    type: 'related' },
      { from: 'code-review',      to: 'mentoring',        type: 'recommended' },
      { from: 'mentoring',        to: 'tech-lead',        type: 'required' },

      { from: 'security',         to: 'owasp',            type: 'required',    pathIds: ['security-specialist'] },
      { from: 'security',         to: 'devsecops',        type: 'recommended', pathIds: ['security-specialist', 'devops'] },
      { from: 'github-actions',   to: 'devsecops',        type: 'recommended', pathIds: ['devops'] },

      { from: 'test-design',      to: 'pytest',           type: 'recommended', pathIds: ['qa-automation-specialist'] },
      { from: 'test-design',      to: 'playwright',       type: 'recommended', pathIds: ['qa-automation-specialist'] },
      { from: 'test-design',      to: 'jstqb',            type: 'related',     pathIds: ['qa-automation-specialist'] },

      { from: 'python',           to: 'data-pipeline',    type: 'required',    pathIds: ['data-ai-engineer'] },
      { from: 'sql',              to: 'data-pipeline',    type: 'required',    pathIds: ['data-ai-engineer'] },
      { from: 'python',           to: 'llm',              type: 'recommended', pathIds: ['data-ai-engineer'] },

      { from: 'fe-jp',            to: 'ap-jp',            type: 'related' },

      // 資格は related
      { from: 'aws',              to: 'aws-saa',          type: 'related', pathIds: ['cloud-architect'] },
      { from: 'kubernetes',       to: 'cka',              type: 'related', pathIds: ['cloud-architect', 'devops'] },

      // 専門ノードへ到達
      { from: 'nextjs',           to: 'frontend-specialist',       type: 'required', pathIds: ['frontend-specialist'] },
      { from: 'uiux',             to: 'frontend-specialist',       type: 'recommended', pathIds: ['frontend-specialist'] },
      { from: 'fastapi',          to: 'backend-specialist',        type: 'required', pathIds: ['backend-specialist'] },
      { from: 'postgresql',       to: 'backend-specialist',        type: 'required', pathIds: ['backend-specialist'] },
      { from: 'kubernetes',       to: 'cloud-architect',           type: 'required', pathIds: ['cloud-architect'] },
      { from: 'terraform',        to: 'cloud-architect',           type: 'required', pathIds: ['cloud-architect'] },
      { from: 'terraform',        to: 'devops-specialist',         type: 'required', pathIds: ['devops'] },
      { from: 'kubernetes',       to: 'devops-specialist',         type: 'required', pathIds: ['devops'] },
      { from: 'observability',    to: 'devops-specialist',         type: 'required', pathIds: ['devops'] },
      { from: 'sre',              to: 'devops-specialist',         type: 'required', pathIds: ['devops', 'sre'] },
      { from: 'github-actions',   to: 'devops-specialist',         type: 'required', pathIds: ['devops'] },
      { from: 'playwright',       to: 'qa-automation-specialist',  type: 'required', pathIds: ['qa-automation-specialist'] },
      { from: 'pytest',           to: 'qa-automation-specialist',  type: 'required', pathIds: ['qa-automation-specialist'] },
      { from: 'github-actions',   to: 'qa-automation-specialist',  type: 'required', pathIds: ['qa-automation-specialist'] },
      { from: 'security',         to: 'security-specialist',       type: 'required', pathIds: ['security-specialist'] },
      { from: 'machine-learning', to: 'data-ai-engineer',          type: 'required', pathIds: ['data-ai-engineer'] },
    ],
  };

  // ----------------------------------------------------------
  // 3. 専門ルート定義
  // ----------------------------------------------------------

  const SPECIALIST_PATHS = [
    {
      id: 'devops',
      name: 'DevOps Specialist',
      label: 'DevOps',
      color: '#60A5FA',
      description: '開発と運用をつなぎ、継続的な価値提供を支える専門ルート',
      nodeIds: [
        'engineering-core', 'git-github', 'linux', 'shell-bash', 'networking-http',
        'aws', 'docker', 'github-actions', 'terraform', 'kubernetes',
        'observability', 'sre',
      ],
      targetNodeId: 'devops-specialist',
      requiredAverageLevel: 4,
    },
    {
      id: 'frontend-specialist',
      name: 'Frontend Specialist',
      label: 'Frontend',
      color: '#A78BFA',
      description: 'モダンWebフロントの実装・設計・体験を磨く専門ルート',
      nodeIds: ['engineering-core', 'javascript', 'typescript', 'uiux', 'react', 'nextjs', 'playwright'],
      targetNodeId: 'frontend-specialist',
      requiredAverageLevel: 4,
    },
    {
      id: 'backend-specialist',
      name: 'Backend Specialist',
      label: 'Backend',
      color: '#34D399',
      description: 'API・DB・業務ロジックの設計を担う専門ルート',
      nodeIds: ['engineering-core', 'networking-http', 'python', 'go', 'api-design', 'postgresql', 'fastapi', 'graphql'],
      targetNodeId: 'backend-specialist',
      requiredAverageLevel: 4,
    },
    {
      id: 'cloud-architect',
      name: 'Cloud Architect',
      label: 'Cloud',
      color: '#38BDF8',
      description: 'クラウド基盤・IaC・運用設計をリードする専門ルート',
      nodeIds: ['linux', 'networking-http', 'aws', 'docker', 'terraform', 'kubernetes', 'security', 'aws-saa', 'cka'],
      targetNodeId: 'cloud-architect',
      requiredAverageLevel: 4,
    },
    {
      id: 'qa-automation-specialist',
      name: 'QA Automation Specialist',
      label: 'QA',
      color: '#A3E635',
      description: 'テスト設計と自動化基盤を推進する専門ルート',
      nodeIds: ['engineering-core', 'python', 'typescript', 'pytest', 'playwright', 'github-actions'],
      targetNodeId: 'qa-automation-specialist',
      requiredAverageLevel: 4,
    },
    {
      id: 'security-specialist',
      name: 'Security Specialist',
      label: 'Security',
      color: '#FB7185',
      description: 'セキュア設計、認証認可、脆弱性対策を担う専門ルート',
      nodeIds: ['networking-http', 'linux', 'security', 'aws'],
      targetNodeId: 'security-specialist',
      requiredAverageLevel: 4,
    },
    {
      id: 'data-ai-engineer',
      name: 'Data / AI Engineer',
      label: 'Data/AI',
      color: '#FBBF24',
      description: 'データ処理・分析・AI活用を推進する専門ルート',
      nodeIds: ['engineering-core', 'python', 'postgresql', 'machine-learning'],
      targetNodeId: 'data-ai-engineer',
      requiredAverageLevel: 4,
    },
  ];

  // カテゴリ色（lane別。ノードの色はlaneで決める）
  const LANE_COLORS = {
    core:          { core: '#F8FAFC', glow: '248, 250, 252' },
    frontend:      { core: '#A78BFA', glow: '167, 139, 250' },
    backend:       { core: '#34D399', glow: '52, 211, 153' },
    cloud:         { core: '#38BDF8', glow: '56, 189, 248' },
    devops:        { core: '#60A5FA', glow: '96, 165, 250' },
    qa:            { core: '#A3E635', glow: '163, 230, 53' },
    security:      { core: '#FB7185', glow: '251, 113, 133' },
    data:          { core: '#FBBF24', glow: '251, 191, 36' },
    certification: { core: '#FDE68A', glow: '253, 230, 138' },
    role:          { core: '#F8FAFC', glow: '248, 250, 252' },
  };

  const LEVEL_LABELS = ['未習得', '初学者', '入門', '実務経験あり', '上級', 'エキスパート'];

  // ----------------------------------------------------------
  // 4. 放射レイアウト（lane / stage → x, y）
  // ----------------------------------------------------------

  function toRad(deg) { return (deg * Math.PI) / 180; }

  function layoutNodes(nodes) {
    // 1) stage 0 のCoreは中心
    nodes.forEach(n => {
      if (n.stage === 0) { n.x = 0; n.y = 0; }
    });

    // 2) lane × stage で角度オフセットを計算
    const groups = new Map();
    nodes.forEach(n => {
      if (n.stage === 0) return;
      const key = `${n.lane}|${n.stage}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(n);
    });

    groups.forEach((siblings) => {
      siblings.sort((a, b) => (a.order || 0) - (b.order || 0));
      const stage = siblings[0].stage;
      const lane = siblings[0].lane;
      const baseAngle = LANE_ANGLES[lane];
      if (baseAngle == null) {
        siblings.forEach(n => { n.x = 0; n.y = 0; });
        return;
      }
      const spreadByStage = [0, 30, 42, 50, 22];
      const spread = spreadByStage[stage] || 38;
      const n = siblings.length;
      const radius = STAGE_RADIUS[stage] || (stage * 120);

      siblings.forEach((node, i) => {
        const offset = n === 1
          ? 0
          : -spread / 2 + (spread * i) / (n - 1);
        const angle = toRad(baseAngle + offset);
        node.x = Math.cos(angle) * radius;
        node.y = Math.sin(angle) * radius;
      });
    });
    return nodes;
  }

  // 初期化時にマスターへ座標を生成
  layoutNodes(SKILL_GALAXY_MASTER.nodes);

  // ----------------------------------------------------------
  // 5. 既存ユーザーデータとの照合
  // ----------------------------------------------------------

  function normalize(s) {
    return (s || '').toString().trim().toLowerCase().replace(/[\s\-_/]/g, '');
  }

  function nodeMatchesName(node, name) {
    const target = normalize(name);
    if (!target) return false;
    if (normalize(node.name) === target) return true;
    return (node.aliases || []).some(a => normalize(a) === target);
  }

  function findMatchingSkill(skills, node) {
    return (skills || []).find(s => nodeMatchesName(node, s.name)) || null;
  }

  function findMatchingCertification(certs, node) {
    return (certs || []).find(c => nodeMatchesName(node, c.name)) || null;
  }

  function buildUserGalaxyState(user) {
    const safeUser = user || {};
    return SKILL_GALAXY_MASTER.nodes.map(node => {
      if (node.kind === 'role') {
        return { ...node, owned: false, level: 0, progress: calcRoleProgress(safeUser, node) };
      }
      if (node.kind === 'core') {
        return { ...node, owned: true, level: 5 };
      }
      if (node.kind === 'certification') {
        const cert = findMatchingCertification(safeUser.certifications, node);
        return {
          ...node, owned: Boolean(cert), level: cert ? 5 : 0,
          sourceCertificationId: cert?.id || null,
        };
      }
      const skill = findMatchingSkill(safeUser.skills, node);
      const level = skill ? Number(skill.level || 0) : 0;
      return { ...node, owned: level > 0, level, sourceSkillId: skill?.id || null };
    });
  }

  function getNodeLevelFromUser(user, nodeId) {
    const node = SKILL_GALAXY_MASTER.nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    if (node.kind === 'core') return 5;
    if (node.kind === 'certification') {
      return findMatchingCertification(user?.certifications, node) ? 5 : 0;
    }
    const skill = findMatchingSkill(user?.skills, node);
    return skill ? Number(skill.level || 0) : 0;
  }

  function avg(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function calcRoleProgress(user, roleNode) {
    const required = roleNode.requiredNodeIds || [];
    const recommended = roleNode.recommendedNodeIds || [];
    const requiredLevels = required.map(id => getNodeLevelFromUser(user, id));
    const recommendedLevels = recommended.map(id => getNodeLevelFromUser(user, id));

    if (required.length > 0 &&
        requiredLevels.every(lv => lv > 0) &&
        avg(requiredLevels) >= 4) {
      return 100;
    }
    const requiredScore = avg(requiredLevels.map(lv => lv / 5));
    const recommendedScore = avg(recommendedLevels.map(lv => lv / 5));
    const value = (recommended.length === 0 || required.length === 0)
      ? requiredScore
      : requiredScore * 0.75 + recommendedScore * 0.25;
    return Math.min(99, Math.round(value * 100));
  }

  // ルート進捗（仕様 5.3）
  function calcPathProgress(user, path) {
    if (!path || !path.nodeIds || path.nodeIds.length === 0) return 0;
    const required = path.requiredAverageLevel || 3;
    const levels = path.nodeIds.map(id => {
      const lv = getNodeLevelFromUser(user, id);
      return Math.min(1, lv / required);
    });
    return Math.round(avg(levels) * 100);
  }

  function getPathPassedNodes(state, path) {
    if (!path) return [];
    const required = path.requiredAverageLevel || 3;
    return path.nodeIds
      .map(id => state.find(n => n.id === id))
      .filter(n => n && (n.level || 0) >= required && n.kind !== 'core');
  }

  function getPathPendingNodes(state, path) {
    if (!path) return [];
    const required = path.requiredAverageLevel || 3;
    return path.nodeIds
      .map(id => state.find(n => n.id === id))
      .filter(n => n && (n.level || 0) < required && n.kind !== 'core');
  }

  // ----------------------------------------------------------
  // 6. 編集用：editForm.skills の更新
  // ----------------------------------------------------------

  function updateSkillLevel(editForm, node, level) {
    if (!editForm || !node || node.kind !== 'skill') return;
    if (!Array.isArray(editForm.skills)) editForm.skills = [];
    const lv = Math.max(0, Math.min(5, Number(level) || 0));
    const idx = editForm.skills.findIndex(s => nodeMatchesName(node, s.name));
    if (idx === -1) {
      if (lv > 0) {
        editForm.skills.push({
          id: `skill_${Date.now()}`,
          category: node.category || 'language',
          name: node.name,
          level: lv,
        });
      }
    } else if (lv === 0) {
      editForm.skills.splice(idx, 1);
    } else {
      editForm.skills[idx].level = lv;
    }
  }

  // ----------------------------------------------------------
  // 7. 次に伸ばす候補・関連
  // ----------------------------------------------------------

  function getSuggestedNextNodes(state, fromNodeId, max) {
    const limit = max || 3;
    const neighborIds = new Set();
    SKILL_GALAXY_MASTER.edges.forEach(e => {
      if (e.from === fromNodeId) neighborIds.add(e.to);
      if (e.to === fromNodeId) neighborIds.add(e.from);
    });
    return Array.from(neighborIds)
      .map(id => state.find(n => n.id === id))
      .filter(n => n && n.kind !== 'role' && n.kind !== 'core' && !n.owned)
      .slice(0, limit);
  }

  function getPrerequisiteNodes(state, nodeId) {
    const node = SKILL_GALAXY_MASTER.nodes.find(n => n.id === nodeId);
    if (!node) return [];
    return (node.prerequisiteIds || [])
      .map(id => state.find(n => n.id === id))
      .filter(Boolean);
  }

  function getRelatedRoles(state, nodeId) {
    return state.filter(n =>
      n.kind === 'role' &&
      ((n.requiredNodeIds || []).includes(nodeId) ||
       (n.recommendedNodeIds || []).includes(nodeId))
    );
  }

  function getNodePathIds(nodeId) {
    const node = SKILL_GALAXY_MASTER.nodes.find(n => n.id === nodeId);
    return node?.pathIds || [];
  }

  // ----------------------------------------------------------
  // 7b. スキルカタログ（リスト表示）用ヘルパー
  // ----------------------------------------------------------

  function getCatalogState(user) {
    // role/core を除いた skill/certification のみ
    return buildUserGalaxyState(user)
      .filter(n => n.kind === 'skill' || n.kind === 'certification');
  }

  function filterCatalog(state, opts) {
    const q = (opts.keyword || '').trim().toLowerCase();
    const lane = opts.lane || null;
    const pathId = opts.pathId || null;
    const levelBand = opts.levelBand || null; // 'missing' | 'lv1-2' | 'lv3+' | 'lv5'
    const subcategory = opts.subcategory || null;
    const certOnly = !!opts.certOnly;

    return state.filter(n => {
      if (certOnly && n.kind !== 'certification') return false;
      if (lane && n.lane !== lane) return false;
      if (subcategory && n.subcategory !== subcategory) return false;
      if (pathId && !(n.pathIds || []).includes(pathId)) return false;
      if (q) {
        const hay = [
          n.name, n.shortName, n.description, n.subcategory,
          ...(n.aliases || []),
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (levelBand) {
        const lv = n.level || 0;
        if (levelBand === 'missing' && lv > 0) return false;
        if (levelBand === 'lv1-2'   && !(lv >= 1 && lv <= 2)) return false;
        if (levelBand === 'lv3+'    && lv < 3) return false;
        if (levelBand === 'lv5'     && lv !== 5) return false;
      }
      return true;
    });
  }

  function sortCatalog(nodes, opts) {
    const pathId = opts?.pathId || null;
    const path = pathId ? SPECIALIST_PATHS.find(p => p.id === pathId) : null;
    const pathOrder = new Map();
    if (path) path.nodeIds.forEach((id, i) => pathOrder.set(id, i));

    return [...nodes].sort((a, b) => {
      // 1) ルート上を優先
      if (path) {
        const ao = pathOrder.has(a.id);
        const bo = pathOrder.has(b.id);
        if (ao !== bo) return ao ? -1 : 1;
        if (ao && bo) return pathOrder.get(a.id) - pathOrder.get(b.id);
      }
      // 2) 習得済み > 未習得
      const aown = a.owned ? 0 : 1;
      const bown = b.owned ? 0 : 1;
      if (aown !== bown) return aown - bown;
      // 3) stage
      if ((a.stage || 0) !== (b.stage || 0)) return (a.stage || 0) - (b.stage || 0);
      // 4) order
      return (a.order || 0) - (b.order || 0);
    });
  }

  function groupBySubcategory(nodes) {
    const groups = new Map();
    nodes.forEach(n => {
      const k = n.subcategory || 'other';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(n);
    });
    // ラベル順
    const orderKeys = Object.keys(SUBCATEGORY_LABELS);
    return orderKeys
      .filter(k => groups.has(k))
      .map(k => ({ key: k, label: SUBCATEGORY_LABELS[k], items: groups.get(k) }))
      .concat(
        Array.from(groups.keys())
          .filter(k => !orderKeys.includes(k))
          .map(k => ({ key: k, label: k, items: groups.get(k) }))
      );
  }

  // ----------------------------------------------------------
  // 8. レンダラー
  // ----------------------------------------------------------

  function createRenderer(canvas, options) {
    const opts = Object.assign({
      mode: 'view',           // 'view' | 'edit'
      user: null,
      editable: false,
      displayMode: 'all',     // 'all' | 'path' | 'missing' | 'owned' | 'next'
      selectedPathId: null,
      onSelect: () => {},
      onChange: () => {},
      onCelebrate: () => {},
    }, options || {});

    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    let state = buildUserGalaxyState(opts.user);
    let displayMode = opts.displayMode || 'all';
    let selectedPathId = opts.selectedPathId || null;
    let scale = 0.85;
    let offsetX = 0;
    let offsetY = 0;
    let isPanning = false;
    let panStart = null;
    let pointerDownAt = null;
    let hoveredId = null;
    let selectedId = null;
    let rafId = null;
    let resizeObserver = null;
    let mounted = false;
    let bgStars = [];
    const celebrations = [];
    let lastRoleProgress = new Map();
    let firstDrawDone = false;

    function generateBgStars() {
      bgStars = [];
      const count = 140;
      for (let i = 0; i < count; i++) {
        bgStars.push({
          x: (Math.random() * 2200) - 1100,
          y: (Math.random() * 1600) - 800,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.6 + 0.1,
        });
      }
    }
    generateBgStars();

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      requestDraw();
    }

    function worldToScreen(wx, wy) {
      return { x: wx * scale + width / 2 + offsetX, y: wy * scale + height / 2 + offsetY };
    }
    function screenToWorld(sx, sy) {
      return { x: (sx - width / 2 - offsetX) / scale, y: (sy - height / 2 - offsetY) / scale };
    }

    function nodeColor(node) {
      const key = node.kind === 'role' ? 'role'
                : node.kind === 'certification' ? 'certification'
                : node.kind === 'core' ? 'core'
                : (node.lane || 'core');
      return LANE_COLORS[key] || LANE_COLORS.core;
    }

    function nodeRadius(node) {
      if (node.kind === 'core') return 16;
      if (node.kind === 'role') return 18 + (node.progress || 0) / 4; // 18〜43
      if (node.kind === 'certification') return node.owned ? 10 : 5;
      const level = node.level || 0;
      return level === 0 ? 4 : 5 + level * 1.5;
    }

    function nodeBrightness(node) {
      if (node.kind === 'core') return 1;
      if (node.kind === 'role') return Math.max(0.25, (node.progress || 0) / 100);
      if (node.kind === 'certification') return node.owned ? 1 : 0.2;
      return node.level === 0 ? 0.2 : 0.4 + node.level * 0.12;
    }

    // ノードがハイライト対象か（表示モードによって決まる）
    function isHighlighted(node) {
      if (displayMode === 'path' && selectedPathId) {
        const path = SPECIALIST_PATHS.find(p => p.id === selectedPathId);
        if (!path) return true;
        if (path.nodeIds.includes(node.id)) return true;
        if (path.targetNodeId === node.id) return true;
        return false;
      }
      if (displayMode === 'missing') {
        return node.kind === 'skill' && !node.owned;
      }
      if (displayMode === 'owned') {
        return (node.kind === 'skill' || node.kind === 'certification') && node.owned;
      }
      if (displayMode === 'next') {
        // 前提が満たされていて未習得のスキル
        if (node.kind !== 'skill' || node.owned) return false;
        const prereqs = node.prerequisiteIds || [];
        if (prereqs.length === 0) return true;
        return prereqs.every(pid => {
          const p = state.find(n => n.id === pid);
          return p && (p.owned || p.kind === 'core');
        });
      }
      return true;
    }

    // 線がハイライト対象か
    function isEdgeHighlighted(edge) {
      if (displayMode === 'path' && selectedPathId) {
        return (edge.pathIds || []).includes(selectedPathId);
      }
      return true;
    }

    function clear() {
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, '#0b1024');
      g.addColorStop(1, '#06070f');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    function drawBgStars() {
      ctx.save();
      bgStars.forEach(s => {
        const p = worldToScreen(s.x, s.y);
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) return;
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#cbd5f5';
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function drawStageRings() {
      const center = worldToScreen(0, 0);
      ctx.save();
      for (let i = 1; i < STAGE_RADIUS.length; i++) {
        const r = STAGE_RADIUS[i] * scale;
        ctx.strokeStyle = `rgba(148, 163, 184, ${i === 4 ? 0.18 : 0.10})`;
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // ステージラベル
      ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ['', 'Foundation', 'Practice', 'Advanced', 'Specialist'].forEach((label, i) => {
        if (!label) return;
        const r = STAGE_RADIUS[i] * scale;
        ctx.fillText(label, center.x + r + 4, center.y - 4);
      });
      ctx.restore();
    }

    function drawLaneLabels() {
      // 専門ロールのある外周にレーン名を薄く表示
      ctx.save();
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.textAlign = 'center';
      Object.keys(LANE_ANGLES).forEach(lane => {
        const a = LANE_ANGLES[lane];
        if (a == null) return;
        const r = (STAGE_RADIUS[4] + 40);
        const p = worldToScreen(Math.cos(toRad(a)) * r, Math.sin(toRad(a)) * r);
        const label = LANE_LABELS[lane];
        const isHi = (displayMode === 'path' && selectedPathId &&
          SPECIALIST_PATHS.find(pp => pp.id === selectedPathId)?.id.includes(lane));
        ctx.fillStyle = isHi ? 'rgba(248,250,252,0.85)' : 'rgba(148, 163, 184, 0.5)';
        ctx.fillText(label, p.x, p.y);
      });
      ctx.restore();
    }

    function drawEdges() {
      ctx.save();
      SKILL_GALAXY_MASTER.edges.forEach(edge => {
        const a = state.find(n => n.id === edge.from);
        const b = state.find(n => n.id === edge.to);
        if (!a || !b) return;
        if (!isHighlighted(a) && !isHighlighted(b)) {
          // 両方非ハイライトでも薄く描く（仕様: 非表示にしない）
        }
        const pa = worldToScreen(a.x, a.y);
        const pb = worldToScreen(b.x, b.y);

        const isPathEdge = isEdgeHighlighted(edge);
        const bothOwned = (a.owned || a.kind === 'core') && (b.owned || b.kind === 'role' || b.kind === 'core');
        const colKey = b.kind === 'role'
          ? 'role'
          : (a.lane === 'core' ? (b.lane || 'core') : (a.lane || 'core'));
        const col = LANE_COLORS[colKey] || LANE_COLORS.core;

        let alpha;
        let lineWidth;
        if (displayMode === 'path' && selectedPathId) {
          alpha = isPathEdge ? (bothOwned ? 0.65 : 0.45) : 0.06;
          lineWidth = isPathEdge ? 1.8 : 0.6;
        } else {
          alpha = bothOwned ? 0.45 : 0.14;
          lineWidth = bothOwned ? 1.4 : 0.7;
        }

        if (edge.type === 'related') ctx.setLineDash([3, 4]);
        else if (edge.type === 'recommended') ctx.setLineDash([6, 3]);
        else ctx.setLineDash([]);

        ctx.strokeStyle = `rgba(${col.glow}, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();
    }

    function drawNode(node) {
      const p = worldToScreen(node.x, node.y);
      const r = nodeRadius(node) * Math.max(scale, 0.6);
      const col = nodeColor(node);
      const brightness = nodeBrightness(node);
      const hi = isHighlighted(node);
      const dim = (displayMode !== 'all' && !hi) ? 0.35 : 1;

      ctx.save();
      ctx.globalAlpha = dim;

      // Core: 中央のリング付き
      if (node.kind === 'core') {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `rgba(${col.glow}, 0.4)`);
        grad.addColorStop(1, `rgba(${col.glow}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // ロール（スペシャリスト星雲）
      if (node.kind === 'role') {
        const cloudR = r * 1.8;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, cloudR);
        grad.addColorStop(0, `rgba(${col.glow}, ${0.18 * brightness + 0.05})`);
        grad.addColorStop(1, `rgba(${col.glow}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, cloudR, 0, Math.PI * 2);
        ctx.fill();

        // ハイライト時は太い輪郭
        const laneCol = LANE_COLORS[node.lane] || LANE_COLORS.core;
        const ringCol = hi ? laneCol : col;
        ctx.strokeStyle = `rgba(${ringCol.glow}, ${0.35 + brightness * 0.55})`;
        ctx.lineWidth = brightness > 0.8 ? 2.2 : 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(248, 250, 252, ${0.5 + brightness * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + brightness * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      // 通常スキル・資格
      if (node.owned || node.level > 0) {
        const glowR = r * 3;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, `rgba(${col.glow}, ${0.45 * brightness})`);
        glow.addColorStop(1, `rgba(${col.glow}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = node.owned ? col.core : `rgba(${col.glow}, ${brightness})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();

      // 「次」モードでパルス
      if (displayMode === 'next' && hi) {
        const pulse = 1 + Math.sin(performance.now() / 300) * 0.15;
        ctx.strokeStyle = `rgba(${col.glow}, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (1.6 * pulse), 0, Math.PI * 2);
        ctx.stroke();
        requestDraw();
      }

      if (node.owned && node.level >= 3) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(p.x - r * 0.25, p.y - r * 0.25, r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawSelectionRing(id, color, lw) {
      const node = state.find(n => n.id === id);
      if (!node) return;
      const p = worldToScreen(node.x, node.y);
      const r = nodeRadius(node) * Math.max(scale, 0.6);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw || 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawLabels() {
      ctx.save();
      ctx.font = '600 11px ui-sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      state.forEach(node => {
        if (node.kind === 'core' && scale < 1.0) {
          // Core は中心に常に出す
        }
        const p = worldToScreen(node.x, node.y);
        const r = nodeRadius(node) * Math.max(scale, 0.6);
        const hi = isHighlighted(node);
        const dim = (displayMode !== 'all' && !hi) ? 0.35 : 1;

        let label = node.name;
        let alpha = 0.85;
        if (node.kind === 'role') {
          label = `${node.name} ${node.progress || 0}%`;
          if ((node.progress || 0) < 30 && !hi) alpha = 0.35;
        } else if (!node.owned && node.kind !== 'core') {
          alpha = 0.5;
        }
        alpha *= dim;

        const m = ctx.measureText(label);
        const pad = 4;
        const tx = p.x;
        const ty = p.y + r + 6;
        ctx.fillStyle = `rgba(8, 11, 22, ${alpha * 0.55})`;
        ctx.fillRect(tx - m.width / 2 - pad, ty - 1, m.width + pad * 2, 14);
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
        ctx.fillText(label, tx, ty);
      });
      ctx.restore();
    }

    function drawCelebrations() {
      if (celebrations.length === 0) return;
      const now = performance.now();
      ctx.save();
      for (let i = celebrations.length - 1; i >= 0; i--) {
        const c = celebrations[i];
        const t = (now - c.startedAt) / c.duration;
        if (t >= 1) { celebrations.splice(i, 1); continue; }
        const node = state.find(n => n.id === c.nodeId);
        if (!node) continue;
        const p = worldToScreen(node.x, node.y);
        const r = (nodeRadius(node) * Math.max(scale, 0.6)) + 60 * t;
        const col = nodeColor(node);
        ctx.strokeStyle = `rgba(${col.glow}, ${1 - t})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      requestDraw();
    }

    function draw() {
      rafId = null;
      if (!mounted) return;
      clear();
      drawBgStars();
      drawStageRings();
      drawLaneLabels();
      drawEdges();
      // core → skill/cert → role の順
      state.filter(n => n.kind === 'core').forEach(drawNode);
      state.filter(n => n.kind === 'skill' || n.kind === 'certification').forEach(drawNode);
      state.filter(n => n.kind === 'role').forEach(drawNode);

      if (hoveredId && hoveredId !== selectedId) {
        drawSelectionRing(hoveredId, 'rgba(248, 250, 252, 0.4)', 1.5);
      }
      if (selectedId) {
        drawSelectionRing(selectedId, '#FBBF24', 2);
      }
      drawLabels();
      drawCelebrations();
    }

    function requestDraw() {
      if (rafId != null) return;
      rafId = requestAnimationFrame(draw);
    }

    function findNodeAt(sx, sy) {
      for (let i = state.length - 1; i >= 0; i--) {
        const node = state[i];
        const p = worldToScreen(node.x, node.y);
        const r = nodeRadius(node) * Math.max(scale, 0.6) + 4;
        const dx = sx - p.x;
        const dy = sy - p.y;
        if (dx * dx + dy * dy <= r * r) return node;
      }
      return null;
    }

    function onPointerDown(e) {
      canvas.setPointerCapture?.(e.pointerId);
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      pointerDownAt = { x: sx, y: sy };
      const node = findNodeAt(sx, sy);
      if (node) {
        isPanning = false;
      } else {
        isPanning = true;
        panStart = { x: sx, y: sy, ox: offsetX, oy: offsetY };
      }
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      if (isPanning && panStart) {
        offsetX = panStart.ox + (sx - panStart.x);
        offsetY = panStart.oy + (sy - panStart.y);
        requestDraw();
        return;
      }
      const node = findNodeAt(sx, sy);
      const newId = node ? node.id : null;
      if (newId !== hoveredId) {
        hoveredId = newId;
        canvas.style.cursor = hoveredId ? 'pointer' : (isPanning ? 'grabbing' : 'grab');
        requestDraw();
      }
    }

    function onPointerUp(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      if (isPanning) {
        isPanning = false;
        panStart = null;
        canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
        pointerDownAt = null;
        return;
      }
      const moved = pointerDownAt
        ? Math.hypot(sx - pointerDownAt.x, sy - pointerDownAt.y)
        : 0;
      pointerDownAt = null;
      if (moved > 6) return;
      const node = findNodeAt(sx, sy);
      selectedId = node ? node.id : null;
      opts.onSelect(node);
      requestDraw();
    }

    function onPointerLeave() {
      if (hoveredId) { hoveredId = null; requestDraw(); }
    }

    function onWheel(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const before = screenToWorld(sx, sy);
      const factor = Math.exp(-e.deltaY * 0.0015);
      scale = Math.max(0.45, Math.min(2.4, scale * factor));
      const after = screenToWorld(sx, sy);
      offsetX += (after.x - before.x) * scale;
      offsetY += (after.y - before.y) * scale;
      requestDraw();
    }

    function onDoubleClick(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const before = screenToWorld(sx, sy);
      scale = Math.min(2.4, scale * 1.3);
      const after = screenToWorld(sx, sy);
      offsetX += (after.x - before.x) * scale;
      offsetY += (after.y - before.y) * scale;
      requestDraw();
    }

    function mount() {
      if (mounted) return;
      mounted = true;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);
      }
      resize();
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);
      canvas.addEventListener('pointerleave', onPointerLeave);
      canvas.addEventListener('wheel', onWheel, { passive: false });
      canvas.addEventListener('dblclick', onDoubleClick);
      state.forEach(n => {
        if (n.kind === 'role') lastRoleProgress.set(n.id, n.progress || 0);
      });
      firstDrawDone = true;
      requestDraw();
    }

    function destroy() {
      mounted = false;
      if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDoubleClick);
      if (rafId) cancelAnimationFrame(rafId);
    }

    function setUser(user) {
      opts.user = user;
      const prev = new Map(lastRoleProgress);
      state = buildUserGalaxyState(user);
      state.forEach(n => {
        if (n.kind !== 'role') return;
        const before = prev.get(n.id) || 0;
        const after = n.progress || 0;
        lastRoleProgress.set(n.id, after);
        if (firstDrawDone && before < 80 && after >= 80) {
          celebrations.push({ nodeId: n.id, startedAt: performance.now(), duration: 1200 });
          opts.onCelebrate({ type: 'role-near', nodeId: n.id });
        }
        if (firstDrawDone && before < 100 && after >= 100) {
          celebrations.push({ nodeId: n.id, startedAt: performance.now(), duration: 1500 });
          opts.onCelebrate({ type: 'role-reached', nodeId: n.id });
        }
      });
      if (selectedId) opts.onSelect(state.find(n => n.id === selectedId) || null);
      requestDraw();
    }

    function setMode(m) { opts.mode = m; requestDraw(); }
    function getMode() { return opts.mode; }

    function setDisplayMode(m) {
      displayMode = m || 'all';
      requestDraw();
    }
    function getDisplayMode() { return displayMode; }

    function setPath(pathId) {
      selectedPathId = pathId || null;
      displayMode = pathId ? 'path' : 'all';
      // 選択したルートが見やすくなるよう、対象ロールへ寄せる
      if (pathId) {
        const path = SPECIALIST_PATHS.find(p => p.id === pathId);
        const target = path && state.find(n => n.id === path.targetNodeId);
        if (target) {
          offsetX = -target.x * scale / 2;
          offsetY = -target.y * scale / 2;
        }
      } else {
        offsetX = 0;
        offsetY = 0;
      }
      requestDraw();
    }
    function getSelectedPathId() { return selectedPathId; }

    function focusNode(nodeId) {
      const node = state.find(n => n.id === nodeId);
      if (!node) return;
      offsetX = -node.x * scale;
      offsetY = -node.y * scale;
      selectedId = node.id;
      opts.onSelect(node);
      requestDraw();
    }

    function resetView() {
      scale = 0.85;
      offsetX = 0;
      offsetY = 0;
      requestDraw();
    }

    function getState() { return state; }

    return {
      mount, destroy,
      setUser, setMode, getMode,
      setDisplayMode, getDisplayMode,
      setPath, getSelectedPathId,
      focusNode, resetView,
      getState,
      onSelect(cb) { opts.onSelect = cb || (() => {}); },
      onChange(cb) { opts.onChange = cb || (() => {}); },
      onCelebrate(cb) { opts.onCelebrate = cb || (() => {}); },
    };
  }

  // ----------------------------------------------------------
  // 9. 公開
  // ----------------------------------------------------------

  TH.skillGalaxy = {
    master: SKILL_GALAXY_MASTER,
    paths: SPECIALIST_PATHS,
    laneLabels: LANE_LABELS,
    laneAngles: LANE_ANGLES,
    laneColors: LANE_COLORS,
    levelLabels: LEVEL_LABELS,
    stageRadius: STAGE_RADIUS,
    subcategoryLabels: SUBCATEGORY_LABELS,
    createRenderer,
    buildUserGalaxyState,
    updateSkillLevel,
    calcRoleProgress,
    calcPathProgress,
    getPathPassedNodes,
    getPathPendingNodes,
    getSuggestedNextNodes,
    getPrerequisiteNodes,
    getRelatedRoles,
    getNodePathIds,
    nodeMatchesName,
    // List view helpers
    getCatalogState,
    filterCatalog,
    sortCatalog,
    groupBySubcategory,
  };
})();
