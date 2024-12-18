import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const CONTRACT_NAME = 'microlending';

Clarinet.test({
    name: "Ensure contract owner can add and remove collateral assets",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const asset = "STX";
        
        let block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'add-collateral-asset',
                [types.ascii(asset)],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok true)');
        
        block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'remove-collateral-asset',
                [types.ascii(asset)],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok true)');
    },
});

Clarinet.test({
    name: "Ensure non-owner cannot add collateral assets",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        const asset = "STX";
        
        let block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'add-collateral-asset',
                [types.ascii(asset)],
                user.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, `(err u1000)`); // ERR-NOT-AUTHORIZED
    },
});