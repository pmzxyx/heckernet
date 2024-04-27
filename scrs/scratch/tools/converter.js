(function (window) {
            let ScratchExtensionConverter = {};
            ScratchExtensionConverter.Blocks = {};
            ScratchExtensionConverter.Functions = {};
            function regexMatchArr(string, regex) {
                let r = [...string.matchAll(regex)];
                let res = [];
                r.forEach((k) => {
                    res.push(k.toString());
                });
                return res;
            };
            const getComposedRegex = (...regexes) => new RegExp(regexes.map(regex => regex.source).join("|"))
            function regexIndexes(string, regex) {
                let indexes = [];
                let match = string.match(regex);
                while ((match = regex.exec(string)) != null) {
                    indexes.push(match.index);
                    let match = string.match(regex);
                };
                return indexes;
            }
            function sortR(string, regexList) {
                let kl = [];
                regexList.forEach((regexp, i) => {




                })
            }
            /**
             * Converts scratch 3 block info into Blockly block info, that will be used in the init() function.
             */
            function S3TOBD(data) {
                let opcode = data.opcode || data.OPCODE || data.id || data.identity || data.ID || data.Opcode || data.Id || data.Identity || 'myBlock';
                let args = data.args || data.arguments || data.Args || data.ARGUMENTS || data.Arguments; /* optional */
                let blockType = data.blockType || data.BlockType || data.BLOCKTYPE || data.Blocktype || data.type || data.Type || data.TYPE;
                let text = data.text || data.string || data.TEXT || data.Text;

            }
            function S2BlockNameData(name) {
                name = (typeof name == 'string' ? name : String(name));
                /* regex(s)*/
                let menuRegex = /%m.[a-zA-Z0-9_.-]*/gm;
                let numberRegex = /%n/gm;
                let stringRegex = /%s/gm;
                let boolRegex = /%b/gm;
                let angleRegex = /%a/gm;
                let colorRegex = /%c/gm;
                let noteRegex = /%p/gm;
                let imageRegex = /%i/gm;
                let editMenuRegex = /%d.[a-zA-Z0-9_.-]*/gm;
                /* matches */
                let menus = [...name.matchAll(menuRegex)];
                let numbers = [...name.matchAll(numberRegex)];
                let editMenus = [...name.matchAll(editMenuRegex)];
                let updMenus = regexMatchArr(name, menuRegex);
                let updNumbers = regexMatchArr(name, numberRegex);
                let updEditMenus = regexMatchArr(name, editMenuRegex);
                let updStrings = regexMatchArr(name, stringRegex);
                let updBools = regexMatchArr(name, boolRegex);
                let updColors = regexMatchArr(name, colorRegex);
                let updAngles = regexMatchArr(name, angleRegex);
                let updNotes = regexMatchArr(name, noteRegex);
                let updImages = regexMatchArr(name, imageRegex);
                let km = name;
                let all = [...updMenus, ...updNumbers, ...updEditMenus, ...updStrings, ...updBools, ...updColors, ...updAngles, ...updNotes, ...updImages];
                all.forEach((item, index) => {
                    km = km.replace(item, `[ARG${index + 1}]`);
                });
                let info = {
                    menus: updMenus,
                    editNumMenus: updEditMenus,
                    numbers: updNumbers,
                    str: km,
                    requestStr: name,
                    bools: updBools,
                    colors: updColors,
                    angles: updAngles,
                    strings: updStrings,
                    notes: updNotes,
                    images: updImages,
                    allArgs: all,
                    totalArgs: updMenus.length + updNumbers.length + updEditMenus.length + updBools.length + updColors.length + updAngles.length,
                };
                console.log(info);
                return info;
            };
            window.S2BlockNameData = S2BlockNameData;
            function splitOnce(str, delim) {
                var components = str.split(delim);
                var result = [components.shift()];
                if (components.length) {
                    result.push(components.join(delim));
                };
                return result;
            }
            function getFuncArgs(funcString) {
                let str = funcString;
                let k = splitOnce(str, "(");
                if (k[0].startsWith("function")) {
                    k.shift();
                };
                k = k.join("");
                k = splitOnce(k, ")");
                k = k.shift();
                k = k.toString();
                k = k.replaceAll(' ', '');
                let funcArgs = k.split(",");
                return funcArgs;
            }
            function funcHasArgument(funcString, argName) {
                let args = getFuncArgs(funcString);
                return args.includes(argName);
            }
            /*function getIndicesOf(searchStr, str, caseSensitive) {
                var searchStrLen = searchStr.length;
                if (searchStrLen == 0) {
                    return [];
                }
                var startIndex = 0, index, indices = [];
                if (!caseSensitive) {
                    str = str.toLowerCase();
                    searchStr = searchStr.toLowerCase();
                }
                while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                    indices.push(index);
                    startIndex = index + searchStrLen;
                }
                return indices;
            };*/
            /* getOccurrenceIndices */
            function getIndicesOf(inputString, substring) {
                var occurrences = [];
                var index = inputString.indexOf(substring);
                while (index !== -1) {
                    occurrences.push({ index: index, occurrence: substring });
                    index = inputString.indexOf(substring, index + 1);
                }
                return occurrences;
            }
            window.getIndicesOf = getIndicesOf;
            function getTextBetween(inputString, startIndex, endIndex) {
                if (startIndex < 0 || startIndex >= inputString.length || endIndex < startIndex || endIndex > inputString.length) {
                    return ""; // Invalid range
                }




                return inputString.slice(startIndex, endIndex);
            };
            function replace(inputString, startIndex, endIndex, replacement) {
                if (startIndex < 0 || startIndex >= inputString.length || endIndex < startIndex || endIndex > inputString.length) {
                    return inputString; // Invalid range
                }




                var before = inputString.slice(0, startIndex);
                var after = inputString.slice(endIndex);
                return before + replacement + after;
            };
            window.replace = replace;
            function countOccurrences(inputString, substring) {
                var count = 0;
                var index = inputString.indexOf(substring);
                while (index !== -1) {
                    count++;
                    index = inputString.indexOf(substring, index + 1);
                }
                return count;
            };
            function replaceAll(string, search, replacement, minIndex) {
                let occurenceIndexes = getIndicesOf(string, search);
                minIndex = minIndex || 0;
                occurenceIndexes.forEach((occ) => {
                    let index = occ.index;
                    if (index >= minIndex) {
                        string = replace(string, index, index + search.length, replacement);
                    }
                });
                return string;
            };
            window.replaceAll = replaceAll;
            function removeOcc(inputString, substringToRemove, occIndex) {
                // Find all occurrences of the substring
                var occurrences = [];
                var index = inputString.indexOf(substringToRemove);
                while (index !== -1) {
                    occurrences.push(index);
                    index = inputString.indexOf(substringToRemove, index + 1);
                }




                // Check if occIndex is valid
                if (occIndex > occurrences.length || occIndex <= 0) {
                    return inputString; // Occurrence not found or invalid index
                }




                // Remove the occurrence at occIndex
                var startIndex = occurrences[occIndex - 1];
                var endIndex = startIndex + substringToRemove.length;
                return inputString.slice(0, startIndex) + inputString.slice(endIndex);
            }
            function changeFuncVariable(funcString, name, newName, dontUseArgs = false, onlyUseArgs = false) {
                let b = funcString;
                let args = getFuncArgs(funcString);
                let k = -0;
                let m = b.match(/[A-Za-z]+\([^)]*\)/i) || b.match(/\([^)]*\)=>/i) || b.match(/\([^)]*\) =>/i);
                if (m) {
                    k = m.toString().length - 1;
                };
                let ya = args.join(",");
                let y = ya + '';
                if (!dontUseArgs) {
                    b = b.replaceAll(`${name})=>`, ` ${newName})=>`);
                    b = b.replaceAll(`${name}) =>`, ` ${newName}) =>`);
                    if (onlyUseArgs == null || onlyUseArgs == undefined) { onlyUseArgs = false };
                    args.forEach((argName) => {
                        if (argName == name) {
                            if (m) {




                            }
                            y = y.replaceAll(`${argName},`, `${newName},`);
                            y = y.replaceAll(`${argName},`, `${newName},`);
                            y = y.replaceAll(`(${argName}`, `(${newName}`);
                            y = y.replaceAll(`${argName})`, `${newName})`);
                            y = y.replaceAll(`...${argName},`, `...${newName},`);
                            y = y.replaceAll(`...${argName})`, `...${newName})`);
                        };
                    });




                    b = b.replaceAll(ya, y);
                };
                let mh = function (s, sr, r) {
                    if (!dontUseArgs) {
                        return s;
                    };
                    return replaceAll(s, sr, r, k);
                }
                if (!onlyUseArgs) {
                    b = b.replaceAll(`...${name},`, `...${newName},`);
                    b = b.replaceAll(`...${name})`, `...${newName})`);
                    b = b.replaceAll(` ${name},`, ` ${newName},`);
                    b = b.replaceAll(`,${name},`, `,${newName},`);
                    b = mh(b, `(${name},`, ` (${newName},`);
                    b = mh(b, `,${name})`, `,${newName})`);
                    b = mh(b, `(${name})`, `(${newName})`);
                    b = mh(b, `, ${name},`, `, ${newName},`);
                    b = mh(b, ` ${name},`, ` ${newName},`);
                    b = b.replaceAll(`${name}=`, `${newName}=`);
                    b = b.replaceAll(`${name} =`, `${newName} =`);
                    b = b.replaceAll(` ${name}.`, ` ${newName}.`);
                    b = b.replaceAll(`;${name}.`, `;${newName}.`);
                    b = b.replaceAll(`; ${name}.`, `; ${newName}.`);
                    b = b.replaceAll(` ${name}(`, ` ${newName}(`);
                    b = b.replaceAll(`; ${name}(`, `; ${newName}(`);
                    b = b.replaceAll(`;${name}(`, `;${newName}(`);
                    /* */
                    b = b.replaceAll(`=${name} `, `=${newName} `);
                    b = b.replaceAll(`= ${name} `, `= ${newName} `);
                };
                return b;
            }
            function wrapFunc(func) {
                let str = (typeof func != "string" ? func.toString() : func);
                return `(${str})`;
            };
            /*S3FUNCTOS2FUNC = function (func) {
                let str = func.toString();
                let funcArgs = getFuncArgs(str);
                let ca = {};
                funcArgs.forEach((arg, i) => {
                    if(arg.toLowerCase() != "args" && arg.toLowerCase() != "util") {
                        ca[i] = arg;
                    };
                });
                let op = ``;
                Object.keys(ca).forEach((key) => {
                    let k = op.length == 0 ? '' : ', ';
                    op = op + k + ca[key];
                });
                let func2 = new Function(`
               
                `)
            };*/
            //window.S3FUNCTOS2FUNC = S3FUNCTOS2FUNC;
            S2FUNCTOS3FUNC = function (func) {
                let str = func.toString();
                let funcArgs = getFuncArgs(str);
                /*funcArgs.forEach((arg, index) => {
                    console.log(arg);
                    let t = true;
                    if (!funcHasArgument(str, 'args') && t) {
                        str = changeFuncVariable(str, arg, `args`, false, true);
                        t = false;
                    };
                    if (!funcHasArgument(str, 'util') && t) {
                        str = changeFuncVariable(str, arg, `util`, false, true);
                        t = false;
                    };
                    if (t) {
                        str = changeFuncVariable(str, arg, `args.${arg},`, true, false);
                        t = false;
                    };
                });*/
                if (funcArgs != ["args", "util"] && funcArgs != ["util", "args"]) {
                    let wrappedFunc = wrapFunc(func);
                    let args = getFuncArgs(str);
                    let ca = {};
                    args.forEach((arg, i) => {
                        if (arg == "util") {
                            ca[i] = arg;
                        } else {
                            if (arg == "args") {
                                ca[i] = "args";
                            } else {
                                ca[i] = `args.ARG${i + 1}`;
                            };
                        };
                    });
                    let op = ``;
                    Object.keys(ca).forEach((key) => {
                        let k = op.length == 0 ? '' : ', ';
                        op = op + k + ca[key];
                    });
                    let func2 = new Function(`
                   const args = arguments[0];
                   const util = arguments[1];                   
                   ${wrappedFunc}(${op});
                   `);
                    return func2;
                }
                return func;




            };
            ScratchExtensionConverter.Functions.S2TOS3 = S2FUNCTOS3FUNC;
            /**
             * Converts a singular block's info into a S3 block.
             * @return {Object} - The scratch 3 block info.
             * @param {Object} - The scratch 2 block info.
             * @example
             * Converts a simple block named hello world into a scratch 3 block.
             * S2BlockTOS3Block([' ', 'hello world']);
             */
            S2BlockTOS3Block = function (blockInfo) {
                /* Block syntax
                    0: block type,
                    1: block name,
                    2: function name (opcode),
                    3: param1 default,
                    4: param2 default,
                    5: param3 default,
                    ... goes on
                */
                /* example blockInfo:  [' ', 'hello world']   (this function fixes a SINGULAR block. */
                let type = (typeof blockInfo == 'object' ? blockInfo[0] : undefined);
                let blockType = 'command';  /* default type */
                let blockSubtype = 'none';
                switch (type) {
                    case '':
                        blockType = 'command';
                        break;
                    case ' ':
                        blockType = 'command';
                        break;
                    case 'w':
                        blockSubtype = 'async';
                        blockType = 'command'; /* command block that waits */
                        break;
                    case 'r':
                        blockSubtype = 'number';
                        blockType = 'reporter'; /* normally number, but reporter in scratch 3.0 */
                        break;
                    case 'R':
                        blockSubtype = 'async';
                        blockType = 'reporter'; /* normally number, but reporter in scratch 3.0 */
                    case 'b':
                        blockType = 'Boolean';
                        break;
                    case 's':
                        blockSubtype = 'string';
                        blockType = 'reporter'; /* normally string, but reporter in scratch 3.0 */
                        break;
                    case 'l':
                        blockType = 'loop'; /* custom */
                        break;
                    case 'm':
                        blockType = 'matrix'; /* custom */
                        break;
                    case 'c':
                        blockType = 'conditional'; /* custom */
                        break;
                    case 'e':
                        blockType = 'event'; /* custom */
                        break;
                    case 'h':
                        blockType = 'hat';
                        break;
                    case 'n':
                        blockType = 'button';
                        break;
                };
                let text = (typeof blockInfo == 'object' ? blockInfo[1] : undefined);
                let opcode = (typeof blockInfo == 'object' ? blockInfo[2] : undefined);
                let clone = Object.assign([], blockInfo); /* for getting default parameter values */
                clone.splice(0, 2);
                let defaults = {};
                clone.forEach((n, i) => {
                    defaults[i] = n;
                });
                let nameData = S2BlockNameData(text);
                let blockArgs = {};
                let info = {
                    blockType: blockType,
                    text: nameData.str,
                };
                if (opcode != undefined) {
                    info.opcode = opcode;
                };
                let args = [].concat(nameData.angles, nameData.bools, nameData.colors, nameData.editNumMenus, nameData.menus, nameData.numbers, nameData.strings, nameData.notes, nameData.images);
                args.forEach((g, i) => {
                    let t = "";
                    let menu = undefined;
                    if (g.startsWith("%s")) {
                        t = "string";
                        menu = (g.split(".").length > 1 ? g.split(".")[1] : undefined);
                    };
                    if (g.startsWith("%m")) {
                        t = "string";
                        menu = (g.split(".").length > 1 ? g.split(".")[1] : undefined);
                    };
                    if (g.startsWith("%d")) {
                        t = "string";
                    };
                    if (g.startsWith("%c")) {
                        t = "color";
                    };
                    if (g.startsWith("%a")) {
                        t = "angle";
                    };
                    if (g.startsWith("%n")) {
                        t = "number";
                    };
                    if (g.startsWith("%b")) {
                        t = "Boolean";
                    };
                    if (g.startsWith("%p")) {
                        t = "note";
                    };
                    if (g.startsWith("%i")) {
                        t = "image";
                    };
                    let ink = {
                        type: t || "string",
                        defaultValue: "",
                    }
                    if (menu) {
                        ink.menu = menu;
                    };
                    blockArgs[`ARG${i + 1}`] = ink;
                });
                info.arguments = Object.keys(blockArgs).length > 0 ? blockArgs : undefined;
                return info;
            };
            ScratchExtensionConverter.Blocks.S2BlockTOS3Block = S2BlockTOS3Block;
            /**
             * Converts a scratch 2 block array into a scratch 3 block array.
             * @return {Object} - The scratch 3 block array.
             * @param {Object} - The scratch 2 block array.
             * @example
             * Converts a scratch 2 block array into a scratch 3 block array.
             * S2BlockTOS3Block([[' ', 'hello world']]);
             */
            S2TOS3B = function (obj) {
                /* obj should be the blocks part of the descriptor */
                let blocks2 = (typeof obj == 'object' ? obj.BLOCKS || obj.blocks || obj._blocks || obj.blks : (obj.forEach ? obj : undefined));
                let blocks = (blocks2 ? blocks2 : obj);
                let m = [];
                if (!blocks) {
                    return [];
                };
                try {
                    blocks.forEach((blockInfo) => {
                        let s3Info = S2BlockTOS3Block(blockInfo);
                        m.push(s3Info);
                    });
                } catch (err) {
                };
                return m;
            };
            ScratchExtensionConverter.Blocks.S2TOS3 = S2TOS3B;
            ScratchExtensionConverter.Extensions = {};
            /**
             * Converts scratch 2 extension info to scratch 3 extension info.
             * @return {Object} - The scratch 3 extension info.
             * @example
             * // Converts a scratch 2 extension to a scratch 3 extension with 1 table.
             * ScratchExtensionConverter.Extensions.S2TOS3({descriptor: Object, ext: Object, name: String});
             * @example
             * // Converts a scratch 2 extension to a scratch 3 extension using multiple arguments.
             * ScratchExtensionConverter.Extensions.S2TOS3(descriptor, ext, name);
             * @param {Object} - The descriptor of the extension (or info), including the objects and menus of the extension (or possibly more).
             * @param {Object?} - The extension data, or 'ext' inside of the dsc object.
             * @param {String?} - The extension name. This can also be defined as 'name' in the dsc object.
             */
            S2TOS3E = function (dsc, ext, nme/**/) {
                var args = Array.prototype.slice.call(arguments);
                var type = 'none';
                if (args.length > 1) {
                    type = 'multi';
                    if (args.length > 2) {
                        type = 'multi_all'
                    };
                };
                if (typeof dsc == 'object') {
                    type = 'multi_obj';
                }
                var descriptor = (typeof dsc == 'object' ? dsc.descriptor || dsc.Descriptor || dsc.DESCRIPTOR : dsc || args[0]);
                var extData = (typeof dsc == 'object' ? dsc.ext || dsc.extData || dsc.methods || dsc.extension || dsc.extensionData : ext || args[1]);
                var name = (typeof dsc == 'object' ? dsc.name || dsc.nme || dsc.extName || dsc.id || dsc.extId || dsc.displayName || dsc.extName : nme || args[2]);
                descriptor = descriptor ? descriptor : dsc;
                extData = extData ? extData : (descriptor.ext || descriptor.methods || descriptor.extension || descriptor.extensionData || args[1]);
                name = name ? name : (descriptor.name || descriptor.nme || descriptor.extName || descriptor.id || descriptor.extId || descriptor.displayName || args[2]);
                if (!descriptor || !extData || !name) {
                    throw new Error("A descriptor, extension object (ext), and an extension name are needed.");
                    return {};
                };
                /* Get more info about the extension */
                var kmb = (descriptor.BLOCKS || descriptor.blocks || descriptor._blocks || descriptor.blks);
                var blocks = (kmb ? kmb : undefined);
                var mmb = (descriptor.MENUS || descriptor.menus || descriptor._menus || descriptor.menus || descriptor.mnus || descriptor.mnu || extData.menus || extData.MENUS);
                var menus = (mmb ? mmb : undefined);
                var mb = {}; /* to update */
                var cmb = {} /* core mbs */
                var idb = (descriptor.ID || descriptor.id || descriptor.identity);
                var id = (idb ? idb : name);
                var info = {};
                let mt = [];
                let knm = {};
                blocks.forEach((blockData) => {
                    let s3 = S2BlockTOS3Block(blockData);
                    mt.push(s3);
                });
                Object.keys(menus).forEach((key, i) => {
                    let value = menus[key];
                    let ny = [];
                    value.forEach((o) => {
                        ny.push({
                            value: o,
                            text: o,
                        });
                    });
                    knm[key] = ny;
                });
                Object.keys(extData).forEach((key) => {
                    let value = extData[key];
                    if (key.startsWith("_")) {
                        cmb[key] = value;
                    };
                    /* still add key to mbs */
                    mb[key] = value;
                });
                /* start adding ext info */
                info.id = id || 'myExtension';
                class Extension {
                    constructor(runtime) {
                        this.runtime = runtime;
                    };
                };
                Object.keys(mb).forEach((key) => {
                    let value = mb[key];
                    if (typeof value == "function") {
                        Extension.prototype[key] = S2FUNCTOS3FUNC(value);
                    } else {
                        Extension.prototype[key] = value;
                    }
                });
                Extension.prototype.getInfo = function () {
                    return {
                        id: info.id || id,
                        name: name || 'My Extension',
                        menus: knm,
                        blocks: mt,
                    };
                };
                return Extension;
            };
            window.ExampleExtData = {
                name: "Hello",
                blocks: [
                    ["s", "Alert %s", "alertFunc", "Hello, world!"]
                ],
                menus: {
                    sel: ["stage", "mouse", "this sprite"]
                },
                ext: {
                    _shutdown: function () { },
                    alertFunc: function (text) {
                        alert(text);
                    }
                },
                id: "helloExt",
            };
            ScratchExtensionConverter.Extensions.S2TOS3 = S2TOS3E;
            /*window.ExampleExtData = ExampleExtData;
            window.ScratchExtensionConverter = ScratchExtensionConverter;
            window.lk = ScratchExtensionConverter.Extensions.S2TOS3(ExampleExtData)
            window.f2 = function (a, b) {
                console.log(a, b);
            };*/
            if ('module' in this) {
                module.exports = ScratchExtensionConverter;
                return ScratchExtensionConverter;
            } else {
                return ScratchExtensionConverter;
            };
        })(window);
