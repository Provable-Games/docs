import { ContractLink } from "./ContractLink";

// docs/components/ContractTable.tsx
interface Contract {
  name: string;
  address: string;
}

interface ContractTableProps {
  contracts: Contract[];
  network?: string;
}

export function ContractTable({ contracts, network = "mainnet" }: ContractTableProps) {
  const label = network === "mainnet" ? "Mainnet Address" : "Sepolia Address";
  return (
    <div className="not-prose my-4 overflow-x-auto rounded-lg border border-white/10">
    <table className="w-full divide-y divide-white/10" style={{ margin: 0 }}>
      <thead>
        <tr>
          <th className="px-3 sm:px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/50">
            Contract
          </th>
          <th className="px-3 sm:px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-white/50">
            {label}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {contracts.map((contract, index) => {
          return (
            <tr key={index}>
              <td className="px-3 sm:px-5 py-3 text-sm font-medium whitespace-nowrap align-top">
                {contract.name}
              </td>
              <td className="px-3 sm:px-5 py-3 text-sm break-all">
                <ContractLink
                  address={contract.address}
                  network={network}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}