/*
Copyright (C) 2011 Patrick Gillespie, http://patorjk.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
    Extendible BBCode Parser v1.0.0
    By Patrick Gillespie (patorjk@gmail.com)
    Website: http://patorjk.com/

    This module allows you to parse BBCode and to extend to the mark-up language
    to add in your own tags.
*/

var XBBCODE = (function() {
    "use strict";

    // -----------------------------------------------------------------------------
    // Set up private variables
    // -----------------------------------------------------------------------------

    var me = {},
        urlPattern = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[-a-zA-Z0-9:;@#%&()~_?\+=\/\\\.]*$/,
        colorNamePattern = /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/,
        colorCodePattern = /^#?[a-fA-F0-9]{6}$/,
        emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/,
        fontFacePattern = /^([a-z][a-z0-9_]+|"[a-z][a-z0-9_\s]+")$/i,
        tags,
        tagList,
        tagsNoParseList = [],
        bbRegExp,
        pbbRegExp,
        pbbRegExp2,
        openTags,
        closeTags;

    /* -----------------------------------------------------------------------------
     * tags
     * This object contains a list of tags that your code will be able to understand.
     * Each tag object has the following properties:
     *
     *   openTag - A function that takes in the tag's parameters (if any) and its
     *             contents, and returns what its HTML open tag should be.
     *             Example: [color=red]test[/color] would take in "=red" as a
     *             parameter input, and "test" as a content input.
     *             It should be noted that any BBCode inside of "content" will have
     *             been processed by the time it enter the openTag function.
     *
     *   closeTag - A function that takes in the tag's parameters (if any) and its
     *              contents, and returns what its HTML close tag should be.
     *
     *   displayContent - Defaults to true. If false, the content for the tag will
     *                    not be displayed. This is useful for tags like IMG where
     *                    its contents are actually a parameter input.
     *
     *   restrictChildrenTo - A list of BBCode tags which are allowed to be nested
     *                        within this BBCode tag. If this property is omitted,
     *                        any BBCode tag may be nested within the tag.
     *
     *   restrictParentsTo - A list of BBCode tags which are allowed to be parents of
     *                       this BBCode tag. If this property is omitted, any BBCode
     *                       tag may be a parent of the tag.
     *
     *   noParse - true or false. If true, none of the content WITHIN this tag will be
     *             parsed by the XBBCode parser.
     *
     *
     *
     * LIMITIONS on adding NEW TAGS:
     *  - Tag names should be alphanumeric (including underscores) and all tags should have an opening tag
     *    and a closing tag.
     *    The [*] tag is an exception because it was already a standard
     *    bbcode tag. Technecially tags don't *have* to be alphanumeric, but since
     *    regular expressions are used to parse the text, if you use a non-alphanumeric
     *    tag names, just make sure the tag name gets escaped properly (if needed).
     * --------------------------------------------------------------------------- */

    tags = {
        "big": {
            openTag: function(params,content) {
                return '<span style="font-size: 50px">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "z": {
            openTag: function(params,content) {
                return '<span style="font-size: 20px">' + Z.generate(content);
            },
            closeTag: function(params,content) {
                return '</span>';
            },
            displayContent: false
        },
        "b": {
            openTag: function(params,content) {
                return '<span class="xbbcode-b">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        /*
            This tag does nothing and is here mostly to be used as a classification for
            the bbcode input when evaluating parent-child tag relationships
        */
        "bbcode": {
            openTag: function(params,content) {
                return '';
            },
            closeTag: function(params,content) {
                return '';
            }
        },
        "center": {
            openTag: function(params,content) {
                return '<span class="xbbcode-center">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },

        "code": {
            openTag: function(params,content) {
                return '<span class="xbbcode-code">';
            },
            closeTag: function(params,content) {
                return '</span>';
            },
            noParse: true
        },
        "color": {
            openTag: function(params,content) {
                params = params || '';
                
                var colorCode = (params.substr(1)).toLowerCase() || "black";
                colorNamePattern.lastIndex = 0;
                colorCodePattern.lastIndex = 0;
                if ( !colorNamePattern.test( colorCode ) ) {
                    if ( !colorCodePattern.test( colorCode ) ) {
                        colorCode = "black";
                    } else {
                        if (colorCode.substr(0,1) !== "#") {
                            colorCode = "#" + colorCode;
                        }
                    }
                }

                return '<span style="color:' + colorCode + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "email": {
            openTag: function(params,content) {

                var myEmail;

                if (!params) {
                    myEmail = content.replace(/<.*?>/g,"");
                } else {
                    myEmail = params.substr(1);
                }

                emailPattern.lastIndex = 0;
                if ( !emailPattern.test( myEmail ) ) {
                    return '<a>';
                }

                return '<a href="mailto:' + myEmail + '">';
            },
            closeTag: function(params,content) {
                return '</a>';
            }
        },
        "face": {
            openTag: function(params,content) {
                params = params || '';

                var faceCode = params.substr(1) || "inherit";
                fontFacePattern.lastIndex = 0;
                if ( !fontFacePattern.test( faceCode ) ) {
                        faceCode = "inherit";
                }
                return '<span style="font-family:' + faceCode + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },


        "font": {
            openTag: function(params,content) {
                params = params || '';

                var faceCode = params.substr(1) || "inherit";
                fontFacePattern.lastIndex = 0;
                if ( !fontFacePattern.test( faceCode ) ) {
                        faceCode = "inherit";
                }
                return '<span style="font-family:' + faceCode + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },

        "i": {
            openTag: function(params,content) {
                return '<span class="xbbcode-i">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "img": {
            openTag: function(params,content) {

                var myUrl = content;

                urlPattern.lastIndex = 0;
                if ( !urlPattern.test( myUrl ) ) {
                    myUrl = "";
                }

                return '<img src="' + myUrl + '" />';
            },
            closeTag: function(params,content) {
                return '';
            },
            displayContent: false
        },
        "justify": {
            openTag: function(params,content) {
                return '<span class="xbbcode-justify">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "large": {
            openTag: function(params,content) {
                params = params || '';

                var colorCode = params.substr(1) || "inherit";
                colorNamePattern.lastIndex = 0;
                colorCodePattern.lastIndex = 0;
                if ( !colorNamePattern.test( colorCode ) ) {
                    if ( !colorCodePattern.test( colorCode ) ) {
                        colorCode = "inherit";
                    } else {
                        if (colorCode.substr(0,1) !== "#") {
                            colorCode = "#" + colorCode;
                        }
                    }
                }


                return '<span class="xbbcode-size-36" style="color:' + colorCode + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "left": {
            openTag: function(params,content) {
                return '<span class="xbbcode-left">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "li": {
            openTag: function(params,content) {
                return "<li>";
            },
            closeTag: function(params,content) {
                return "</li>";
            },
            restrictParentsTo: ["list","ul","ol"]
        },
        "list": {
            openTag: function(params,content) {
                return '<ul>';
            },
            closeTag: function(params,content) {
                return '</ul>';
            },
            restrictChildrenTo: ["*", "li"]
        },
        "noparse": {
            openTag: function(params,content) {
                return '';
            },
            closeTag: function(params,content) {
                return '';
            },
            noParse: true
        },
        "ol": {
            openTag: function(params,content) {
                return '<ol>';
            },
            closeTag: function(params,content) {
                return '</ol>';
            },
            restrictChildrenTo: ["*", "li"]
        },
        "php": {
            openTag: function(params,content) {
                return '<span class="xbbcode-code">';
            },
            closeTag: function(params,content) {
                return '</span>';
            },
            noParse: true
        },
        "quote": {
            openTag: function(params,content) {
                return '<blockquote class="xbbcode-blockquote">';
            },
            closeTag: function(params,content) {
                return '</blockquote>';
            }
        },
        "right": {
            openTag: function(params,content) {
                return '<span class="xbbcode-right">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "s": {
            openTag: function(params,content) {
                return '<span class="xbbcode-s">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "size": {
            openTag: function(params,content) {
                params = params || '';

                var mySize = parseInt(params.substr(1),10) || 0;
                if (mySize < 4 || mySize > 40) {
                    mySize = 14;
                }

                return '<span class="xbbcode-size-' + mySize + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "small": {
            openTag: function(params,content) {
                params = params || '';

                var colorCode = params.substr(1) || "inherit";
                colorNamePattern.lastIndex = 0;
                colorCodePattern.lastIndex = 0;
                if ( !colorNamePattern.test( colorCode ) ) {
                    if ( !colorCodePattern.test( colorCode ) ) {
                        colorCode = "inherit";
                    } else {
                        if (colorCode.substr(0,1) !== "#") {
                            colorCode = "#" + colorCode;
                        }
                    }
                }

                return '<span class="xbbcode-size-10" style="color:' + colorCode + '">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },

        "sub": {
            openTag: function(params,content) {
                return '<sub>';
            },
            closeTag: function(params,content) {
                return '</sub>';
            }
        },
        "sup": {
            openTag: function(params,content) {
                return '<sup>';
            },
            closeTag: function(params,content) {
                return '</sup>';
            }
        },

        "table": {
            openTag: function(params,content) {
                return '<table class="xbbcode-table">';
            },
            closeTag: function(params,content) {
                return '</table>';
            },
            restrictChildrenTo: ["tbody","thead", "tfoot", "tr"]
        },
        "tbody": {
            openTag: function(params,content) {
                return '<tbody>';
            },
            closeTag: function(params,content) {
                return '</tbody>';
            },
            restrictChildrenTo: ["tr"],
            restrictParentsTo: ["table"]
        },
        "tfoot": {
            openTag: function(params,content) {
                return '<tfoot>';
            },
            closeTag: function(params,content) {
                return '</tfoot>';
            },
            restrictChildrenTo: ["tr"],
            restrictParentsTo: ["table"]
        },
        "thead": {
            openTag: function(params,content) {
                return '<thead class="xbbcode-thead">';
            },
            closeTag: function(params,content) {
                return '</thead>';
            },
            restrictChildrenTo: ["tr"],
            restrictParentsTo: ["table"]
        },
        "td": {
            openTag: function(params,content) {
                return '<td class="xbbcode-td">';
            },
            closeTag: function(params,content) {
                return '</td>';
            },
            restrictParentsTo: ["tr"]
        },
        "th": {
            openTag: function(params,content) {
                return '<th class="xbbcode-th">';
            },
            closeTag: function(params,content) {
                return '</th>';
            },
            restrictParentsTo: ["tr"]
        },
        "tr": {
            openTag: function(params,content) {
                return '<tr class="xbbcode-tr">';
            },
            closeTag: function(params,content) {
                return '</tr>';
            },
            restrictChildrenTo: ["td","th"],
            restrictParentsTo: ["table","tbody","tfoot","thead"]
        },
        "u": {
            openTag: function(params,content) {
                return '<span class="xbbcode-u">';
            },
            closeTag: function(params,content) {
                return '</span>';
            }
        },
        "ul": {
            openTag: function(params,content) {
                return '<ul>';
            },
            closeTag: function(params,content) {
                return '</ul>';
            },
            restrictChildrenTo: ["*", "li"]
        },
        "url": {
            openTag: function(params,content) {

                var myUrl;

                if (!params) {
                    myUrl = content.replace(/<.*?>/g,"");
                } else {
                    myUrl = params.substr(1);
                }

                urlPattern.lastIndex = 0;
                if ( !urlPattern.test( myUrl ) ) {
                    myUrl = "#";
                }

                return '<a href="' + myUrl + '">';
            },
            closeTag: function(params,content) {
                return '</a>';
            }
        },
        /*
            The [*] tag is special since the user does not define a closing [/*] tag when writing their bbcode.
            Instead this module parses the code and adds the closing [/*] tag in for them. None of the tags you
            add will act like this and this tag is an exception to the others.
        */
        "*": {
            openTag: function(params,content) {
                return "<li>";
            },
            closeTag: function(params,content) {
                return "</li>";
            },
            restrictParentsTo: ["list","ul","ol"]
        }
    };

    // create tag list and lookup fields
    function initTags() {
        tagList = [];
        var prop,
            ii,
            len;
        for (prop in tags) {
            if (tags.hasOwnProperty(prop)) {
                if (prop === "*") {
                    tagList.push("\\" + prop);
                } else {
                    tagList.push(prop);
                    if ( tags[prop].noParse ) {
                        tagsNoParseList.push(prop);
                    }
                }

                tags[prop].validChildLookup = {};
                tags[prop].validParentLookup = {};
                tags[prop].restrictParentsTo = tags[prop].restrictParentsTo || [];
                tags[prop].restrictChildrenTo = tags[prop].restrictChildrenTo || [];

                len = tags[prop].restrictChildrenTo.length;
                for (ii = 0; ii < len; ii++) {
                    tags[prop].validChildLookup[ tags[prop].restrictChildrenTo[ii] ] = true;
                }
                len = tags[prop].restrictParentsTo.length;
                for (ii = 0; ii < len; ii++) {
                    tags[prop].validParentLookup[ tags[prop].restrictParentsTo[ii] ] = true;
                }
            }
        }

        bbRegExp = new RegExp("<bbcl=([0-9]+) (" + tagList.join("|") + ")([ =][^>]*?)?>((?:.|[\\r\\n])*?)<bbcl=\\1 /\\2>", "gi");
        pbbRegExp = new RegExp("\\[(" + tagList.join("|") + ")([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]", "gi");
        pbbRegExp2 = new RegExp("\\[(" + tagsNoParseList.join("|") + ")([ =][^\\]]*?)?\\]([\\s\\S]*?)\\[/\\1\\]", "gi");

        // create the regex for escaping ['s that aren't apart of tags
        (function() {
            var closeTagList = [];
            for (var ii = 0; ii < tagList.length; ii++) {
                if ( tagList[ii] !== "\\*" ) { // the * tag doesn't have an offical closing tag
                    closeTagList.push ( "/" + tagList[ii] );
                }
            }

            openTags = new RegExp("(\\[)((?:" + tagList.join("|") + ")(?:[ =][^\\]]*?)?)(\\])", "gi");
            closeTags = new RegExp("(\\[)(" + closeTagList.join("|") + ")(\\])", "gi");
        })();

    }
    initTags();

    // -----------------------------------------------------------------------------
    // private functions
    // -----------------------------------------------------------------------------

    function checkParentChildRestrictions(parentTag, bbcode, bbcodeLevel, tagName, tagParams, tagContents, errQueue) {

        errQueue = errQueue || [];
        bbcodeLevel++;

        // get a list of all of the child tags to this tag
        var reTagNames = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + tagList.join("|") + ")([ =>])","gi"),
            reTagNamesParts = new RegExp("(<bbcl=" + bbcodeLevel + " )(" + tagList.join("|") + ")([ =>])","i"),
            matchingTags = tagContents.match(reTagNames) || [],
            cInfo,
            errStr,
            ii,
            childTag,
            pInfo = tags[parentTag] || {};

        reTagNames.lastIndex = 0;

        if (!matchingTags) {
            tagContents = "";
        }

        for (ii = 0; ii < matchingTags.length; ii++) {
            reTagNamesParts.lastIndex = 0;
            childTag = (matchingTags[ii].match(reTagNamesParts))[2].toLowerCase();

            if ( pInfo && pInfo.restrictChildrenTo && pInfo.restrictChildrenTo.length > 0 ) {
                if ( !pInfo.validChildLookup[childTag] ) {
                    errStr = "The tag \"" + childTag + "\" is not allowed as a child of the tag \"" + parentTag + "\".";
                    errQueue.push(errStr);
                }
            }
            cInfo = tags[childTag] || {};
            if ( cInfo.restrictParentsTo.length > 0 ) {
                if ( !cInfo.validParentLookup[parentTag] ) {
                    errStr = "The tag \"" + parentTag + "\" is not allowed as a parent of the tag \"" + childTag + "\".";
                    errQueue.push(errStr);
                }
            }

        }

        tagContents = tagContents.replace(bbRegExp, function(matchStr, bbcodeLevel, tagName, tagParams, tagContents ) {
            errQueue = checkParentChildRestrictions(tagName.toLowerCase(), matchStr, bbcodeLevel, tagName, tagParams, tagContents, errQueue);
            return matchStr;
        });
        return errQueue;
    }

    /*
        This function updates or adds a piece of metadata to each tag called "bbcl" which
        indicates how deeply nested a particular tag was in the bbcode. This property is removed
        from the HTML code tags at the end of the processing.
    */
    function updateTagDepths(tagContents) {
        tagContents = tagContents.replace(/\<([^\>][^\>]*?)\>/gi, function(matchStr, subMatchStr) {
            var bbCodeLevel = subMatchStr.match(/^bbcl=([0-9]+) /);
            if (bbCodeLevel === null) {
                return "<bbcl=0 " + subMatchStr + ">";
            } else {
                return "<" + subMatchStr.replace(/^(bbcl=)([0-9]+)/, function(matchStr, m1, m2) {
                    return m1 + (parseInt(m2, 10) + 1);
                }) + ">";
            }
        });
        return tagContents;
    }

    /*
        This function removes the metadata added by the updateTagDepths function
    */
    function unprocess(tagContent) {
        return tagContent.replace(/<bbcl=[0-9]+ \/\*>/gi,"").replace(/<bbcl=[0-9]+ /gi,"&#91;").replace(/>/gi,"&#93;");
    }

    var replaceFunct = function(matchStr, bbcodeLevel, tagName, tagParams, tagContents) {

        tagName = tagName.toLowerCase();

        var processedContent = tags[tagName].noParse ? unprocess(tagContents) : tagContents.replace(bbRegExp, replaceFunct),
            openTag = tags[tagName].openTag(tagParams,processedContent),
            closeTag = tags[tagName].closeTag(tagParams,processedContent);

        if ( tags[tagName].displayContent === false) {
            processedContent = "";
        }

        return openTag + processedContent + closeTag;
    };

    function parse(config) {
        var output = config.text;
        output = output.replace(bbRegExp, replaceFunct);
        return output;
    }

    /*
        The star tag [*] is special in that it does not use a closing tag. Since this parser requires that tags to have a closing
        tag, we must pre-process the input and add in closing tags [/*] for the star tag.
        We have a little levaridge in that we know the text we're processing wont contain the <> characters (they have been
        changed into their HTML entity form to prevent XSS and code injection), so we can use those characters as markers to
        help us define boundaries and figure out where to place the [/*] tags.
    */
    function fixStarTag(text) {
        text = text.replace(/\[(?!\*[ =\]]|list([ =][^\]]*)?\]|\/list[\]])/ig, "<");
        text = text.replace(/\[(?=list([ =][^\]]*)?\]|\/list[\]])/ig, ">");

        while (text !== (text = text.replace(/>list([ =][^\]]*)?\]([^>]*?)(>\/list])/gi, function(matchStr,contents,endTag) {

            var innerListTxt = matchStr;
            while (innerListTxt !== (innerListTxt = innerListTxt.replace(/\[\*\]([^\[]*?)(\[\*\]|>\/list])/i, function(matchStr,contents,endTag) {
                if (endTag.toLowerCase() === ">/list]") {
                    endTag = "</*]</list]";
                } else {
                    endTag = "</*][*]";
                }
                return "<*]" + contents + endTag;
            })));

            innerListTxt = innerListTxt.replace(/>/g, "<");
            return innerListTxt;
        })));

        // add ['s for our tags back in
        text = text.replace(/</g, "[");
        return text;
    }

    function addBbcodeLevels(text) {
        while ( text !== (text = text.replace(pbbRegExp, function(matchStr, tagName, tagParams, tagContents) {
            matchStr = matchStr.replace(/\[/g, "<");
            matchStr = matchStr.replace(/\]/g, ">");
            return updateTagDepths(matchStr);
        })) );
        return text;
    }

    // -----------------------------------------------------------------------------
    // public functions
    // -----------------------------------------------------------------------------

    // API, Expose all available tags
    me.tags = function() {
        return tags;
    };

    // API
    me.addTags = function(newtags) {
        var tag;
        for (tag in newtags) {
            tags[tag] = newtags[tag];
        }
        initTags();
    };

    me.process = function(config) {

        var ret = {html: "", error: false},
            errQueue = [];

        config.text = config.text.replace(/</g, "&lt;"); // escape HTML tag brackets
        config.text = config.text.replace(/>/g, "&gt;"); // escape HTML tag brackets

        config.text = config.text.replace(openTags, function(matchStr, openB, contents, closeB) {
            return "<" + contents + ">";
        });
        config.text = config.text.replace(closeTags, function(matchStr, openB, contents, closeB) {
            return "<" + contents + ">";
        });

        config.text = config.text.replace(/\[/g, "&#91;"); // escape ['s that aren't apart of tags
        config.text = config.text.replace(/\]/g, "&#93;"); // escape ['s that aren't apart of tags
        config.text = config.text.replace(/</g, "["); // escape ['s that aren't apart of tags
        config.text = config.text.replace(/>/g, "]"); // escape ['s that aren't apart of tags

        // process tags that don't have their content parsed
        while ( config.text !== (config.text = config.text.replace(pbbRegExp2, function(matchStr, tagName, tagParams, tagContents) {
            tagContents = tagContents.replace(/\[/g, "&#91;");
            tagContents = tagContents.replace(/\]/g, "&#93;");
            tagParams = tagParams || "";
            tagContents = tagContents || "";
            return "[" + tagName + tagParams + "]" + tagContents + "[/" + tagName + "]";
        })) );

        config.text = fixStarTag(config.text); // add in closing tags for the [*] tag
        config.text = addBbcodeLevels(config.text); // add in level metadata

        errQueue = checkParentChildRestrictions("bbcode", config.text, -1, "", "", config.text);

        ret.html = parse(config);

        if ( ret.html.indexOf("[") !== -1 || ret.html.indexOf("]") !== -1) {
            errQueue.push("Some tags appear to be misaligned.");
        }

        if (config.removeMisalignedTags) {
            ret.html = ret.html.replace(/\[.*?\]/g,"");
        }
        if (config.addInLineBreaks) {
            ret.html = '<div style="white-space:pre-wrap;">' + ret.html + '</div>';
        }

		if (!config.escapeHtml) {
			ret.html = ret.html.replace("&#91;", "["); // put ['s back in
        	ret.html = ret.html.replace("&#93;", "]"); // put ['s back in
		}

        ret.error = errQueue.length !== 0;
        ret.errorQueue = errQueue;

        return ret;
    };

    return me;
})();

var Z = {
    chars: {
        0 : [ /* up */
    '\u030d', /*     ̍     */
    '\u030e', /*     ̎     */
    '\u0304', /*     ̄     */
    '\u0305', /*     ̅     */
    '\u033f', /*     ̿     */
    '\u0311', /*     ̑     */
    '\u0306', /*     ̆     */
    '\u0310', /*     ̐     */
    '\u0352', /*     ͒     */
    '\u0357', /*     ͗     */
    '\u0351', /*     ͑     */
    '\u0307', /*     ̇     */
    '\u0308', /*     ̈     */
    '\u030a', /*     ̊     */
    '\u0342', /*     ͂     */
    '\u0343', /*     ̓     */
    '\u0344', /*     ̈́     */
    '\u034a', /*     ͊     */
    '\u034b', /*     ͋     */
    '\u034c', /*     ͌     */
    '\u0303', /*     ̃     */
    '\u0302', /*     ̂     */
    '\u030c', /*     ̌     */
    '\u0350', /*     ͐     */
    '\u0300', /*     ̀     */
    '\u0301', /*     ́     */
    '\u030b', /*     ̋     */
    '\u030f', /*     ̏     */
    '\u0312', /*     ̒     */
    '\u0313', /*     ̓     */
    '\u0314', /*     ̔     */
    '\u033d', /*     ̽     */
    '\u0309', /*     ̉     */
    '\u0363', /*     ͣ     */
    '\u0364', /*     ͤ     */
    '\u0365', /*     ͥ     */
    '\u0366', /*     ͦ     */
    '\u0367', /*     ͧ     */
    '\u0368', /*     ͨ     */
    '\u0369', /*     ͩ     */
    '\u036a', /*     ͪ     */
    '\u036b', /*     ͫ     */
    '\u036c', /*     ͬ     */
    '\u036d', /*     ͭ     */
    '\u036e', /*     ͮ     */
    '\u036f', /*     ͯ     */
    '\u033e', /*     ̾     */
    '\u035b', /*     ͛     */
    '\u0346', /*     ͆     */
    '\u031a'  /*     ̚     */
    ],
    1 : [ /* down */
    '\u0316', /*     ̖     */
    '\u0317', /*     ̗     */
    '\u0318', /*     ̘     */
    '\u0319', /*     ̙     */
    '\u031c', /*     ̜     */
    '\u031d', /*     ̝     */
    '\u031e', /*     ̞     */
    '\u031f', /*     ̟     */
    '\u0320', /*     ̠     */
    '\u0324', /*     ̤     */
    '\u0325', /*     ̥     */
    '\u0326', /*     ̦     */
    '\u0329', /*     ̩     */
    '\u032a', /*     ̪     */
    '\u032b', /*     ̫     */
    '\u032c', /*     ̬     */
    '\u032d', /*     ̭     */
    '\u032e', /*     ̮     */
    '\u032f', /*     ̯     */
    '\u0330', /*     ̰     */
    '\u0331', /*     ̱     */
    '\u0332', /*     ̲     */
    '\u0333', /*     ̳     */
    '\u0339', /*     ̹     */
    '\u033a', /*     ̺     */
    '\u033b', /*     ̻     */
    '\u033c', /*     ̼     */
    '\u0345', /*     ͅ     */
    '\u0347', /*     ͇     */
    '\u0348', /*     ͈     */
    '\u0349', /*     ͉     */
    '\u034d', /*     ͍     */
    '\u034e', /*     ͎     */
    '\u0353', /*     ͓     */
    '\u0354', /*     ͔     */
    '\u0355', /*     ͕     */
    '\u0356', /*     ͖     */
    '\u0359', /*     ͙     */
    '\u035a', /*     ͚     */
    '\u0323'  /*     ̣     */
        ],
    2 : [ /* mid */
    '\u0315', /*     ̕     */
    '\u031b', /*     ̛     */
    '\u0340', /*     ̀     */
    '\u0341', /*     ́     */
    '\u0358', /*     ͘     */
    '\u0321', /*     ̡     */
    '\u0322', /*     ̢     */
    '\u0327', /*     ̧     */
    '\u0328', /*     ̨     */
    '\u0334', /*     ̴     */
    '\u0335', /*     ̵     */
    '\u0336', /*     ̶     */
    '\u034f', /*     ͏     */
    '\u035c', /*     ͜     */
    '\u035d', /*     ͝     */
    '\u035e', /*     ͞     */
    '\u035f', /*     ͟     */
    '\u0360', /*     ͠     */
    '\u0362', /*     ͢     */
    '\u0338', /*     ̸     */
    '\u0337', /*     ̷      */
    '\u0361', /*     ͡     */
    '\u0489' /*     ҉_     */
    ]

    },
    random: function(len) {
        if (len == 1) return 0;
        return !!len ? Math.floor(Math.random() * len + 1) - 1 : Math.random();
    },
    generate: function(str) {
        var str_arr = str.split(''),
            output = str_arr.map(function(a) {
                if(a == " ") return a;
                for(var i = 0, l = Z.random(16);
                    i<l;i++){
                        var rand = Z.random(3);
                    a += Z.chars[rand][
                        Z.random(Z.chars[rand].length)
                        ];
                 }
                return a;
            });
        return output.join('');
    }
};

// for node
// if (module) {
//     module.exports = XBBCODE;
// }
