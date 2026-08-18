import React, { useEffect, useState } from 'react'
import { Button, TextInput, Card, Alert } from '@ui'
import { api } from '../../lib/apiClient'

interface Profile {
  id: number
  fullName: string
  username: string
  role: string
}

interface ProfileForm {
  fullName: string
  username: string
  role: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfilePage() {
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    username: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  async function loadProfile() {
    setLoading(true)
    setError(null)

    try {
      const res = await api.get<Profile>('/users/me')

      setForm((prev) => ({
        ...prev,
        fullName: res.data.fullName || '',
        username: res.data.username || '',
        role: res.data.role || '',
      }))
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'Profil bilgileri yüklenemedi.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSave() {
    setError(null)
    setSuccess(null)

    if (
      form.newPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      setError('Yeni şifreler uyuşmuyor.')
      return
    }

    if (
      form.newPassword &&
      !form.currentPassword
    ) {
      setError('Yeni şifre belirlemek için mevcut şifrenizi girin.')
      return
    }

    setSaving(true)

    try {
      await api.put('/users/me', {
        fullName: form.fullName,
        username: form.username,
        currentPassword:
          form.currentPassword.trim() === ''
            ? null
            : form.currentPassword,
        newPassword:
          form.newPassword.trim() === ''
            ? null
            : form.newPassword,
        confirmPassword:
          form.confirmPassword.trim() === ''
            ? null
            : form.confirmPassword,
      })

      setSuccess(
        'Bilgileriniz başarıyla güncellendi.',
      )

      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))

      setEditMode(false)

      await loadProfile()

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'Bilgileriniz güncellenirken bir hata oluştu.',
      )
    } finally {
      setSaving(false)
    }
  }

  function cancelEdit() {
    setEditMode(false)

    setForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))

    setError(null)
  }

  if (loading) {
    return (
      <Card title="Profilim">
        <p className="text-sm text-slate-500">
          Profil bilgileri yükleniyor...
        </p>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Profilim">
        <div className="flex flex-col gap-5">
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

          {!editMode ? (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-slate-500">
                  Ad Soyad
                </p>

                <p className="text-xl font-semibold text-slate-800">
                  {form.fullName || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Kullanıcı Adı
                </p>

                <p className="text-xl font-semibold text-slate-800">
                  {form.username || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Rol
                </p>

                <p className="text-xl font-semibold text-slate-800">
                  {form.role || '-'}
                </p>
              </div>

              <div>
                <Button
                  onClick={() => {
                    setError(null)
                    setSuccess(null)
                    setEditMode(true)
                  }}
                >
                  Bilgilerimi Güncelle
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <TextInput
                label="Ad Soyad"
                value={form.fullName}
                onChange={(e) =>
                  updateField(
                    'fullName',
                    e.target.value,
                  )
                }
              />

              <TextInput
                label="Kullanıcı Adı"
                value={form.username}
                onChange={(e) =>
                  updateField(
                    'username',
                    e.target.value,
                  )
                }
              />

              <TextInput
                label="Rol"
                value={form.role}
                disabled
              />

              <div className="border-t border-slate-200 pt-5">
                <h2 className="text-base font-semibold text-slate-700 mb-4">
                  Şifre Değiştir
                </h2>

                <div className="flex flex-col gap-4">
                  <TextInput
                    label="Mevcut Şifre"
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) =>
                      updateField(
                        'currentPassword',
                        e.target.value,
                      )
                    }
                  />

                  <TextInput
                    label="Yeni Şifre"
                    type="password"
                    value={form.newPassword}
                    onChange={(e) =>
                      updateField(
                        'newPassword',
                        e.target.value,
                      )
                    }
                  />

                  <TextInput
                    label="Yeni Şifre Tekrar"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField(
                        'confirmPassword',
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  loading={saving}
                >
                  Kaydet
                </Button>

                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Vazgeç
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}