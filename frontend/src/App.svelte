<script>
  import Router from 'svelte-spa-router';
  import { authStore } from './stores/authStore.js';
  import Login from './components/Login.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import PersonelYonetimi from './components/PersonelYonetimi.svelte';
  import VisitorYonetimi from './components/VisitorYonetimi.svelte';
  import KullaniciYonetimi from './components/KullaniciYonetimi.svelte';
  import RaporYonetimi from './components/RaporYonetimi.svelte';
  import Profile from './components/Profile.svelte';

  const routes = {
    '/profilim': Profile,
    '/dashboard': VisitorYonetimi,
    '/personal': PersonelYonetimi,
    '/users': KullaniciYonetimi,
    '/reports': RaporYonetimi,
    '*': VisitorYonetimi
  };

  function cikisYap() {
    authStore.logout();
  }
</script>

<main class="min-h-screen bg-gray-100">
  {#if $authStore.token}
    <div class="flex">
      <Sidebar />
      <div class="flex-1">
        <div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-800">Hoşgeldin, {$authStore.username}!</span>
          <button
            on:click={cikisYap}
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Çıkış Yap
          </button>
        </div>
        <Router {routes} />
      </div>
    </div>
  {:else}
    <Login />
  {/if}
</main>