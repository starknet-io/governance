import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Starknet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const starknetABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct ERC20Votes.Checkpoint',
        type: 'tuple',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          { name: 'votes', internalType: 'uint224', type: 'uint224' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__.
 */
export function useStarknetRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useStarknetDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useStarknetDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"MINTER_ROLE"`.
 */
export function useStarknetMinterRole<
  TFunctionName extends 'MINTER_ROLE',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'MINTER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"allowance"`.
 */
export function useStarknetAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useStarknetBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"checkpoints"`.
 */
export function useStarknetCheckpoints<
  TFunctionName extends 'checkpoints',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'checkpoints',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"decimals"`.
 */
export function useStarknetDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"delegates"`.
 */
export function useStarknetDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"getPastTotalSupply"`.
 */
export function useStarknetGetPastTotalSupply<
  TFunctionName extends 'getPastTotalSupply',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'getPastTotalSupply',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"getPastVotes"`.
 */
export function useStarknetGetPastVotes<
  TFunctionName extends 'getPastVotes',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'getPastVotes',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useStarknetGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"getVotes"`.
 */
export function useStarknetGetVotes<
  TFunctionName extends 'getVotes',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'getVotes',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"hasRole"`.
 */
export function useStarknetHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"name"`.
 */
export function useStarknetName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"nonces"`.
 */
export function useStarknetNonces<
  TFunctionName extends 'nonces',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'nonces',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"numCheckpoints"`.
 */
export function useStarknetNumCheckpoints<
  TFunctionName extends 'numCheckpoints',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'numCheckpoints',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useStarknetSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"symbol"`.
 */
export function useStarknetSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useStarknetTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof starknetABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: starknetABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof starknetABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__.
 */
export function useStarknetWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof starknetABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, TFunctionName, TMode>({
    abi: starknetABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"approve"`.
 */
export function useStarknetApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof starknetABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'approve', TMode>({
    abi: starknetABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useStarknetDecreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'decreaseAllowance'
        >['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<typeof starknetABI, 'decreaseAllowance', TMode> & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'decreaseAllowance', TMode>({
    abi: starknetABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"delegate"`.
 */
export function useStarknetDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { functionName?: 'delegate' }
    : UseContractWriteConfig<typeof starknetABI, 'delegate', TMode> & {
        abi?: never
        functionName?: 'delegate'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'delegate', TMode>({
    abi: starknetABI,
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"delegateBySig"`.
 */
export function useStarknetDelegateBySig<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'delegateBySig'
        >['request']['abi'],
        'delegateBySig',
        TMode
      > & { functionName?: 'delegateBySig' }
    : UseContractWriteConfig<typeof starknetABI, 'delegateBySig', TMode> & {
        abi?: never
        functionName?: 'delegateBySig'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'delegateBySig', TMode>({
    abi: starknetABI,
    functionName: 'delegateBySig',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"grantRole"`.
 */
export function useStarknetGrantRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'grantRole'
        >['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof starknetABI, 'grantRole', TMode> & {
        abi?: never
        functionName?: 'grantRole'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'grantRole', TMode>({
    abi: starknetABI,
    functionName: 'grantRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useStarknetIncreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'increaseAllowance'
        >['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<typeof starknetABI, 'increaseAllowance', TMode> & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'increaseAllowance', TMode>({
    abi: starknetABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"mint"`.
 */
export function useStarknetMint<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'mint'
        >['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof starknetABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'mint', TMode>({
    abi: starknetABI,
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"permit"`.
 */
export function useStarknetPermit<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'permit'
        >['request']['abi'],
        'permit',
        TMode
      > & { functionName?: 'permit' }
    : UseContractWriteConfig<typeof starknetABI, 'permit', TMode> & {
        abi?: never
        functionName?: 'permit'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'permit', TMode>({
    abi: starknetABI,
    functionName: 'permit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useStarknetRenounceRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'renounceRole'
        >['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof starknetABI, 'renounceRole', TMode> & {
        abi?: never
        functionName?: 'renounceRole'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'renounceRole', TMode>({
    abi: starknetABI,
    functionName: 'renounceRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useStarknetRevokeRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'revokeRole'
        >['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof starknetABI, 'revokeRole', TMode> & {
        abi?: never
        functionName?: 'revokeRole'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'revokeRole', TMode>({
    abi: starknetABI,
    functionName: 'revokeRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"transfer"`.
 */
export function useStarknetTransfer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof starknetABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'transfer', TMode>({
    abi: starknetABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useStarknetTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof starknetABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof starknetABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof starknetABI, 'transferFrom', TMode>({
    abi: starknetABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__.
 */
export function usePrepareStarknetWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareStarknetApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareStarknetDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'decreaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'decreaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"delegate"`.
 */
export function usePrepareStarknetDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'delegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'delegate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"delegateBySig"`.
 */
export function usePrepareStarknetDelegateBySig(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'delegateBySig'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'delegateBySig',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'delegateBySig'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareStarknetGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'grantRole'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'grantRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareStarknetIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'increaseAllowance'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'increaseAllowance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareStarknetMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'mint'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareStarknetPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'permit'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'permit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'permit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareStarknetRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'renounceRole'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'renounceRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareStarknetRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'revokeRole'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'revokeRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareStarknetTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link starknetABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareStarknetTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof starknetABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: starknetABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof starknetABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__.
 */
export function useStarknetEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    ...config,
  } as UseContractEventConfig<typeof starknetABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"Approval"`.
 */
export function useStarknetApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"DelegateChanged"`.
 */
export function useStarknetDelegateChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'DelegateChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'DelegateChanged',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'DelegateChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"DelegateVotesChanged"`.
 */
export function useStarknetDelegateVotesChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'DelegateVotesChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'DelegateVotesChanged',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'DelegateVotesChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useStarknetRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'RoleAdminChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'RoleAdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useStarknetRoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'RoleGranted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useStarknetRoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'RoleRevoked'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link starknetABI}__ and `eventName` set to `"Transfer"`.
 */
export function useStarknetTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof starknetABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: starknetABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof starknetABI, 'Transfer'>)
}
