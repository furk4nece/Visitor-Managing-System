import React, { useEffect, useState } from 'react'
import { Card, Alert } from '@ui'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import { api } from '../../lib/apiClient'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

export function ReportsPage() {
  const [toplam, setToplam] = useState(0)
  const [icerideSayisi, setIcerideSayisi] = useState(0)
  const [ortalamaSure, setOrtalamaSure] = useState('-')
  const [hata, setHata] = useState<string | null>(null)

  const [mostVisitedData, setMostVisitedData] = useState<any>(null)
  const [weeklyTrafficData, setWeeklyTrafficData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReports() {
      try {
        const [tumRes, aktifRes, mostVisitedRes, weeklyRes] = await Promise.all([
          api.get('/visitors').catch(() => ({ data: [] })),
          api.get('/visitors/active').catch(() => ({ data: [] })),
          api.get('/reports/most-visited').catch(() => ({ data: [] })),
          api.get('/reports/weekly-traffic').catch(() => ({ data: [] }))
        ])

        const tumZiyaretciler = tumRes.data || []
        const aktifZiyaretciler = aktifRes.data || []
        const enCokZiyaret = mostVisitedRes.data || []
        const haftalikTrafik = weeklyRes.data || []

        setToplam(tumZiyaretciler.length)
        setIcerideSayisi(aktifZiyaretciler.length)
        setOrtalamaSure(hesaplaOrtalamaSure(tumZiyaretciler))

        setMostVisitedData({
          labels: enCokZiyaret.map((h: any) => h.fullName),
          datasets: [{
            label: 'Ziyaret Sayısı',
            data: enCokZiyaret.map((h: any) => h.visitCount),
            backgroundColor: '#2563eb',
          }],
        })

        setWeeklyTrafficData({
          labels: haftalikTrafik.map((d: any) => d.day),
          datasets: [{
            label: 'Ziyaret Sayısı',
            data: haftalikTrafik.map((d: any) => d.visitCount),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            tension: 0.3,
            fill: true,
          }],
        })
      } catch (err) {
        setHata('Rapor verileri yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  function hesaplaOrtalamaSure(ziyaretciler: any[]) {
    const tamamlananlar = ziyaretciler.filter((z) => z.entryTime && z.exitTime)
    if (tamamlananlar.length === 0) return '-'
    const toplamDakika = tamamlananlar.reduce((acc, z) => {
      const fark = (new Date(z.exitTime).getTime() - new Date(z.entryTime).getTime()) / 60000
      return acc + fark
    }, 0)
    return `${Math.round(toplamDakika / tamamlananlar.length)} dk`
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-slate-800">Sistem Raporları</h1>

      {hata && <Alert tone="danger">{hata}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-slate-500 mb-1">Toplam Ziyaretçi</div>
          <div className="text-2xl font-bold text-slate-800">{toplam}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500 mb-1">İçeride</div>
          <div className="text-2xl font-bold text-slate-800">{icerideSayisi}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500 mb-1">Ortalama Süre</div>
          <div className="text-2xl font-bold text-slate-800">{ortalamaSure}</div>
        </Card>
      </div>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-500">Raporlar yükleniyor...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="En Çok Ziyaret Edilenler">
            {mostVisitedData ? (
              <Bar data={mostVisitedData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <p className="text-sm text-slate-500">Veri yok</p>
            )}
          </Card>

          <Card title="Haftalık Trafik">
            {weeklyTrafficData ? (
              <Line data={weeklyTrafficData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            ) : (
              <p className="text-sm text-slate-500">Veri yok</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}