import "./Ownable.sol";
import "./provableAPI.sol";
pragma solidity 0.5.12;

contract CoinFlip is Ownable, usingProvable{

    bool win;
    string winStatus;
    string withdrawMessage;
    uint winings;
    string HeadsTailsProvable;
    uint betHeadsTails;


    modifier costs(uint cost){
      require(msg.value >= cost);
      _;
  }
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 public latestNumber;

    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);

    constructor()
    public
    {
      update();
    }

    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public{
      require(msg.sender == provable_cbAddress());
      uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
      latestNumber = randomNumber;
      emit generatedRandomNumber(randomNumber);
    }

    function update() public payable{
      uint256 QUERY_EXECUTION_DELAY = 0;
      uint256 GAS_FOR_CALLBACK = 200000;
      provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);
      emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
    }

    function flipCoin(uint betHeadsTails, uint betAmount) public payable{
      require(winings == 0);
      update();
      if(latestNumber == betHeadsTails){
        withdrawMessage = "You need to withdraw your winnings first";
        winStatus = "You win!";
        win = true;
        winings = msg.value * 2;
      }
      else{
        winStatus = "You lose!";
        win = false;
        winings = msg.value * 0;
      }
    }
    function getWin() public view returns(string memory){
      return winStatus;
    }
    function getBalance() public view returns(uint){
      uint contractBalance;
      return contractBalance = address(this).balance;
    }
    function withdraw() public{
      require(winings != 0);
      msg.sender.transfer(winings);
      winings = 0;
      withdrawMessage = "";
     }
    function getWinnings() public view returns(uint){
      return winings;
    }
    function getWinMessage() public view returns(string memory){
      return withdrawMessage;
    }
    function fundContract() public payable{
      require(msg.value > 0);
    }
    function getLastestNumber() public view returns(uint) {
      return latestNumber;
    }
}
