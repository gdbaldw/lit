import {
  html,
  css,
  LitElement,
  customElement,
  property
} from "../web_modules/lit-element.js";

import { bottom, top, left, right } from "./borders.js";

type Board = (number | null)[]

@customElement("sudoku-board")
export default class extends LitElement {
  @property({ type: Array })
  puzzle: Board = Array(81).fill(null);

  @property({ type: Number })
  incorrect = -1;

  @property({ type: Array })
  solution: Board = Array(81).fill(null);

  @property({ type: Number })
  digit: number = 0;

  makepuzzle: (() => Board) | undefined;
  solvepuzzle: ((board: any) => any) | undefined;

  newpuzzle() {
    this.puzzle = this.makepuzzle!();
    this.solution = this.solvepuzzle!(this.puzzle)!;
    for (let v of this.puzzle) {
      if (v !== null) {
        this.digit = v;
        break;
      }
    }
    this.incorrect = -1;
  }

  firstUpdated() {
    import('../web_modules/sudoku.js').then(module => {
      this.makepuzzle = module.makepuzzle;
      this.solvepuzzle = module.solvepuzzle;
      this.newpuzzle();
    });
  }

  input(i: number) {
    this.incorrect = -1;
    if (this.digit === this.solution[i]) {
      this.puzzle[i] = this.digit;
      this.puzzle = [...this.puzzle];
      for (let i = 0; i < 9; i++) {
        if (this.puzzle.reduce((acc, cv) => cv === this.digit ? acc! + 1 : acc, 0)! < 9) { return; }
        this.digit = (this.digit + 1) % 9;
      }
      this.digit = -1;
    } else if (this.puzzle[i] !== null) {
      this.digit = this.puzzle[i]!
    } else {
      this.incorrect = i;
    }
  }
  
render() {
    return html`
      <h1>Sudoku</h1>
      <section ?completed=${this.digit === -1}>
        ${this.puzzle.map(
      (cv: any, i: number) =>
        html`
              <div
                value=${cv === null ? "" : cv + 1}
                ?highlight=${cv === this.digit}
                ?readonly=${this.puzzle[i] !== null}
                ?incorrect=${this.incorrect === i}
                ?bottom=${bottom[i]}
                ?top=${top[i]}
                ?left=${left[i]}
                ?right=${right[i]}
                @click=${this.input.bind(this,i)}
              >${cv === null ? "" : cv + 1}</div>
            `
    )}
      </section>
      <aside>
      ${[...Array(9).keys()].map((v) => html`<button digit 
         @click=${() => { this.digit = v; this.incorrect = -1 }}
        ?disabled=${this.puzzle.reduce((pv, cv) => (pv! + (cv === v ? 1 : 0)), 0) === 9} 
        ?highlight=${v === this.digit}
         >${v + 1}</button>`)}
      </aside>
      <button @click=${this.newpuzzle}>New Puzzle</button>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        text-align: center;
      }

      section {
        width: 27rem;
        margin: auto;
        display: grid;
        grid-template-columns: repeat(9, 3rem);
        grid-template-rows: repeat(9, 3rem);
        border: 5px solid black;
        border-radius: 5px;
        margin-bottom: 1rem;
      }

      section[completed] {
        border: 20px solid lightgreen;
        border-radius: 20px;
      }

      aside{
        width: 27rem;
        margin: auto;
        display: grid;
        grid-template-columns: repeat(9, 3rem);
        justify-content: space-evenly;
      }

      button {
        font-size: 1rem;
        border-radius: 10%;
      }
      
      button[digit] {
        font-size: 2rem;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        background-color: lightgray;
        margin-bottom: 1rem;
      }
      
      button[highlight] {
        background-color: gray;
        color: white;
      }

      div {
        line-height: 3rem;
        font-size: 2rem;
        text-align: center;
        border: 1px solid lightskyblue;
        cursor: default;
      }

      div[bottom] {
        border-bottom-color: black;
      }

      div[top] {
        border-top-color: black;
      }

      div[left] {
        border-left-color: black;
      }

      div[right] {
        border-right-color: black;
      }

      div[incorrect] {
        background-color: pink;
      }

      div[readonly] {
        background-color: lightgray;
      }

      div[highlight]{
        background: gray;
        color: white;
      }
    `;
  }
}
