"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ejs = _interopRequireDefault(require("ejs"));

var _fs = _interopRequireDefault(require("fs"));

var _mv = _interopRequireDefault(require("mv"));

var _path = _interopRequireDefault(require("path"));

var _fulcrumCore = require("fulcrum-core");

var _htmlToPdf = _interopRequireDefault(require("./html-to-pdf"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sanitizeFilename = _interopRequireDefault(require("sanitize-filename"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const move = _bluebird.default.promisify(_mv.default);

class ReportGenerator {
  constructor(record) {
    _defineProperty(this, "renderValues", (feature, renderFunction) => {
      for (const element of feature.formValues.container.elements) {
        const formValue = feature.formValues.get(element.key);

        if (formValue) {
          renderFunction(element, formValue);
        }
      }
    });

    this.record = record;
  }

  get contentTemplate() {
    return _fs.default.readFileSync(_path.default.join(__dirname, 'template.ejs')).toString();
  }

  async generate(directory) {
    const data = {
      DateUtils: _fulcrumCore.DateUtils,
      record: this.record,
      renderValues: this.renderValues
    };
    const options = {};

    const html = _ejs.default.render(this.contentTemplate, data, options);

    const topdf = new _htmlToPdf.default(html);
    const result = await topdf.run();
    let outputPath = null;

    if (result) {
      const reportName = (0, _sanitizeFilename.default)(this.record.displayValue || this.record.id);
      outputPath = _path.default.join(directory, reportName + '.pdf');
      await move(result.file, outputPath);
    }

    await topdf.cleanup();
    return {
      file: outputPath,
      size: result.size
    };
  }

  static async generate({
    reportName,
    template,
    header,
    footer,
    cover,
    data,
    directory,
    ejsOptions,
    reportOptions
  }) {
    const bodyContent = _ejs.default.render(template, data, ejsOptions);

    const headerContent = header ? _ejs.default.render(header, data, ejsOptions) : null;
    const footerContent = footer ? _ejs.default.render(footer, data, ejsOptions) : null;
    const coverContent = cover ? _ejs.default.render(cover, data, ejsOptions) : null;
    const topdf = new _htmlToPdf.default(bodyContent, {
      header: headerContent,
      footer: footerContent,
      cover: coverContent,
      ...reportOptions
    });
    const result = await topdf.run();
    let outputPath = null;

    if (result) {
      outputPath = _path.default.join(directory, (0, _sanitizeFilename.default)(reportName) + '.pdf');
      await move(result.file, outputPath);
    }

    await topdf.cleanup();
    return {
      file: outputPath,
      size: result.size
    };
  }

}

exports.default = ReportGenerator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3JlcG9ydHMvZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbIm1vdmUiLCJQcm9taXNlIiwicHJvbWlzaWZ5IiwibXYiLCJSZXBvcnRHZW5lcmF0b3IiLCJjb25zdHJ1Y3RvciIsInJlY29yZCIsImZlYXR1cmUiLCJyZW5kZXJGdW5jdGlvbiIsImVsZW1lbnQiLCJmb3JtVmFsdWVzIiwiY29udGFpbmVyIiwiZWxlbWVudHMiLCJmb3JtVmFsdWUiLCJnZXQiLCJrZXkiLCJjb250ZW50VGVtcGxhdGUiLCJmcyIsInJlYWRGaWxlU3luYyIsInBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwidG9TdHJpbmciLCJnZW5lcmF0ZSIsImRpcmVjdG9yeSIsImRhdGEiLCJEYXRlVXRpbHMiLCJyZW5kZXJWYWx1ZXMiLCJvcHRpb25zIiwiaHRtbCIsImVqcyIsInJlbmRlciIsInRvcGRmIiwiSHRtbFRvUGRmIiwicmVzdWx0IiwicnVuIiwib3V0cHV0UGF0aCIsInJlcG9ydE5hbWUiLCJkaXNwbGF5VmFsdWUiLCJpZCIsImZpbGUiLCJjbGVhbnVwIiwic2l6ZSIsInRlbXBsYXRlIiwiaGVhZGVyIiwiZm9vdGVyIiwiY292ZXIiLCJlanNPcHRpb25zIiwicmVwb3J0T3B0aW9ucyIsImJvZHlDb250ZW50IiwiaGVhZGVyQ29udGVudCIsImZvb3RlckNvbnRlbnQiLCJjb3ZlckNvbnRlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsSUFBSSxHQUFHQyxrQkFBUUMsU0FBUixDQUFrQkMsV0FBbEIsQ0FBYjs7QUFFZSxNQUFNQyxlQUFOLENBQXNCO0FBQ25DQyxFQUFBQSxXQUFXLENBQUNDLE1BQUQsRUFBUztBQUFBLDBDQXNDTCxDQUFDQyxPQUFELEVBQVVDLGNBQVYsS0FBNkI7QUFDMUMsV0FBSyxNQUFNQyxPQUFYLElBQXNCRixPQUFPLENB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QU0sRUFBRU0sYUFBaEM7QUFBK0NMLE1BQUFBLEtBQUssRUFBRU0sWUFBdEQ7QUFBb0UsU0FBR0o7QUFBdkUsS0FBM0IsQ0FBZDtBQUVBLFVBQU1kLE1BQU0sR0FBRyxNQUFNRixLQUFLLENBQUNHLEdBQU4sRUFBckI7QUFFQSxRQUFJQyxVQUFVLEdBQUcsSUFBakI7O0FBRUEsUUFBSUYsTUFBSixFQUFZO0FBQ1ZFLE1BQUFBLFVBQVUsR0FBR2pCLGNBQUtDLElBQUwsQ0FBVUksU0FBVixFQUFxQiwrQkFBU2EsVUFBVCxJQUF1QixNQUE1QyxDQUFiO0FBRUEsWUFBTXJDLElBQUksQ0FBQ2tDLE1BQU0sQ0FBQ00sSUFBUixFQUFjSixVQUFkLENBQVY7QUFDRDs7QUFFRCxVQUFNSixLQUFLLENBQUNTLE9BQU4sRUFBTjtBQUVBLFdBQU87QUFBQ0QsTUFBQUEsSUFBSSxFQUFFSixVQUFQO0FBQW1CTSxNQUFBQSxJQUFJLEVBQUVSLE1BQU0sQ0FBQ1E7QUFBaEMsS0FBUDtBQUNEOztBQXRFa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG12IGZyb20gJ212JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBIdG1sVG9QZGYgZnJvbSAnLi9odG1sLXRvLXBkZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgc2FuaXRpemUgZnJvbSAnc2FuaXRpemUtZmlsZW5hbWUnO1xuXG5jb25zdCBtb3ZlID0gUHJvbWlzZS5wcm9taXNpZnkobXYpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihyZWNvcmQpIHtcbiAgICB0aGlzLnJlY29yZCA9IHJlY29yZDtcbiAgfVxuXG4gIGdldCBjb250ZW50VGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVtcGxhdGUuZWpzJykpLnRvU3RyaW5nKCk7XG4gIH1cblxuICBhc3luYyBnZW5lcmF0ZShkaXJlY3RvcnkpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgRGF0ZVV0aWxzOiBEYXRlVXRpbHMsXG4gICAgICByZWNvcmQ6IHRoaXMucmVjb3JkLFxuICAgICAgcmVuZGVyVmFsdWVzOiB0aGlzLnJlbmRlclZhbHVlc1xuICAgIH07XG5cbiAgICBjb25zdCBvcHRpb25zID0ge307XG5cbiAgICBjb25zdCBodG1sID0gZWpzLnJlbmRlcih0aGlzLmNvbnRlbnRUZW1wbGF0ZSwgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCB0b3BkZiA9IG5ldyBIdG1sVG9QZGYoaHRtbCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0b3BkZi5ydW4oKTtcblxuICAgIGxldCBvdXRwdXRQYXRoID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHJlcG9ydE5hbWUgPSBzYW5pdGl6ZSh0aGlzLnJlY29yZC5kaXNwbGF5VmFsdWUgfHwgdGhpcy5yZWNvcmQuaWQpO1xuXG4gICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgcmVwb3J0TmFtZSArICcucGRmJyk7XG5cbiAgICAgIGF3YWl0IG1vdmUocmVzdWx0LmZpbGUsIG91dHB1dFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRvcGRmLmNsZWFudXAoKTtcblxuICAgIHJldHVybiB7ZmlsZTogb3V0cHV0UGF0aCwgc2l6ZTogcmVzdWx0LnNpemV9O1xuICB9XG5cbiAgcmVuZGVyVmFsdWVzID0gKGZlYXR1cmUsIHJlbmRlckZ1bmN0aW9uKSA9PiB7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5jb250YWluZXIuZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGZvcm1WYWx1ZSA9IGZlYXR1cmUuZm9ybVZhbHVlcy5nZXQoZWxlbWVudC5rZXkpO1xuXG4gICAgICBpZiAoZm9ybVZhbHVlKSB7XG4gICAgICAgIHJlbmRlckZ1bmN0aW9uKGVsZW1lbnQsIGZvcm1WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdlbmVyYXRlKHtyZXBvcnROYW1lLCB0ZW1wbGF0ZSwgaGVhZGVyLCBmb290ZXIsIGNvdmVyLCBkYXRhLCBkaXJlY3RvcnksIGVqc09wdGlvbnMsIHJlcG9ydE9wdGlvbnN9KSB7XG4gICAgY29uc3QgYm9keUNvbnRlbnQgPSBlanMucmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBlanNPcHRpb25zKTtcbiAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gaGVhZGVyID8gZWpzLnJlbmRlcihoZWFkZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcbiAgICBjb25zdCBmb290ZXJDb250ZW50ID0gZm9vdGVyID8gZWpzLnJlbmRlcihmb290ZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcbiAgICBjb25zdCBjb3ZlckNvbnRlbnQgPSBjb3ZlciA/IGVqcy5yZW5kZXIoY292ZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcblxuICAgIGNvbnN0IHRvcGRmID0gbmV3IEh0bWxUb1BkZihib2R5Q29udGVudCwge2hlYWRlcjogaGVhZGVyQ29udGVudCwgZm9vdGVyOiBmb290ZXJDb250ZW50LCBjb3ZlcjogY292ZXJDb250ZW50LCAuLi5yZXBvcnRPcHRpb25zfSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0b3BkZi5ydW4oKTtcblxuICAgIGxldCBvdXRwdXRQYXRoID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBzYW5pdGl6ZShyZXBvcnROYW1lKSArICcucGRmJyk7XG5cbiAgICAgIGF3YWl0IG1vdmUocmVzdWx0LmZpbGUsIG91dHB1dFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRvcGRmLmNsZWFudXAoKTtcblxuICAgIHJldHVybiB7ZmlsZTogb3V0cHV0UGF0aCwgc2l6ZTogcmVzdWx0LnNpemV9O1xuICB9XG59XG4iXX0=