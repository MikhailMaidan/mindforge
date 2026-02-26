<script setup lang="ts">
const menuItems = ['Dashboard', 'Statistics', 'Customize', 'Leaderboard', 'Tricks', 'Blog', 'Settings', 'Info']
const sessions = ['Maggot', 'School', 'Student', 'Master', 'PhD', 'Engineer', 'Mathematician', 'Academic', 'Noble', 'GOAT']
</script>

<template>
  <aside
    class="grid min-h-[auto] grid-rows-[auto_auto_1fr_auto] border-r border-slate-400 bg-slate-200 xl:min-h-screen"
  >
    <header class="border-b border-slate-400 p-6">
      <div class="text-5xl font-extrabold text-slate-900">MindForge</div>
    </header>

    <nav class="grid gap-2 p-5">
      <a
        v-for="item in menuItems"
        :key="item"
        href="#"
        class="rounded-xl px-3 py-2 text-2xl text-slate-900 transition hover:bg-indigo-100"
        :class="{ 'bg-indigo-200': item === 'Dashboard' }"
      >
        {{ item }}
      </a>
    </nav>

    <section class="border-y border-slate-400 px-5 py-4">
      <p class="mb-3 mt-0 text-2xl font-bold text-slate-900">Popular Sessions</p>
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-xl text-blue-600">
        <span v-for="item in sessions" :key="item">{{ item }}</span>
      </div>
    </section>

    <footer class="p-5 text-2xl font-bold text-slate-900">User</footer>
  </aside>
</template>
