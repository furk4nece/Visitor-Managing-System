<script>
  import { onMount } from 'svelte';
  import { fetchPersonals, createPersonal, updatePersonal, deletePersonal } from '../lib/api.js';
  import { authStore } from '../stores/authStore.js';

  let personeller = [];
  let aramaMetni = '';
  let yeniPersonel = { fullName: '', department: '', tittle: '', email: '' };
  let hata = '';
  let basari = '';
  let formAcik = false;

  // Düzenleme (update) için durum
  let duzenlemeModuAcik = false;
  let duzenlenenPersonel = { id: null, fullName: '', department: '', tittle: '', email: '' };

  onMount(async () => {
    await personelleriYukle();
  });

  async function personelleriYukle() {
    try {
      personeller = await fetchPersonals();
    } catch (e) {
      hata = 'Personel listesi yüklenemedi.';
    }
  }

  $: filtreliPersoneller = personeller.filter(p =>
    p.fullName.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  async function personelEkle() {
    if (!yeniPersonel.fullName || !yeniPersonel.department || !yeniPersonel.tittle || !yeniPersonel.email) {
      hata = 'Tüm alanları doldurun.';
      return;
    }
    try {
      const eklenen = await createPersonal(yeniPersonel);
      personeller = [...personeller, eklenen];
      yeniPersonel = { fullName: '', department: '', tittle: '', email: '' };
      formAcik = false;
      hata = '';
      basari = 'Personel başarıyla eklendi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Personel eklenemedi. Email zaten mevcut olabilir.';
    }
  }

  function duzenlemeyiBaslat(personel) {
    duzenlenenPersonel = {
      id: personel.id,
      fullName: personel.fullName,
      department: personel.department,
      tittle: personel.tittle,
      email: personel.email
    };
    duzenlemeModuAcik = true;
    formAcik = false;
    hata = '';
  }

  function duzenlemeyiIptalEt() {
    duzenlemeModuAcik = false;
    duzenlenenPersonel = { id: null, fullName: '', department: '', tittle: '', email: '' };
  }

  async function personelGuncelle() {
    if (!duzenlenenPersonel.fullName || !duzenlenenPersonel.department || !duzenlenenPersonel.tittle || !duzenlenenPersonel.email) {
      hata = 'Tüm alanları doldurun.';
      return;
    }
    try {
      const guncellenen = await updatePersonal(duzenlenenPersonel.id, {
        fullName: duzenlenenPersonel.fullName,
        department: duzenlenenPersonel.department,
        tittle: duzenlenenPersonel.tittle,
        email: duzenlenenPersonel.email
      });
      personeller = personeller.map(p => p.id === guncellenen.id ? guncellenen : p);
      duzenlemeyiIptalEt();
      hata = '';
      basari = 'Personel başarıyla güncellendi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Personel güncellenemedi. Email zaten mevcut olabilir.';
    }
  }

  async function personelSil(id) {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    try {
      await deletePersonal(id);
      personeller = personeller.filter(p => p.id !== id);
      basari = 'Personel silindi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Personel silinemedi.';
    }
  }
</script>

<div class="p-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Personel Yönetimi</h1>

    <div class="flex gap-3">
      {#if $authStore.role === 'ADMIN'}
        <button
          on:click={() => { formAcik = !formAcik; duzenlemeModuAcik = false; }}
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {formAcik ? 'İptal' : '+ Yeni Personel'}
        </button>
      {/if}
    </div>
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
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Yeni Personel Ekle</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">İsim Soyisim</label>
          <input
            bind:value={yeniPersonel.fullName}
            type="text"
            placeholder="Ahmet Demir"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Departman</label>
          <input
            bind:value={yeniPersonel.department}
            type="text"
            placeholder="Yazılım"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ünvan</label>
          <input
            bind:value={yeniPersonel.tittle}
            type="text"
            placeholder="Uzman"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <input
            bind:value={yeniPersonel.email}
            type="email"
            placeholder="ahmet@sirket.com"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <button
        on:click={personelEkle}
        class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Ekle
      </button>
    </div>
  {/if}

  {#if duzenlemeModuAcik}
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-amber-400">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Personeli Düzenle</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">İsim Soyisim</label>
          <input
            bind:value={duzenlenenPersonel.fullName}
            type="text"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Departman</label>
          <input
            bind:value={duzenlenenPersonel.department}
            type="text"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ünvan</label>
          <input
            bind:value={duzenlenenPersonel.tittle}
            type="text"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <input
            bind:value={duzenlenenPersonel.email}
            type="email"
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button
          on:click={personelGuncelle}
          class="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600">
          Güncelle
        </button>
        <button
          on:click={duzenlemeyiIptalEt}
          class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">
          İptal
        </button>
      </div>
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
          <th class="p-4">İsim Soyisim</th>
          <th class="p-4">Departman</th>
          <th class="p-4">Ünvan</th>
          <th class="p-4">Email</th>
          <th class="p-4">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {#each filtreliPersoneller as personel}
          <tr class="border-t border-gray-200 hover:bg-gray-50">
            <td class="p-4">{personel.fullName}</td>
            <td class="p-4">{personel.department}</td>
            <td class="p-4">{personel.tittle}</td>
            <td class="p-4">{personel.email}</td>
            <td class="p-4">
              {#if $authStore.role === 'ADMIN'}
                <div class="flex gap-2">
                  <button
                    on:click={() => duzenlemeyiBaslat(personel)}
                    class="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">
                    Düzenle
                  </button>
                  <button
                    on:click={() => personelSil(personel.id)}
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Sil
                  </button>
                </div>
              {/if}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="p-4 text-center text-gray-500">
              Personel bulunamadı.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>