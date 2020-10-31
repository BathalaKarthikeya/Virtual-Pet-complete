//declare the variables.
var dog;
var dogImg;
var happyDogImg;
var database;
var foodS;
var foodObj;
var bowl;
var full;
var empty;

var readGame;
var changeGame;
var gameState;

var fedTime;
var lastFed;
var currentTime;

var bedroom;
var washroom;
var garden;

function preload() {
  //load the images.
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");

  bedroom = loadImage("images/Bed Room.png");
  washroom = loadImage("images/Wash Room.png");
  garden = loadImage("images/Garden.png")

  empty = loadImage("images/fava.jpg");
  full = loadImage("images/fav.jpg");
}

function setup() {
  createCanvas(600, 500);
  //use the database.
  database = firebase.database();
  //refer to "FOOD" in the database.
  foodS = database.ref("Food");
  //create a listener to listen to all the changes in the database.
  foodS.on("value", readStock);

  readGame = database.ref("gameState");
  readGame.on("value", (data) => {
    gameState = data.val();
  })

  //create the dog sprite.
  dog = createSprite(500, 400, 20, 20);
  dog.scale = 0.2;
  dog.addImage(dogImg);

  bowl = createSprite(400, 450, 20, 20);
  bowl.scale = 0.2;
  bowl.addImage(empty);

  foodObj = new Food(200, 200);
  foodObj.scale = 0.1;

  add = createButton("Add Food");
  add.position(400, 150);
  add.mousePressed(AddFood);

  feed = createButton("Feed the Dog");
  feed.position(800, 150);
  feed.mousePressed(FeedDog);
}


function draw() {
  background(46, 139, 87);

  if (foodS !== undefined) {
    //write text.
    textSize(20);
    fill(255);
    stroke("red");
    text("Food Remaining: " + foodS, 150, 50);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
      lastFed = data.val();
    })

    fill(255, 255, 255);
    textSize(15);
    if (lastFed >= 12) {
      text("Last Fed : " + lastFed % 12 + "PM", 350, 30);
    } else if (lastFed == 0) {
      text("Last Fed : 12AM", 350, 350);
    } else {
      text("Last Fed :" + lastFed + "AM", 350, 30);
    }

    currentTime = hour();
    if (currentTime == (lastFed + 1)) {

      foodObj.garden();
      updateGame("playing");

      textSize(30);
      fill("darkgreen");
      noStroke();
      text("'BHOW!!BHOW!! Now it's time to play!!!'", 50, 50)
    } else if (currentTime == (lastFed + 2)) {

      foodObj.bedroom();
      updateGame("sleeping");

      textSize(30);
      fill("black");
      noStroke();
      text("'ZZzz!! feeling lazy, let's sleep.'", 50, 50)

    } else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {

      foodObj.washroom();
      updateGame("bathing");

      textSize(30);
      fill("green");
      noStroke();
      text("'GOSH!! I did not bathe today.'", 50, 50)

    } else {
      updateGame("Hungry");
      foodObj.display();

      //write text.
      textSize(20);
      fill(255);
      stroke("red");
      text("'Hi, I am your pet dog, My name is Snoopy.You can also feed me'", 50, 400, 300, 300);
    }
    if (gameState !== "Hungry") {
      feed.hide();
      add.hide();
      dog.remove();
      bowl.remove()
    } else {
      feed.show();
      add.show();
    }
  }

  drawSprites();

}
//read the stock value (which is 30)and store the value in the variable foodS.
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
//write stock.
function writeStock(x) {
  //if the food stock is greater than 0, it will decrease by 1. if it is lesser than or equal to 0, it will be 0.
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  //refer and update that food is x.
  database.ref("/").update({
    Food: x
  })
}

function FeedDog() {
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);

  dog.addImage(happyDogImg);
  bowl.addImage(full);

  dog.x = 450;
  dog.depth = bowl.depth;
  dog.depth = dog.depth + 1;


  database.ref('/').update({

    Food: foodObj.getFoodStock(),
    FeedTime: hour(),

  })

}
function AddFood() {
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}
function updateGame(state) {
  database.ref("/").update({
    gameState: state
  })
}