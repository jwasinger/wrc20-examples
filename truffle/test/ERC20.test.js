// Basic test cases for ERC20 pulled directly from OpenZeppelin: https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/token/ERC20/ERC20.test.js
const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;
const util = require('util')

const ERC20Mock = artifacts.require('WRC20');
const WRC20Address = '0x8013314eA35839F2bB351C1eFd2C163964ec3a3E';
const PrefundedAddress = '0xeD09375DC6B20050d242d1611af97eE4A6E93CAd';
const PrefundedAmount = new BN('16000000000000000000', 10);

contract('WRC20', function ([_, initialHolder, recipient, anotherAccount]) {
  let instanceA;

  before(async () => {
    instanceA = await ERC20Mock.at(WRC20Address);
  });

  it('Should be deployed', () => {
    assert.ok(instanceA, 'Contract should be deployed');
  });

  it('Should have a prefunded account', () => {
    //assert.ok(instanceA, 'Contract should be deployed');
    //instanceA.balance(WRC20Address);//.should.be.bignumber.equal('0');
    return instanceA.balance.call(PrefundedAddress).then(res => {
      let received = new BN(res, 16)
      assert(received.eq(PrefundedAmount), util.format("actual account balance (%s) != expected prefunded amount(%s)", received, PrefundedAmount));
    })
  });

  it('Should be able to send a balance between two accounts', () => {
    const receivingAddress = '0x85ea6adbac1ca7e16c6c9f59115ce2d370b0b358';
    const receivedAmount = new BN('1000', 10)

    return instanceA.transfer.call(PrefundedAddress, receivedAmount).then(res => {
      return instanceA.balance.call(receivingAddress).then(balance => {

        assert((new BN(balance, '16')).eq(receivedAmount), util.format("actual account balance (%s) != expected amount(%s)", new BN(balance, '16'), receivedAmount));
      })
    })
  })
});
