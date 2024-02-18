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
// L1StarknetDelegation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const l1StarknetDelegationABI = [
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__.
 */
export function useL1StarknetDelegationRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useL1StarknetDelegationDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useL1StarknetDelegationDomainSeparator<
  TFunctionName extends 'DOMAIN_SEPARATOR',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"MINTER_ROLE"`.
 */
export function useL1StarknetDelegationMinterRole<
  TFunctionName extends 'MINTER_ROLE',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'MINTER_ROLE',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"allowance"`.
 */
export function useL1StarknetDelegationAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useL1StarknetDelegationBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"checkpoints"`.
 */
export function useL1StarknetDelegationCheckpoints<
  TFunctionName extends 'checkpoints',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'checkpoints',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"decimals"`.
 */
export function useL1StarknetDelegationDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"delegates"`.
 */
export function useL1StarknetDelegationDelegates<
  TFunctionName extends 'delegates',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'delegates',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"getPastTotalSupply"`.
 */
export function useL1StarknetDelegationGetPastTotalSupply<
  TFunctionName extends 'getPastTotalSupply',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'getPastTotalSupply',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"getPastVotes"`.
 */
export function useL1StarknetDelegationGetPastVotes<
  TFunctionName extends 'getPastVotes',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'getPastVotes',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useL1StarknetDelegationGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"getVotes"`.
 */
export function useL1StarknetDelegationGetVotes<
  TFunctionName extends 'getVotes',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'getVotes',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"hasRole"`.
 */
export function useL1StarknetDelegationHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"name"`.
 */
export function useL1StarknetDelegationName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"nonces"`.
 */
export function useL1StarknetDelegationNonces<
  TFunctionName extends 'nonces',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'nonces',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"numCheckpoints"`.
 */
export function useL1StarknetDelegationNumCheckpoints<
  TFunctionName extends 'numCheckpoints',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'numCheckpoints',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useL1StarknetDelegationSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"symbol"`.
 */
export function useL1StarknetDelegationSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useL1StarknetDelegationTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: l1StarknetDelegationABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__.
 */
export function useL1StarknetDelegationWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, TFunctionName, TMode>(
    { abi: l1StarknetDelegationABI, ...config } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"approve"`.
 */
