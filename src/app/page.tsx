"use client";
import { useState } from "react";
import { createPublicClient, http, parseAbi } from "viem";
import { createNadoClient } from "@nadohq/client";
import { ink } from "viem/chains";
declare global {
  interface Window {
    ethereum?: any;
  }
}
  const TYDRO_POOL = "0x2816cf15F6d2A220E789aA011D5EE4eB6c47FEbA";
  const TYDRO_DATA_PROVIDER = "0x96086C25d13943C80Ff9a19791a40Df6aFC08328";
  const KBTC = "0x73e0c0d45e048d25fc26fa3159b0aa04bfa4db98";

const TYDRO_ABI = parseAbi([
"function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
]);
const TYDRO_DATA_PROVIDER_ABI = parseAbi([
"function getUserReserveData(address asset, address user) view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)",
]);
const inkClient = createPublicClient({
  transport: http("https://rpc-gel.inkonchain.com"),
});


    
export default function Home() {

  const [walletAddress, setWalletAddress] = useState("");
  const [watchAddress, setWatchAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [ethUsdPrice, setEthUsdPrice] = useState(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [totalTokenValue, setTotalTokenValue] = useState("0.00");
  const [nfts, setNfts] = useState<any[]>([]);
  const [nftPrices, setNftPrices] = useState<any[]>([]);
  const [nftCollectionNames, setNftCollectionNames] =
  useState<Record<string, { name: string; topOffer: number }>>({});
  const getNftFloorPrice = (nft: any) => {
    
  const getNftCollectionName = (nft: any) => {
  const nftAddress = (
    nft.token?.address ||
    nft.token?.address_hash ||
    nft.address ||
    ""
  ).toLowerCase();

  const collection = nftPrices.find((item: any) =>
    item.contracts?.some(
      (contract: any) =>
        contract.address?.toLowerCase() === nftAddress
    )
  );

  return collection?.name || nft.name || nft.metadata?.name || "Unnamed NFT";
};const nftAddress = (
    nft.token?.address ||
    nft.token?.address_hash ||
    nft.address ||
    ""
  ).toLowerCase();


  const collection = nftPrices.find((item: any) =>
    item.contracts?.some(
      (contract: any) =>
        contract.address?.toLowerCase() === nftAddress
    )
  );


return nftCollectionNames[nft.id]?.topOffer || Number(collection?.stats?.total?.floor_price || 0);
};
const getNftCollectionName = (nft: any) => {
return nftCollectionNames[nft.id]?.name || nft.name || nft.metadata?.name || "Unnamed NFT";
};
const totalNftValueEth = nfts.reduce(
  (total: number, nft: any) => total + getNftFloorPrice(nft),
  0
);
const totalTokensUsd =
  Number(totalTokenValue || 0) + Number(ethBalance || 0) * ethUsdPrice;

const totalTokenValueEth =
  ethUsdPrice > 0 ? totalTokensUsd / ethUsdPrice : Number(ethBalance || 0);

const totalPortfolioValueEth =
  totalNftValueEth + totalTokenValueEth;
  
  const [tydroCollateral, setTydroCollateral] = useState("");
const [tydroDebt, setTydroDebt] = useState("");
const [kbtcDebt, setKbtcDebt] = useState("");
const [tydroHealthFactor, setTydroHealthFactor] = useState("");
const [tydroCollateralAsset, setTydroCollateralAsset] = useState("");
const [nadoBalance, setNadoBalance] = useState("");
const [nadoPositions, setNadoPositions] = useState<any[]>([]);
const [riskScore, setRiskScore] = useState(0);
const [riskLevel, setRiskLevel] = useState("No Risk");
const [hedgeRecommendation, setHedgeRecommendation] = useState("");
const [suggestedHedge, setSuggestedHedge] = useState("");
const [showHedgePreview, setShowHedgePreview] = useState(false);
const [hedgePrepared, setHedgePrepared] = useState(false);
const viewWallet = async () => {
  if (!watchAddress.startsWith("0x") || watchAddress.length !== 42) {
    alert("Enter a valid wallet address.");
    return;
  }setWalletAddress(watchAddress);
  const address = watchAddress as `0x${string}`;
  const balanceWei = await inkClient.getBalance({
  address,
});

const balanceEth = Number(balanceWei) / 1e18;
setEthBalance(balanceEth.toFixed(6));
const readOnlyEthPriceResponse = await fetch(
  "https://api.coinbase.com/v2/prices/ETH-USD/spot"
);

const readOnlyEthPriceData = await readOnlyEthPriceResponse.json();
const readOnlyEthPrice = Number(readOnlyEthPriceData.data.amount);

setEthUsdPrice(readOnlyEthPrice);
const tokenResponse = await fetch(
  `https://explorer.inkonchain.com/api/v2/addresses/${address}/token-balances`
);

const tokenData = await tokenResponse.json();
setTokens(tokenData);
const tokenTotal = tokenData.reduce((total: number, token: any) => {
  const amount =
    Number(token.value) / 10 ** Number(token.token?.decimals || 18);
  const price = Number(token.token?.exchange_rate || 0);

  return total + amount * price;
}, 0);

setTotalTokenValue(tokenTotal.toFixed(2));
let readOnlyNfts: any[] = [];
let readOnlyNextPageParams = "";

while (true) {
  const readOnlyNftUrl =
    `https://explorer.inkonchain.com/api/v2/addresses/${address}/nft` +
    (readOnlyNextPageParams ? `?${readOnlyNextPageParams}` : "");

  const nftResponse = await fetch(readOnlyNftUrl);
  const nftData = await nftResponse.json();

  readOnlyNfts = [...readOnlyNfts, ...(nftData.items || [])];

  if (!nftData.next_page_params) break;

  readOnlyNextPageParams = new URLSearchParams(
    nftData.next_page_params
  ).toString();
}

setNfts(readOnlyNfts);
const collectionNameEntries = await Promise.all(
 readOnlyNfts.map(async (nft: any) => {
    const contract =
      nft.token?.address ||
      nft.token?.address_hash ||
      nft.address ||
      "";

    if (!contract || !nft.id) {
      return [nft.id, ""] as const;
    }

    const response = await fetch(
      `/api/nft-prices?contract=${contract}&tokenId=${nft.id}`
    );

    const data = await response.json();
    console.log("OPENSEA NFT COLLECTION:", nft.id, data);

  return [
  nft.id,
  {
    name: data.name || "",
topOffer: Number(data.offer?.price?.value || 0) / 1e18,
  },
] as const;
  })
);

setNftCollectionNames(Object.fromEntries(collectionNameEntries));

const nftPriceResponse = await fetch("/api/nft-prices");
const nftPriceData = await nftPriceResponse.json();
setNftPrices(nftPriceData.collections || []);
};
const connectWallet = async () => {

  if (!window.ethereum) {
    alert("Please install a crypto wallet extension.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  const nadoClient = createNadoClient(
  { chainEnv: "inkMainnet" },
  { publicClient: inkClient }
);

 const nadoSummary = await nadoClient.subaccount.getSubaccountSummary({
  subaccountOwner: accounts[0],
  subaccountName: "default",
});  

const nadoRawBalance = nadoSummary.balances.find(
  (balance: any) => balance.productId === 0
)?.amount;


const nadoOpenPositions = await nadoClient.subaccount.getIsolatedPositions({
  subaccountOwner: accounts[0],
  subaccountName: "default",
});
setNadoPositions(nadoOpenPositions);
console.log("NADO POSITIONS:", nadoOpenPositions);

setNadoBalance(
  nadoRawBalance
    ? nadoRawBalance.dividedBy(1e18).toFixed(6)
    : "0.000000"
);
setWalletAddress(accounts[0]);

  const currentChainId = await window.ethereum.request({
  method: "eth_chainId",
});

setChainId(currentChainId);
const balanceWei = await inkClient.getBalance({
  address: accounts[0] as `0x${string}`,
});
const balanceEth = Number(balanceWei) / 1e18;
setEthBalance(balanceEth.toFixed(6));

const tokenResponse = await fetch(
  `https://explorer.inkonchain.com/api/v2/addresses/${accounts[0]}/token-balances`
);
const tokenData = await tokenResponse.json();
setTokens(tokenData);
const tokenTotal = tokenData.reduce((total: number, token: any) => {
  const amount =
    Number(token.value) / 10 ** Number(token.token?.decimals || 18);

  const price = Number(token.token?.exchange_rate || 0);

  return total + amount * price;
}, 0);

setTotalTokenValue(tokenTotal.toFixed(2));
let allNfts: any[] = [];
let nextPageParams = "";

while (true) {
  const nftUrl =
    `https://explorer.inkonchain.com/api/v2/addresses/${accounts[0]}/nft` +
    (nextPageParams ? `?${nextPageParams}` : "");

  const nftResponse = await fetch(nftUrl);
  const nftData = await nftResponse.json();

  allNfts = [...allNfts, ...(nftData.items || [])];

  if (!nftData.next_page_params) break;

  nextPageParams = new URLSearchParams(
    nftData.next_page_params
  ).toString();
}

setNfts(allNfts);
console.log("FIRST NFT FULL DATA:", allNfts[0]);

const nftPricesResponse = await fetch("/api/nft-prices");
const nftPricesData = await nftPricesResponse.json();
setNftPrices(nftPricesData.collections || []);

const kbtcReserveData = await inkClient.readContract({
  address: TYDRO_DATA_PROVIDER,
  abi: TYDRO_DATA_PROVIDER_ABI,
  functionName: "getUserReserveData",
  args: [KBTC, accounts[0] as `0x${string}`],
});
console.log("KBTC RESERVE DATA:", kbtcReserveData);
const currentKbtcDebt = Number(kbtcReserveData[2]) / 1e8;
setKbtcDebt((Number(kbtcReserveData[2]) / 1e8).toFixed(8));
const btcPriceResponse = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
const btcPriceData = await btcPriceResponse.json();
const btcPrice = Number(btcPriceData.data.amount);
const ethPriceResponse = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
const ethPriceData = await ethPriceResponse.json();
const ethPrice = Number(ethPriceData.data.amount);
setEthUsdPrice(ethPrice);

const tydroData = await inkClient.readContract({
  address: TYDRO_POOL,
  abi: TYDRO_ABI,
  functionName: "getUserAccountData",
  args: [accounts[0] as `0x${string}`],
});
console.log("TYDRO DATA:", tydroData);
setTydroCollateral((Number(tydroData[0]) / 1e8).toFixed(2));
setTydroDebt((Number(tydroData[1]) / 1e8).toFixed(2));
setTydroHealthFactor((Number(tydroData[5]) / 1e18).toFixed(2));
const healthFactor = Number(tydroData[5]) / 1e18;

const hedgePercent =
  healthFactor < 1.1 ? 0.75 :
  healthFactor < 1.3 ? 0.50 :
  healthFactor < 1.5 ? 0.25 :
  0;
setSuggestedHedge((currentKbtcDebt * btcPrice * hedgePercent).toFixed(2));
setRiskScore(Math.max(0, Math.min(100, Math.round((2 - healthFactor) * 100))));

  if (healthFactor < 1.1) {
  setRiskLevel("Critical");
} else if (healthFactor < 1.3) {
  setRiskLevel("High");
} else if (healthFactor < 1.5) {
  setRiskLevel("Medium");
} else {
  setRiskLevel("Low");
}if (healthFactor < 1.1) {
setHedgeRecommendation("Open strong BTC LONG on Nado / Repay debt urgently");
} else if (healthFactor < 1.3) {
 setHedgeRecommendation("Open BTC LONG on Nado / Repay debt recommended");
} else if (healthFactor < 1.5) {
 setHedgeRecommendation("Open partial BTC LONG on Nado");
} else {
  setHedgeRecommendation("No hedge needed");
}
} catch {
    alert("Wallet connection cancelled.");
  }
};

const openNadoHedge = () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  setShowHedgePreview(true);
};

  return (
    <main className="min-h-screen bg-purple-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-12">
          

          <h1 className="text-5xl font-bold mb-4">
            INK BOARD
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl">
            everythINK you need. One dashboard.
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-8 bg-gray-950">
          <h2 className="text-2xl font-semibold mb-2">
            Your entire Ink portfolio. One place.
          </h2>

          <p className="text-gray-400 mb-8">
           Track your tokens, NFTs and DeFi positions across Ink.
          </p>

          <button
            onClick={connectWallet}
            className="bg-white text-black font-semibold px-6 py-3 rounded-xl"
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
          <p className="mt-2 text-xs text-green-400">
  Read-only connection — Inkboard will never request signatures, token approvals or transactions.
</p>
          <div className="mt-4">
  <input
    type="text"
    placeholder="Enter wallet address (0x...)"
    value={watchAddress}
    onChange={(e) => setWatchAddress(e.target.value)}
    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white"
  />
</div>
<button onClick={viewWallet}
  className="mt-3 bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl"
>
  View Wallet
</button>
          <p className="mt-4 text-sm">
  {chainId === "0xdef1"
    ? "🟢 Connected to Ink"
    : chainId
    ? "🔴 Wrong Network"
    : ""}
    
</p>
<div className="mt-6">
  <p className="text-gray-500 text-sm">Total Portfolio Value</p>
 <p className="text-3xl font-bold mt-1">
  {totalPortfolioValueEth.toFixed(6)} ETH
<span className="block text-sm text-gray-400 mt-1">
  ≈ ${(totalPortfolioValueEth * ethUsdPrice).toFixed(2)}
</span>
</p>

 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-4 bg-gray-900 rounded-xl">
  <div className="flex items-center justify-between mb-3">
    <p className="text-xl font-bold tracking-wide">Tokens</p>
  <p className="text-lg font-bold text-white">
${totalTokensUsd.toFixed(2)}
</p>
  </div>
<div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2 border-b border-gray-800">
  <p className="text-white font-semibold">ETH</p>

  <p className="text-gray-300 text-sm text-right">
    {Number(ethBalance || 0).toFixed(6)}
  </p>

  <p className="text-white text-sm font-semibold text-right min-w-[64px]">
    ${(Number(ethBalance || 0) * ethUsdPrice).toFixed(2)}
  </p>
</div>
  {tokens.slice(0, 4).map((token: any, index: number) => (
  <div
    key={index}
    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2 border-b border-gray-800 last:border-b-0"
  >
    <p className="text-white font-semibold">
      {token.token?.symbol || "Unknown Token"}
    </p>

    <p className="text-gray-300 text-sm text-right">
      {(Number(token.value) / 10 ** Number(token.token?.decimals || 18)).toLocaleString(undefined, {
        maximumFractionDigits: 6,
      })}
    </p>

    <p className="text-white text-sm font-semibold text-right min-w-[64px]">
      {token.token?.exchange_rate
        ? `$${(
            (Number(token.value) / 10 ** Number(token.token?.decimals || 18)) *
            Number(token.token.exchange_rate)
          ).toFixed(2)}`
        : "-"}
    </p>
  </div>
))}

  {tokens.length > 4 && (
    <p className="text-sm text-gray-400 mt-3">+ {tokens.length - 4} more tokens</p>
  )}
</div>
<div className="p-4 bg-gray-900 rounded-xl">
  <div className="flex items-center justify-between mb-3">
    <p className="text-xl font-bold tracking-wide">NFTs</p>
<p className="text-lg font-bold text-white">
{totalNftValueEth.toFixed(4)} ETH
<span className="block text-sm text-gray-400">
  ≈ ${(totalNftValueEth * ethUsdPrice).toFixed(2)}
</span>
</p>
  </div>

  {[...nfts]
  .sort((a: any, b: any) => {
    const aAddress = (a.token?.address || a.token?.address_hash || a.address || "").toLowerCase();
    const bAddress = (b.token?.address || b.token?.address_hash || b.address || "").toLowerCase();

const aValue = getNftFloorPrice(a);
const bValue = getNftFloorPrice(b);
    return bValue - aValue;
  })
  .slice(0, 4)
  .map((nft: any, index: number) => (
    <div key={index} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2 border-b border-gray-800 last:border-b-0">
      <p className="text-white font-semibold">
       {getNftCollectionName(nft)}
      </p>
      <p className="text-gray-300 text-sm text-right">
  1
</p>

<p className="text-white text-sm font-semibold text-right min-w-[64px]">
 {getNftFloorPrice(nft) > 0
? `${getNftFloorPrice(nft).toFixed(4)} ETH · $${(getNftFloorPrice(nft) * ethUsdPrice).toFixed(2)}`
  : "-"}
</p>
      
    </div>
  ))}

  {nfts.length > 4 && (
    <p className="text-sm text-gray-400 mt-3">+ {nfts.length - 4} more NFTs</p>
  )}
</div>
</div>
 <div className="mt-6 p-4 bg-gray-900 rounded-xl">
 <p className="text-xl font-bold tracking-wide mb-3">Tydro Position</p>
  <p className="text-white">Collateral: ${tydroCollateral || "0.00"}</p>
  <p className="text-white">Debt: ${tydroDebt || "0.00"}</p>
  <p className="text-white">kBTC Debt: <span className="font-semibold">{kbtcDebt || "0.00000000"} kBTC</span></p>
 <p className="text-white">Health Factor: <span className="font-semibold text-orange-400">{tydroHealthFactor || "-"}</span></p>
</div>
<div className="mt-6 p-4 bg-gray-900 rounded-xl">
<p className="text-xl font-bold tracking-wide mb-3">Nado Perps</p>
<p className="text-white">Balance: <span className="font-semibold">{nadoBalance || "-"}</span></p>
<p className="text-white">Open Positions: <span className="font-semibold">{nadoPositions.length}</span></p>
  {nadoPositions.length === 0 && (
<p className="text-gray-400 text-sm mt-3">● No open positions</p>
  )}
  {nadoPositions.map((position: any, index: number) => (
    <div key={index} className="mt-2 text-sm text-gray-300">
      Position #{index + 1}
    </div>
  ))}
</div>
<div className="mt-6 p-4 bg-gray-900 rounded-xl">
<p className="text-xl font-bold tracking-wide mb-3">Inkboard</p>
<p className="text-2xl font-bold mb-1">{riskScore}<span className="text-sm text-gray-400">/100 Risk Score</span></p>
 <p className="text-white">Risk Level: <span className="text-orange-400 font-semibold">{riskLevel}</span></p>
<p className="mt-3 text-lg font-semibold">Suggested Hedge: <span className="text-green-400">${suggestedHedge || "0.00"} BTC LONG</span></p>
  <p className="text-white">Recommendation: {hedgeRecommendation || "-"}</p>
  <button onClick={openNadoHedge} className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold">
  Open Hedge on Nado
</button>
{showHedgePreview && (
  <div className="mt-4 p-4 bg-black/30 rounded-lg">
    <p className="text-white font-semibold">Hedge Preview</p>
    <p className="text-white">BTC LONG</p>
    <p className="text-white">Size: ${suggestedHedge || "0.00"}</p>
    <p className="text-gray-400 text-sm">
      Based on your kBTC debt and Health Factor {tydroHealthFactor || "-"}
    </p>
    <div className="mt-4 flex gap-3">
  <button onClick={() => setHedgePrepared(true)} className="px-4 py-2 bg-white text-black rounded-lg font-semibold">
    Confirm Hedge
  </button>
  <button
    onClick={() => setShowHedgePreview(false)}
    className="px-4 py-2 border border-gray-600 rounded-lg"
  >
    Cancel
  </button>
</div>
  </div>
)}
{hedgePrepared && (
  <div className="mt-4 p-4 bg-black/30 rounded-lg">
    <p className="text-white font-semibold">✓ Hedge prepared</p>
    <p className="text-white">BTC LONG · ${suggestedHedge || "0.00"}</p>
    <p className="text-gray-400 text-sm">Ready for Nado execution</p>
  <button onClick={() => window.open("https://app.nado.xyz/perpetuals?join=inkboard", "_blank", "noopener,noreferrer")} className="mt-3 px-4 py-2 bg-white text-black rounded-lg font-semibold">
  Execute on Nado
</button>
  </div>
)}
</div>





 <div className="p-4 bg-gray-900 rounded-xl">
  <div className="flex items-center justify-between mb-4">
    <p className="text-xl font-bold">Tokens</p>
    <p className="text-gray-400 text-sm">{tokens.length} found</p>
  </div>

  {tokens.slice(0, 4).map((token: any, index: number) => (
    <div
      key={index}
      className="py-2 border-b border-gray-800 last:border-b-0"
    >
      <p className="text-white font-semibold">
        {token.token?.symbol || "Unknown Token"}
      </p>
      <p className="text-gray-400 text-sm">
        {(Number(token.value) / 10 ** Number(token.token?.decimals || 18)).toLocaleString()}
      </p>
    </div>
  ))}

  {tokens.length > 4 && (
    <p className="text-gray-400 text-sm mt-3">
      + {tokens.length - 4} more tokens
    </p>
  )}
</div>
</div>
<div className="p-4 bg-gray-900 rounded-xl">
  <div className="flex items-center justify-between mb-4">
    <p className="text-xl font-bold">NFTs</p>
    <p className="text-gray-400 text-sm">{nfts.length} found</p>
  </div>

  {nfts.slice(0, 4).map((nft: any, index: number) => (
    <div
      key={index}
      className="py-2 border-b border-gray-800 last:border-b-0"
    >
      <p className="text-white font-semibold">
        {nft.name || nft.metadata?.name || "Unnamed NFT"}
      </p>
      <p className="text-gray-400 text-sm">
        Token #{nft.id || nft.token?.id || "Unknown"}
      </p>
    </div>
  ))}

  {nfts.length > 4 && (
    <p className="text-gray-400 text-sm mt-3">
      + {nfts.length - 4} more NFTs
    </p>
  )}
</div>
</div>
</div>
</main>
);
}