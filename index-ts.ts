import {
  createWalletClient,
  createPublicClient,
  parseEther,
  formatEther,
  transport,
  custom,
  defineChain,
} from "viem";
import { abi, contractAddress } from "./constants-js.js";
import "viem/window";

let connectBtn = document.getElementById("connectButton") as HTMLButtonElement;
let fundBtn = document.getElementById("fundButton") as HTMLButtonElement;
let ethAmountInput = document.getElementById("ethAmountInput") as HTMLInputElement;
let getBalanceBtn = document.getElementById("getBalanceButton") as HTMLButtonElement;
let withDrawBtn = document.getElementById("withdrawButton") as HTMLButtonElement;

let walletClient: createWalletClient;
let publicClient: createPublicClient;

async function connect(): Promise<void> {
  console.log("connecting........");
  if (window.ethereum) {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    let [connectedWallet] = await walletClient.requestAddresses();
    console.log(connectedWallet);
    connectBtn.innerText = "Wallet Connected";
  }
}

async function fund(): Promise<void> {
  console.log("funding.............");
  if (window.ethereum) {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    let currentChain = await getCurrentChain(walletClient);
    let [connectedAccount] = await walletClient.requestAddresses();

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    let { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmountInput.value),
    });

    // let hash = await walletClient.writeContract(request);
    // console.log(hash);
  }
}

async function getBalance(): Promise<void> {
  console.log("getting balancee");
  if (window.ethereum) {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    let balance: bigint = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(formatEther(balance));
  }
}

async function getCurrentChain(client: createWalletClient): Promise<object> {
  let chainId: number = await client.getChainId();
  const currentChain: object = defineChain({
    id: chainId,
    name: "Anvil",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

function withdraw(){
  console.log("withdrawing.........");
}

connectBtn.onclick = connect;
fundBtn.onclick = fund;
getBalanceBtn.onclick = getBalance;
withDrawBtn.onclick = withdraw;
