// deno-lint-ignore-file require-await ban-unused-ignore
import { Info } from "https://deno.land/x/nessie@2.0.10/mod.ts";
import { ExtendedSeeder } from "../abstract.ts";

export default class extends ExtendedSeeder {
  async run(_ctx: Info): Promise<void> {
    this.someHelperFunction();
  }
}
