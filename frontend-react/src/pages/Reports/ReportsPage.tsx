import React, { useEffect, useState } from 'react'
import { Card, Alert } from '@ui'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js/auto'
import { Bar, Line } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import { api } from '../../lib/apiClient'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function ReportsPage() {
  const [toplam, setToplam] = useState(0)
  const [icerideSayisi, setIcerideSayisi] = useState(0)
  const [ortalamaSure, setOrtalamaSure] = useState('-')
  const [hata, setHata] = useState<string | null>(null)

  const [mostVisitedData, setMostVisitedData] = useState<any>(null)
  const [weeklyTrafficData, setWeeklyTrafficData] = useState<any>(null)

  // Excel'e aktarılacak ziyaretçiler
  const [tumZiyaretciler, setTumZiyaretciler] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    async function loadReports() {
      try {
        const [
          tumRes,
          aktifRes,
          mostVisitedRes,
          weeklyRes
        ] = await Promise.all([
          api.get('/visitors').catch(() => ({ data: [] })),
          api.get('/visitors/active').catch(() => ({ data: [] })),
          api.get('/reports/most-visited').catch(() => ({ data: [] })),
          api.get('/reports/weekly-traffic').catch(() => ({ data: [] }))
        ])

        const ziyaretciler = tumRes.data || []
        const aktifZiyaretciler = aktifRes.data || []
        const enCokZiyaret = mostVisitedRes.data || []
        const haftalikTrafik = weeklyRes.data || []

        // Ziyaretçileri state'e kaydet.
        // Excel oluştururken bu liste kullanılacak.
        setTumZiyaretciler(ziyaretciler)

        setToplam(ziyaretciler.length)
        setIcerideSayisi(aktifZiyaretciler.length)
        setOrtalamaSure(hesaplaOrtalamaSure(ziyaretciler))

        setMostVisitedData({
          labels: enCokZiyaret.map((h: any) => h.fullName),
          datasets: [
            {
              label: 'Ziyaret Sayısı',
              data: enCokZiyaret.map((h: any) => h.visitCount),
              backgroundColor: '#2563eb'
            }
          ]
        })

        setWeeklyTrafficData({
          labels: haftalikTrafik.map((d: any) => d.day),
          datasets: [
            {
              label: 'Ziyaret Sayısı',
              data: haftalikTrafik.map((d: any) => d.visitCount),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              tension: 0.3,
              fill: true
            }
          ]
        })
      } catch (err) {
        console.error(err)
        setHata('Rapor verileri yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  /**
   * Ortalama ziyaret süresini hesaplar.
   */
  function hesaplaOrtalamaSure(ziyaretciler: any[]) {
    const tamamlananlar = ziyaretciler.filter(
      (z) => z.entryTime && z.exitTime
    )

    if (tamamlananlar.length === 0) {
      return '-'
    }

    const toplamDakika = tamamlananlar.reduce((acc, z) => {
      const fark =
        (new Date(z.exitTime).getTime() -
          new Date(z.entryTime).getTime()) /
        60000

      return acc + fark
    }, 0)

    return `${Math.round(
      toplamDakika / tamamlananlar.length
    )} dk`
  }

  /**
   * Tarihi Türkçe formatta gösterir.
   *
   * Örnek:
   * 21.08.2026 09:30
   */
  function formatTarih(tarih: any) {
    if (!tarih) {
      return '-'
    }

    const date = new Date(tarih)

    if (isNaN(date.getTime())) {
      return '-'
    }

    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * İki tarih arasındaki ziyaret süresini hesaplar.
   */
  function hesaplaSure(entryTime: any, exitTime: any) {
    if (!entryTime || !exitTime) {
      return '-'
    }

    const giris = new Date(entryTime).getTime()
    const cikis = new Date(exitTime).getTime()

    if (isNaN(giris) || isNaN(cikis)) {
      return '-'
    }

    const dakika = Math.round((cikis - giris) / 60000)

    if (dakika < 60) {
      return `${dakika} dk`
    }

    const saat = Math.floor(dakika / 60)
    const kalanDakika = dakika % 60

    if (kalanDakika === 0) {
      return `${saat} saat`
    }

    return `${saat} saat ${kalanDakika} dk`
  }

  /**
   * Ziyaretçinin durumunu Türkçe olarak döndürür.
   */
  function getDurum(ziyaretci: any) {
    if (ziyaretci.isInside) {
      return 'İçeride'
    }

    return 'Çıkış yaptı'
  }

  function exportToExcel() {
    try {
      setExporting(true)
      setHata(null)

      if (!tumZiyaretciler || tumZiyaretciler.length === 0) {
        setHata('Excel oluşturmak için ziyaretçi verisi bulunamadı.')
        return
      }

      const ziyaretciExcelData = tumZiyaretciler.map((ziyaretci: any) => ({
        'Ziyaretçi': ziyaretci.fullName || '-',

        'Ziyaret Edilen Personel':
          ziyaretci.host?.fullName || '-',

        'Giriş Tarihi':
          formatTarih(ziyaretci.entryTime),

        'Çıkış Tarihi':
          formatTarih(ziyaretci.exitTime),

        'Ziyaret Süresi':
          hesaplaSure(
            ziyaretci.entryTime,
            ziyaretci.exitTime
          ),

        'Durum':
          getDurum(ziyaretci)
      }))

      const ziyaretcilerSheet =
        XLSX.utils.json_to_sheet(ziyaretciExcelData)

      ziyaretcilerSheet['!cols'] = [
        { wch: 25 },
        { wch: 30 },
        { wch: 22 },
        { wch: 22 },
        { wch: 18 },
        { wch: 18 }
      ]

      const raporOzeti = [
        {
          'Rapor': 'Toplam Ziyaretçi',
          'Değer': toplam
        },
        {
          'Rapor': 'Şu An İçeride',
          'Değer': icerideSayisi
        },
        {
          'Rapor': 'Çıkış Yapmış Ziyaretçi',
          'Değer': toplam - icerideSayisi
        },
        {
          'Rapor': 'Ortalama Ziyaret Süresi',
          'Değer': ortalamaSure
        },
        {
          'Rapor': 'Rapor Tarihi',
          'Değer': formatTarih(new Date())
        }
      ]

      const raporOzetiSheet =
        XLSX.utils.json_to_sheet(raporOzeti)

      raporOzetiSheet['!cols'] = [
        { wch: 35 },
        { wch: 25 }
      ]

      let haftalikTrafikExcelData: any[] = []

      if (weeklyTrafficData) {
        haftalikTrafikExcelData =
          weeklyTrafficData.labels.map(
            (label: string, index: number) => ({
              'Gün': label,
              'Ziyaret Sayısı':
                weeklyTrafficData.datasets?.[0]?.data?.[index] || 0
            })
          )
      }

      const haftalikTrafikSheet =
        XLSX.utils.json_to_sheet(
          haftalikTrafikExcelData
        )

      haftalikTrafikSheet['!cols'] = [
        { wch: 20 },
        { wch: 20 }
      ]

      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        ziyaretcilerSheet,
        'Ziyaretçiler'
      )

      XLSX.utils.book_append_sheet(
        workbook,
        raporOzetiSheet,
        'Rapor Özeti'
      )

      XLSX.utils.book_append_sheet(
        workbook,
        haftalikTrafikSheet,
        'Haftalık Trafik'
      )

      const bugun = new Date()

      const gun = String(
        bugun.getDate()
      ).padStart(2, '0')

      const ay = String(
        bugun.getMonth() + 1
      ).padStart(2, '0')

      const yil = bugun.getFullYear()

      const dosyaAdi =
        `VMS_Rapor_${gun}-${ay}-${yil}.xlsx`

      XLSX.writeFile(workbook, dosyaAdi)

    } catch (error) {
      console.error(
        'Excel oluşturulurken hata:',
        error
      )

      setHata(
        'Excel dosyası oluşturulurken bir hata oluştu.'
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Sistem Raporları
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Ziyaret ve sistem istatistiklerini görüntüleyin.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToExcel}
          disabled={
            exporting ||
            loading ||
            tumZiyaretciler.length === 0
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-green-600
            text-white
            font-medium
            text-sm
            hover:bg-green-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          {exporting ? (
            <>
              <span>⏳</span>
              Excel hazırlanıyor...
            </>
          ) : (
            <>
              <span>📊</span>
              Excel'e Aktar
            </>
          )}
        </button>

      </div>

      {hata && (
        <Alert tone="danger">
          {hata}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <div className="text-sm text-slate-500 mb-1">
            Toplam Ziyaretçi
          </div>

          <div className="text-2xl font-bold text-slate-800">
            {toplam}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-slate-500 mb-1">
            İçeride
          </div>

          <div className="text-2xl font-bold text-slate-800">
            {icerideSayisi}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-slate-500 mb-1">
            Ortalama Süre
          </div>

          <div className="text-2xl font-bold text-slate-800">
            {ortalamaSure}
          </div>
        </Card>

      </div>

      {loading ? (

        <Card>
          <p className="text-sm text-slate-500">
            Raporlar yükleniyor...
          </p>
        </Card>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card title="En Çok Ziyaret Edilenler">

            {mostVisitedData ? (

              <Bar
                data={mostVisitedData}
                options={{
                  responsive: true,

                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />

            ) : (

              <p className="text-sm text-slate-500">
                Veri yok
              </p>

            )}

          </Card>

          <Card title="Haftalık Trafik">

            {weeklyTrafficData ? (

              <Line
                data={weeklyTrafficData}
                options={{
                  responsive: true,

                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />

            ) : (

              <p className="text-sm text-slate-500">
                Veri yok
              </p>

            )}

          </Card>

        </div>

      )}

    </div>
  )
}
