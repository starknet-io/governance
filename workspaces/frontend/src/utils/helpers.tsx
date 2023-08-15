import { ethers } from "ethers";

export function isValidEthereumAddress(address: string): boolean {
  return ethers.utils.isAddress(address);
}
