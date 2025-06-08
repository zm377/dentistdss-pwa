/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_API_PORT: string
  readonly VITE_API_ROOT_PATH: string
  readonly VITE_API_AUTH_PATH: string
  readonly VITE_API_OAUTH_PATH: string
  readonly VITE_API_GENAI_PATH: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
