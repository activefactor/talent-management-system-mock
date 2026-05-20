/* ============================================================
   TalentHub Mock - common.js
   ナビゲーション、共通UIヘルパー、フォーマット関数
   依存: data.js / auth.js が先に読み込まれていること
   ============================================================ */

window.TH = window.TH || {};

// ── ナビゲーション ─────────────────────────────────────────────
TH.nav = {
  /**
   * 指定画面に遷移する
   * @param {string} screen - 画面名
   * @param {string} [userId] - プロフィール表示用ユーザーID（省略可）
   */
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

  /** 自分のプロフィールへ確実に遷移する */
  goMyProfile() {
    const me = TH.auth.getCurrentUser();
    if (!me) return;
    TH.nav.go('profile-view', me.id);
  },

  /** 自分のプロフィール編集画面へ */
  goMyProfileEdit() {
    const me = TH.auth.getCurrentUser();
    if (!me) return;
    localStorage.setItem('th_viewing_user_id', me.id);
    window.location.href = 'profile-edit.html';
  },
};

// ── フォーマット関数 ────────────────────────────────────────────
TH.fmt = {
  /**
   * 分数を「x時間y分」形式に変換
   */
  minutes(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `${m}分`;
    if (m === 0) return `${h}時間`;
    return `${h}時間${m}分`;
  },

  /**
   * 分数を「xxx.x時間」形式に変換
   */
  totalHours(min) {
    return (min / 60).toFixed(1) + '時間';
  },

  /**
   * 'YYYY-MM' を '〇〇〇〇年〇月' に変換
   */
  date(dateStr) {
    if (!dateStr) return 'なし';
    const parts = dateStr.split('-');
    const y = parts[0];
    const m = parseInt(parts[1]);
    return `${y}年${m}月`;
  },

  /**
   * カテゴリ値を日本語ラベルに変換
   */
  categoryLabel(cat) {
    const map = {
      reading:       '読書',
      certification: '資格勉強',
      personal_dev:  '個人開発',
      study_group:   '勉強会',
      ojt:           'OJT',
      other:         'その他',
    };
    return map[cat] || cat;
  },

  /**
   * カテゴリ値に対応したカラーコードを返す
   */
  categoryColor(cat) {
    const map = {
      reading:       '#6366F1',
      certification: '#F59E0B',
      personal_dev:  '#10B981',
      study_group:   '#3B82F6',
      ojt:           '#8B5CF6',
      other:         '#6B7280',
    };
    return map[cat] || '#6B7280';
  },

  /**
   * カテゴリに対応する絵文字アイコンを返す
   */
  categoryIcon(cat) {
    const map = {
      reading:       '📖',
      certification: '📜',
      personal_dev:  '💻',
      study_group:   '🎓',
      ojt:           '👨‍💼',
      other:         '📝',
    };
    return map[cat] || '📝';
  },

  /**
   * ロール値を日本語ラベルに変換
   */
  roleLabel(role) {
    const map = {
      admin:    '管理者',
      senior:   'シニアエンジニア',
      engineer: 'エンジニア',
    };
    return map[role] || role;
  },

  /**
   * ロールに対応した CSS クラス名（badge-chip 用）を返す
   */
  roleBadgeClass(role) {
    const map = {
      admin:    'role-badge-admin',
      senior:   'role-badge-senior',
      engineer: 'role-badge-engineer',
    };
    return map[role] || '';
  },

  /**
   * スキルカテゴリに対応した skill-tag の CSS クラス文字列を返す
   */
  skillTagClass(category) {
    const map = {
      language:  'skill-tag-language',
      framework: 'skill-tag-framework',
      infra:     'skill-tag-infra',
      domain:    'skill-tag-domain',
    };
    return 'skill-tag ' + (map[category] || '');
  },

  /**
   * スキルカテゴリに対応した塗りドットの CSS クラス名を返す
   */
  levelDotFilledClass(category) {
    const map = {
      language:  'skill-dot-filled-language',
      framework: 'skill-dot-filled-framework',
      infra:     'skill-dot-filled-infra',
      domain:    'skill-dot-filled-domain',
    };
    return 'skill-dot ' + (map[category] || 'skill-dot-filled-default');
  },

  /**
   * スキルカテゴリの日本語ラベルを返す
   */
  skillCategoryLabel(cat) {
    const map = {
      language:    '言語',
      framework:   'フレームワーク',
      infra:       'インフラ・クラウド',
      methodology: '開発手法',
      domain:      'ドメイン経験',
    };
    return map[cat] || cat;
  },
};

