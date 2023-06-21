import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import DelegateRegistryABI from './src/wagmi/DelegateRegistryABI.json'

export default defineConfig({
  out: 'src/wagmi/DelegateRegistry.ts',
  plugins: [react()],
  contracts: [
    {
      name: 'DelegateRegistry',
      abi: DelegateRegistryABI as any,
    },
  ],
})
