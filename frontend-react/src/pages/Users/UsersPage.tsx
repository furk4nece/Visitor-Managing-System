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
import { useAuth } from '../../context/AuthContext'

interface User {
  id: number
  fullName: string
  username?: string
  role: string
}

const PAGE_SIZE = 10

export function UsersPage() {
  const { user: currentUser, hasRole } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('RECEPTIONIST')

  const isSuperAdmin = hasRole('SUPER_ADMIN')
  const isAdmin = hasRole('ADMIN')

  async function loadUsers() {
    setLoading(true)

    try {
      const res = await api.get<User[]>('/users')
      setUsers(res.data)
    } catch (err) {
      setError('Kullanıcı listesi yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = users.filter((u) =>
    `${u.fullName || ''} ${u.username || ''}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  )

  const pageRows = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  function canManageUser(user: User) {
    const targetRole = user.role?.toUpperCase() || ''

    if (currentUser?.id === user.id) {
      return false
    }

    if (isSuperAdmin) {
      return true
    }

    if (isAdmin && targetRole === 'RECEPTIONIST') {
      return true
    }

    return false
  }

  function getAvailableRoles(targetUser?: User | null) {
    if (isSuperAdmin) {
      return ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST']
    }

    if (isAdmin) {
      if (targetUser?.role?.toUpperCase() === 'RECEPTIONIST') {
        return ['ADMIN', 'RECEPTIONIST']
      }

      return ['ADMIN', 'RECEPTIONIST']
    }

    return []
  }

  function openCreateModal() {
    if (!isSuperAdmin && !isAdmin) {
      return
    }

    setEditTarget(null)
    setFullName('')
    setUsername('')
    setPassword('')
    setRole('RECEPTIONIST')
    setError(null)
    setSuccess(null)
    setIsModalOpen(true)
  }

  function openEditModal(user: User) {
    if (!canManageUser(user)) {
      return
    }

    setEditTarget(user)
    setFullName(user.fullName || '')
    setUsername(user.username || '')
    setPassword('')

    const availableRoles = getAvailableRoles(user)
    const targetRole = user.role?.toUpperCase() || ''

    if (availableRoles.includes(targetRole)) {
      setRole(targetRole)
    } else {
      setRole(availableRoles[0] || '')
    }

    setError(null)
    setSuccess(null)
    setIsModalOpen(true)
  }

  async function handleSaveUser() {
    if (!username || (!editTarget && !password)) {
      setError('Tüm zorunlu alanları doldurun.')
      return
    }

    const availableRoles = getAvailableRoles(editTarget)

    if (!availableRoles.includes(role)) {
      setError('Bu rolü verme yetkiniz yok.')
      return
    }

    if (editTarget && !canManageUser(editTarget)) {
      setError('Bu kullanıcıyı düzenleme yetkiniz yok.')
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      if (editTarget) {
        await api.put(`/users/${editTarget.id}`, {
          fullName,
          username,
          role,
        })

        setSuccess('Kullanıcı güncellendi.')
      } else {
        await api.post('/users', {
          fullName,
          username,
          password,
          role,
        })

        setSuccess('Kullanıcı başarıyla eklendi.')
      }

      setIsModalOpen(false)
      await loadUsers()

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError('İşlem gerçekleştirilemedi.')
    } finally {
      setActionLoading(false)
    }
  }

  function openDeleteModal(user: User) {
    if (!canManageUser(user)) {
      return
    }

    setError(null)
    setDeleteTarget(user)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    if (!canManageUser(deleteTarget)) {
      setError('Bu kullanıcıyı silme yetkiniz yok.')
      setDeleteTarget(null)
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      await api.delete(`/users/${deleteTarget.id}`)

      setDeleteTarget(null)
      setSuccess('Kullanıcı silindi.')

      await loadUsers()

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError('Silme işlemi gerçekleştirilemedi.')
    } finally {
      setActionLoading(false)
    }
  }

  const columns: DataGridColumn<User>[] = [
    {
      key: 'fullName',
      header: 'Ad Soyad',
      render: (row) => row.fullName || row.username,
    },
    {
      key: 'role',
      header: 'Rol',
      render: (row) => (
        <Badge tone="info">
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'İşlem',
      align: 'right',
      render: (row) => {
        if (!canManageUser(row)) {
          return null
        }

        return (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditModal(row)}
            >
              Düzenle
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => openDeleteModal(row)}
            >
              Sil
            </Button>
          </div>
        )
      },
    },
  ]

  const availableRoles = getAvailableRoles(editTarget)

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">
          Sistem Kullanıcıları
        </h1>

        {(isSuperAdmin || isAdmin) && (
          <Button onClick={openCreateModal}>
            + Yeni Kullanıcı
          </Button>
        )}
      </div>

      <Card>
        <div className="mb-4 max-w-xs">
          <TextInput
            placeholder="Ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <DataGrid
          columns={columns}
          rows={pageRows}
          rowKey={(r) => r.id}
          loading={loading}
        />

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editTarget
            ? 'Kullanıcı Düzenle'
            : 'Yeni Kullanıcı Ekle'
        }
        footer={
          <ModalConfirmFooter
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleSaveUser}
            confirmText="Kaydet"
            loading={actionLoading}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextInput
            label="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!editTarget && (
            <TextInput
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Select
            label="Rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={availableRoles.map((availableRole) => ({
              value: availableRole,
              label: availableRole,
            }))}
          />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Kullanıcı Sil"
        footer={
          <ModalConfirmFooter
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
            confirmText="Sil"
            loading={actionLoading}
          />
        }
      >
        <p className="text-sm text-slate-600">
          <strong>
            {deleteTarget?.fullName || deleteTarget?.username}
          </strong>{' '}
          adlı kullanıcıyı silmek istediğinize emin misiniz?
        </p>
      </Modal>
    </div>
  )
}