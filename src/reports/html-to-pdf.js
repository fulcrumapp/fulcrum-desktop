import uuid from 'uuid';
import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import async from 'async';
import rimraf from 'rimraf';

const DEFAULT_MARGIN = '0.75in';
const DEFAULT_PAGE_SIZE = 'Letter';
const DEFAULT_IMAGE_QUALITY = '85';
const DEFAULT_ORIENTATION = 'Portrait';

export default class HtmlToPdf {
  constructor(html, {header, footer, cover, marginTop, marginBottom, marginLeft, marginRight, pageSize, imageQuality, orientation, wkhtmltopdf}) {
    this.tempID = uuid.v4();
    this.debug = false;
    this.html = html;
    this.header = header;
    this.footer = footer;
    this.cover = cover;
    this.wkhtmltopdf = wkhtmltopdf;
    this.marginTop = marginTop || DEFAULT_MARGIN;
    this.marginBottom = marginBottom || DEFAULT_MARGIN;
    this.marginLeft = marginLeft || DEFAULT_MARGIN;
    this.marginRight = marginRight || DEFAULT_MARGIN;
    this.pageSize = pageSize || DEFAULT_PAGE_SIZE;
    this.imageQuality = imageQuality || DEFAULT_IMAGE_QUALITY;
    this.orientation = orientation || DEFAULT_ORIENTATION;
  }

  get binary() {
    return this.wkhtmltopdf || '/usr/local/bin/wkhtmltopdf';
  }

  get command() {
    const parts = [
      '--page-size', this.pageSize,
      '--margin-top', this.marginTop,
      '--margin-left', this.marginLeft,
      '--margin-bottom', this.marginBottom,
      '--margin-right', this.marginRight,
      '--image-quality', this.imageQuality,
      '--orientation', this.orientation,
      '--encoding', 'UTF-8',
      this.quietArgument,
      ...this.coverArgument,
      ...this.headerArgument,
      ...this.footerArgument,
      this.inputArgument,
      this.outputArgument ];

    return _.compact(parts);
  }

  tempFilePath(part, ext = 'html') {
    return path.join(os.tmpdir(), `${this.tempID}_${part}.${ext}`);
  }

  get quietArgument() {
    return '--quiet';
    // return this.debug ? null : '--quiet';
  }

  get inputArgument() {
    return '-';
  }

  get outputArgument() {
    return this.tempFilePath(this.tempID + '_output', 'pdf');
  }

  get coverArgument() {
    if (this.cover) {
      const coverPath = this.tempFilePath('cover');

      fs.writeFileSync(coverPath, this.cover);

      return [ 'cover', coverPath ];
    }

    return [];
  }

  get headerArgument() {
    if (this.header) {
      const headerPath = this.tempFilePath('header');

      fs.writeFileSync(headerPath, this.header);

      return [ '--header-html', headerPath ];
    }

    return [];
  }

  get footerArgument() {
    if (this.footer) {
      const footerPath = this.tempFilePath('footer');

      fs.writeFileSync(footerPath, this.footer);

      return [ '--footer-html', footerPath ];
    }

    return [];
  }

  run() {
    return new Promise((resolve, reject) => {
      const cmd = this.command;

      const process = spawn(this.binary, cmd, {});

      const stdout = [];
      const stderr = [];

      process.stdin.setEncoding('utf8');
      process.stdin.end(this.html);

      process.stdout.on('data', (data) => {
        stdout.push(data.toString());
      });

      process.stderr.on('data', (data) => {
        stderr.push(data.toString());
      });

      process.on('close', (code) => {
        fs.stat(this.outputArgument, (err, stat) => {
          if (err) {
            return reject(err);
          }

          return resolve({code: code,
                          stdout: stdout,
                          stderr: stderr,
                          size: stat.size,
                          file: this.outputArgument});
        });
      });
    });
  }

  cleanup() {
    const files = [
      this.tempFilePath('header'),
      this.tempFilePath('cover'),
      this.tempFilePath('content'),
      this.tempFilePath('footer'),
      this.tempFilePath('toc', 'xml'),
      this.tempFilePath('output', 'pdf')
    ];

    return new Promise((resolve, reject) => {
      async.each(files, rimraf, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
}
