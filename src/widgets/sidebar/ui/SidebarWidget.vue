<script setup lang="ts">
const menuItems = ['Dashboard', 'Statistics', 'Customize', 'Leaderboard', 'Tricks', 'Blog', 'Settings', 'Info']
const sessions = ['Maggot', 'School', 'Student', 'Master', 'PhD', 'Engineer', 'Mathematician', 'Academic', 'Noble', 'GOAT']
</script>

<template>
  <aside class="sidebar">
    <header class="brand">
      <div class="logo">MindForge</div>
    </header>

    <nav class="menu">
      <a
        v-for="item in menuItems"
        :key="item"
        href="#"
        class="menu-link"
        :class="{ active: item === 'Dashboard' }"
      >
        {{ item }}
      </a>
    </nav>

    <section class="popular">
      <p class="popular-title">Popular Sessions</p>
      <div class="popular-grid">
        <span v-for="item in sessions" :key="item">{{ item }}</span>
      </div>
    </section>

    <footer class="user">User</footer>
  </aside>
</template>

<style scoped>
.sidebar {
  border-right: 1px solid #9ca3af;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  background: #e5e7eb;
}

.brand {
  padding: 24px;
  border-bottom: 1px solid #9ca3af;
}

.logo {
  font-size: 3.4rem;
  font-weight: 800;
  color: #111827;
}

.menu {
  padding: 20px;
  display: grid;
  gap: 8px;
}

.menu-link {
  text-decoration: none;
  color: #111827;
  font-size: 2rem;
  border-radius: 14px;
  padding: 12px;
}

.menu-link.active {
  background: #c7d2fe;
}

.popular {
  border-top: 1px solid #9ca3af;
  border-bottom: 1px solid #9ca3af;
  padding: 16px 20px;
}

.popular-title {
  margin: 0 0 12px;
  font-size: 2rem;
  font-weight: 700;
}

.popular-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  color: #2563eb;
  font-size: 1.8rem;
}

.user {
  padding: 16px 20px;
  font-size: 2rem;
  font-weight: 700;
}

@media (max-width: 1200px) {
  .sidebar {
    min-height: auto;
  }
}
</style>
