"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sequenceSplitter = sequenceSplitter;
exports.jsonSequenceStream = jsonSequenceStream;
exports.parseFile = parseFile;

var _assert = _interopRequireDefault(require("assert"));

var _through = _interopRequireDefault(require("through2"));

var _fs = _interopRequireDefault(require("fs"));

var _delimitStream = _interopRequireDefault(require("delimit-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sequenceSplitter() {
  return new _delimitStream.default('\x1e', {
    objectMode: true
  });
}

function jsonSequenceStream({
  onObject,
  onInvalid,
  onTruncated
} = {}) {
  return _through.default.obj(function (chunk, encoding, completion) {
    _assert.default.ok(chunk.length > 0); // if the entry doesn't end with \n, it got truncated


    if (chunk[chunk.length - 1] !== 0x0a) {
      this.push({
        truncated: chunk
      });

      if (onTruncated) {
        onTruncated(chunk, completion);
      } else {
        completion();
      }
    } else {
      try {
        const json = JSON.parse(chunk.toString());
        this.push({
          json: json
        });

        if (onObject) {
          onObject(json, completion);
        } else {
          completion();
        }
      } catch (error) {
        this.push({
          invalid: chunk
        });

        if (onInvalid) {
          onInvalid(chunk, completion);
        } else {
          completion();
        }
      }
    }
  });
}

function parseFile(filePath, {
  onObject,
  onInvalid,
  onTruncated
}) {
  return _fs.default.createReadStream(filePath).pipe(sequenceSplitter()).pipe(jsonSequenceStream({
    onObject,
    onInvalid,
    onTruncated
  })).on('data', () => {});
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uc2VxLmpzIl0sIm5hbWVzIjpbInNlcXVlbmNlU3BsaXR0ZXIiLCJEZWxpbWl0U3RyZWFtIiwib2JqZWN0TW9kZSIsImpzb25TZXF1ZW5jZVN0cmVhbSIsIm9uT2JqZWN0Iiwib25JbnZhbGlkIiwib25UcnVuY2F0ZWQiLCJ0aHJvdWdoMiIsIm9iaiIsImNodW5rIiwiZW5jb2RpbmciLCJjb21wbGV0aW9uIiwiYXNzZXJ0Iiwib2siLCJsZW5ndGgiLCJwdXNoIiwidHJ1bmNhdGVkIiwianNvbiIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwiZXJyb3IiLCJpbnZhbGlkIiwicGFyc2VGaWxlIiwiZmlsZVBhdGgiLCJmcyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJwaXBlIiwib24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsZ0JBQVQsR0FBNEI7QUFDakMsU0FBTyxJQUFJQyxzQkFBSixDQUFrQixNQUFsQixFQUEwQjtBQUFDQyxJQUFBQSxVQUFVLEVBQUU7QUFBYixHQUExQixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0Msa0JBQVQsQ0FBNEI7QUFBQ0MsRUFBQUEsUUFBRDtBQUFXQyxFQUFBQSxTQUFYO0FBQXNCQyxFQUFBQTtBQUF0QixJQUFxQyxFQUFqRSxFQUFxRTtBQUMxRSxTQUFPQyxpQkFBU0MsR0FBVCxDQUFhLFVBQVNDLEtBQVQsRUFBZ0JDLFFBQWhCLEVBQTBCQyxVQUExQixFQUFzQztBQUN4REMsb0JBQU9DLEVBQVAsQ0FBVUosS0FBSyxDQUFDSyxNQUFOLEdBQWUsQ0FBekIsRUFEd0QsQ0FHeEQ7OztBQUNBLFFBQUlMLEtBQUssQ0FBQ0EsS0FBSyxDQUFDSyxNQUFOLEdBQWUsQ0FBaEIsQ0FBTCxLQUE0QixJQUFoQyxFQUFzQztBQUNwQyxXQUFLQyxJQUFMLENBQVU7QUFBQ0MsUUFBQUEsU0FBUyxFQUFFUDtBQUFaLE9BQVY7O0FBRUEsVUFBSUgsV0FBSixFQUFpQjtBQUNmQSxRQUFBQSxXQUFXLENBQUNHLEtBQUQsRUFBUUUsVUFBUixDQUFYO0FBQ0QsT0FGRCxNQUVPO0FBQ0xBLFFBQUFBLFVBQVU7QUFDWDtBQUNGLEtBUkQsTUFRTztBQUNMLFVBQUk7QUFDRixjQUFNTSxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXVixLQUFLLENBQUNXLFFBQU4sRUFBWCxDQUFiO0FBRUEsYUFBS0wsSUFBTCxDQUFVO0FBQUNFLFVBQUFBLElBQUksRUFBRUE7QUFBUCxTQUFWOztBQUVBLFlBQUliLFFBQUosRUFBYztBQUNaQSxVQUFBQSxRQUFRLENBQUNhLElBQUQsRUFBT04sVUFBUCxDQUFSO0FBQ0QsU0FGRCxNQUVPO0FBQ0xBLFVBQUFBLFVBQVU7QUFDWDtBQUNGLE9BVkQsQ0FVRSxPQUFPVSxLQUFQLEVBQWM7QUFDZCxhQUFLTixJQUFMLENBQVU7QUFBQ08sVUFBQUEsT0FBTyxFQUFFYjtBQUFWLFNBQVY7O0FBRUEsWUFBSUosU0FBSixFQUFlO0FBQ2JBLFVBQUFBLFNBQVMsQ0FBQ0ksS0FBRCxFQUFRRSxVQUFSLENBQVQ7QUFDRCxTQUZELE1BRU87QUFDTEEsVUFBQUEsVUFBVTtBQUNYO0FBQ0Y7QUFDRjtBQUNGLEdBakNNLENBQVA7QUFrQ0Q7O0FBRU0sU0FBU1ksU0FBVCxDQUFtQkMsUUFBbkIsRUFBNkI7QUFBQ3BCLEVBQUFBLFFBQUQ7QUFBV0MsRUFBQUEsU0FBWDtBQUFzQkMsRUFBQUE7QUFBdEIsQ0FBN0IsRUFBaUU7QUFDdEUsU0FBT21CLFlBQUdDLGdCQUFILENBQW9CRixRQUFwQixFQUNHRyxJQURILENBQ1EzQixnQkFBZ0IsRUFEeEIsRUFFRzJCLElBRkgsQ0FFUXhCLGtCQUFrQixDQUFDO0FBQUNDLElBQUFBLFFBQUQ7QUFBV0MsSUFBQUEsU0FBWDtBQUFzQkMsSUFBQUE7QUFBdEIsR0FBRCxDQUYxQixFQUdHc0IsRUFISCxDQUdNLE1BSE4sRUFHYyxNQUFNLENBQUUsQ0FIdEIsQ0FBUDtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IHRocm91Z2gyIGZyb20gJ3Rocm91Z2gyJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgRGVsaW1pdFN0cmVhbSBmcm9tICdkZWxpbWl0LXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZVNwbGl0dGVyKCkge1xuICByZXR1cm4gbmV3IERlbGltaXRTdHJlYW0oJ1xceDFlJywge29iamVjdE1vZGU6IHRydWV9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGpzb25TZXF1ZW5jZVN0cmVhbSh7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9ID0ge30pIHtcbiAgcmV0dXJuIHRocm91Z2gyLm9iaihmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNvbXBsZXRpb24pIHtcbiAgICBhc3NlcnQub2soY2h1bmsubGVuZ3RoID4gMCk7XG5cbiAgICAvLyBpZiB0aGUgZW50cnkgZG9lc24ndCBlbmQgd2l0aCBcXG4sIGl0IGdvdCB0cnVuY2F0ZWRcbiAgICBpZiAoY2h1bmtbY2h1bmsubGVuZ3RoIC0gMV0gIT09IDB4MGEpIHtcbiAgICAgIHRoaXMucHVzaCh7dHJ1bmNhdGVkOiBjaHVua30pO1xuXG4gICAgICBpZiAob25UcnVuY2F0ZWQpIHtcbiAgICAgICAgb25UcnVuY2F0ZWQoY2h1bmssIGNvbXBsZXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGlvbigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShjaHVuay50b1N0cmluZygpKTtcblxuICAgICAgICB0aGlzLnB1c2goe2pzb246IGpzb259KTtcblxuICAgICAgICBpZiAob25PYmplY3QpIHtcbiAgICAgICAgICBvbk9iamVjdChqc29uLCBjb21wbGV0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wbGV0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMucHVzaCh7aW52YWxpZDogY2h1bmt9KTtcblxuICAgICAgICBpZiAob25JbnZhbGlkKSB7XG4gICAgICAgICAgb25JbnZhbGlkKGNodW5rLCBjb21wbGV0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wbGV0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VGaWxlKGZpbGVQYXRoLCB7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9KSB7XG4gIHJldHVybiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVQYXRoKVxuICAgICAgICAgICAucGlwZShzZXF1ZW5jZVNwbGl0dGVyKCkpXG4gICAgICAgICAgIC5waXBlKGpzb25TZXF1ZW5jZVN0cmVhbSh7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9KSlcbiAgICAgICAgICAgLm9uKCdkYXRhJywgKCkgPT4ge30pO1xufVxuIl19