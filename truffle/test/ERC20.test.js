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

  it('Should be able to "mint" balance for initial owner', () => {
    //assert.ok(instanceA, 'Contract should be deployed');
    //instanceA.balance(WRC20Address);//.should.be.bignumber.equal('0');
    return instanceA.balance.call(PrefundedAddress).then(res => {
      let received = new BN(res, 16)
      assert(received.eq(PrefundedAmount), util.format("received (%s) != expected prefunded amount(%s) %s", received, PrefundedAmount, res));
    })
  });
});
