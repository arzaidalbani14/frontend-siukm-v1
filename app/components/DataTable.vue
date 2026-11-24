<template>
  <div class="space-y-3">
    <div v-if="pencarian || $slots.filter" class="flex flex-wrap items-center gap-2">
      <UInput
        v-if="pencarian"
        :model-value="q"
        icon="i-lucide-search"
        :placeholder="placeholderCari"
        class="w-full sm:w-72"
        @update:model-value="emit('update:q', String($event ?? ''))"
      />
      <slot name="filter" />
    </div>

    <UAlert
      v-if="galat"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Data gagal dimuat"
      :description="galat"
      :actions="[{ label: 'Coba lagi', color: 'error', variant: 'outline', onClick: () => emit('ulang') }]"
    />

    <div v-else-if="memuat" class="space-y-2" aria-busy="true">
      <USkeleton v-for="n in 5" :key="n" class="h-10 w-full" />
    </div>

    <div v-else-if="baris.length === 0" class="rounded-md border border-dashed border-default p-8 text-center text-sm text-muted">
      {{ pesanKosong }}
    </div>

    <template v-else>
      <!-- Desktop: tabel -->
      <div class="hidden md:block overflow-x-auto rounded-md border border-default">
        <table class="w-full text-sm">
          <thead class="bg-elevated text-left text-muted">
            <tr>
              <th v-for="k in kolom" :key="k.key" class="px-3 py-2 font-medium" :class="k.class">
                {{ k.label }}
              </th>
              <th v-if="$slots.aksi" class="px-3 py-2 font-medium text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="(b, i) in baris" :key="kunciBaris(b, i)">
              <td v-for="k in kolom" :key="k.key" class="px-3 py-2" :class="k.class">
                <slot :name="`sel-${k.key}`" :baris="b">
                  {{ b[k.key] ?? '-' }}
                </slot>
              </td>
              <td v-if="$slots.aksi" class="px-3 py-2 text-right">
                <slot name="aksi" :baris="b" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- HP: kartu -->
      <ul class="md:hidden space-y-2">
        <li v-for="(b, i) in baris" :key="kunciBaris(b, i)" class="rounded-md border border-default p-3 space-y-1.5">
          <div v-for="k in kolom" :key="k.key" class="flex justify-between gap-3 text-sm">
            <span class="text-muted shrink-0">{{ k.label }}</span>
            <span class="text-right text-default break-words min-w-0">
              <slot :name="`sel-${k.key}`" :baris="b">{{ b[k.key] ?? '-' }}</slot>
            </span>
          </div>
          <div v-if="$slots.aksi" class="pt-2 flex justify-end">
            <slot name="aksi" :baris="b" />
          </div>
        </li>
      </ul>

      <div v-if="meta && totalHalaman > 1" class="flex justify-center">
        <UPagination
          :page="meta.page"
          :items-per-page="meta.limit"
          :total="meta.total"
          @update:page="emit('update:page', $event)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PaginasiMeta } from '~/api/contract'

export interface KolomTabel {
  key: string
  label: string
  class?: string
}

const props = withDefaults(defineProps<{
  kolom: KolomTabel[]
  baris: Record<string, unknown>[]
  memuat?: boolean
  galat?: string | null
  meta?: PaginasiMeta | null
  pencarian?: boolean
  q?: string
  placeholderCari?: string
  pesanKosong?: string
  /** Nama field unik per baris untuk `key` (mis. 'id_anggota'). */
  kunci?: string
}>(), {
  memuat: false,
  galat: null,
  meta: null,
  pencarian: false,
  q: '',
  placeholderCari: 'Cari...',
  pesanKosong: 'Belum ada data.',
  kunci: undefined
})

const emit = defineEmits<{
  'update:q': [string]
  'update:page': [number]
  'ulang': []
}>()

const totalHalaman = computed(() => {
  if (!props.meta) return 1
  return props.meta.total_halaman ?? Math.max(1, Math.ceil(props.meta.total / props.meta.limit))
})

function kunciBaris(b: Record<string, unknown>, i: number): string | number {
  const nilai = props.kunci ? b[props.kunci] : undefined
  return typeof nilai === 'string' || typeof nilai === 'number' ? nilai : i
}
</script>
