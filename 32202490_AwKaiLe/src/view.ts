/**
 * View File that responsible to output the view on SVG and Preview onto HTML
 * Show changes to user on webpage
 * It is responsible to show score, high score, and level that is updated.
 * It is responsible to update preview element (showing next Tetris Block)
 * It is responsible to update TetroBoard (print placed block, and current block)
 */
export { updateView, render, show, hide, createSvgElement }
import { State, Viewport, Block, Constants } from "./type";
import { randomColor } from "./state";

/**
 * Displays a SVG element on the canvas. Brings to foreground.
 * @param elem SVG element to display
 */
const show = (elem: SVGGraphicsElement) => {
    elem.setAttribute("visibility", "visible");
    elem.parentNode!.appendChild(elem);
  };
  
/**
* Hides a SVG element on the canvas.
* @param elem SVG element to hide
*/
const hide = (elem: SVGGraphicsElement) =>
    elem.setAttribute("visibility", "hidden");
  
/**
* Creates an SVG element with the given properties.
*
* See https://developer.mozilla.org/en-US/docs/Web/SVG/Element for valid
* element names and properties.
*
* @param namespace Namespace of the SVG element
* @param name SVGElement name
* @param props Properties to set on the SVG element
* @returns SVG element
*/
const createSvgElement = (
    namespace: string | null,
    name: string,
    props: Record<string, string> = {}
  ) => {
    const elem = document.createElementNS(namespace, name) as SVGElement;
    Object.entries(props).forEach(([k, v]) => elem.setAttribute(k, v));
    return elem;
  };

// Canvas elements
const svg = document.querySelector("#svgCanvas") as SVGGraphicsElement & HTMLElement;
const preview = document.querySelector("#svgPreview") as SVGGraphicsElement & HTMLElement;
const gameover = document.querySelector("#gameOver") as SVGGraphicsElement & HTMLElement;
const container = document.querySelector("#main") as HTMLElement;

svg.setAttribute("height", `${Viewport.CANVAS_HEIGHT}`);
svg.setAttribute("width", `${Viewport.CANVAS_WIDTH}`);
preview.setAttribute("height", `${Viewport.PREVIEW_HEIGHT}`);
preview.setAttribute("width", `${Viewport.PREVIEW_WIDTH}`);

// Text fields
const levelText = document.querySelector("#levelText") as HTMLElement;
const scoreText = document.querySelector("#scoreText") as HTMLElement;
const highScoreText = document.querySelector("#highScoreText") as HTMLElement;

/**
* Renders the current state to the canvas.
*
* In MVC terms, this updates the View using the Model.
*
* @param s Current state
*/
const render = (s: State): void => {

    // update score and level and high score
    highScoreText.innerHTML = "" + s.highscore;
    scoreText.innerHTML = "" + s.score;
    levelText.innerHTML = "" + s.level;

    // check if it is game over
    if (s.gameOver){
        svg.append(gameover);
        show(gameover);
        return ;
    }

    // REMOVE ENTIRELY (SMOOTHEN CURRENT BLOCK MOTION to ensure only latest current block is shown)
    const svgChildNode = Array.from(svg.childNodes);
    for (const elem of svgChildNode) svg.removeChild(elem);

    // PRINTING CURRENT BLOCK 
    for (let i = 0; i < s.current.shape.length; i++) {
        for (let j = 0; j < s.current.shape[i].length; j++) {
            const position = s.current.shape[i][j];
    
            if (position === 1) { // has a block at this position
            
            const svgTetro = createSvgElement(svg.namespaceURI, "rect", {
              height: `${Block.HEIGHT}`,
              width: `${Block.WIDTH}`,
              x: ""+ (s.current.x + i) * Block.WIDTH, 
              y: ""+ (s.current.y + j)  * Block.HEIGHT, 
              style: "fill: " + randomColor(s.current.shape.length), 
            });

            svg.appendChild(svgTetro);      // current tetromino block is shown
            }
        }
    }
    
    // PRINTING GAME BOARD (INCLUDED PREVIOUS BLOCK ADDED)
    for (let i = 0; i < s.tetroBoard.length; i++){
        for (let j = 0; j < s.tetroBoard[i].length; j++){
    
          if (s.tetroBoard[i][j] === 1){
            const svgPosition = createSvgElement(svg.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: ""+ i * Block.WIDTH, 
            y: ""+ j * Block.HEIGHT, 
            style: "fill: grey", 
            });

            svg.appendChild(svgPosition);
          }
        }
      }
    
    // REMOVE ENTIRELY (always show latest next tetromino block)
    const previewChildNode = Array.from(preview.childNodes);
    for (const elem of previewChildNode) preview.removeChild(elem);
    
    // PRINTING PREVIEW (NEXT) BLOCK
    for (let i = 0; i < s.next.shape.length; i++) {
    for (let j = 0; j < s.next.shape[i].length; j++) {
        const position = s.next.shape[i][j];
        if (position === 1) { // has a block at this position
            const previewTetro = createSvgElement(svg.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: `${(s.next.x + i + 1) * Block.WIDTH}`, 
            y: `${(s.next.y + j + 1) * Block.HEIGHT}`, 
            style: "fill: " + randomColor(s.next.shape.length), 
            });

            preview.appendChild(previewTetro);
          }
        }
    }
};

/**
 * Function that update the view of game board
 * @param s input state
 */
function updateView(s: State): void {
    render(s);
}