/**
 * Collection of functions that deal with Tetris Blocks and TetroBoard
 * Several classes such as Action classes and a board class that specifically settle on board
 */
export { initialState, createTetromino, reduceState, randomColor, Fall, MoveLeft, MoveRight, Keep}
import { State, tetros, Constants, TetroShape, tetroColor, Action, GameBoard } from "./type"
import { randomNumber } from "./utils";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Initialise Object Tetro Block
 * @returns random tetromino shape retrieved from TetroShape Array
 */
function createTetromino(i: number = 0): TetroShape {
    // console.log(randomNumber(input));
    // return tetros[randomNumber(input)]
    //randomNumber();
    return tetros[randomNumber(i)];
    //return tetros[Math.floor(Math.random() * tetros.length)];     
}

/**
 * Initialise a random colour
 * @param val length of array (based on tetro shape)
 * @returns specific colours
 */
const randomColor = (size: number): string => {
    switch (size){
      case 2:
        return tetroColor[1];
      case 3:
        return tetroColor[2];
      case 4:
        return tetroColor[3];
    }
    return "black";
  }

/**
   * Update the level board
   * @param s input state
   * @param initial integer of initial level value
   * @returns level value
   */
const levelUpdater = (s: State, initial: number = 0): number => {
    initial = s.level;
    // restriction to ensure level 5 is maximum and update level based on score
    if (s.score >= initial * 5 && initial < 5) return initial + 1;  // every 5 score is 1 level up
    return initial;
}
  
/**
 * Update the score board
 * @param s input state
 * @param initial integer of initial score value
 * @returns score integer
 */
const scoreUpdater = (s: State, initial: number = 0): number => {
    initial = s.score;
    const result: number[] = Board.validateBoard(Board.updateBoard(s)) as unknown as number[];     // did not detect it!
    for (let i = 0; i < result.length; i++) initial += result[i];
    return initial;
}

/**
 * Update high scoring result
 * @param s input state
 * @returns integer value of high score
 */
const highScoreUpdater = (s: State): number => {
    if (s.score > s.highscore) return s.score;
    return s.highscore
}

/**
 * Class Board that performs actions to edit or manage the board properties
 */
class Board {

/**
 * Update the board after an action is done to cause the block to move
 * @param s State
 * @returns updated board from State
 */
static updateBoard = (s: State): number[][] => {

    const board = s.tetroBoard;
    for (let i = 0; i < s.current.shape.length; i++) {
        for (let j = 0; j < s.current.shape[i].length; j++) {
            if (s.current.shape[i][j] === 1){
                board[s.current.x+i][s.current.y+j] = 1;
            }
        }
    }
    return board;
}

/**
 * Validate the board by checking which row is fully filled
 * @param board [[]] of width x height array
 * @returns array of number that determine which row is fully filled
 */
static validateBoard = (board: number[][]): number[] => {

    // initialise an empty array of size height (number of rows)
    let arr: number[] = [];
    for (let i = 0; i < board[0].length; i++) arr.push(1);

    // check rows and columns
    for (let j = 0; j < board[0].length; j++){
        for (let i = 0; i < board.length; i++){
            if (board[i][j] === 0) arr[j] = 0;
        }
    }
    return arr;
} 

/**
 * Modify the board by removing a complete row (x constant, y varies) is built
 * @param board [[]] of width x height array
 * @returns modified board of [[]] array
 */
static modifyBoard = (board: number[][]): number[][] => {

    const shortList: number[] = Board.validateBoard(board) as unknown as number[];         // call function to validate row with completed block filled
    for (let i = 0; i < shortList.length; i++){
        if (shortList[i] === 1){                    // it is fully filled at this row
            board = this.adjustBoard(board)(i)           // call function to adjust board by moving down to fill up removed row
        }
    }
    return board;
}

/**
 * Adjust the board by moving down every block from above rows
 * @param board [[]] of width x height array
 * @returns adjusted board of [[]] array
 */
static adjustBoard = (board: number[][]) => (row: number): number[][] => {

    const tempBoard = board;    // Hard copy of board
    
    // Move every block above row down by one!!!
    for (let i = 0; i < board.length; i++){
        for (let j = row; j > 0; j--){
            if (!(j === 0)) board[i][j] = tempBoard[i][j-1];
        }
    }
    return board;
}
}

/**
 * A standard initial State that how the game will start off with
 */
