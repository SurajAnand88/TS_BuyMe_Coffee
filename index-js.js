import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
} from "https://esm.sh/viem";

import { abi, contractAddress } from "./constants-js.js";

let connectBtn = document.getElementById("connectButton");
let fundBtn = document.getElementById("fundButton");
let ethAmountInput = document.getElementById("ethAmountInput");
let getBalanceBtn = document.getElementById("getBalanceButton");
let withDrawBtn= document.getElementById("withdrawButton")

let walletClient;
let publicClient;

connectBtn.onclick = connect;
fundBtn.onclick = fund;
getBalanceBtn.onclick = getBalance;
withDrawBtn.onclick = withdraw;

async function getBalance() {
  
  if (window.ethereum) {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const balance = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(formatEther(balance));
  }
}

async function connect() {
  console.log("onConnect...........");
  if (window.ethereum) {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedWallet] = await walletClient.requestAddresses();
    console.log(connectedWallet);
    connectBtn.innerText = "Connected!";
  } else {
    connectBtn.innerText = "Please install metamask";
  }
}

async function fund() {
  if (window.ethereum) {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const [connectedAccount] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    console.log(parseEther(ethAmountInput.value));
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "fund",
      account: connectedAccount,
      chain: currentChain,
      value: parseEther(ethAmountInput.value),
    });

    const hash = await walletClient.writeContract(request);
    console.log(hash);
  } else {
    connectBtn.innerText = "Please install Metamast";
  }
}

async function withdraw() {
  if (window.ethereum) {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    let [connectedAddress] = await walletClient.requestAddresses();
    let currentChain = await getCurrentChain(walletClient);

    let publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    let { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "withdraw",
      account: connectedAddress,
      chain: currentChain,
    });

    let hash = await walletClient.writeContract(request);
    console.log(hash);
  } else {
    connectBtn.innerText = "Please connect Metmask!";
  }
}
async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
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
