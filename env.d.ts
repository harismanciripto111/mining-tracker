/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_DEFAULT_LOCALE: string
  readonly VITE_PARTICLES_ENABLED: string
  readonly VITE_PARTICLE_DENSITY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
