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
// DelegateRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const delegateRegistryABI = [
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
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ClearDelegate',
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
      { name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SetDelegate',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'clearDelegate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32' },
      { name: 'delegate', internalType: 'address', type: 'address' },
    ],
    name: 'setDelegate',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link delegateRegistryABI}__.
 */
export function useDelegateRegistryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof delegateRegistryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof delegateRegistryABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: delegateRegistryABI,
    ...config,
  } as UseContractReadConfig<
    typeof delegateRegistryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link delegateRegistryABI}__ and `functionName` set to `"delegation"`.
 */
export function useDelegateRegistryDelegation<
  TFunctionName extends 'delegation',
  TSelectData = ReadContractResult<typeof delegateRegistryABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof delegateRegistryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: delegateRegistryABI,
    functionName: 'delegation',
    ...config,
  } as UseContractReadConfig<
    typeof delegateRegistryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__.
 */
export function useDelegateRegistryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateRegistryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof delegateRegistryABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof delegateRegistryABI, TFunctionName, TMode>({
    abi: delegateRegistryABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__ and `functionName` set to `"clearDelegate"`.
 */
export function useDelegateRegistryClearDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateRegistryABI,
          'clearDelegate'
        >['request']['abi'],
        'clearDelegate',
        TMode
      > & { functionName?: 'clearDelegate' }
    : UseContractWriteConfig<
        typeof delegateRegistryABI,
        'clearDelegate',
        TMode
      > & {
        abi?: never
        functionName?: 'clearDelegate'
      } = {} as any,
) {
  return useContractWrite<typeof delegateRegistryABI, 'clearDelegate', TMode>({
    abi: delegateRegistryABI,
    functionName: 'clearDelegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__ and `functionName` set to `"setDelegate"`.
 */
export function useDelegateRegistrySetDelegate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateRegistryABI,
          'setDelegate'
        >['request']['abi'],
        'setDelegate',
        TMode
      > & { functionName?: 'setDelegate' }
    : UseContractWriteConfig<
        typeof delegateRegistryABI,
        'setDelegate',
        TMode
      > & {
        abi?: never
        functionName?: 'setDelegate'
      } = {} as any,
) {
  return useContractWrite<typeof delegateRegistryABI, 'setDelegate', TMode>({
    abi: delegateRegistryABI,
    functionName: 'setDelegate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__.
 */
export function usePrepareDelegateRegistryWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateRegistryABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateRegistryABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof delegateRegistryABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__ and `functionName` set to `"clearDelegate"`.
 */
export function usePrepareDelegateRegistryClearDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateRegistryABI, 'clearDelegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateRegistryABI,
    functionName: 'clearDelegate',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof delegateRegistryABI,
    'clearDelegate'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateRegistryABI}__ and `functionName` set to `"setDelegate"`.
 */
export function usePrepareDelegateRegistrySetDelegate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateRegistryABI, 'setDelegate'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateRegistryABI,
    functionName: 'setDelegate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof delegateRegistryABI, 'setDelegate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateRegistryABI}__.
 */
export function useDelegateRegistryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof delegateRegistryABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateRegistryABI,
    ...config,
  } as UseContractEventConfig<typeof delegateRegistryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateRegistryABI}__ and `eventName` set to `"ClearDelegate"`.
 */
export function useDelegateRegistryClearDelegateEvent(
  config: Omit<
    UseContractEventConfig<typeof delegateRegistryABI, 'ClearDelegate'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateRegistryABI,
    eventName: 'ClearDelegate',
    ...config,
  } as UseContractEventConfig<typeof delegateRegistryABI, 'ClearDelegate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateRegistryABI}__ and `eventName` set to `"SetDelegate"`.
 */
export function useDelegateRegistrySetDelegateEvent(
  config: Omit<
    UseContractEventConfig<typeof delegateRegistryABI, 'SetDelegate'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateRegistryABI,
    eventName: 'SetDelegate',
    ...config,
  } as UseContractEventConfig<typeof delegateRegistryABI, 'SetDelegate'>)
}
