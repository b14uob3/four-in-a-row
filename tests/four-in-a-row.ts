import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { FourInARow } from "../target/types/four_in_a_row";

describe("four-in-a-row", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.FourInARow as Program<FourInARow>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
