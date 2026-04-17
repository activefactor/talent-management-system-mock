/* ============================================================
   TalentHub Mock - auth.js
   モック認証ヘルパー
   依存: data.js が先に読み込まれていること
   ============================================================ */

window.TH = window.TH || {};

TH.auth = (function () {

  const KEY_USER_ID = 'th_current_user_id';

  // デモロール → デフォルトユーザーIDのマッピング
  const ROLE_DEFAULT_USER = {
    admin:    'u001',
    senior:   'u002',
    engineer: 'u004',
  };

  /**
   * 指定ロールでログイン（モック：SSO不要）
   * @param {string} role - 'admin' | 'senior' | 'engineer'
   */
  function login(role) {
    const userId = ROLE_DEFAULT_USER[role] || 'u004';
    localStorage.setItem(KEY_USER_ID, userId);
  }

  /**
   * ログアウトしてログイン画面へリダイレクト
   */
  function logout() {
    localStorage.removeItem(KEY_USER_ID);
    localStorage.removeItem('th_viewing_user_id');
    window.location.href = 'index.html';
  }

  /**
   * 現在ログイン中のユーザーIDを返す
   * @returns {string|null}
   */
  function getCurrentUserId() {
    return localStorage.getItem(KEY_USER_ID);
  }

  /**
   * 現在ログイン中のユーザーオブジェクトを返す
   * @returns {object|null}
   */
  function getCurrentUser() {
    const id = getCurrentUserId();
    return id ? TH.data.getUserById(id) : null;
  }

  /**
   * 未ログインなら index.html にリダイレクト
   * @returns {boolean} ログイン済みなら true
   */
  function guard() {
    if (!getCurrentUserId()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  /**
   * admin ロール以外なら dashboard.html にリダイレクト
   * @returns {boolean} admin ロールなら true
   */
  function guardAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  }

  return {
    login,
    logout,
    getCurrentUserId,
    getCurrentUser,
    guard,
    guardAdmin,
  };

})();
