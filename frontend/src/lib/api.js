import { authStore } from '../stores/authStore.js';

const BASE_URL = 'http://localhost:8080/api/v1';

let currentToken = null;
authStore.subscribe(value => {
  currentToken = value.token;
});

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${currentToken}`
  };
}

async function handleResponse(res, errorMessage) {
  if (!res.ok) {
    if (res.status === 401) {
      authStore.logout();
    }
    throw new Error(errorMessage);
  }
  return res;
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Kullanıcı adı veya şifre hatalı');
  return res.json();
}

export async function fetchPersonals() {
  const res = await fetch(`${BASE_URL}/personals`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Personel listesi alınamadı');
  return res.json();
}

export async function createPersonal(personal) {
  const res = await fetch(`${BASE_URL}/personals`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(personal)
  });
  await handleResponse(res, 'Personel eklenemedi');
  return res.json();
}

export async function updatePersonal(id, personal) {
  const res = await fetch(`${BASE_URL}/personals/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(personal)
  });
  await handleResponse(res, 'Personel güncellenemedi');
  return res.json();
}

export async function deletePersonal(id) {
  const res = await fetch(`${BASE_URL}/personals/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  await handleResponse(res, 'Personel silinemedi');
}

export async function fetchActiveVisitors() {
  const res = await fetch(`${BASE_URL}/visitors/active`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Aktif ziyaretçiler alınamadı');
  return res.json();
}

export async function fetchAllVisitors() {
  const res = await fetch(`${BASE_URL}/visitors`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Ziyaretçiler alınamadı');
  return res.json();
}

export async function checkInVisitor(fullName, hostId) {
  const res = await fetch(`${BASE_URL}/visitors/checkin`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ fullName, hostId })
  });
  await handleResponse(res, 'Ziyaretçi kaydı oluşturulamadı');
  return res.json();
}

export async function checkOutVisitor(id) {
  const res = await fetch(`${BASE_URL}/visitors/${id}/checkout`, {
    method: 'PUT',
    headers: authHeaders()
  });
  await handleResponse(res, 'Çıkış işlemi başarısız');
  return res.json();
}

export async function deleteVisitor(id) {
  const res = await fetch(`${BASE_URL}/visitors/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  await handleResponse(res, 'Ziyaretçi silinemedi');
}

export async function fetchMostVisitedReport() {
  const res = await fetch(`${BASE_URL}/reports/most-visited`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Rapor alınamadı');
  return res.json();
}

export async function fetchWeeklyTrafficReport() {
  const res = await fetch(`${BASE_URL}/reports/weekly-traffic`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Rapor alınamadı');
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: authHeaders()
  });
  await handleResponse(res, 'Kullanıcılar alınamadı');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(user)
  });
  await handleResponse(res, 'Kullanıcı oluşturulamadı');
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(user)
  });
  await handleResponse(res, 'Kullanıcı güncellenemedi');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  await handleResponse(res, 'Kullanıcı silinemedi');
}

export async function getMyProfile() {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: authHeaders()
  });

  await handleResponse(res, 'Profil bilgileri alınamadı');
  return res.json();
}

export async function updateMyProfile(profile) {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: authHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(profile)
  });

  await handleResponse(res, 'Profil güncellenemedi');
  return res.json();
}