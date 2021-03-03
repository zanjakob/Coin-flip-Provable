var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var winnings;


$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x8806EAAA58Ee941F1eC04A9955Ca334814228Ed6", {from: accounts[0]});
      contractInstance.methods.getBalance().call().then(function(res){
        displayInfoBalance(res);
      });
      contractInstance.methods.getWinnings().call().then(function(res){
        displayInfoWinnings(res);
      });
    });
    $("#Flip_coin_button").click(flipCoinButton);
    $("#bet_1ETH_button").click(buy1ETH);
    $("#bet_2ETH_button").click(buy2ETH);
    $("#bet_3ETH_button").click(buy3ETH);
    $("#bet_HEADS_button").click(betHeads);
    $("#bet_TAILS_button").click(betTails);
    $("#Flip_coin_button").click(getMessageWin);
    $("#Flip_coin_button_provable").click(getMessageWin);
    $("#withdraw_button").click(withdrawETH);
    $("#fundETH_button").click(fundEthereum);
    $("#update_button_provable").click(updateProvable);
    $("#callback_button").click(callbackProvable);
    $("#callback_button_getLatestNumber").click(getLastestNumberget);
  });
var bet = "0";
var betHT;
function betHeads(){
  betHT = "1";
  $("#headsTails_output").text("HEADS");
}
function betTails(){
  betHT = "0";
  $("#headsTails_output").text("TAILS");
}
function buy1ETH(){
  bet = "100";
  $("#betETH_output").text("You bet 0.1 ETH");
}
function buy2ETH(){
  bet = "200";
  $("#betETH_output").text("You bet 0.2 ETH");
}
function buy3ETH(){
  bet = "300";
  $("#betETH_output").text("You bet 0.3 ETH");
}
function flipCoinButton(){
  contractInstance.methods.flipCoin(betHT, bet).send({value: web3.utils.toWei(bet, "Milliether")})
  .on('transactionHash', function(hash){
      console.log("tx hash");
    })
  .on('confirmation', function(confirmationNumber, receipt){
        console.log("conf");
    })
  .on('receipt', function(){
      contractInstance.methods.getWin().call().then(function(res){
        displayInfo(res);
      });
    })
    .on('receipt', function(){
    contractInstance.methods.getBalance().call().then(function(res){
      displayInfoBalance(res);
    });
  })
    .on('receipt', function(){
      contractInstance.methods.getWinnings().call().then(function(res){
        displayInfoWinnings(res);
    });
  })
}

function displayInfo(res){

  $("#win_output").text(res);
}
function displayInfoBalance(res){
  $("#balance_output").text(Web3.utils.fromWei(res, 'ether'));
}
function displayInfoWinnings(res){
  $("#winnings_output").text(Web3.utils.fromWei(res, 'ether'));
  var winnings = $("#winnings_output").val();
}
function getMessageWin(){
  contractInstance.methods.getWinMessage().call().then(function(res){
    displaywinMessage(res);
});
}
function displaywinMessage(res){
    $("#winMessage_output").text(res);
}
function withdrawETH(){
  contractInstance.methods.withdraw().send()
  .on('transactionHash', function(hash){
      console.log("tx hash");
    })
  .on('confirmation', function(confirmationNumber, receipt){
        console.log("conf");
    })
  .on('receipt', function(){
    contractInstance.methods.getBalance().call().then(function(res){
      displayInfoBalance(res);
    });
  })
  .on('receipt', function(){
    contractInstance.methods.getWinnings().call().then(function(res){
      displayInfoWinnings(res);
  });
})
}
function fundEthereum(){
  var fundETHinput = $("#fundETH_input").val();
  contractInstance.methods.fundContract().send({value: web3.utils.toWei(fundETHinput, "ether")})
  .on('receipt', function(){
    contractInstance.methods.getBalance().call().then(function(res){
      displayInfoBalance(res);
    });
  })
}
function updateProvable(){
  contractInstance.methods.update().send()
}
function callbackProvable(){
  contractInstance.methods.__callback().call()
}
function getLastestNumberget(){
  contractInstance.methods.getLastestNumber().call().then(function(res){
    displayInfoLatestNumber(res);
  });
}
function displayInfoLatestNumber(res){
  $("#getLatestNumber_output").text(res);
}
