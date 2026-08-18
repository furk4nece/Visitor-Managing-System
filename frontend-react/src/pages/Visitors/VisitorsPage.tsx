import React, { useEffect, useState } from 'react'
import {
  Button,
  TextInput,
  DataGrid,
  DataGridColumn,
  Badge,
  Modal,
  ModalConfirmFooter,
  Pagination,
  Card,
  Alert,
  Select,
} from '@ui'
import { api } from '../../lib/apiClient'

interface Personal {
  id: number
  fullName: string
  department: string
}

interface Visitor {
  id: number
  fullName: string
  host?: {
    id: number
    fullName: string
  }
  company?: string
  entryTime: string
  exitTime?: string | null
}

const PAGE_SIZE = 10

export function VisitorsPage() {
  const [activeVisitors, setActiveVisitors] = useState<Visitor[]>([])
  const [inactiveVisitors, setInactiveVisitors] = useState<Visitor[]>([])
  const [personals, setPersonals] = useState<Personal[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

  const [search, setSearch] = useState('')

  const [activePage, setActivePage] = useState(1)
  const [inactivePage, setInactivePage] = useState(1)

  const [checkoutTarget, setCheckoutTarget] =
    useState<Visitor | null>(null)

  const [deleteTarget, setDeleteTarget] =
    useState<Visitor | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    host: '',
  })

  async function loadVisitors() {
    setLoading(true)
    setError(null)

    try {
      const [activeRes, allRes, personalsRes] =
        await Promise.all([
          api.get<Visitor[]>('/visitors/active'),
          api.get<Visitor[]>('/visitors'),
          api.get<Personal[]>('/personals'),
        ])

      const active = activeRes.data
      const all = allRes.data

      const activeIds = new Set(
        active.map((visitor) => visitor.id),
      )

      const inactive = all.filter(
        (visitor) => !activeIds.has(visitor.id),
      )

      setActiveVisitors(active)
      setInactiveVisitors(inactive)
      setPersonals(personalsRes.data)
    } catch (e) {
      setError(
        'Sistemden veriler yüklenirken bir sorun oluştu.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisitors()
  }, [])

  function formatDate(date: string) {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  async function addVisitor() {
    if (!form.fullName.trim() || !form.host) {
      setError(
        'Lütfen zorunlu alanları eksiksiz doldurun.',
      )
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await api.post<Visitor>(
        '/visitors/checkin',
        {
          fullName: form.fullName,
          hostId: Number(form.host),
        },
      )

      setActiveVisitors((prev) => [
        ...prev,
        res.data,
      ])

      setForm({
        fullName: '',
        host: '',
      })

      setSuccess(
        'Ziyaretçi sisteme başarıyla kaydedildi.',
      )

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (e) {
      setError(
        'Ziyaretçi kayıt işlemi sırasında bir hata meydana geldi.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function confirmCheckout() {
    if (!checkoutTarget) return

    setCheckoutLoading(true)
    setError(null)

    try {
      await api.put(
        `/visitors/${checkoutTarget.id}/checkout`,
      )

      setActiveVisitors((prev) =>
        prev.filter(
          (visitor) =>
            visitor.id !== checkoutTarget.id,
        ),
      )

      setInactiveVisitors((prev) => [
        ...prev,
        {
          ...checkoutTarget,
          exitTime: new Date().toISOString(),
        },
      ])

      setCheckoutTarget(null)

      setSuccess(
        'Ziyaretçi sistemden çıkış yaptı.',
      )

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (e) {
      setError(
        'Çıkış işlemi sırasında bir sunucu hatası oluştu.',
      )
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    setDeleteLoading(true)
    setError(null)

    try {
      await api.delete(
        `/visitors/${deleteTarget.id}`,
      )

      setInactiveVisitors((prev) =>
        prev.filter(
          (visitor) =>
            visitor.id !== deleteTarget.id,
        ),
      )

      setDeleteTarget(null)

      setSuccess(
        'Ziyaretçi kaydı silindi.',
      )

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (e) {
      setError(
        'Ziyaretçi silinirken bir hata oluştu.',
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  function filterVisitors(
    visitors: Visitor[],
  ) {
    return visitors.filter((visitor) =>
      [
        visitor.fullName,
        visitor.company,
        visitor.host?.fullName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  }

  const filteredActive =
    filterVisitors(activeVisitors)

  const filteredInactive =
    filterVisitors(inactiveVisitors)

  const activePageCount = Math.max(
    1,
    Math.ceil(
      filteredActive.length / PAGE_SIZE,
    ),
  )

  const inactivePageCount = Math.max(
    1,
    Math.ceil(
      filteredInactive.length / PAGE_SIZE,
    ),
  )

  const activeRows = filteredActive.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  )

  const inactiveRows = filteredInactive.slice(
    (inactivePage - 1) * PAGE_SIZE,
    inactivePage * PAGE_SIZE,
  )

  const activeColumns: DataGridColumn<Visitor>[] = [
    {
      key: 'fullName',
      header: 'Ziyaretçi',
    },
    {
      key: 'host',
      header: 'Kimi Görecek',
      render: (row) =>
        row.host?.fullName || '-',
    },
    {
      key: 'entryTime',
      header: 'Giriş Tarihi / Saati',
      render: (row) =>
        formatDate(row.entryTime),
    },
    {
      key: 'status',
      header: 'Durum',
      align: 'center',
      render: () => (
        <Badge tone="success">
          İçeride
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlem',
      align: 'right',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setCheckoutTarget(row)
          }
        >
          Çıkış
        </Button>
      ),
    },
  ]

  const inactiveColumns: DataGridColumn<Visitor>[] = [
    {
      key: 'fullName',
      header: 'Ziyaretçi',
    },
    {
      key: 'host',
      header: 'Kimi Gördü',
      render: (row) =>
        row.host?.fullName || '-',
    },
    {
      key: 'entryTime',
      header: 'Giriş Tarihi / Saati',
      render: (row) =>
        formatDate(row.entryTime),
    },
    {
      key: 'exitTime',
      header: 'Çıkış Tarihi / Saati',
      render: (row) =>
        row.exitTime
          ? formatDate(row.exitTime)
          : '-',
    },
    {
      key: 'status',
      header: 'Durum',
      align: 'center',
      render: () => (
        <Badge tone="neutral">
          Çıkış yaptı
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlem',
      align: 'right',
      render: (row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() =>
            setDeleteTarget(row)
          }
        >
          Sil
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {success && (
        <Alert tone="success">
          {success}
        </Alert>
      )}

      {error && (
        <Alert tone="danger">
          {error}
        </Alert>
      )}

      <Card title="Yeni Ziyaretçi Kaydı">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <TextInput
              label="İsim"
              placeholder="Ali Yılmaz"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
            />
          </div>

          <div className="flex-1">
            <Select
              label="Kimi Görecek"
              placeholder="Seçiniz"
              value={form.host}
              onChange={(e) =>
                setForm({
                  ...form,
                  host: e.target.value,
                })
              }
              options={personals.map((personal) => ({
                value: String(personal.id),
                label: `${personal.fullName} - ${personal.department}`,
              }))}
            />
          </div>

          <Button
            onClick={addVisitor}
            loading={saving}
          >
            Ekle
          </Button>
        </div>
      </Card>

      <Card title="Aktif Ziyaretçiler">
        <div className="mb-4 max-w-xs">
          <TextInput
            placeholder="Ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActivePage(1)
              setInactivePage(1)
            }}
          />
        </div>

        <DataGrid
          columns={activeColumns}
          rows={activeRows}
          rowKey={(row) => row.id}
          loading={loading}
        />

        <Pagination
          page={activePage}
          pageCount={activePageCount}
          onPageChange={setActivePage}
        />
      </Card>

      <div>
      <Button
        variant="outline"
        onClick={() => setShowInactive(!showInactive)}
      >
        {showInactive
          ? 'Aktif Olmayanları Gizle'
          : 'Aktif Olmayan Ziyaretçileri Göster'}
      </Button>

      {showInactive && (
        <Card title="Aktif Olmayan Ziyaretçiler">
          <DataGrid
            columns={inactiveColumns}
            rows={inactiveRows}
            rowKey={(row) => row.id}
            loading={loading}
          />

          <Pagination
            page={inactivePage}
            pageCount={inactivePageCount}
            onPageChange={setInactivePage}
          />
        </Card>
      )}
    </div>

      <Modal
        open={!!checkoutTarget}
        onClose={() =>
          setCheckoutTarget(null)
        }
        title="Çıkış Onayı"
        footer={
          <ModalConfirmFooter
            onCancel={() =>
              setCheckoutTarget(null)
            }
            onConfirm={confirmCheckout}
            confirmText="Çıkışı Onayla"
            loading={checkoutLoading}
          />
        }
      >
        <p className="text-sm text-slate-600">
          <strong>
            {checkoutTarget?.fullName}
          </strong>{' '}
          için çıkış işlemini onaylıyor musunuz?
        </p>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() =>
          setDeleteTarget(null)
        }
        title="Ziyaretçi Sil"
        footer={
          <ModalConfirmFooter
            onCancel={() =>
              setDeleteTarget(null)
            }
            onConfirm={confirmDelete}
            confirmText="Sil"
            loading={deleteLoading}
          />
        }
      >
        <p className="text-sm text-slate-600">
          <strong>
            {deleteTarget?.fullName}
          </strong>{' '}
          adlı ziyaretçinin kaydını silmek
          istediğinize emin misiniz?
        </p>
      </Modal>
    </div>
  )
}