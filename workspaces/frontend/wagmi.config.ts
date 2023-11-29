import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import DelegateRegistryABI from './src/wagmi/StarknetDelegationRegistryABI.json'

export default defineConfig({
  out: 'src/wagmi/StarknetDelegationRegistry.ts',
  plugins: [react()],
  contracts: [
    {
      name: 'Starknet',
      abi: DelegateRegistryABI as any,
    },
  ],
})
