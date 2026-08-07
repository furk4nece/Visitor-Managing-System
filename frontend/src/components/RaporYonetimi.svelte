<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fetchMostVisitedReport, fetchWeeklyTrafficReport, fetchAllVisitors, fetchActiveVisitors } from '../lib/api.js';

  let toplam = 0;
  let icerideSayisi = 0;
  let ortalamaSure = '-';
  let hata = '';

  let barCanvas;
  let lineCanvas;
  let barChart;
  let lineChart;

  onMount(async () => {
    try {
      const [tumZiyaretciler, aktifZiyaretciler, enCokZiyaret, haftalikTrafik] = await Promise.all([
        fetchAllVisitors(),
        fetchActiveVisitors(),
        fetchMostVisitedReport(),
        fetchWeeklyTrafficReport()
      ]);

      toplam = tumZiyaretciler.length;
      icerideSayisi = aktifZiyaretciler.length;
      ortalamaSure = ortalamaSureHesapla(tumZiyaretciler);

      barChart = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: enCokZiyaret.map(h => h.fullName),
          datasets: [{
            label: 'Ziyaret Sayısı',
            data: enCokZiyaret.map(h => h.visitCount),
            backgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });

      lineChart = new Chart(lineCanvas, {
        type: 'line',
        data: {
          labels: haftalikTrafik.map(d => d.day),
          datasets: [{
            label: 'Ziyaret Sayısı',
            data: haftalikTrafik.map(d => d.visitCount),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    } catch (e) {
      hata = 'Rapor verileri yüklenemedi.';
    }
  });

  onDestroy(() => {
    barChart?.destroy();
    lineChart?.destroy();
  });

  function ortalamaSureHesapla(ziyaretciler) {
    const tamamlananlar = ziyaretciler.filter(z => z.entryTime && z.exitTime);
    if (tamamlananlar.length === 0) return '-';
    const toplamDakika = tamamlananlar.reduce((toplam, z) => {
      const fark = (new Date(z.exitTime) - new Date(z.entryTime)) / 60000;
      return toplam + fark;
    }, 0);
    return `${Math.round(toplamDakika / tamamlananlar.length)} dk`;
  }
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold text-gray-800 mb-6">Sistem Raporları</h1>

  {#if hata}
    <div class="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
      {hata}
    </div>
  {/if}

  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-sm text-gray-500 mb-1">Toplam Ziyaretçi</div>
      <div class="text-2xl font-bold text-gray-800">{toplam}</div>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-sm text-gray-500 mb-1">İçeride</div>
      <div class="text-2xl font-bold text-gray-800">{icerideSayisi}</div>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-sm text-gray-500 mb-1">Ortalama Süre</div>
      <div class="text-2xl font-bold text-gray-800">{ortalamaSure}</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">En Çok Ziyaret Edilenler</h2>
      <canvas bind:this={barCanvas}></canvas>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Haftalık Trafik</h2>
      <canvas bind:this={lineCanvas}></canvas>
    </div>
  </div>
</div>