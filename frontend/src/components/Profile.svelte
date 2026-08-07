<script>
    import { onMount } from "svelte";
    import { getMyProfile, updateMyProfile } from "../lib/api.js";

    let editMode = false;

    let form = {
        fullName: "",
        username: "",
        role: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    };

    let loading = false;
    let success = "";
    let error = "";

    onMount(async () => {
        try {
            const user = await getMyProfile();

            form.fullName = user.fullName;
            form.username = user.username;
            form.role = user.role;

        } catch (e) {
            error = e.message;
        }
    });

    async function kaydet() {

        error = "";
        success = "";

        if (
            form.newPassword &&
            form.newPassword !== form.confirmPassword
        ) {
            error = "Yeni şifreler uyuşmuyor.";
            return;
        }

        loading = true;

        try {

            await updateMyProfile({
                fullName: form.fullName,
                username: form.username,
                currentPassword: form.currentPassword.trim() === "" ? null : form.currentPassword,
                newPassword: form.newPassword.trim() === "" ? null : form.newPassword,
                confirmPassword: form.confirmPassword.trim() === "" ? null : form.confirmPassword
            });

            success = "Bilgileriniz başarıyla güncellendi.";

            form.currentPassword = "";
            form.newPassword = "";
            form.confirmPassword = "";

            editMode = false;

        } catch (e) {

            error = e.message;

        }

        loading = false;
    }
</script>

<div class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

    <h1 class="text-3xl font-bold mb-8">
        Profilim
    </h1>

    {#if success}
        <div class="bg-green-100 text-green-700 rounded p-3 mb-5">
            {success}
        </div>
    {/if}

    {#if error}
        <div class="bg-red-100 text-red-700 rounded p-3 mb-5">
            {error}
        </div>
    {/if}

    {#if !editMode}

        <div class="space-y-6">

            <div>
                <p class="text-gray-500">Ad Soyad</p>
                <p class="text-xl font-semibold">{form.fullName}</p>
            </div>

            <div>
                <p class="text-gray-500">Kullanıcı Adı</p>
                <p class="text-xl font-semibold">{form.username}</p>
            </div>

            <div>
                <p class="text-gray-500">Rol</p>
                <p class="text-xl font-semibold">{form.role}</p>
            </div>

            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                on:click={() => editMode = true}>

                Bilgilerimi Güncelle

            </button>

        </div>

    {:else}

        <div class="space-y-5">

            <div>
                <label>Ad Soyad</label>

                <input
                    bind:value={form.fullName}
                    class="w-full border rounded p-2"/>
            </div>

            <div>
                <label>Kullanıcı Adı</label>

                <input
                    bind:value={form.username}
                    class="w-full border rounded p-2"/>
            </div>

            <div>
                <label>Rol</label>

                <input
                    value={form.role}
                    disabled
                    class="w-full border rounded p-2 bg-gray-100"/>
            </div>

            <hr>

            <div>
                <label>Mevcut Şifre</label>

                <input
                    bind:value={form.currentPassword}
                    type="password"
                    class="w-full border rounded p-2"/>
            </div>

            <div>
                <label>Yeni Şifre</label>

                <input
                    bind:value={form.newPassword}
                    type="password"
                    class="w-full border rounded p-2"/>
            </div>

            <div>
                <label>Yeni Şifre Tekrar</label>

                <input
                    bind:value={form.confirmPassword}
                    type="password"
                    class="w-full border rounded p-2"/>
            </div>

            <div class="flex gap-3">

                <button
                    on:click={kaydet}
                    disabled={loading}
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded">

                    {loading ? "Kaydediliyor..." : "Kaydet"}

                </button>

                <button
                    on:click={() => editMode = false}
                    class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded">

                    Vazgeç

                </button>

            </div>

        </div>

    {/if}

</div>