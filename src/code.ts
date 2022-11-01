import vscode = require('vscode');
import { findContent } from './find';

export type CodeCtx = {
    editor: vscode.TextEditor,
    line: number,
    content: string,
};


export function genComment(ctx: CodeCtx) {
    let lines = ctx.content.split("\n");

    // current line
    let currentLineCtx = lines[ctx.line];

    // If the current row satisfies
    let currentRow = findContent(currentLineCtx);


    if (currentRow !== null) {
        // Get the previous line
        let previousLine = lines[ctx.line - 1];
        replaceCtx(ctx, {
            annotation: true,
            currentLine: ctx.line,
            currentLineCtx: currentLineCtx,
            previous: previousLine,
            comment: currentRow
        });
        return;
    }

    // 需要考虑用户是采用的当前行 所以不需要考虑下一行
    let nextLineContent = lines[ctx.line + 1];

    if (RegExp("^\\s*$").test(nextLineContent)) {
        return;
    }

    // Try to determine which type it belongs to
    let res = findContent(nextLineContent);
    if (res !== null) {
        replaceCtx(ctx, {
            annotation: false,
            currentLine: ctx.line,
            currentLineCtx: currentLineCtx,
            previous: nextLineContent,
            comment: res
        });
        return;
    }

}


type input = {
    annotation: boolean,
    currentLine: number,
    currentLineCtx: string,
    previous: string,
    comment: string
};


function replaceCtx(ctx: CodeCtx, input: input) {
    if (RegExp(".*\\*/\\s*$").test(input.previous)) {
        return;
    }

    if (RegExp("^\\s*//.*").test(input.previous)) {
        return;
    }

    let val = new vscode.SnippetString;
    if (input.annotation) {
        val = new vscode.SnippetString("\n" + input.comment);
        ctx.editor.insertSnippet(val, new vscode.Position(input.currentLine - 1, input.currentLineCtx.length));
    } else {
        val = new vscode.SnippetString(input.comment);
        ctx.editor.insertSnippet(val, new vscode.Position(input.currentLine, input.previous.length));
    }
    return;
}

