<script>
  import { push, router } from 'svelte-spa-router';
  import { authStore } from '../stores/authStore.js';

  const menuItems = [
    { label: 'Profilim' , path: '/profilim'},
    { label: 'Ziyaretçiler', path: '/dashboard' },
    { label: 'Personel', path: '/personal' },
    { label: 'Rapor', path: '/reports' },
    { label: 'Kullanıcılar', path: '/users', adminOnly: true }
  ];
</script>

<aside class="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
  <div class="px-6 py-5 text-lg font-bold border-b border-slate-700">
    VMS
  </div>
  <nav class="flex-1 py-4">
    {#each menuItems as item}
      {#if !item.adminOnly || $authStore.role === 'ADMIN' || $authStore.role === 'SUPER_ADMIN'}
        <button
          on:click={() => push(item.path)}
          class="w-full text-left px-6 py-3 hover:bg-slate-700 {router.location === item.path ? 'bg-slate-700 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}">
          {item.label}
        </button>
      {/if}
    {/each}
  </nav>
</aside>