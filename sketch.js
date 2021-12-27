//ADD ANIMATIONS

let tiles = [];
let tW;
let currentCol = 0;
let currentRow = 0;
let error1 = false;
let error2 = false;

let message = "";
let displayMessage = false;
let displayTime = 90;
let timer = 0;

let dictionary;
let targetWord;

function preload(){
  dictionary = loadStrings("dictionary.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  textSize(windowHeight/15);
  tW = (textWidth("WORDLE"));
  
  for (let y = 0; y < 6; y++){
    for (let x = 0; x < 5; x++){
      xPos = map(x, 0, 4, width/2 - 0.8*tW, width/2 + 0.8*tW);
      yPos = map(y, 0, 5, height/6, height/6+1.98*tW);
      tiles.push(new Tile(x, y, xPos, yPos, 0.36*tW));
    }
  }
  
  targetWord = random(dictionary);

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  textSize(windowHeight/15);
  tW = (textWidth("WORDLE"));
  
  
    for (let i = 0; i < 30; i++){
      for (let x = 0; x < 5; x++){
        if (tiles[i].row == x){
          tiles[i].initX = map(x, 0, 4, width/2 - 0.8*tW, width/2 + 0.8*tW);
        }
      }
      for (let y = 0; y < 6; y++){
        if (tiles[i].col == y){
          tiles[i].y = map(y, 0, 5, height/6, height/6+1.98*tW);
        }
      }
      tiles[i].size = 0.36*tW;
    
  }
  
}

function draw() {
  background(30);
  
  
  //Heading
  fill(200);
  text("WORDY", width/2, height/20);
  stroke(100);
  line(width/2 - tW, height/12, width/2 + tW, height/12);
  
  
  //Grid
  for (let t in tiles){
    tiles[t].update();   
  }
  
  
  //Messages
  push();
  noStroke();
  textSize(height/40);
  
  if (displayMessage && timer < displayTime){
    fill(220);
    rect(width/2, 0.9*height, 0.8*tW, tW/3);
    fill(20); 
    text(message, width/2, 0.9*height);
    timer++;
  } else {
    displayMessage = false;
    timer = 0;
  }
  
  pop();
  
}

function keyPressed(){
  //Add letters
  if (keyCode >= 65 && keyCode <= 90 && currentCol < 5){
    tiles[currentRow*5+currentCol].letter = key.toUpperCase();
    currentCol += 1;
  }
  
  //Delete letters
  if (key == "Backspace" && currentCol > 0){
    tiles[currentRow*5+currentCol-1].letter = "";
    currentCol -= 1;
  }
  
  let currentWord = '';
  for (let i = 0; i < 5; i++){
    currentWord += tiles[currentRow*5+i].letter;
  }
  
  //Verify word
  if (key == "Enter"){
    //Insufficient letters
    if (currentCol < 5){
      for (let i = 0; i < 5; i++){
        tiles[currentRow*5+i].shake = true;
      }
      message = "Not enough letters";
      displayTime = 60;
      displayMessage = true;
      
    } else {
      //Accepted word
      
      let testTargetWord = targetWord;
      
        if (dictionary.includes(currentWord)){
          for (let i = 0; i < 5; i++){
            if (testTargetWord.includes(tiles[currentRow*5+i].letter)){
              if (targetWord.charAt(i) == tiles[currentRow*5+i].letter){
                tiles[currentRow*5+i].state = "perfect";
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              } else {
                tiles[currentRow*5+i].state = "match";
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              }
            } else {
              tiles[currentRow*5+i].state = "filled";
            }            
          }
          
          if (targetWord == currentWord){
            message = "YOU GOT IT!";
            displayTime = 400;
            displayMessage = true;
          } else if (currentRow == 5){
            message = targetWord;
            displayTime = Infinity;
            displayMessage = true; 
          }
          
          
          currentRow++;
          currentCol = 0;
          testTargetWord = targetWord;
          
          //Colour in tiles
        } else {
        //Unaccepted word
          for (let i = 0; i < 5; i++){
            tiles[currentRow*5+i].shake = true;
          }
          displayTime = 60;
          message = "Not in word list";
          displayMessage = true;
          
        }
      }
    }
   
}

class Tile{
  constructor(row, col, x, y, size){
    this.row = row;
    this.col = col;
    this.x = x;
    this.initX = x;
    this.y = y;
    this.size = size;
    this.state = "unfilled";
    this.letter = "";
    this.shake = false;
    this.counter = 0;
  }
  
  update(){
    //SHAKE
    if (this.shake && this.counter <= 90){
      this.x += sin(frameCount);
      this.counter+=2;
    } else {
      this.shake = false;
      this.x = this.initX;
      this.counter = 0;
    }
    
    if (this.state == "unfilled"){
      noFill();
      stroke(100);
    } else if (this.state == "filled"){
      stroke(60);
      fill(60);
    } else if (this.state == "match"){
      stroke(100, 170, 245);
      fill(100, 170, 245);
    } else if (this.state == "perfect"){
      stroke(224, 112, 31);
      fill(224, 112, 31);
    }
    
    square(this.x, this.y, this.size);
    
    fill(250);
    textStyle(BOLD);
    text(this.letter, this.x, this.y);
  }

}
