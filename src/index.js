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
const UglifyJs = require('uglify-js');

let PrajnaWrapperPlugin = function(opt) {
    if (this instanceof PrajnaWrapperPlugin) {
        this.progressive = _.extend({
            crossorigin: true,
            scriptPath: `https://cdn.jsdelivr.net/npm/prajna@1.0.0-rc.8/dist/prajna.1.0.0-rc.8.js`
        }, opt.options.progressive);

        this.options = {
            includes: opt.includes || [],
            options: {
                autopv: opt.options.autopv || false,
                env: opt.options.env || 'dev',
                project: opt.options.project || 'unnamed-project',
                prajnaServerUrls: _.extend({
                    'dev': '//',
                    'test': '//',
                    'alpha': '//',
                    'beta': '//',
                    'release-candidate': '//',
                    'product': '//'
                }, opt.options.prajnaServerUrls),
                progressive: this.progressive
            }
        };

        this.dns = this.progressive.scriptPath.substring(this.progressive.scriptPath.indexOf('://') + 1,
                                                         this.progressive.scriptPath.substring(this.progressive.scriptPath.indexOf('://') + 3).indexOf('/') + this.progressive.scriptPath.indexOf('://') + 3);

        this.presets = {
            'meta': [
                `<link class="prajna-wrapper-content" rel="dns-prefetch" href="${this.dns}">`,
                `<meta class="prajna-wrapper-content" name="prajna:autopv" content="${this.options.options.autopv}"/>`
            ],
            'script': [
                `<script type="text/javascript" class="prajna-wrapper-content">${UglifyJs.minify(
                     `
                     window.__prajnaAutoPV__ = ${this.options.options.autopv};
                     window.__prajnaServerUrls__ = ${JSON.stringify(this.options.options.prajnaServerUrls)};
                     window.__prajnaEnv__ = "${this.options.options.env}";
                     window.__prajnaServerUrl__ = window.__prajnaServerUrls__.${this.options.options.env};
                     window.__appName__ = "${this.options.options.project}";
                     `
                ).code}</script>`
            ],
            'prajna-static': [`<script type="text/javascript" charset="utf-8" class="prajna-wrapper-content" type="text/javascript" src="${this.progressive.scriptPath}"></script>`]
        };
    } else {
        return new PrajnaWrapperPlugin(opt);
    }
};

PrajnaWrapperPlugin.prototype.injectPresets = function(raw) {
    const self = this;
    const $ = cheerio.load(raw, {
        decodeEntities: false
    });
    let document = raw;
    const htmlRegExp = /(<html\s*>)/i;
    const headRegExp = /(<\/head\s*>)/i;
    if (htmlRegExp.test(raw) && !headRegExp.test(raw)) {
        $('html').prepend('<head></head>')
        document = $.html();
    }
    if (headRegExp.test(document)) {
        self.presets['prajna-static'].forEach(function(sdk) {
            $('head').prepend(sdk);
        });
        self.presets.script.forEach(function(script) {
            $('head').prepend(script);
        });
        self.presets.meta.forEach(function(meta) {
            $('head').prepend(meta);
        });
        document = $.html();
    }
    if (self.options.options.progressive.crossorigin) {
        document = document.replace(/<script/g, '<script crossorigin="anonymous"');
    }
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
            callback(null, data);
        });
    });
};

module.exports = PrajnaWrapperPlugin;
