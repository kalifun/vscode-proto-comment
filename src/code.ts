import { stringify } from 'querystring';
import vscode = require('vscode');

export type CodeCtx = {
    editor: vscode.TextEditor,
    line: number,
    content: string,

};


export function genComment(ctx: CodeCtx) {
    let lines = ctx.content.split("\n");

    let nextLineContent = lines[ctx.line + 1];

    if (RegExp("^\\s*$").test(nextLineContent)) {
        return;
    }

    // Try to determine which type it belongs to
    let res = findMessage(nextLineContent);
    if (res !== null) {
        let len = res.length;
        ctx.editor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(
                new vscode.Position(ctx.line, 0),
                new vscode.Position(ctx.line, len)), String(res));
        });

        return;
    }

}


export function getLineEndOffset(lines: string[], line: number): number {
    let offset = 0;

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index];
        offset += element.length + 1;
        if (index >= line) {
            return offset;
        }
    }
    return offset;
}



export function getLineStartOffset(lines: string[], line: number): number {
    let offset = 0;

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index];
        if (index >= line) {
            return offset;
        }

        offset += element.length + 1;

    }

    return offset;
}



function findMessage(content: string): string | null {
    const msgRegex = RegExp("^\\s*message\\s*(\\w+)\\s*\\{");
    const mgsComment = "// @desc: Message Description";
    let msg = msgRegex.test(content);
    if (msg) {
        return mgsComment;
    }
    return null;
}