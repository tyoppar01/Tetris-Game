/**
 * Consists of every type declaration 
 * Consists of majority constants that is exported
 */

export { Viewport, Constants, Block, tetroColor, tetros, GameBoard };
export type { TetroShape, TetroProperties, State, Action, Key, Event };

/** Types */
type Key = "KeyS" | "KeyA" | "KeyD" | "KeyC" | "KeyW";

type Event = "keydown" | "keyup" | "keypress";

/** A [[]] array that defines the tetromino block's shape */
type TetroShape = number[][];

/** Type TetroProperties that defines a particular tetromino block's properties */
type TetroProperties = Readonly<{
    shape: TetroShape;
    rotation: number;
    color: string;
    x: number;
    y: number;
  }>

/** Type state that defines it's attributes for state */
type State = Readonly<{
    gameOver: boolean;
    speed: number;
    tetroBoard: number[][]
    level: number;
    score: number;
    highscore: number;
    current: TetroProperties;
    next: TetroProperties;
    inventory: TetroProperties | undefined;
    reservable: boolean;
}>;

/** Constants */

/** Constant array of [[]] arrays that defines shape of tetromino */
const tetros: TetroShape[] = [
    [ // 2x2 block
      [1, 1],       
      [1, 1] 
    ]    
    ,
    [ // triangular block
      [0, 1, 0],       
      [1, 1, 0], 
      [0, 1, 0]
    ]  
    ,
    [ // Z block (left)
      [0, 0, 1],       
      [0, 1, 1], 
      [0, 1, 0]
    ]  
    ,
    [ // L block (right)
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]  
    ,
    [ // 1x4 block
      [0, 0, 1, 0],       
      [0, 0, 1, 0],      
      [0, 0, 1, 0],     
      [0, 0, 1, 0]     
    ]  
]; 

/** Constant array of strings that defines colours */
const tetroColor: string[] = ["black", "yellow", "purple", "blue"];


/** Interface Action that allow every action to follow structure to apply certain action onto the state */
interface Action {
    apply(s: State): State;
  }

/** Constant provided are listed below */
const Viewport = {
  CANVAS_WIDTH: 200,
  CANVAS_HEIGHT: 400,
  PREVIEW_WIDTH: 160,
  PREVIEW_HEIGHT: 80,
} as const;

const Constants = {
  TICK_RATE_MS: 500,
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
} as const;

const Block = {
  WIDTH: Viewport.CANVAS_WIDTH / Constants.GRID_WIDTH,
  HEIGHT: Viewport.CANVAS_HEIGHT / Constants.GRID_HEIGHT,
};

// starting board with 10 x 20 based on grid with and grid height for game board
const GameBoard: number[][] = [         
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]