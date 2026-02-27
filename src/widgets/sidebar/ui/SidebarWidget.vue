<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '~shared/config/routes'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
  }>(),
  {
    collapsed: false,
  },
)

const emit = defineEmits<{
  toggleCollapsed: []
}>()

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
  { key: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard.svg', to: routes.leaderboard },
  { key: 'tricks', label: 'Tricks', icon: 'trick.svg', to: routes.tricks },
  { key: 'blog', label: 'Blog', icon: 'blog.svg', to: routes.blog },
  { key: 'settings', label: 'Settings', icon: 'settings.svg', to: routes.settings },
  { key: 'info', label: 'Info', icon: 'info.svg', to: routes.info },
]

const route = useRoute()
const router = useRouter()
const activeItemKey = ref('dashboard')

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
  if (!item.to || item.to === route.path) return
  await router.push(item.to)
}

const onBrandClick = async () => {
  activeItemKey.value = 'dashboard'
  if (route.path === routes.dashboard) return
  await router.push(routes.dashboard)
}

const onProfileClick = async () => {
  if (route.path === routes.profile) return
  await router.push(routes.profile)
}

const itemClasses = (item: SidebarItem) =>
  [
    props.collapsed ? 'justify-center px-2' : 'gap-3 px-3',
    item.key === activeItemKey.value
      ? 'bg-blue-100 text-blue-700'
      : 'text-slate-900 hover:bg-slate-300/70',
  ]

const iconClasses = 'text-slate-900 group-hover:text-slate-900'

const iconMaskStyle = (icon: string) => ({
  '--sidebar-icon': `url("/${icon}")`,
})

const toggleGlyph = computed(() => (props.collapsed ? '>' : '<'))
const isProfileActive = computed(() => route.path === routes.profile)
</script>

<template>
  <aside
    class="flex h-full min-h-0 flex-col border-r border-slate-300 bg-slate-200 py-4 transition-all duration-200"
    :class="props.collapsed ? 'px-2' : 'px-3'"
  >
    <header class="mb-4 border-b border-slate-300 pb-4">
      <div v-if="!props.collapsed" class="flex min-h-12 items-end gap-4">
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-1 text-left transition hover:bg-slate-100/60"
          @click="onBrandClick"
        >
          <img src="/logo.png" alt="MindForge logo" class="h-12 w-12 shrink-0 object-contain" />
          <span class="whitespace-nowrap text-4xl font-extrabold leading-none">
            <span class="text-blue-600">Mind</span><span class="text-slate-900">Forge</span>
          </span>
        </button>

        <button
          type="button"
          class="inline-flex h-9 w-9 shrink-0 -translate-y-1 items-center justify-center rounded-md bg-transparent text-xl font-bold text-slate-700 transition hover:bg-slate-300/50 hover:text-slate-900"
          :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="emit('toggleCollapsed')"
        >
          {{ toggleGlyph }}
        </button>
      </div>

      <div v-else class="flex min-h-12 items-center justify-center">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-xl font-bold text-slate-700 transition hover:bg-slate-300/50 hover:text-slate-900"
          :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="emit('toggleCollapsed')"
        >
          {{ toggleGlyph }}
        </button>
      </div>
    </header>

    <nav class="min-h-0 flex-1" aria-label="Sidebar navigation">
      <ul class="m-0 grid list-none gap-1.5 p-0">
        <li v-for="item in menuItems" :key="item.key">
          <button
            type="button"
            class="group flex w-full items-center rounded-xl py-2.5 text-left text-[1.75rem] font-semibold transition-colors"
            :class="itemClasses(item)"
            @click="onItemClick(item)"
          >
            <span
              class="sidebar-icon h-5 w-5 shrink-0 transition-colors"
              :class="iconClasses"
              :style="iconMaskStyle(item.icon)"
              aria-hidden="true"
            />
            <span v-if="!props.collapsed" class="text-2xl leading-none">{{ item.label }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <footer class="mt-4 border-t border-slate-300 pt-4">
      <button
        type="button"
        class="group flex w-full items-center rounded-xl py-2.5 text-left transition-colors"
        :class="
          [
            props.collapsed ? 'justify-center px-2' : 'gap-3 px-3',
            isProfileActive ? 'bg-blue-100 text-blue-700' : 'text-slate-900 hover:bg-slate-300/70',
          ]
        "
        @click="onProfileClick"
      >
        <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300/80">
          <span class="sidebar-icon h-5 w-5 text-slate-900" :style="iconMaskStyle('profile.svg')" aria-hidden="true" />
        </span>
        <span v-if="!props.collapsed" class="text-2xl font-semibold leading-none">User</span>
      </button>
    </footer>
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
