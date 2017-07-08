declare function re(tag: TemplateStringsArray, ...subs: any[]): RegExp;
declare function re(flags: string, escape?: boolean): (tag: TemplateStringsArray, ...subs: any[]) => RegExp;

declare namespace re {
    export function line(tag: TemplateStringsArray, ...subs: any[]): RegExp;
    export function line(flags: string, escape?: boolean): (tag: TemplateStringsArray, ...subs: any[]) => RegExp;

    export function create(raw: string[], subs: any[], opts?: {
        flags?: string,
        escape?: boolean,
        multiline?: boolean
    }): RegExp;

    export function escape(tag: TemplateStringsArray, ...subs: any[]): string;
    export function escape(string: string): string;

    export function ignore(tag: TemplateStringsArray, ...subs: any[]): String;
    export function ignore(string: string): String;

    export function isTemplateTag(item: any): boolean;

    export var specialEscapeRegex: RegExp;
    export var RegExp: RegExpConstructor;
}

export = re;