const initialState: State = {

    gameOver: false,
    speed: 6,
    tetroBoard: GameBoard,
    level: 1,
    score: 0,
    highscore: 0,
    current:  {shape: createTetromino(), rotation: 1, color: "", x: 0, y: 0},
    next:     {shape: createTetromino(1), rotation: 1, color: "", x: 0, y: 0},
    inventory: undefined,
    reservable: true
  }

/**
 * Class MoveLeft helps to move current tetromino block to left side if is applicable and follow rules
 */
class MoveLeft implements Action {
    constructor() { }

    /**
     * Apply function that implements from Action interface
     * @param s state
     * @returns updated state
     */
    apply = (s: State): State => {

        return MoveLeft.handleMove({
            ...s,
            gameOver: false,
            speed: s.speed,
            tetroBoard: s.tetroBoard,
            level: s.level,
            score: s.score,
            highscore: s.highscore,
            current: s.current,
            next: s.next
        })
    }

    /**
     * handleMovement by validating move left 
     * no obstacle on left hand side of current block
     * @param s state
     * @returns updated state depending on conditions (remain or moved left)
     */
    static handleMove = (s: State): State => {

        const xPoint: number = s.current.x;
        const yPoint: number = s.current.y;
        const body: number[][] = s.current.shape;
        const board: number[][] = s.tetroBoard;

        // Loop through the tetromino's shape
        for (let i = 0; i < body.length; i++) {
            for (let j = 0; j < body[i].length; j++) {

                // Identify if current has a block at this position based on shape
                if (body[i][j] === 1){
                    const positionX = xPoint + i - 1;      // a block on it's left
                    const positionY = yPoint + j;          // y coordinate

                    if (positionX === -1 || board[positionX][positionY] === 1){
                        return {
                            ...s,
                            // no updated attribute of state
                        }
                    }
                }
            }
        }
        return {
            ...s,
            current: {shape: body, rotation: 1, color: s.current.color, x: xPoint - 1, y: yPoint}
            // update current position by moving left by 1
        }
    }
}

/**
 * Class MoveRight helps to move current tetromino block to right side if is applicable and follow rules
 */
class MoveRight implements Action {
    constructor() { }

    /**
     * Apply function that implements from Action interface
     * @param s state
     * @returns updated state
     */
    apply = (s: State): State => {

        return MoveRight.handleMove({
            ...s,
            gameOver: false,
            speed: s.speed,
            tetroBoard: s.tetroBoard,
            level: s.level,
            score: s.score,
            highscore: s.highscore,
            current: s.current,
            next: s.next
        })
    }

    /**
     * handleMovement by validating move right
     * no obstacle on right hand side of current block
     * @param s state
     * @returns updated state depending on conditions (remain or moved right)
     */
    static handleMove = (s: State): State => {

        const xPoint: number = s.current.x;
        const yPoint: number = s.current.y;
        const body: number[][] = s.current.shape;
        const board: number[][] = s.tetroBoard;

        // Loop through the tetromino's shape
        for (let i = 0; i < body.length; i++) {
            for (let j = 0; j < body[i].length; j++) {

                // Identify if current has a block at this position based on shape
                if (body[i][j] === 1){
                    const positionX = xPoint + i + 1;      // a block on it's right
                    const positionY = yPoint + j;          // y coordinate

                    if (positionX === 10 || board[positionX][positionY] === 1){
                        return {
                            ...s,
                            // no updated attribute of state
                        }
                    }
                }
            }
        }
        return {
            ...s,
            current: {shape: body, rotation: 1, color: s.current.color, x: xPoint + 1, y: yPoint}
            // update current position by moving left by 1
        }
    }
}

/**
 * Class Fall helps to move current tetromino block to down (increment in y coordinate)
 */
class Fall implements Action {
    constructor() { }

    /**
     * Apply function that implements from Action interface
     * @param s state
     * @returns updated state
     */
    apply = (s: State): State => {

        return Fall.handleFall({
            ...s,
            gameOver: false,
            speed: s.speed,
            tetroBoard: s.tetroBoard,
            level: s.level,
            score: s.score,
            highscore: s.highscore,
            current: s.current,
            next: s.next,
            inventory: s.inventory,
            reservable: s.reservable
        })
    }

