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
let currentLetters = [];

let dictionary;
let targetWord;


let keys = [["Q","W","E","R","T","Y","U","I","O","P"], ["","A","S","D","F","G","H","J","K","L",""],["ENTER","Z","X","C","V","B","N","M","DEL"]];

let keyboard = [];
let keyboardX = 0;
let keyboardY = 0;

let unit = 4.5;

let codes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
let codeBoard = [11, 25, 23, 13, 2, 14, 15, 16, 7, 17, 18, 19, 27, 26, 8, 9, 0, 3, 12, 4, 6, 24, 1, 22, 5, 20];

function preload(){
  dictionary = loadStrings("dictionary.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  unit = height/220;
  
  textSize(windowHeight/22);
  tW = (textWidth("WORDLE"));
  
  for (let y = 0; y < 6; y++){
    for (let x = 0; x < 5; x++){
      xPos = map(x, 0, 4, width/2 - 0.7*tW, width/2 + 0.7*tW);
      yPos = map(y, 0, 5, height/4, height/4+1.75*tW);
      tiles.push(new Tile(x, y, xPos, yPos, 0.32*tW));
    }
  }
  
  targetWord = random(dictionary);
  
  keyboardX = width/2 - unit*44.5;
  keyboardY = height - unit*50;

  let currentX = keyboardX;
  let keySize;
  
  let i = 0;
  
  for (let row in keys){
    currentX = keyboardX;
    for(let k in keys[row]){
      if (keys[row][k].length == 1){
        keySize = unit*8;
      } else if (keys[row][k].length < 1){
        keySize = unit*3.5;
      } else if (keys[row][k].length > 1){
        keySize = unit*12.5;
      }
      keyboard.push(new Key(row, k, currentX, keyboardY + row*unit*11.5, keySize, keys[row][k], 'unfilled'));
      currentX += keySize + unit;
      i++;
    }
  }
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  textSize(windowHeight/22);
  tW = (textWidth("WORDLE"));
  
  unit = height/220;
  
  
    for (let i = 0; i < 30; i++){
      for (let x = 0; x < 5; x++){
        if (tiles[i].row == x){
          tiles[i].initX = map(x, 0, 4, width/2 - 0.7*tW, width/2 + 0.7*tW);
        }
      }
      for (let y = 0; y < 6; y++){
        if (tiles[i].col == y){
          tiles[i].y = map(y, 0, 5, height/4, height/4+1.75*tW);
        }
      }
      tiles[i].size = 0.32*tW;
    
  }
  
  keyboardX = width/2 - unit*44.5;
  keyboardY = height - unit*50;

  let currentX = keyboardX;
  let keySize;
  
 let i = 0;
  
  for (let row in keys){
    currentX = keyboardX;
    for(let k in keys[row]){
      if (keys[row][k].length == 1){
        keySize = unit*8;
      } else if (keys[row][k].length < 1){
        keySize = unit*3.5;
      } else if (keys[row][k].length > 1){
        keySize = unit*12.5;
      }

      keyboard[i].x = currentX;
      keyboard[i].y = keyboardY + row*unit*11.5;
      keyboard[i].size = keySize;
      
      currentX += keySize + unit;
      i++;
    }
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
  textSize(height/70);
  
  if (displayMessage && timer < displayTime){
    fill(220, 220);
    rect(width/2, 0.42*height, 0.8*tW, tW/3);
    fill(20); 
    text(message, width/2, 0.42*height);
    timer++;
  } else {
    displayMessage = false;
    timer = 0;
  }
  
  pop();
  
  //Keyboard
  for (let k in keyboard){
    keyboard[k].update();
   // keyboard[k].hov();
  }

  //keyboard hover cursor change
  // if (mouseX > keyboardX &&
  //     mouseX < keyboardX + 89*unit &&
  //     mouseY > keyboardY &&
  //     mouseY < keyboardY + 34*unit){
  //       cursor(HAND);
  // } else {
  //       cursor(ARROW);
  // }
  
}

function keyPressed(){
  //Add letters
  if (keyCode >= 65 && keyCode <= 90 && currentCol < 5){
    tiles[currentRow*5+currentCol].letter = key.toUpperCase();
    currentLetters.push(codeBoard[keyCode-65]);
    currentCol += 1;
  }
  
  //Delete letters
  if (key == "Backspace" && currentCol > 0){
    tiles[currentRow*5+currentCol-1].letter = "";
    currentLetters.pop();
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
                keyboard[currentLetters[i]].state = "perfect";
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              } else {
                tiles[currentRow*5+i].state = "match";
                if(keyboard[currentLetters[i]].state != "perfect"){
                  keyboard[currentLetters[i]].state = "match";
                }
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              }
            } else {
              tiles[currentRow*5+i].state = "filled";
              if(keyboard[currentLetters[i]].state != "match" || 
                keyboard[currentLetters[i]].state != "perfect"){
                  keyboard[currentLetters[i]].state = "filled";
              }
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
          currentLetters = [];
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

var released = true;

function mouseReleased(){
	released = true;
	return false;
}

function mousePressed(){
	
	if(!released){
		return;
	}
	released = false;

  for (let k in keyboard){
    keyboard[k].hov();
    if (keyboard[k].hover){
      keyboard[k].hover = false;
      
      if (keyboard[k].char != "DEL" && keyboard[k].char != "ENTER" && currentCol < 5){
        tiles[currentRow*5+currentCol].letter = keyboard[k].char;
        currentLetters.push(k);
        currentCol += 1;
      }
      
      
      if (keyboard[k].char == "DEL" && currentCol > 0){
        tiles[currentRow*5+currentCol-1].letter = "";
        currentLetters.pop();
        currentCol -= 1;
      }
      

  let currentWord = '';
  for (let i = 0; i < 5; i++){
    currentWord += tiles[currentRow*5+i].letter;
  }
  
  // Verify word
  if (keyboard[k].char == "ENTER"){
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
                keyboard[currentLetters[i]].state = "perfect";
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              } else {
                tiles[currentRow*5+i].state = "match";
                if(keyboard[currentLetters[i]].state != "perfect"){
                  keyboard[currentLetters[i]].state = "match";
                }
                testTargetWord = testTargetWord.replace(tiles[currentRow*5+i].letter, '');
              }
            } else {
              tiles[currentRow*5+i].state = "filled";
              if(keyboard[currentLetters[i]].state != "match" || 
                keyboard[currentLetters[i]].state != "perfect"){
                  keyboard[currentLetters[i]].state = "filled";
              }
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
          currentLetters = [];
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
  }

  
  
}

class Key{
  constructor(row, col, x, y, size, char, state){
    this.row = row;
    this.col = col;
    this.x = x;
    this.y = y;
    this.size = size;
    this.char = char;
    this.state = state;
    this.hover = false;
  }
  
  hov(){
    if (mouseX > this.x &&
        mouseX < this.x + this.size &&
        mouseY > this.y &&
        mouseY < this.y + 10*unit){
      this.hover = true;
    }
    else {
      this.hover = false;
    }
  }
  
  update(){
    push();
    rectMode(CORNER);
    if(this.size != unit*3.5){
      noStroke();
    if (this.state == "unfilled"){
      fill(140);
    } else if (this.state == "filled"){
      fill(60);
    } else if (this.state == "match"){
      fill(100, 170, 245);
    } else if (this.state == "perfect"){
      fill(224, 112, 31);
    }
      
      rect(this.x, this.y, this.size, unit*10, unit/2);
      fill(230);
      textSize(height/75);
      text(this.char, this.x + this.size/2, this.y+unit*5);
    }
    pop();
  }
}
