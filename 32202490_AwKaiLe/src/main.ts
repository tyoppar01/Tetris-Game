/**
 * Inside this file you will use the classes and functions from rx.js
 * to add visuals to the svg element in index.html, animate them, and make them interactive.
 *
 * Study and complete the tasks in observable exercises first to get ideas.
 *
 * Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/
 *
 * You will be marked on your functional programming style
 * as well as the functionality that you implement.
 *
 * Document your code!
 */

import "./style.css";
import { fromEvent, interval, merge } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import { initialState, reduceState, MoveLeft, MoveRight, Fall, Keep } from "./state";
import { State, Key, Constants} from "./type"
import { updateView } from "./view";

/**
 * This is the function called on page load. Your main game loop
 * should be called here.
 */
export function main() {

  /** Observables */

  /** Determines the rate of time steps */
  //const tick$ = interval(Constants.TICK_RATE_MS).pipe(map(_ => new Fall()));
  // Hi, if you want to make changes to speed, do below this tick$ >.< thank you.
  const tick$ = interval(100).pipe(map(_ => new Fall()));

  const key$ = fromEvent<KeyboardEvent>(document, "keypress");

  const fromKey = (keyCode: Key) =>
    key$.pipe(filter(({ code }) => code === keyCode), 
    filter(({ repeat }) => !repeat),
    map(() => (keyCode)));

  const left$ = fromKey("KeyA").pipe(map(_ => new MoveLeft()));
  const right$ = fromKey("KeyD").pipe(map(_ => new MoveRight()));
  const keep$ = fromKey("KeyC").pipe(map(_ => new Keep()));
  //const up$ = fromKey("KeyW").pipe(map(_ => new Rotation()));

  /** Handle Observable */
  // 1. merge all into single stream
  // 2. pipe up and apply scan function to modify state
  // 3. initialState is starting state properties that is created
  // 4. subscribe the modified state to perform rendering
  const sources$ = merge(tick$, left$, right$, keep$).pipe(
    scan(reduceState, initialState)
  ).subscribe((input: State) => {

    if (input.gameOver){        // if game over
      sources$.unsubscribe();   // unsubscribe for further calling
    }
    updateView(input);          // update the view of game board shown
  })

  };  

// The following simply runs your main function on window load.  Make sure to leave it in place.
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
}
