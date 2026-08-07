<script>
  import { onMount } from 'svelte';
  import { fetchUsers, createUser, deleteUser } from '../lib/api.js';

  let kullanicilar = [];
  let aramaMetni = '';
  let yeniKullanici = { username: '', password: '', role: 'RECEPTIONIST' };
  let hata = '';
  let basari = '';
  let formAcik = false;

  onMount(async () => {
    await kullanicilariYukle();
  });

  async function kullanicilariYukle() {
    try {
      kullanicilar = await fetchUsers();
    } catch (e) {
      hata = 'Kullanıcı listesi yüklenemedi.';
    }
  }

  $: filtreliKullanicilar = kullanicilar.filter(k =>
    k.fullName.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  async function kullaniciEkle() {
    if (!yeniKullanici.username || !yeniKullanici.password) {
      hata = 'Tüm alanları doldurun.';
      return;
    }
    try {
      const eklenen = await createUser(yeniKullanici);
      kullanicilar = [...kullanicilar, eklenen];
      yeniKullanici = { username: '', password: '', role: 'RECEPTIONIST' };
      formAcik = false;
      hata = '';
      basari = 'Kullanıcı başarıyla eklendi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Kullanıcı eklenemedi.';
    }
  }

  
  async function kullaniciSil(id) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteUser(id);
      kullanicilar = kullanicilar.filter(k => k.id !== id);
      basari = 'Kullanıcı silindi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Silme işlemi gerçekleştirilemedi.';
    }
  }
</script>

<div class="p-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Sistem Kullanıcıları</h1>

    <button
      on:click={() => { formAcik = !formAcik}}
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
      {formAcik ? 'İptal' : '+ Yeni Kullanıcı'}
    </button>
  </div>

  {#if basari}
    <div class="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
      {basari}
    </div>
  {/if}

  {#if hata}
    <div class="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
      {hata}
    </div>
  {/if}

  {#if formAcik}
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Yeni Kullanıcı Ekle</h2>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Kullanıcı Adı</label>
          <input
            bind:value={yeniKullanici.username}
            type="text"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Şifre</label>
          <input
            bind:value={yeniKullanici.password}
            type="password"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Rol</label>
          <select
            bind:value={yeniKullanici.role}
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500">
            <option value="ADMIN">ADMIN</option>
            <option value="RECEPTIONIST">RECEPTIONIST</option>
          </select>
        </div>
      </div>
      <button
        on:click={kullaniciEkle}
        class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Kaydet
      </button>
    </div>
  {/if}

  <div class="mb-4">
    <input
      bind:value={aramaMetni}
      type="text"
      placeholder="Ara..."
      class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
  </div>

  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-800 text-white">
        <tr>
          <th class="p-4">Ad Soyad</th>
          <th class="p-4">Rol</th>
          <th class="p-4">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {#each filtreliKullanicilar as kullanici}
          <tr class="border-t border-gray-200 hover:bg-gray-50">
            <td class="p-4">{kullanici.fullName}</td>
            <td class="p-4">{kullanici.role}</td>
            <td class="p-4 flex gap-2">
              <button
                on:click={() => kullaniciSil(kullanici.id)}
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Sil
              </button>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="p-4 text-center text-gray-500">
              Kullanıcı bulunamadı.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>