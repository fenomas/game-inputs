export class GameInputs {
    /**
     *   Simple inputs manager to abstract key/mouse inputs.
     *
     * @param {HTMLElement} domElement
     * @param {DefaultOptions} options
    */
    constructor(domElement: HTMLElement, options: DefaultOptions);
    version: string;
    /** The HTMLElement that `inputs` is bound to. */
    element: Document | HTMLElement;
    /** When true, all key events with bindings will call `preventDefaults`. */
    preventDefaults: boolean;
    /** When true, all key events with bindings will call `stopPropagation`. */
    stopPropagation: boolean;
    /** When this is false, the context menu will be prevented from opening if there is a binding to the right mouse button. */
    allowContextMenu: boolean;
    /** When disabled, no binding events will fire. */
    disabled: boolean;
    /**
     * Optional filter function. Useful if you want to, e.g.,
     * ignore a key binding if ctrl/alt are pressed, but allow that
     * same binding if it originated from a mouse event.
     * @param {KeyboardEvent & MouseEvent} ev
     * @param {string} bindingName
    */
    filterEvents: (ev: KeyboardEvent & MouseEvent, bindingName: string) => boolean;
    /**
     * Event emitter for binding **press** events.
     * The original mouse or key event will be passed as an argument.
    */
    down: any;
    /**
     * Event emitter for binding **release** events.
     * The original mouse or key event will be passed as an argument.
     */
    up: any;
    /**
     * The boolean state of whether each binding is currently pressed.
     *
     * `inputs.state['move-left'] // true if a bound key is pressed`
     * @type {{ [key:string]: boolean }}
    */
    state: {
        [key: string]: boolean;
    };
    /**
     * Numeric counters representing accumulated pointer/scroll inputs
     * since the last time `tick` was called.
    */
    pointerState: {
        dx: number;
        dy: number;
        scrollx: number;
        scrolly: number;
        scrollz: number;
    };
    /**
     * How many times each binding has been **pressed**
     * since the last time `tick` was called.
     * @type {{ [key:string]: number }}
    */
    pressCount: {
        [key: string]: number;
    };
    /**
     * How many times each binding has been **released**
     * since the last time `tick` was called.
     * @type {{ [key:string]: number }}
    */
    releaseCount: {
        [key: string]: number;
    };
    /** @private @type {{ [key:string]: string[] }}   code -> [...binding names] */
    private _keyBindmap;
    /** @private @type {{ [key:string]: boolean }} code -> isDown */
    private _keyStates;
    /** @private @type {{ [key:string]: number }}  bindingName -> currCt */
    private _bindPressCount;
    /** @private */
    private _touches;
    /**
     * Binds one or more physical keys to an arbitrary binding name.
     * Key strings should align to `KeyboardEvent.code` strings -
     * e.g. `KeyA`, `ArrowDown`, etc.
     *
     * `inputs.bind('move-player-left', 'KeyW', 'ArrowLeft')
     *
     * @param {string} bindingName
     * @param {...string} keys
     */
    bind(bindingName: string, ...keys: string[]): void;
    /**
     * Removes all key bindings for a given binding name.
     *
     * `inputs.unbind('move-player-left')
     */
    unbind(bindingName: any): void;
    /**
     * Returns a copy of all existing bindings, in the format:
     * ```js
     *   {
     *      bindingName: [ keyCode1, keyCode2, ... ]
     *      ...
     *   }
     * ```
     */
    getBindings(): {};
    /**
     * Tick function - clears out all cumulative counters
    */
    tick(): void;
}
declare function DefaultOptions(): void;
declare class DefaultOptions {
    preventDefaults: boolean;
    stopPropagation: boolean;
    allowContextMenu: boolean;
    disabled: boolean;
}
export {};
