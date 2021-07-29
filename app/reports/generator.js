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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvcnRzL2dlbmVyYXRvci5qcyJdLCJuYW1lcyI6WyJtb3ZlIiwiUHJvbWlzZSIsInByb21pc2lmeSIsIm12IiwiUmVwb3J0R2VuZXJhdG9yIiwiY29uc3RydWN0b3IiLCJyZWNvcmQiLCJmZWF0dXJlIiwicmVuZGVyRnVuY3Rpb24iLCJlbGVtZW50IiwiZm9ybVZhbHVlcyIsImNvbnRhaW5lciIsImVsZW1lbnRzIiwiZm9ybVZhbHVlIiwiZ2V0Iiwia2V5IiwiY29udGVudFRlbXBsYXRlIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInRvU3RyaW5nIiwiZ2VuZXJhdGUiLCJkaXJlY3RvcnkiLCJkYXRhIiwiRGF0ZVV0aWxzIiwicmVuZGVyVmFsdWVzIiwib3B0aW9ucyIsImh0bWwiLCJlanMiLCJyZW5kZXIiLCJ0b3BkZiIsIkh0bWxUb1BkZiIsInJlc3VsdCIsInJ1biIsIm91dHB1dFBhdGgiLCJyZXBvcnROYW1lIiwiZGlzcGxheVZhbHVlIiwiaWQiLCJmaWxlIiwiY2xlYW51cCIsInNpemUiLCJ0ZW1wbGF0ZSIsImhlYWRlciIsImZvb3RlciIsImNvdmVyIiwiZWpzT3B0aW9ucyIsInJlcG9ydE9wdGlvbnMiLCJib2R5Q29udGVudCIsImhlYWRlckNvbnRlbnQiLCJmb290ZXJDb250ZW50IiwiY292ZXJDb250ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLElBQUksR0FBR0Msa0JBQVFDLFNBQVIsQ0FBa0JDLFdBQWxCLENBQWI7O0FBRWUsTUFBTUMsZUFBTixDQUFzQjtBQUNuQ0MsRUFBQUEsV0FBVyxDQUFDQyxNQUFELEVBQVM7QUFBQSwwQ0FzQ0wsQ0FBQ0MsT0FBRCxFQUFVQyxjQUFWLEtBQTZCO0FBQzFDLFdBQUssTUFBTUMsT0FBWCxJQUFzQkYsT0FBTyxDQUFDRyxVQUFSLENBQW1CQyxTQUFuQixDQUE2QkMsUUFBbkQsRUFBNkQ7QUFDM0QsY0FBTUMsU0FBUyxHQUFHTixPQUFPLENBQUNHLFVBQVIsQ0FBbUJJLEdBQW5CLENBQXVCTCxPQUFPLENBQUNNLEdBQS9CLENBQWxCOztBQUVBLFlBQUlGLFNBQUosRUFBZTtBQUNiTCxVQUFBQSxjQUFjLENBQUNDLE9BQUQsRUFBVUksU0FBVixDQUFkO0FBQ0Q7QUFDRjtBQUNGLEtBOUNtQjs7QUFDbEIsU0FBS1AsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7O0FBRWtCLE1BQWZVLGVBQWUsR0FBRztBQUNwQixXQUFPQyxZQUFHQyxZQUFILENBQWdCQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsY0FBckIsQ0FBaEIsRUFBc0RDLFFBQXRELEVBQVA7QUFDRDs7QUFFYSxRQUFSQyxRQUFRLENBQUNDLFNBQUQsRUFBWTtBQUN4QixVQUFNQyxJQUFJLEdBQUc7QUFDWEMsTUFBQUEsU0FBUyxFQUFFQSxzQkFEQTtBQUVYcEIsTUFBQUEsTUFBTSxFQUFFLEtBQUtBLE1BRkY7QUFHWHFCLE1BQUFBLFlBQVksRUFBRSxLQUFLQTtBQUhSLEtBQWI7QUFNQSxVQUFNQyxPQUFPLEdBQUcsRUFBaEI7O0FBRUEsVUFBTUMsSUFBSSxHQUFHQyxhQUFJQyxNQUFKLENBQVcsS0FBS2YsZUFBaEIsRUFBaUNTLElBQWpDLEVBQXVDRyxPQUF2QyxDQUFiOztBQUVBLFVBQU1JLEtBQUssR0FBRyxJQUFJQyxrQkFBSixDQUFjSixJQUFkLENBQWQ7QUFFQSxVQUFNSyxNQUFNLEdBQUcsTUFBTUYsS0FBSyxDQUFDRyxHQUFOLEVBQXJCO0FBRUEsUUFBSUMsVUFBVSxHQUFHLElBQWpCOztBQUVBLFFBQUlGLE1BQUosRUFBWTtBQUNWLFlBQU1HLFVBQVUsR0FBRywrQkFBUyxLQUFLL0IsTUFBTCxDQUFZZ0MsWUFBWixJQUE0QixLQUFLaEMsTUFBTCxDQUFZaUMsRUFBakQsQ0FBbkI7QUFFQUgsTUFBQUEsVUFBVSxHQUFHakIsY0FBS0MsSUFBTCxDQUFVSSxTQUFWLEVBQXFCYSxVQUFVLEdBQUcsTUFBbEMsQ0FBYjtBQUVBLFlBQU1yQyxJQUFJLENBQUNrQyxNQUFNLENBQUNNLElBQVIsRUFBY0osVUFBZCxDQUFWO0FBQ0Q7O0FBRUQsVUFBTUosS0FBSyxDQUFDUyxPQUFOLEVBQU47QUFFQSxXQUFPO0FBQUNELE1BQUFBLElBQUksRUFBRUosVUFBUDtBQUFtQk0sTUFBQUEsSUFBSSxFQUFFUixNQUFNLENBQUNRO0FBQWhDLEtBQVA7QUFDRDs7QUFZb0IsZUFBUm5CLFFBQVEsQ0FBQztBQUFDYyxJQUFBQSxVQUFEO0FBQWFNLElBQUFBLFFBQWI7QUFBdUJDLElBQUFBLE1BQXZCO0FBQStCQyxJQUFBQSxNQUEvQjtBQUF1Q0MsSUFBQUEsS0FBdkM7QUFBOENyQixJQUFBQSxJQUE5QztBQUFvREQsSUFBQUEsU0FBcEQ7QUFBK0R1QixJQUFBQSxVQUEvRDtBQUEyRUMsSUFBQUE7QUFBM0UsR0FBRCxFQUE0RjtBQUMvRyxVQUFNQyxXQUFXLEdBQUduQixhQUFJQyxNQUFKLENBQVdZLFFBQVgsRUFBcUJsQixJQUFyQixFQUEyQnNCLFVBQTNCLENBQXBCOztBQUNBLFVBQU1HLGFBQWEsR0FBR04sTUFBTSxHQUFHZCxhQUFJQyxNQUFKLENBQVdhLE1BQVgsRUFBbUJuQixJQUFuQixFQUF5QnNCLFVBQXpCLENBQUgsR0FBMEMsSUFBdEU7QUFDQSxVQUFNSSxhQUFhLEdBQUdOLE1BQU0sR0FBR2YsYUFBSUMsTUFBSixDQUFXYyxNQUFYLEVBQW1CcEIsSUFBbkIsRUFBeUJzQixVQUF6QixDQUFILEdBQTBDLElBQXRFO0FBQ0EsVUFBTUssWUFBWSxHQUFHTixLQUFLLEdBQUdoQixhQUFJQyxNQUFKLENBQVdlLEtBQVgsRUFBa0JyQixJQUFsQixFQUF3QnNCLFVBQXhCLENBQUgsR0FBeUMsSUFBbkU7QUFFQSxVQUFNZixLQUFLLEdBQUcsSUFBSUMsa0JBQUosQ0FBY2dCLFdBQWQsRUFBMkI7QUFBQ0wsTUFBQUEsTUFBTSxFQUFFTSxhQUFUO0FBQXdCTCxNQUFBQSxNQUFNLEVBQUVNLGFBQWhDO0FBQStDTCxNQUFBQSxLQUFLLEVBQUVNLFlBQXREO0FBQW9FLFNBQUdKO0FBQXZFLEtBQTNCLENBQWQ7QUFFQSxVQUFNZCxNQUFNLEdBQUcsTUFBTUYsS0FBSyxDQUFDRyxHQUFOLEVBQXJCO0FBRUEsUUFBSUMsVUFBVSxHQUFHLElBQWpCOztBQUVBLFFBQUlGLE1BQUosRUFBWTtBQUNWRSxNQUFBQSxVQUFVLEdBQUdqQixjQUFLQyxJQUFMLENBQVVJLFNBQVYsRUFBcUIsK0JBQVNhLFVBQVQsSUFBdUIsTUFBNUMsQ0FBYjtBQUVBLFlBQU1yQyxJQUFJLENBQUNrQyxNQUFNLENBQUNNLElBQVIsRUFBY0osVUFBZCxDQUFWO0FBQ0Q7O0FBRUQsVUFBTUosS0FBSyxDQUFDUyxPQUFOLEVBQU47QUFFQSxXQUFPO0FBQUNELE1BQUFBLElBQUksRUFBRUosVUFBUDtBQUFtQk0sTUFBQUEsSUFBSSxFQUFFUixNQUFNLENBQUNRO0FBQWhDLEtBQVA7QUFDRDs7QUF0RWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBtdiBmcm9tICdtdic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgSHRtbFRvUGRmIGZyb20gJy4vaHRtbC10by1wZGYnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHNhbml0aXplIGZyb20gJ3Nhbml0aXplLWZpbGVuYW1lJztcblxuY29uc3QgbW92ZSA9IFByb21pc2UucHJvbWlzaWZ5KG12KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwb3J0R2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVjb3JkKSB7XG4gICAgdGhpcy5yZWNvcmQgPSByZWNvcmQ7XG4gIH1cblxuICBnZXQgY29udGVudFRlbXBsYXRlKCkge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3RlbXBsYXRlLmVqcycpKS50b1N0cmluZygpO1xuICB9XG5cbiAgYXN5bmMgZ2VuZXJhdGUoZGlyZWN0b3J5KSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIERhdGVVdGlsczogRGF0ZVV0aWxzLFxuICAgICAgcmVjb3JkOiB0aGlzLnJlY29yZCxcbiAgICAgIHJlbmRlclZhbHVlczogdGhpcy5yZW5kZXJWYWx1ZXNcbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgY29uc3QgaHRtbCA9IGVqcy5yZW5kZXIodGhpcy5jb250ZW50VGVtcGxhdGUsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgdG9wZGYgPSBuZXcgSHRtbFRvUGRmKGh0bWwpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdG9wZGYucnVuKCk7XG5cbiAgICBsZXQgb3V0cHV0UGF0aCA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBjb25zdCByZXBvcnROYW1lID0gc2FuaXRpemUodGhpcy5yZWNvcmQuZGlzcGxheVZhbHVlIHx8IHRoaXMucmVjb3JkLmlkKTtcblxuICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnksIHJlcG9ydE5hbWUgKyAnLnBkZicpO1xuXG4gICAgICBhd2FpdCBtb3ZlKHJlc3VsdC5maWxlLCBvdXRwdXRQYXRoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0b3BkZi5jbGVhbnVwKCk7XG5cbiAgICByZXR1cm4ge2ZpbGU6IG91dHB1dFBhdGgsIHNpemU6IHJlc3VsdC5zaXplfTtcbiAgfVxuXG4gIHJlbmRlclZhbHVlcyA9IChmZWF0dXJlLCByZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuY29udGFpbmVyLmVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBmb3JtVmFsdWUgPSBmZWF0dXJlLmZvcm1WYWx1ZXMuZ2V0KGVsZW1lbnQua2V5KTtcblxuICAgICAgaWYgKGZvcm1WYWx1ZSkge1xuICAgICAgICByZW5kZXJGdW5jdGlvbihlbGVtZW50LCBmb3JtVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZW5lcmF0ZSh7cmVwb3J0TmFtZSwgdGVtcGxhdGUsIGhlYWRlciwgZm9vdGVyLCBjb3ZlciwgZGF0YSwgZGlyZWN0b3J5LCBlanNPcHRpb25zLCByZXBvcnRPcHRpb25zfSkge1xuICAgIGNvbnN0IGJvZHlDb250ZW50ID0gZWpzLnJlbmRlcih0ZW1wbGF0ZSwgZGF0YSwgZWpzT3B0aW9ucyk7XG4gICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGhlYWRlciA/IGVqcy5yZW5kZXIoaGVhZGVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG4gICAgY29uc3QgZm9vdGVyQ29udGVudCA9IGZvb3RlciA/IGVqcy5yZW5kZXIoZm9vdGVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG4gICAgY29uc3QgY292ZXJDb250ZW50ID0gY292ZXIgPyBlanMucmVuZGVyKGNvdmVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG5cbiAgICBjb25zdCB0b3BkZiA9IG5ldyBIdG1sVG9QZGYoYm9keUNvbnRlbnQsIHtoZWFkZXI6IGhlYWRlckNvbnRlbnQsIGZvb3RlcjogZm9vdGVyQ29udGVudCwgY292ZXI6IGNvdmVyQ29udGVudCwgLi4ucmVwb3J0T3B0aW9uc30pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdG9wZGYucnVuKCk7XG5cbiAgICBsZXQgb3V0cHV0UGF0aCA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgc2FuaXRpemUocmVwb3J0TmFtZSkgKyAnLnBkZicpO1xuXG4gICAgICBhd2FpdCBtb3ZlKHJlc3VsdC5maWxlLCBvdXRwdXRQYXRoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0b3BkZi5jbGVhbnVwKCk7XG5cbiAgICByZXR1cm4ge2ZpbGU6IG91dHB1dFBhdGgsIHNpemU6IHJlc3VsdC5zaXplfTtcbiAgfVxufVxuIl19