/**
 * @fileOverview prajna wrapper code injector for webpack bundled prajects
 * @name index.js<prajna-wrapper-plugin>
 * @author Young Lee <youngleemails@gmail.com>
 * @license MIT
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const cheerio = require('cheerio');
const uglifyJs = require('uglify-js');

let PrajnaWrapperPlugin = function(opt) {
    if (this instanceof PrajnaWrapperPlugin) {
        this.progressive = _.extend({
            crossorigin: true,
            scriptPath: `http://portal.io:9090/prajna.js`
        }, opt.options.progressive);

        this.options = {
            includes: opt.includes || [],
            options: {
                autopv: opt.options.autopv || true,
                env: opt.options.env || 'dev',
                project: opt.options.project || 'unnamed-project',
                envMapping: opt.options.envMapping || {
                    'dev': '//',
                    'test': '//',
                    'alpha': '//',
                    'beta': '//',
                    'release-candidate': '//',
                    'product': '//'
                },
                progressive: this.progressive
            }
        };

        this.presets = {
            'meta': [
                `<meta class="prajna-gadget-content" name="prajna:autopv" content="${this.options.options.autopv}"/>`
            ],
            'script': [
                `var __prajnaEnv__ = ${this.options.options.env}`
            ],
            'prajna-static': [
                `<script type="text/javascript" src="${this.progressive.scriptPath}"></script>`
            ]
        };
    } else {
        return new PrajnaWrapperPlugin(opt);
    }
};

// PrajnaWrapperPlugin.prototype.getHtmlContent = function(type, raw) {
//     const self = this;
//     const $ = cheerio.load(raw, {
//         decodeEntities: false
//     });
//     if (type === 'head') {
//         if (!self.options.prajnaOptions.thirdParty.forbidLX4) {
//             self.seed.lxmeta.forEach(function(item) {
//                 $('head').prepend(item);
//             });
//             $('head').append(self.seed.lxSeed);
//         }
//         $('head').prepend(self.seed.catSeed);
//         $('head').prepend(self.seed.core);
//         self.seed.prajnameta.forEach(function(item) {
//             $('head').prepend(item);
//         });
//     }
//     return $.html();
// };

PrajnaWrapperPlugin.prototype.injectPresets = function(raw) {
    const self = this;
    const $ = cheerio.load(raw, {
        decodeEntities: false
    });
    let document = raw;
    const htmlRegExp = /(<html\s*>)/i;
    const headRegExp = /(<\/head\s*>)/i;
    // if (htmlRegExp.test(raw) && !headRegExp.test(raw)) {
    //     $('html').prepend('<head></head>')
    //     document = $.html();
    // }
    // if (headRegExp.test(raw)) {
    //     document = self.getHtmlContent('head', raw);
    // }
    if (self.options.options.progressive.crossorigin) {
        document = document.replace(/<script/g, '<script crossorigin');
    }
	console.log(document);
    return document;
};

PrajnaWrapperPlugin.prototype.apply = function(compiler) {
    const self = this;
    const targets = self.options.includes;
    compiler.plugin('compilation', function(compilation) {
        const candidates = [];
        if (targets && targets.length) {
            targets.forEach(function (html) {
                candidates.push(path.resolve(process.cwd(), html));
            });
        }
        compilation.plugin('html-webpack-plugin-after-html-processing', function(data, callback) {
            if (candidates.length) {
                candidates.forEach(function(candidate) {
                    const c = new RegExp(candidate);
                    if (c.test(data.plugin.options.template)) {
                        data.html = self.injectPresets(data.html);
                    }
                });
            }
            // callback(null, data);
        });
    });
};

module.exports = PrajnaWrapperPlugin;