    /**
     * handleFall by validating moving downwards
     * @param s input
     * @returns updated state depending on conditions
     */
    static handleFall = (s: State): State => {

        // special handler that helps change tick speed based on level
        if (s.level <= s.speed) return {
                ...s,
                speed: s.speed - 1
            }

        const xPoint: number = s.current.x;
        const yPoint: number = s.current.y;
        const body: number[][] = s.current.shape;
        const board: number[][] = s.tetroBoard;

        // Loop through the tetromino's shape
        for (let i = 0; i < body.length; i++) {
            for (let j = 0; j < body[i].length; j++) {

                // Identify if current has a block at this position based on shape
                if (body[i][j] === 1){
                    const positionX = xPoint + i;      // x coordinate
                    const positionY = yPoint + j + 1;  // a block below it

                    // GAME OVER AS IT TOUCHES THE TOP OF
                    if (board[0][0] === 1){ 
                        return {
                            ...s,
                            gameOver: true,
                            score: s.score,
                            highscore: highScoreUpdater(s),
                        }
                    }

                    // Use new tetromino block as it reaches conditions listed below:
                    // 1. hit boundary of y (y = 20)
                    // 2. hit a block at a y-coordinate below it
                    if (positionY >= 20 || board[positionX][positionY] === 1){
                        return {
                            ...s,
                            speed: 6 - s.level,
                            level: levelUpdater(s),
                            score: scoreUpdater(s),
                            highscore: highScoreUpdater(s),
                            tetroBoard: Board.modifyBoard(Board.updateBoard(s)),
                            gameOver: false,
                            current: s.next,            // use next block (shown in preview)
                            next:                       // initialise new tetromino block
                            {
                                shape: createTetromino(),
                                rotation: 1, 
                                color: "",
                                x: 0,
                                y: 0
                            },
                            inventory: s.inventory,
                            reservable: true            // allow to reserve block after a block placed  
                        }
                    }
                }
            }
        }
        return {
            ...s,
            level: levelUpdater(s),
            speed: 6 - s.level,
            current: {shape: body, rotation: 1, color: s.current.color, x: xPoint, y: yPoint + 1}, 
            highscore: highScoreUpdater(s)
            // update current position by moving down by 1 (increment y point)
            }
    }
}

/**
 * Class Keep helps to reserve current tetromino block
 */
class Keep implements Action {
    constructor() { }

    /**
     * Apply function that implements from Action interface
     * @param s state
     * @returns updated state
     */
    apply = (s: State): State => {
        return Keep.handleKeep({
            ...s,
            gameOver: false,
            speed: s.speed,
            tetroBoard: s.tetroBoard, //updateBoard(s.tetroBoard),
            level: s.level,
            score: s.score,
            highscore: s.highscore,
            current: s.current,
            next: s.next,
            inventory: s.inventory,
            reservable: s.reservable
        })
    }

    /**
     * handleKeep by validating it's reservable properties is true
     * @param s input
     * @returns updated state depending on conditions
     */
    static handleKeep = (s: State): State => {

        // if inventory is empty 
        // result: store current block and use next block
        if (s.inventory === undefined){
            return {
                ...s,
                current: s.next,
                next:                       // use next tetromino block to use as current
                {
                    shape: createTetromino(),
                    rotation: 1, 
                    color: "",
                    x: 0,
                    y: 0
                },
                inventory:                  // store current block to inventory
                {
                    shape: s.current.shape,
                    rotation: 1, 
                    color: "",
                    x: 0,
                    y: 0
                },
                reservable: false,          // ensure reservable not applicable until next block placement
            }
        }

        // if can be reserved in inventory
        // result: store current block and use inventory block
        else if (s.reservable){

            return {
                ...s,
                current: 
                {
                    shape: s.inventory.shape,
                    rotation: 1, 
                    color: "",
                    x: 0,
                    y: 0
                },
                next: s.next,
                inventory: 
                {
                    shape: s.current.shape, 
                    rotation: s.current.rotation, 
                    color: "",
                    x: 0,
                    y: 0
                },
                reservable: false,
            }
        }

        // if no condition above is succcessfully achieved
        // not applicable to store current block
        // return original state
        return {
            ...s,
            }
    }
}

/**
 * Reduce State that allow an Action interface to apply a specific function onto state
 * @param s         state
 * @param action    action that is desired to apply
 * @returns         applied function onto state
 */
const reduceState = (s: State, action: Action) => action.apply(s);



