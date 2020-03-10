import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import AppEth from "@ledgerhq/hw-app-eth";

async function example() {
  const transport = await TransportNodeHid.open("");
  transport.setDebugMode(true);
  const appEth = new AppEth(transport);
  const result = await appEth.getAddress("44'/52752'/0'/0/0");
  const result2 = await appEth.signTransaction("44'/52752'/0'/0/0", "f840050782520880943254cf5b6509a634fdaec8d9bc0656ede78f8e7d821388943254cf5b6509a634fdaec8d9bc0656ede78f8e7d884563918244f4000080808080");
  return [result, result2];
}

example().then(
  result => {
    console.log(result);
  },
  e => {
    console.error(e);
  }
);
