<script>
  import { onMount, onDestroy } from 'svelte';
  import { fetchActiveVisitors, checkInVisitor, checkOutVisitor, fetchPersonals } from '../lib/api.js';

  let ziyaretciler = [];
  let personeller = [];
  let yeniZiyaretci = { fullName: '', host: '' };
  let hata = '';
  let basari = '';
  let simdi = new Date();
  let zamanlayici;

  onMount(async () => {
    await verileriYukle();
    zamanlayici = setInterval(() => simdi = new Date(), 1000);
  });

  onDestroy(() => {
    clearInterval(zamanlayici);
  });

  async function verileriYukle() {
    try {
      ziyaretciler = await fetchActiveVisitors();
      personeller = await fetchPersonals();
    } catch (e) {
      hata = 'Sistemden veriler yüklenirken bir sorun oluştu.';
    }
  }

  function sureHesapla(entryTime) {
    const giris = new Date(entryTime);
    const farkSaniye = Math.max(0, Math.floor((simdi - giris) / 1000));
    const saat = String(Math.floor(farkSaniye / 3600)).padStart(2, '0');
    const dakika = String(Math.floor((farkSaniye % 3600) / 60)).padStart(2, '0');
    const saniye = String(farkSaniye % 60).padStart(2, '0');
    return `${saat}:${dakika}:${saniye}`;
  }

  function girisTarihiFormatla(entryTime) {
    return new Date(entryTime).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function ziyaretciEkle() {
    if (!yeniZiyaretci.fullName || !yeniZiyaretci.host) {
      hata = 'Lütfen zorunlu alanları eksiksiz doldurun.';
      return;
    }
    try {
      const eklenen = await checkInVisitor(yeniZiyaretci.fullName, Number(yeniZiyaretci.host));
      ziyaretciler = [...ziyaretciler, eklenen];
      yeniZiyaretci = { fullName: '', host: '' };
      hata = '';
      basari = 'Ziyaretçi sisteme başarıyla kaydedildi.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Ziyaretçi kayıt işlemi sırasında bir hata meydana geldi.';
    }
  }

  async function visitorCheckOut(id) {
    try {
      await checkOutVisitor(id);
      ziyaretciler = ziyaretciler.filter(z => z.id !== id);
      basari = 'Ziyaretçi sistemden çıkış yaptı.';
      setTimeout(() => basari = '', 3000);
    } catch (e) {
      hata = 'Çıkış işlemi sırasında bir sunucu hatası oluştu.';
    }
  }
</script>

<div class="p-6">
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

  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-lg font-semibold mb-4 text-gray-700">Yeni Ziyaretçi Kaydı</h2>
    <div class="flex gap-4 items-end">
      <div class="flex-1">
        <label class="block text-sm text-gray-600 mb-1">İsim</label>
        <input
          bind:value={yeniZiyaretci.fullName}
          type="text"
          placeholder="Ali Yılmaz"
          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" />
      </div>
      <div class="flex-1">
        <label class="block text-sm text-gray-600 mb-1">Kimi Görecek</label>
        <select
          bind:value={yeniZiyaretci.host}
          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500">
          <option value="">Seçiniz</option>
          {#each personeller as personel}
            <option value={personel.id}>{personel.fullName} - {personel.department}</option>
          {/each}
        </select>
      </div>
      <button
        on:click={ziyaretciEkle}
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Ekle
      </button>
    </div>
  </div>

  <h2 class="text-lg font-semibold mb-3 text-gray-700">Binadaki Güncel Ziyaretçiler (Canlı)</h2>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-800 text-white">
        <tr>
          <th class="p-4">Ziyaretçi</th>
          <th class="p-4">Kimi Görecek</th>
          <th class="p-4">Giriş Tarihi / Saati</th>
          <th class="p-4">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {#each ziyaretciler as ziyaretci}
          <tr class="border-t border-gray-200 hover:bg-gray-50">
            <td class="p-4">{ziyaretci.fullName}</td>
            <td class="p-4">{ziyaretci.host?.fullName}</td>
            <td class="p-4">{girisTarihiFormatla(ziyaretci.entryTime)}</td>
            <td class="p-4">
              <button
                on:click={() => visitorCheckOut(ziyaretci.id)}
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Çıkış
              </button>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="4" class="p-4 text-center text-gray-500">
              Şu anda binada ziyaretçi yok.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>