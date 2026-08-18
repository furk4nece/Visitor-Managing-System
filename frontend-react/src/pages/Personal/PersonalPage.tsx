import React, { useEffect, useState } from 'react'
import {
  Button,
  TextInput,
  DataGrid,
  DataGridColumn,
  Modal,
  ModalConfirmFooter,
  Card,
  Alert,
} from '@ui'
import { api } from '../../lib/apiClient'
import { useAuth } from '../../context/AuthContext'

interface Personal {
  id: number
  fullName: string
  department: string
  tittle: string
  email: string
}

const PAGE_SIZE = 10

export function PersonalPage() {
  const { hasRole } = useAuth()

  const [personalList, setPersonalList] = useState<Personal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Personal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Personal | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '',
    department: '',
    tittle: '',
    email: '',
  })

  const canManagePersonal = hasRole('SUPER_ADMIN', 'ADMIN')

  async function loadPersonal() {
    setLoading(true)

    try {
      const res = await api.get<Personal[]>('/personals')
      setPersonalList(res.data)
    } catch (e) {
      setError('Personel listesi yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPersonal()
  }, [])

  function startEdit(p: Personal) {
    if (!canManagePersonal) {
      return
    }

    setEditTarget(p)

    setForm({
      fullName: p.fullName,
      department: p.department,
      tittle: p.tittle,
      email: p.email,
    })

    setIsModalOpen(true)
  }

  async function handleSave() {
    if (!canManagePersonal) {
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      if (editTarget) {
        await api.put(`/personals/${editTarget.id}`, form)
      } else {
        await api.post('/personals', form)
      }

      setIsModalOpen(false)
      setEditTarget(null)

      await loadPersonal()
    } catch (e) {
      setError(
        'İşlem başarısız oldu. Lütfen verileri kontrol edin.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !canManagePersonal) {
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      await api.delete(`/personals/${deleteTarget.id}`)

      setDeleteTarget(null)

      await loadPersonal()
    } catch (e) {
      setError(
        'Bu personel üzerinde kayıtlı ziyaretçi bulunduğu için silinemez.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const columns: DataGridColumn<Personal>[] = [
    {
      key: 'fullName',
      header: 'İsim Soyisim',
    },
    {
      key: 'department',
      header: 'Departman',
    },
    {
      key: 'tittle',
      header: 'Ünvan',
    },
    {
      key: 'email',
      header: 'Email',
    },
    ...(canManagePersonal
      ? [
          {
            key: 'actions',
            header: 'İşlem',
            align: 'right' as const,
            render: (row: Personal) => (
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(row)}
                >
                  Düzenle
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteTarget(row)}
                >
                  Sil
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ]

  const filteredPersonal = personalList.filter((p) =>
    `${p.fullName} ${p.department} ${p.tittle} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert tone="danger">
          {error}
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          Personel Yönetimi
        </h1>

        {canManagePersonal && (
          <Button
            onClick={() => {
              setEditTarget(null)
              setForm({
                fullName: '',
                department: '',
                tittle: '',
                email: '',
              })
              setIsModalOpen(true)
            }}
          >
            Yeni Personel Ekle
          </Button>
        )}
      </div>

      <Card>
        <TextInput
          placeholder="Ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />

        <DataGrid
          columns={columns}
          rows={filteredPersonal.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE,
          )}
          rowKey={(r) => r.id}
          loading={loading}
        />
      </Card>

      {canManagePersonal && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editTarget
              ? 'Personeli Düzenle'
              : 'Yeni Personel Ekle'
          }
        >
          <div className="flex flex-col gap-4">
            <TextInput
              label="İsim Soyisim"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
            />

            <TextInput
              label="Departman"
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                })
              }
            />

            <TextInput
              label="Ünvan"
              value={form.tittle}
              onChange={(e) =>
                setForm({
                  ...form,
                  tittle: e.target.value,
                })
              }
            />

            <TextInput
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <Button
              onClick={handleSave}
              loading={actionLoading}
            >
              {editTarget ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </Modal>
      )}

      {canManagePersonal && (
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Personel Sil"
        >
          <p>
            <strong>{deleteTarget?.fullName}</strong> silinecek,
            emin misiniz?
          </p>

          <ModalConfirmFooter
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
            loading={actionLoading}
          />
        </Modal>
      )}
    </div>
  )
}