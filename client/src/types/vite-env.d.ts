/// <reference types="vite/client" />
/// <reference types="vitest" />

import { UserConfig as ViteConfig } from 'vite'
import { UserConfig as VitestConfig } from 'vitest/config'

declare module 'vite' {
  export interface UserConfig extends ViteConfig {
    test?: VitestConfig['test']
  }
}
