import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import DelegateRegistryABI from './src/wagmi/TestTokenRegistryABI.json'

export default defineConfig({
  out: 'src/wagmi/TestTokenRegistry.ts',
  plugins: [react()],
  contracts: [
    {
      name: 'TestToken',
      abi: DelegateRegistryABI as any,
    },
  ],
})
