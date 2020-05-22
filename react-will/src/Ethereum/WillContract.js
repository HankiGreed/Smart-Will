import web3 from './web3';
import WillContract from './Will.json';

const createContract = (contractAddress) => {
  return new web3.eth.Contract(WillContract['abi'], contractAddress);
};
export default createContract;
