import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import DelegateRegistryABI from './src/wagmi/L1StarknetDelegationABI.json'

export default defineConfig({
  out: 'src/wagmi/L1StarknetDelegation.ts',
  plugins: [react()],
  contracts: [
    {
      name: 'L1StarknetDelegation',
      abi: DelegateRegistryABI as any,
    },
  ],
})
