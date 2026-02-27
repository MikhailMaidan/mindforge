<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '~shared/config/routes'

interface SidebarItem {
  icon: string
  key: string
  label: string
  to?: string
}

const menuItems: readonly SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home.svg', to: routes.dashboard },
  { key: 'statistics', label: 'Statistics', icon: 'statistics.svg', to: routes.statistics },
  { key: 'customize', label: 'Customize', icon: 'settings.svg', to: routes.customize },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard.svg' },
  { key: 'tricks', label: 'Tricks', icon: 'trick.svg' },
  { key: 'blog', label: 'Blog', icon: 'blog.svg' },
  { key: 'settings', label: 'Settings', icon: 'settings.svg', to: routes.settings },
  { key: 'info', label: 'Info', icon: 'info.svg', to: routes.info },
]

const route = useRoute()
const router = useRouter()
const activeItemKey = ref('dashboard')
const navigablePaths = computed(() => new Set(router.getRoutes().map((routeRecord) => routeRecord.path)))

const routeByPath = computed(() =>
  new Map(menuItems.filter((item) => item.to).map((item) => [item.to!, item.key])),
)

watch(
  () => route.path,
  (path) => {
    const routeKey = routeByPath.value.get(path)
    if (routeKey) activeItemKey.value = routeKey
  },
  { immediate: true },
)

const onItemClick = async (item: SidebarItem) => {
  activeItemKey.value = item.key
  if (!item.to || !navigablePaths.value.has(item.to) || item.to === route.path) return
  await router.push(item.to)
}

const onBrandClick = async () => {
  activeItemKey.value = 'dashboard'
  if (route.path === routes.dashboard) return
  await router.push(routes.dashboard)
}

const itemClasses = (item: SidebarItem) =>
  item.key === activeItemKey.value
    ? 'bg-blue-100 text-blue-700'
    : 'text-slate-700 hover:bg-slate-300/70 hover:text-slate-900'

const iconClasses = (item: SidebarItem) =>
  item.key === activeItemKey.value
    ? 'text-blue-600'
    : 'text-slate-400 group-hover:text-slate-500'

const iconMaskStyle = (icon: string) => ({
  '--sidebar-icon': `url("/${icon}")`,
})
</script>

<template>
  <aside class="h-full min-h-0 border-r border-slate-300 bg-slate-200 px-3 py-4">
    <header class="mb-4 border-b border-slate-300 pb-4">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-slate-100/60"
        @click="onBrandClick"
      >
        <img src="/logo.png" alt="MindForge logo" class="h-12 w-12 shrink-0 object-contain" />
        <span class="whitespace-nowrap text-4xl font-extrabold leading-none">
          <span class="text-blue-600">Mind</span><span class="text-slate-900">Forge</span>
        </span>
      </button>
    </header>

    <nav aria-label="Sidebar navigation">
      <ul class="m-0 grid list-none gap-1.5 p-0">
        <li v-for="item in menuItems" :key="item.key">
          <button
            type="button"
            class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[1.75rem] font-semibold transition-colors"
            :class="itemClasses(item)"
            @click="onItemClick(item)"
          >
            <span
              class="sidebar-icon h-5 w-5 shrink-0 transition-colors"
              :class="iconClasses(item)"
              :style="iconMaskStyle(item.icon)"
              aria-hidden="true"
            />
            <span class="text-2xl leading-none">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-icon {
  mask-image: var(--sidebar-icon);
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  -webkit-mask-image: var(--sidebar-icon);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  background-color: currentColor;
}
</style>
