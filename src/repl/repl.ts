import * as readline from "readline";
import { Lexer } from "../lexer/lexer";
import { Token, TokenKind } from "../token/token";
import { Parser } from "../parser/parser";
import { evaluate } from "../evaluator/evaluator";
import { Environment } from "../environment/environment";

const monkeyFace = `            __,__
   .--.  .-"     "-.  .--.
  / .. \/  .-. .-.  \/ .. \
 | |  '|  /   Y   \  |'  | |
 | \   \  \ 0 | 0 /  /   / |
  \ '- ,\.-"""""""-./, -' /
   ''-' /_   ^ ^   _\ '-''
       |  \._   _./  |
       \   \ '~' /   /
        '._ '-=-' _.'
           '-----'
`;

export function start(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt(">> ");
  rl.prompt();

  rl.on("line", (input: string) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (parser.errs.length != 0) {
      printParseErrors(process.stdout, parser.errs);
      // } else {
      // process.stdout.write(program?.string() + "\n");
    }

    const env = new Environment();
    const evaluated = evaluate(env, program);
    if (evaluated !== undefined) {
      process.stdout.write(evaluated.inspect() + "\n");
    }

    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

function printParseErrors(out: NodeJS.WriteStream, errs: string[]): void {
  out.write(monkeyFace);
  out.write("Woops! We ran into some monkey business here!\n");
  errs.forEach((msg) => {
    out.write("\t" + msg + "\n");
  });
}
