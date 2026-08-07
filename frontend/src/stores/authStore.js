import { writable } from 'svelte/store';

function createAuthStore() {

  const storedToken = localStorage.getItem('vms_token');
  const storedUsername = localStorage.getItem('vms_username');
  const storedRole = localStorage.getItem('vms_role');


  const { subscribe, set } = writable({
    token: storedToken || null,
    username: storedUsername || null,
    role: storedRole || null
  });


  return {

    subscribe,

    login(token, username, role) {

      localStorage.setItem('vms_token', token);
      localStorage.setItem('vms_username', username);
      localStorage.setItem('vms_role', role);


      set({
        token,
        username,
        role
      });
    },


    logout() {

      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_username');
      localStorage.removeItem('vms_role');


      set({
        token: null,
        username: null,
        role: null
      });
    }
  };
}


export const authStore = createAuthStore();