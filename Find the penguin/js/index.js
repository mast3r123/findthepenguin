//handle three rounds and game over or game won situation

$(document).ready(function () {
  var totalMounds = 16;
  var totalRounds = 3;
  var currentRound = 1;
  var totalScore = 0;
  var totalClicks = 0;
  var highestScore = 0;
  var audioElement = document.createElement("audio");
  //Audio is copyrighted in someway, was not able to find without background noise
  var roar = "./roar.mp3";
  var squawk = "./squawk.mp3";

  var mounds = [
    { moundImg: "mound_1.png", moundHover: "mound_1_hover.png" },
    { moundImg: "mound_2.png", moundHover: "mound_2_hover.png" },
    { moundImg: "mound_3.png", moundHover: "mound_3_hover.png" },
    { moundImg: "mound_4.png", moundHover: "mound_4_hover.png" },
    { moundImg: "mound_5.png", moundHover: "mound_5_hover.png" },
    { moundImg: "mound_6.png", moundHover: "mound_6_hover.png" },
    { moundImg: "mound_7.png", moundHover: "mound_7_hover.png" },
    { moundImg: "mound_8.png", moundHover: "mound_8_hover.png" },
    { moundImg: "mound_9.png", moundHover: "mound_9_hover.png" },
    { moundImg: "mound_1.png", moundHover: "mound_1_hover.png" },
    { moundImg: "mound_2.png", moundHover: "mound_2_hover.png" },
    { moundImg: "mound_3.png", moundHover: "mound_3_hover.png" },
    { moundImg: "mound_4.png", moundHover: "mound_4_hover.png" },
    { moundImg: "mound_5.png", moundHover: "mound_5_hover.png" },
    { moundImg: "mound_6.png", moundHover: "mound_6_hover.png" },
    { moundImg: "mound_7.png", moundHover: "mound_7_hover.png" },
  ];

  var objects = [
    { moundImg: "penguin_1.png" },
    { moundImg: "penguin_2.png" },
    { moundImg: "penguin_3.png" },
    { moundImg: "penguin_4.png" },
    { moundImg: "penguin_5.png" },
    { moundImg: "penguin_6.png" },
    { moundImg: "penguin_7.png" },
    { moundImg: "penguin_8.png" },
    { moundImg: "penguin_6.png" },
    { moundImg: "penguin_7.png" },
    { moundImg: "penguin_8.png" },
    { moundImg: "penguin_1.png" },
    { moundImg: "penguin_2.png" },
    { moundImg: "penguin_3.png" },
    { moundImg: "penguin_4.png" },
    { moundImg: "yeti.png" },
  ];

  var randomiseArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  var setNewHighScore = (score) => {
    //test this functionality by playing a game on shuffeling on and after turn it off and try it manually
    sessionStorage.setItem("highScore", score);
  };

  var fetchStoredScore = () => {
    return sessionStorage.getItem("highScore");
  };

  var initialLoad = () => {
    $("#round").text(currentRound + "/" + totalRounds);
    $("#score").text(0);
    if (fetchStoredScore() <= 0) {
      setNewHighScore(0);
    }
    //Comment below two lines to get yeti always at the last position for testing score as well as session storage
    mounds = randomiseArray(mounds);
    objects = randomiseArray(objects);
  };

  var newGame = () => {
    initialLoad();
    $("#fadeMe").hide();
    for (var i = 0; i < totalMounds; i++) {
      var div = document.createElement("div");
      div.setAttribute("id", "penguin");

      let img = "./images/" + mounds[i].moundImg.toString();
      let hoverImg = "./images/" + mounds[i].moundHover.toString();
      let pengImg = "./images/" + objects[i].moundImg.toString();

      $(div).css("background-image", "url(" + img + ")");
      $(div).appendTo("#gamearea");

      $(div).on({
        mouseenter: function () {
          if ($(this).data("isClicked") != "true") {
            $(this).css("background-image", "url(" + hoverImg + ")");
          }
        },
        mouseleave: function () {
          if ($(this).data("isClicked") != "true") {
            $(this).css("background-image", "url(" + img + ")");
          }
        },
        click: function () {
          if ($(this).data("isClicked") != "true") {
            $(this).css("background-image", "url(" + pengImg + ")");
            $(this).data("isClicked", "true");
            if (pengImg.includes("yeti")) {
              audioElement.setAttribute("src", roar);
              audioElement.play();
              const elements = document.querySelectorAll("#penguin");
              $("#score").text(0);
              Array.from(elements).forEach((element, index) => {
                if (!$(element).css("background-image").includes("yeti")) {
                  //Game over and reset mounds other than Yeti
                  let img = "./images/" + mounds[index].moundImg.toString();
                  $(element).css("background-image", "url(" + img + ")");
                }
              });
              setTimeout(gameLost, 250);
            } else {
              audioElement.setAttribute("src", squawk);
              audioElement.play();
              totalClicks++;
              //score based on total number of penguins and yeti to total to 100
              totalScore = totalClicks * 6;
              $("#score").text(totalScore);
              if (totalClicks == totalMounds - 1) {
                //Won the game, handle win situation
                totalScore = totalScore + 10;
                $("#score").text(totalScore);
                setTimeout(gameWon, 250);
              }
            }
          }
        },
      });
    }
  };

  newGame();

  var newRound = () => {
    resetGame();
  };

  /*var gameOver = () => {
    var promptSel = prompt(
      "You have played 3 rounds. \nYour highest score was " +
        fetchStoredScore +
        "\n Do you want to restart the game?"
    );
    if (promptSel != null) {
      if (promptSel.toLowerCase() == "yes") {

      } else {
      }
    } else {
    }
  };*/

  var finishGame = () => {
    $("#fadeMe").show();
    $("#finalScore").html(
      "You have finished the game <br> Your highest score for this game was " +
        highestScore +
        "<br> Your highest score for this session was " +
        fetchStoredScore() +
        "<br> Please fresh this page to play again"
    );
  };

  var gameLost = () => {
    if (currentRound == totalRounds) {
      if (highestScore < totalScore) {
        highestScore = totalScore;
        if (fetchStoredScore() < highestScore) {
          setNewHighScore(totalScore);
        }
      }
      finishGame();
    } else {
      var promptSel = prompt(
        "Oops!!, you have lost this round. \n\nDo you want to play another round? \n\nPlease type Yes to continue or No/Cancel to reset the game",
        "Yes"
      );
      if (promptSel != null) {
        if (promptSel.toLowerCase() == "yes") {
          if (highestScore < totalScore) {
            highestScore = totalScore;
            if (fetchStoredScore() < highestScore) {
              setNewHighScore(totalScore);
            }
          }
          currentRound++;
          newRound();
        } else if (promptSel.toLowerCase() == "no") {
          restartGame();
        }
      } else {
        restartGame();
      }
    }
  };

  var gameWon = () => {
    if (currentRound == totalRounds) {
      finishGame();
    } else {
      var promptSel = prompt(
        "Congratulations, you have won this round. \n\nDo you want to play another round? \n\nPlease type Yes to continue or No/Cancel to reset the game",
        "Yes"
      );
      if (promptSel != null) {
        if (promptSel.toLowerCase() == "yes") {
          if (highestScore < totalScore) {
            highestScore = totalScore;
            if (fetchStoredScore() < highestScore) {
              setNewHighScore(totalScore);
            }
          }
          currentRound++;
          newRound();
        } else if (promptSel.toLowerCase() == "no") {
          restartGame();
        }
      } else {
        restartGame();
      }
    }
  };

  var restartGame = () => {
    currentRound = 1;
    resetGame();
  };

  var resetGame = () => {
    totalScore = 0;
    totalClicks = 0;
    $("#score").text(totalScore);
    const myNode = document.getElementById("gamearea");
    myNode.innerHTML = "";
    newGame();
  };
});
