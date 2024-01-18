/**
 * A class that is retrieved from tutorial exercise to perform out the random
 * number generator. However, slight modification is done to imporve and ideally
 * suits Tetris Battle as it returns a number between 0 and 4.
 */

export { RNG, getMilliseconds, randomNumber };
import { tetros } from "./type";

abstract class RNG {
    
    // LCG using GCC's constants
    private static m = 0x80000000; // 2**31
    private static a = 1103515245;
    private static c = 12345;

    /**
     * Call `hash` repeatedly to generate the sequence of hashes.
     * @param seed 
     * @returns a hash of the seed
     */
    public static hash = (seed: number) => (RNG.a * seed + RNG.c) % RNG.m;

    /**
     * Takes hash value and scales it to the range [0, 4]
     * As we have 5 types of tetromino blocks!!!
     */
    public static scale = (hash: number) => Math.floor((hash / RNG.m) * tetros.length);
}

/**
 * get Date() based on Milliseconds (vary over time)
 * @returns a number based on Date()
 */
function getMilliseconds(): number {
    return new Date().getMilliseconds();
  }

/**
 * Generate random number based on scales
 * @param input 
 * @returns integer number to pick a tetris block in tetros
 */
const randomNumber = (input: number = 0) => {
    const hashedNumber: number = RNG.hash(getMilliseconds() + input);
    //console.log("hash: " + hashedNumber)
    const scaledNumber: number = RNG.scale(hashedNumber);
    //console.log("scale: " + scaledNumber);
    return scaledNumber;
}