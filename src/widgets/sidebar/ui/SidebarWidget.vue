<script setup lang="ts">
const menuItems = ['Dashboard', 'Statistics', 'Customize', 'Leaderboard', 'Tricks', 'Blog', 'Settings', 'Info']
const sessions = ['Maggot', 'School', 'Student', 'Master', 'PhD', 'Engineer', 'Mathematician', 'Academic', 'Noble', 'GOAT']
</script>

<template>
  <aside
    class="grid h-full min-h-0 grid-rows-[auto_auto_1fr_auto] border-r border-slate-400 bg-slate-200"
  >
    <header class="border-b border-slate-400 p-4">
      <div class="text-4xl font-extrabold text-slate-900">MindForge</div>
    </header>

    <nav class="grid gap-1.5 p-4">
      <a
        v-for="item in menuItems"
        :key="item"
        href="#"
        class="rounded-xl px-3 py-1.5 text-xl text-slate-900 transition hover:bg-indigo-100"
        :class="{ 'bg-indigo-200': item === 'Dashboard' }"
      >
        {{ item }}
      </a>
    </nav>

    <section class="border-y border-slate-400 px-4 py-3">
      <p class="mb-2 mt-0 text-xl font-bold text-slate-900">Popular Sessions</p>
      <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-lg text-blue-600">
        <span v-for="item in sessions" :key="item">{{ item }}</span>
      </div>
    </section>

    <footer class="p-4 text-xl font-bold text-slate-900">User</footer>
  </aside>
</template>
