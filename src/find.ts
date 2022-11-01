type FindTool = {
    name: string,
    regex: string,
    comment: string[],
};


const findMap: FindTool[] = [
    {
        name: "findrpc",
        regex: "(rpc)(\\s+)([A-Za-z_][A-Za-z0-9_.]*)",
        comment: [
            "/**",
            "\t@path: api path",
            "\t@desc: rpc desc",
            "\t@method: get/post",
            "\t@version: v1",
            "*/"
        ]
    },
    {
        name: "findmsg",
        regex: "^\\s*message\\s*(\\w+)\\s*\\{",
        comment: ["// @desc: Message Description"]
    },
    {
        name: "findsvr",
        regex: "^\\s*service\\s*(\\w+)\\s*\\{",
        comment: ["// @desc: Service Description"]
    },
    {
        name: "findenum",
        regex: "(enum)(\\s+)([A-Za-z_][A-Za-z0-9_.]*)(\\s*)(\\{)?",
        comment: ["// @desc: Enum Description"]
    },
    {
        name: "findField",
        regex: "\\s*(optional|repeated|required)?\\s*\\b([\\w.]+)\\s+(\\w+)\\s*(=)\\s*(0[xX][0-9a-fA-F]+|[0-9]+)",
        comment: [
            "/**",
            "\t@desc: FieldName Description",
            "\t@required: true",
            "*/"
        ]
    },
    {
        name: "findEnumField",
        regex: "([A-Za-z][A-Za-z0-9_]*)\\s*(=)\\s*(0[xX][0-9a-fA-F]+|[0-9]+)",
        comment: ["// @desc: FieldName Description"]
    }
];


export function findContent(content: string): string | null {
    for (let index = 0; index < findMap.length; index++) {
        const element = findMap[index];
        let msg = RegExp(element.regex).test(content);
        if (msg) {
            return element.comment.join("\n");
        }
    }
    return null;
}