export function useL1StarknetDelegationApprove<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'approve',
        TMode
      > & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'approve', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useL1StarknetDelegationDecreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'decreaseAllowance'
        >['request']['abi'],
        'decreaseAllowance',
        TMode
      > & { functionName?: 'decreaseAllowance' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'decreaseAllowance',
        TMode
      > & {
        abi?: never
        functionName?: 'decreaseAllowance'
      } = {} as any,
) {
  return useContractWrite<
    typeof l1StarknetDelegationABI,
    'decreaseAllowance',
    TMode
  >({
    abi: l1StarknetDelegationABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"delegate"`.
 */
export function useL1StarknetDelegationDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'delegate'
        >['request']['abi'],
        'delegate',
        TMode
      > & { functionName?: 'delegate' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'delegate',
        TMode
      > & {
        abi?: never
        functionName?: 'delegate'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'delegate', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'delegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"delegateBySig"`.
 */
export function useL1StarknetDelegationDelegateBySig<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'delegateBySig'
        >['request']['abi'],
        'delegateBySig',
        TMode
      > & { functionName?: 'delegateBySig' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'delegateBySig',
        TMode
      > & {
        abi?: never
        functionName?: 'delegateBySig'
      } = {} as any,
) {
  return useContractWrite<
    typeof l1StarknetDelegationABI,
    'delegateBySig',
    TMode
  >({
    abi: l1StarknetDelegationABI,
    functionName: 'delegateBySig',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"grantRole"`.
 */
export function useL1StarknetDelegationGrantRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'grantRole'
        >['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'grantRole',
        TMode
      > & {
        abi?: never
        functionName?: 'grantRole'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'grantRole', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'grantRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useL1StarknetDelegationIncreaseAllowance<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'increaseAllowance'
        >['request']['abi'],
        'increaseAllowance',
        TMode
      > & { functionName?: 'increaseAllowance' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'increaseAllowance',
        TMode
      > & {
        abi?: never
        functionName?: 'increaseAllowance'
      } = {} as any,
) {
  return useContractWrite<
    typeof l1StarknetDelegationABI,
    'increaseAllowance',
    TMode
  >({
    abi: l1StarknetDelegationABI,
    functionName: 'increaseAllowance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"mint"`.
 */
export function useL1StarknetDelegationMint<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'mint'
        >['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof l1StarknetDelegationABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'mint', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"permit"`.
 */
export function useL1StarknetDelegationPermit<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'permit'
        >['request']['abi'],
        'permit',
        TMode
      > & { functionName?: 'permit' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'permit',
        TMode
      > & {
        abi?: never
        functionName?: 'permit'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'permit', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'permit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useL1StarknetDelegationRenounceRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'renounceRole'
        >['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'renounceRole',
        TMode
      > & {
        abi?: never
        functionName?: 'renounceRole'
      } = {} as any,
) {
  return useContractWrite<
    typeof l1StarknetDelegationABI,
    'renounceRole',
    TMode
  >({
    abi: l1StarknetDelegationABI,
    functionName: 'renounceRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useL1StarknetDelegationRevokeRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'revokeRole'
        >['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'revokeRole',
        TMode
      > & {
        abi?: never
        functionName?: 'revokeRole'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'revokeRole', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'revokeRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"transfer"`.
 */
export function useL1StarknetDelegationTransfer<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'transfer',
        TMode
      > & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof l1StarknetDelegationABI, 'transfer', TMode>({
    abi: l1StarknetDelegationABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useL1StarknetDelegationTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof l1StarknetDelegationABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<
        typeof l1StarknetDelegationABI,
        'transferFrom',
        TMode
      > & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<
    typeof l1StarknetDelegationABI,
    'transferFrom',
    TMode
  >({
    abi: l1StarknetDelegationABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__.
 */
export function usePrepareL1StarknetDelegationWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareL1StarknetDelegationApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareL1StarknetDelegationDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      'decreaseAllowance'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'decreaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'decreaseAllowance'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"delegate"`.
 */
export function usePrepareL1StarknetDelegationDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'delegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'delegate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'delegate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"delegateBySig"`.
 */
export function usePrepareL1StarknetDelegationDelegateBySig(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      'delegateBySig'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'delegateBySig',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'delegateBySig'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareL1StarknetDelegationGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'grantRole'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'grantRole'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareL1StarknetDelegationIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      'increaseAllowance'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'increaseAllowance',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'increaseAllowance'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareL1StarknetDelegationMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'mint'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareL1StarknetDelegationPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'permit'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'permit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'permit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareL1StarknetDelegationRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      'renounceRole'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'renounceRole'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareL1StarknetDelegationRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'revokeRole'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'revokeRole'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareL1StarknetDelegationTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof l1StarknetDelegationABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'transfer'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareL1StarknetDelegationTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof l1StarknetDelegationABI,
      'transferFrom'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: l1StarknetDelegationABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof l1StarknetDelegationABI,
    'transferFrom'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__.
 */
export function useL1StarknetDelegationEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    ...config,
  } as UseContractEventConfig<typeof l1StarknetDelegationABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"Approval"`.
 */
export function useL1StarknetDelegationApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof l1StarknetDelegationABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"DelegateChanged"`.
 */
export function useL1StarknetDelegationDelegateChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'DelegateChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'DelegateChanged',
    ...config,
  } as UseContractEventConfig<
    typeof l1StarknetDelegationABI,
    'DelegateChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"DelegateVotesChanged"`.
 */
export function useL1StarknetDelegationDelegateVotesChangedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof l1StarknetDelegationABI,
      'DelegateVotesChanged'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'DelegateVotesChanged',
    ...config,
  } as UseContractEventConfig<
    typeof l1StarknetDelegationABI,
    'DelegateVotesChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useL1StarknetDelegationRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'RoleAdminChanged'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<
    typeof l1StarknetDelegationABI,
    'RoleAdminChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useL1StarknetDelegationRoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'RoleGranted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof l1StarknetDelegationABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useL1StarknetDelegationRoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'RoleRevoked'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof l1StarknetDelegationABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link l1StarknetDelegationABI}__ and `eventName` set to `"Transfer"`.
 */
export function useL1StarknetDelegationTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof l1StarknetDelegationABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: l1StarknetDelegationABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof l1StarknetDelegationABI, 'Transfer'>)
}
