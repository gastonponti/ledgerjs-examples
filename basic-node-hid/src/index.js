import "babel-polyfill";
import TransportNodeHID from "@ledgerhq/hw-transport-node-hid";
import AppEth from "@ledgerhq/hw-app-eth";
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20'
import { RLP } from 'eth-lib'

async function example() {
  const transport = await TransportNodeHID.open("");
  transport.setDebugMode(true);
  const appEth = new AppEth(transport);
  const arrayTx = []
  arrayTx.push([ 
    '0x', // nonce
    '0x012a05f200', // gasPrice
    '0x9669', // gas
    '0x', // feeCurrency
    '0x12d99a7c39c53283e3a0b46a69ede6a1cb7048b6', // gatewayFeeRecipient
    '0x2710', // gatewayFee
    '0xb8641365dbe943bc2fb6977e6fbc1630ef47db5a', // to
    '0x4500000000000000', // value
    '0xa9059cbb0000000000000000000000006dde80aa8b48e849aff8f80a806fc3777b19a07000000000000000000000000000000000000000000000000000038d7ea4c68000',
    '0xaef2', // chainId
    '0x',
    '0x'
  ])
/*  arrayTx.push([ 
    '0x', // nonce
    '0x012a05f200', // gasPrice
    '0x9669', // gas
    '0x', // feeCurrency
    '0x12d99a7c39c53283e3a0b46a69ede6a1cb7048b6', // gatewayFeeRecipient
    '0x2710', // gatewayFee
    '0xb8641365dbe943bc2fb6977e6fbc1630ef47db5a', // to
    '0x', // value
    '0xa9059cbb0000000000000000000000006dde80aa8b48e849aff8f80a806fc3777b19a07000000000000000000000000000000000000000000000000000038d7ea4c68000',
    '0xaef2', // chainId
    '0x',
    '0x'
  ])*/
  arrayTx.push([ 
    '0x04', // nonce
    '0x012a05f200', // gasPrice
    '0x9669', // gas
    '0x', // feeCurrency
    '0x12d99a7c39c53283e3a0b46a69ede6a1cb7048b6', // gatewayFeeRecipient
    '0x2710', // gatewayFee
    '0xb8641365dbe943bc2fb6977e6fbc1630ef47db5a', // to
    '0x', // value
    '0xa9059cbb0000000000000000000000006dde80aa8b48e849aff8f80a806fc3777b19a07000000000000000000000000000000000000000000000000000038d7ea4c68000',
    '0x', // chainId
    '0x',
    '0x'
  ])
/*  arrayTx.push([
    '0x', //nonce
    '0x02540be400', //gasPrice
    '0x022c68', // gas
    '0xe94ad4f222e3b4e6a1fdf209801e5f76ff30d50f', // feeCurrency
    '0x12d99a7c39c53283e3a0b46a69ede6a1cb7048b6', // gatewayFeeRecipient
    '0x2710', // gatewayFee
    '0xe94ad4f222e3b4e6a1fdf209801e5f76ff30d50f', // to
    '0x', // value
    '0xe1d6aceb000000000000000000000000ce10ce10ce10ce10ce10ce10ce10ce10ce10ce10000000000000000000000000000000000000000000000000008e1bc9bf04000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000', //data
    '0xaef2', // chainId
    '0x',
    '0x'
  ])*/
  console.log("Transactions Length: ", arrayTx.length)
  const codedArray = arrayTx.map(value => RLP.encode(value).slice(2));
  console.log("Codes: ", codedArray)
  const resultArray = []
  console.log("Fetching address...")
  resultArray.push(await appEth.getAddress("44'/52752'/0'/0/0"));
  console.log("Signing...")
  for (const code of codedArray) {
    resultArray.push(await executeSign(appEth, "44'/52752'/0'/0/0", code));
  }
  return resultArray;
}

async function executeSign(appEth, deriPath, coded) {
  const decoded = RLP.decode('0x'+coded);
  let result;
  try {
    result = await appEth.signTransaction(deriPath, coded);
  } catch(error) {
    result = error;
  }
  return {coded, result, decoded};
}

example().then(
  result => {
    console.log(result);
  },
  e => {
    console.error(e);
  }
);
