import { ContractLink } from "./ContractLink";

// docs/components/ContractTable.tsx
interface Contract {
  name: string;
  address: string;
}

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Contract
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
            Mainnet Address
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {contracts.map((contract, index) => {
          return (
            <tr key={index}>
              <td className="px-6 py-4 text-sm font-medium">
                {contract.name}
              </td>
              <td className="px-6 py-4 text-sm">
                <ContractLink
                  address={contract.address}
                  network="mainnet"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}