declare module '#app' {
  interface PageMeta {
    /** Kode hak akses; pengguna lolos bila memiliki salah satunya. */
    permissions?: string[]
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    permissions?: string[]
  }
}

export {}
