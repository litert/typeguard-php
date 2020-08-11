/**
 * Copyright 2020 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as C from '@litert/typeguard';

class PHPLanguage
implements C.ILanguageBuilder {

    public switchCase(expr: string, cases: string[]): string {

        return `switch (${expr}) { ${cases.join('')} }`;
    }

    public caseIf(cond: string[], expr: string): string {

        return `${cond.map((x) => `case ${x}:`).join(' ')} { ${expr} break; }`;
    }

    public caseDefault(expr: string): string {

        return `default: { ${expr} break; }`;
    }

    public lowerCase(a: string): string {

        return `strtolower(${a})`;
    }

    public array(v: any[]): string {

        return JSON.stringify(v);
    }

    public arrayInSet(theArray: string, theSet: string): string {

        return `count(array_unique(${theArray})) === count(${theSet})`;
    }

    public instr(
        expr: string,
        match: string
    ): string {

        return `strpos(${expr}, ${match}) !== false`;
    }

    public call(fnName: string, ...args: string[]): string {

        return `${fnName}(${args.join(',')})`;
    }

    public startsWith(
        expr: string,
        match: string
    ): string {

        return `substr(${expr}, 0, strlen(${match})) === ${match}`;
    }

    public endsWith(
        expr: string,
        match: string
    ): string {

        return `substr(${expr}, -strlen(${match})) === ${match}`;
    }

    public varName(index: number | string): string {

        return `$v_${index}`;
    }

    private _dereplicate(conds: string[]): string[] {

        return Array.from(new Set(conds));
    }

    public ifElseOp(
        cond: string,
        a: string | number,
        b: string | number
    ): string {
        return `(${cond}) ? ${a} : ${b}`;
    }

    public or(conditions: string[]): string {

        if (conditions.length === 1) {

            return conditions[0];
        }

        if (conditions.includes('true')) {

            return 'true';
        }

        conditions = this._dereplicate(conditions.filter((x) => x !== 'false'));

        if (!conditions.length) {

            return 'true';
        }

        return `${conditions.map((x) => `(${x})`).join(' || ')}`;
    }

    public and(conditions: string[]): string {

        if (conditions.length === 1) {

            return conditions[0];
        }

        if (conditions.includes('false')) {

            return 'false';
        }

        conditions = this._dereplicate(conditions.filter((x) => x !== 'true'));

        if (!conditions.length) {

            return 'true';
        }

        return `${conditions.map((x) => `(${x})`).join(' && ')}`;
    }

    public eq(a: string, b: string | number): string {

        return `${a} === ${b}`;
    }

    public ne(a: string, b: string): string {

        return `${a} !== ${b}`;
    }

    public gt(a: string, b: string): string {

        return `${a} > ${b}`;
    }

    public gte(a: string, b: string): string {

        return `${a} >= ${b}`;
    }

    public lt(a: string, b: string): string {

        return `${a} < ${b}`;
    }

    public lte(a: string, b: string): string {

        return `${a} <= ${b}`;
    }

    public not(a: string): string {

        return `!(${a})`;
    }

    public literal(val: string | boolean | number): string {

        return JSON.stringify(val).replace(/\$/g, '\\$');
    }

    public modOf(a: string, b: string): string {

        return `${a} % ${b}`;
    }

    public matchRegExp(
        expr: string,
        regExp: string
    ): string {

        let m = /^\/(.+)\/([a-z]*)$/i.exec(regExp);

        if (m) {

            return `preg_match('/${m[1].replace(/(['"])/g, '\\$1')}/${m[2] || ''}', ${expr})`;
        }

        return `preg_match('/${regExp.replace(/(['"])/g, '\\$1')}', ${expr})`;
    }

    public isNull(vn: string, positive: boolean = true): string {

        return positive ? `!isset(${vn})` : `isset(${vn})`;
    }

    public isUndefined(vn: string, positive: boolean = true): string {

        return positive ? `!isset(${vn})` : `isset(${vn})`;
    }

    public isString(vn: string, positive: boolean = true): string {

        return positive ? `(isset(${vn}) && is_string(${vn}))` : `(!isset(${vn}) || !is_string(${vn}))`;
    }

    public isStrucutre(vn: string, positive: boolean = true): string {

        return positive ?
            `(isset(${vn}) && is_array(${vn}) && (array_keys(${vn}) !== range(0, count(${vn}) - 1)))` :
            `(!isset(${vn}) || !is_array(${vn}) || (array_keys(${vn}) === range(0, count(${vn}) - 1)))`;
    }

    public isInteger(vn: string, positive: boolean = true): string {

        return positive ? `(isset(${vn}) && is_int(${vn}))` : `(!isset(${vn}) || !is_int(${vn}))`;
    }

    public isNumber(vn: string, positive: boolean = true): string {

        return positive ?
            `isset(${vn}) && (is_int(${vn}) || is_float(${vn}))` :
            `!isset(${vn}) || (!is_int(${vn}) && !is_float(${vn})))`;
    }

    public isNumeric(vn: string, positive: boolean = true): string {

        return positive ? `(isset(${vn}) && is_numeric(${vn}))` : `(!isset(${vn}) || !is_numeric(${vn}))`;
    }

    public isArray(vn: string, positive: boolean = true): string {

        return positive ?
            `(isset(${vn}) && is_array(${vn}) && (array_keys(${vn}) === range(0, count(${vn}) - 1)))` :
            `(!isset(${vn}) || !is_array(${vn}) || (array_keys(${vn}) !== range(0, count(${vn}) - 1)))`;
    }

    public isBoolean(vn: string, positive: boolean = true): string {

        return positive ? `(isset(${vn}) && is_bool(${vn}))` : `(!isset(${vn}) || !is_bool(${vn}))`;
    }

    public arrayLength(vn: string): string {

        return `count(${vn})`;
    }

    public stringLength(vn: string): string {

        return `strlen(${vn})`;
    }

    public keys(vn: string): string {

        return `array_keys(${vn})`;
    }

    public forEach(
        an: string,
        it: string,
        body: string
    ): string {

        return `foreach (${an} as ${it}) {
            ${body}
        }`;
    }

    public series(statements: string[]): string {

        return statements.map((s) => s.endsWith(';') ? s : `${s};`).join('');
    }

    public ifThen(
        condition: string,
        ifBody: string,
        elseBody?: string
    ): string {

        if (elseBody) {

            return `if (${condition}) {
                ${ifBody}
            } else {
                ${elseBody}
            }`;
        }

        return `if (${condition}) { ${ifBody} }`;
    }

    public forIn(
        o: string,
        k: string,
        i: string,
        body: string
    ): string {

        return `foreach (array_keys(${o}) as ${k}) { const ${i} = ${o}[${k}]; ${body} }`;
    }

    public fieldIndex(
        o: string,
        k: string
    ): string {

        return `${o}[${k}]`;
    }

    public str2Int(expr: string): string {

        return `intval(${expr})`;
    }

    public str2Float(expr: string): string {

        return `floatval(${expr})`;
    }

    public str2Bool(expr: string): string {

        return `(${expr} === "true" ? true : (${expr} === "false" ? false : null))`;
    }

    public arraySlice(
        arrayName: string,
        start: string | number,
        end?: string | number
    ): string {

        if (end !== undefined) {

            return `array_slice(${arrayName}, ${start}, ${end} - ${start})`;
        }

        return `array_slice(${arrayName}, ${start})`;
    }

    public arrayIndex(
        a: string,
        i: string | number
    ): string {

        return `${a}[${i}]`;
    }

    public get literalFalse(): string {

        return 'false';
    }

    public get literalTrue(): string {

        return 'true';
    }

    public get maxSafeInteger(): string {

        return '0x7FFFFFFFFFFFFFFF';
    }

    public get minSafeInteger(): string {

        return '(-0x7FFFFFFFFFFFFFFF - 1)';
    }

    public isTrueValue(vn: string): string {

        return `!!${vn}`;
    }

    public isFalseValue(vn: string): string {

        return `!${vn}`;
    }

    public returnValue(vn: string): string {

        return `return ${vn};`;
    }

    public closure(
        params: string[],
        args: string[],
        body: string
    ): string {

        return `(function(${params.join(', ')}) {
            ${body}
        })(${
            args.join(', ')
        })`;
    }
}

/**
 * Create a language builder object for PHP.
 */
export function createPHPLanguageBuilder(): C.ILanguageBuilder {

    return new PHPLanguage();
}
