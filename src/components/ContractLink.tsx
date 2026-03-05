import { displayAddress } from "../../utils";

// components/ContractLink.tsx
interface ContractLinkProps {
  address: string;
  label?: string;
  network?: string;
}

export function ContractLink({ address, label, network }: ContractLinkProps) {
  const host = network === "mainnet" ? "voyager.online" : "sepolia.voyager.online";
  return (
    <a
      href={`https://${host}/contract/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-(--color-brand) hover:text-(--color-brand) hover:underline font-mono text-xs"
    >
      {label || address}
    </a>
  );
}