// ── UI ヘルパー ────────────────────────────────────────────────
TH.ui = {

  /**
   * ヒートマップを指定コンテナに描画する
   * @param {string} containerId - 描画先要素の id
   * @param {string} userId      - 対象ユーザーID
   * @param {number} [weeks=26]  - 表示週数
   */
  renderHeatmap(containerId, userId, weeks) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cells = TH.data.getHeatmapData(userId, weeks || 26);
    container.innerHTML = '';
    container.className = 'heatmap-grid';
    cells.forEach(cell => {
      const div = document.createElement('div');
      div.className = `heatmap-cell hm-${cell.level}`;
      div.title = `${cell.date}${cell.minutes > 0 ? ': ' + cell.minutes + '分' : ''}`;
      container.appendChild(div);
    });
  },

  /**
   * スキルレベルをドット（●×5）で表現した HTML 文字列を返す
   * @param {number} level    - 習熟度 1〜5
   * @param {string} category - スキルカテゴリ
   * @returns {string} HTML 文字列
   */
  skillDotsHtml(level, category) {
    const filledClass = TH.fmt.levelDotFilledClass(category);
    let html = '<span class="skill-dots">';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="skill-dot ${i <= level ? filledClass : 'skill-dot-empty'}"></span>`;
    }
    html += '</span>';
    return html;
  },

  /**
   * トースト通知を表示する（3秒後自動消去）
   * @param {string} message     - 表示メッセージ
   * @param {'success'|'error'|'info'} [type='success'] - 種別
   */
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
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  /**
   * 共通サイドバーを生成してコンテナに挿入する
   * @param {string} containerId    - サイドバーコンテナの id
   * @param {string} activeScreen   - 現在の画面名（ハイライト用）
   */
  renderSidebar(containerId, activeScreen) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const user = TH.auth.getCurrentUser();
    if (!user) return;

    const navItems = [
      { screen: 'dashboard',    label: 'ダッシュボード', icon: _icons.home  },
      { screen: 'profile-view', label: 'マイプロフィール', icon: _icons.user, match: 'profile', action: 'TH.nav.goMyProfile()' },
      { screen: 'members',      label: 'メンバー検索',   icon: _icons.users },
      { screen: 'learning-log', label: '学習ログ',       icon: _icons.book  },
      { screen: 'consultation', label: '相談窓口',       icon: _icons.chat  },
    ];

    const adminItems = [
      { screen: 'admin', label: 'スキルマップ', icon: _icons.chart },
    ];

    const isActive = item => {
      if (!activeScreen) return false;
      if (item.match) return activeScreen.startsWith(item.match);
      return activeScreen === item.screen;
    };

    const makeItem = item => `
      <div class="sidebar-nav-item ${isActive(item) ? 'active' : ''}"
           onclick="${item.action || `TH.nav.go('${item.screen}')`}">
        ${item.icon}
        <span>${item.label}</span>
      </div>`;

    let nav = navItems.map(makeItem).join('');

    if (user.role === 'admin') {
      nav += `<div style="border-top:1px solid #F3F4F6;margin:8px 12px;"></div>`;
      nav += adminItems.map(makeItem).join('');
    }

    const totalMin  = TH.data.getTotalMinutes(user.id);
    const initial   = user.avatarInitial || user.name.charAt(0);
    const roleLabel = TH.fmt.roleLabel(user.role);
    const roleCls   = TH.fmt.roleBadgeClass(user.role);

    container.innerHTML = `
      <!-- ロゴ -->
      <div style="padding:16px;border-bottom:1px solid #F3F4F6;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="avatar" style="width:28px;height:28px;font-size:13px;background:#4F46E5;">T</div>
          <span style="font-weight:700;color:#4F46E5;font-size:15px;">TalentHub</span>
        </div>
      </div>

      <!-- ユーザー情報（クリックで自分のプロフィールへ） -->
      <div class="sidebar-user-card" onclick="TH.nav.goMyProfile()"
           title="マイプロフィールを開く"
           style="padding:16px;border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background-color 0.15s;"
           onmouseover="this.style.backgroundColor='#F9FAFB'"
           onmouseout="this.style.backgroundColor=''">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="avatar" style="width:40px;height:40px;font-size:16px;background:${user.avatarColor};">${initial}</div>
          <div style="min-width:0;flex:1;">
            <div style="font-weight:600;color:#111827;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.name}</div>
            <div style="font-size:11px;color:#6B7280;margin-top:1px;">${user.department} · ${roleLabel}</div>
          </div>
          <svg style="width:14px;height:14px;color:#9CA3AF;flex-shrink:0;" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </div>
        <div style="margin-top:8px;font-size:12px;color:#6B7280;">
          累計 <span style="font-weight:600;color:#374151;">${TH.fmt.totalHours(totalMin)}</span>
        </div>
      </div>

      <!-- ナビゲーション -->
      <nav style="flex:1;padding:12px;display:flex;flex-direction:column;gap:2px;">
        ${nav}
      </nav>

      <!-- ログアウト -->
      <div style="padding:12px;border-top:1px solid #F3F4F6;">
        <div class="sidebar-nav-item" style="color:#EF4444;" onclick="TH.auth.logout()">
          ${_icons.logout}
          <span>ログアウト</span>
        </div>
      </div>
    `;
  },
};

// ── SVG アイコン（Heroicons v2 outline） ────────────────────────
const _icons = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
  </svg>`,

  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
  </svg>`,

  book: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
  </svg>`,

  chat: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
  </svg>`,

  chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
  </svg>`,

  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
  </svg>`,

  pencil: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
  </svg>`,

  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
  </svg>`,

  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
  </svg>`,

  plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
  </svg>`,

  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
  </svg>`,

  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
  </svg>`,

  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>`,
};

// アイコンを外部からも参照できるよう公開
TH.icons = _icons;
