<script>
  import { login } from '../lib/api.js';
  import { authStore } from '../stores/authStore.js';
  import { decodeToken } from '../lib/jwt.js';

  let username = '';
  let password = '';
  let hata = '';
  let yukleniyor = false;

  async function girisYap() {
    if (!username || !password) {
      hata = 'Kullanıcı adı ve şifre gerekli.';
      return;
    }

    yukleniyor = true;
    hata = '';

    try {
      const { token } = await login(username, password);
      const payload = decodeToken(token);
      const role = payload.groups?.[0] ?? '';
      authStore.login(token, payload.upn, role);
    } catch (e) {
      hata = 'Kullanıcı adı veya şifre hatalı.';
    } finally {
      yukleniyor = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">

    <!-- Logo ve Başlık -->
    <div class="flex flex-col items-center mb-6">
      <img
        src="/cybersoft_logo.png"
        alt="VMS Logo"
        class="w-52 h-40 object-contain mb-5"
      />

      <h1 class="text-2xl font-bold text-gray-800 text-center">
        VMS Giriş
      </h1>
    </div>

    {#if hata}
      <div class="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-sm">
        {hata}
      </div>
    {/if}

    <form on:submit|preventDefault={girisYap}>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">
          Kullanıcı Adı
        </label>

        <input
          bind:value={username}
          type="text"
          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm text-gray-600 mb-1">
          Şifre
        </label>

        <input
          bind:value={password}
          type="password"
          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={yukleniyor}
        class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>

  </div>
</div>