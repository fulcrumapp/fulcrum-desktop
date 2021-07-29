"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _request = _interopRequireDefault(require("request"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _fs = _interopRequireDefault(require("fs"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reqPromise = _bluebird.default.promisify(_request.default);

const req = options => reqPromise({
  forever: true,
  ...options
});

const defaultOptions = {
  headers: {
    'User-Agent': 'Fulcrum Sync',
    'Accept': 'application/json'
  }
};
const BASE_URL = 'https://api.fulcrumapp.com';

class Client {
  urlForResource(resource) {
    return BASE_URL + resource;
  }

  rawRequest(options) {
    return (0, _request.default)({
      forever: true,
      ...options
    });
  }

  request(options) {
    return req(options);
  }

  optionsForAuthenticatedRequest(token, options) {
    const result = (0, _lodash.extend)({}, defaultOptions, options);

    if (token) {
      result.headers['X-ApiToken'] = token;
    }

    return result;
  }

  authenticate(userName, password) {
    const options = {
      method: 'GET',
      uri: this.urlForResource('/api/v2/users.json'),
      auth: {
        username: userName,
        password: password,
        sendImmediately: true
      },
      headers: defaultOptions.headers
    };
    return this.request(options);
  }

  authenticateWithToken(token) {
    return this.request(this.getRequestOptions(token, '/api/v2/users.json'));
  }

  getRequestOptions(token, path, opts) {
    return this.optionsForAuthenticatedRequest(token, {
      url: this.urlForResource(path),
      ...opts
    });
  }

  getResource(account, path, opts = {}) {
    return this.request(this.getRequestOptions(account.token, path, opts));
  }

  getSync(account) {
    return this.getResource(account, '/api/_private/sync.json');
  }

  getRoles(account) {
    return this.getResource(account, '/api/v2/roles.json');
  }

  getMemberships(account) {
    return this.getResource(account, '/api/v2/memberships.json');
  }

  getForms(account) {
    return this.getResource(account, '/api/v2/forms.json');
  }

  getChoiceLists(account) {
    return this.getResource(account, '/api/v2/choice_lists.json');
  }

  getClassificationSets(account) {
    return this.getResource(account, '/api/v2/classification_sets.json');
  }

  getProjects(account) {
    return this.getResource(account, '/api/v2/projects.json');
  }

  getPhotos(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };
    return this.getResource(account, '/api/v2/photos.json', {
      qs
    });
  }

  getVideos(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };
    return this.getResource(account, '/api/v2/videos.json', {
      qs
    });
  }

  getAudio(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };
    return this.getResource(account, '/api/v2/audio.json', {
      qs
    });
  }

  getSignatures(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };
    return this.getResource(account, '/api/v2/signatures.json', {
      qs
    });
  }

  getChangesets(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      counts: '0'
    };
    return this.getResource(account, '/api/v2/changesets.json', {
      qs
    });
  }

  getQueryURL(account, sql) {
    const qs = {
      q: sql,
      format: 'jsonseq',
      arrays: 1
    };
    return this.getRequestOptions(account.token, '/api/v2/query', {
      qs
    });
  }

  getPhotoURL(account, media) {
    return this.urlForResource(`/api/v2/photos/${media.id}?token=${account.token}`);
  }

  getVideoURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${media.id}?token=${account.token}`);
  }

  getVideoTrackURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${media.id}/track.json?token=${account.token}`);
  }

  getVideoTrack(account, media) {
    return this.getResource(account, `/api/v2/videos/${media.id}/track.json`);
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}?token=${account.token}`);
  }

  getAudioTrackURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}/track.json?token=${account.token}`);
  }

  getAudioTrack(account, media) {
    return this.getResource(account, `/api/v2/audio/${media.id}/track.json`);
  }

  getSignatureURL(account, media) {
    return this.urlForResource(`/api/v2/signatures/${media.id}?token=${account.token}`);
  }

  download(url, to) {
    return new _bluebird.default((resolve, reject) => {
      const rq = (0, _request.default)(url).pipe(_fs.default.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }

  getRecords(account, form, sequence, pageSize) {
    const qs = {
      form_id: form.id,
      per_page: pageSize,
      sequence: sequence || 0
    };
    return this.getResource(account, '/api/v2/records.json', {
      qs
    });
  }

  getRecordsHistory(account, form, sequence, pageSize) {
    const qs = {
      form_id: form.id,
      per_page: pageSize,
      extents: 0,
      sequence: sequence || 0
    };
    return this.getResource(account, '/api/v2/records/history.json', {
      qs
    });
  }

}

const client = new Client();
var _default = client;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsIlByb21pc2UiLCJwcm9taXNpZnkiLCJyZXF1ZXN0IiwicmVxIiwib3B0aW9ucyIsImZvcmV2ZXIiLCJkZWZhdWx0T3B0aW9ucyIsImhlYWRlcnMiLCJCQVNFX1VSTCIsIkNsaWVudCIsInVybEZvclJlc291cmNlIiwicmVzb3VyY2UiLCJyYXdSZXF1ZXN0Iiwib3B0aW9uc0ZvckF1dGhlbnRpY2F0ZWRSZXF1ZXN0IiwidG9rZW4iLCJyZXN1bHQiLCJhdXRoZW50aWNhdGUiLCJ1c2VyTmFtZSIsInBhc3N3b3JkIiwibWV0aG9kIiwidXJpIiwiYXV0aCIsInVzZXJuYW1lIiwic2VuZEltbWVkaWF0ZWx5IiwiYXV0aGVudGljYXRlV2l0aFRva2VuIiwiZ2V0UmVxdWVzdE9wdGlvbnMiLCJwYXRoIiwib3B0cyIsInVybCIsImdldFJlc291cmNlIiwiYWNjb3VudCIsImdldFN5bmMiLCJnZXRSb2xlcyIsImdldE1lbWJlcnNoaXBzIiwiZ2V0Rm9ybXMiLCJnZXRDaG9pY2VMaXN0cyIsImdldENsYXNzaWZpY2F0aW9uU2V0cyIsImdldFByb2plY3RzIiwiZ2V0UGhvdG9zIiwic2VxdWVuY2UiLCJwZXJQYWdlIiwicXMiLCJwZXJfcGFnZSIsImZ1bGwiLCJnZXRWaWRlb3MiLCJnZXRBdWRpbyIsImdldFNpZ25hdHVyZXMiLCJnZXRDaGFuZ2VzZXRzIiwiY291bnRzIiwiZ2V0UXVlcnlVUkwiLCJzcWwiLCJxIiwiZm9ybWF0IiwiYXJyYXlzIiwiZ2V0UGhvdG9VUkwiLCJtZWRpYSIsImlkIiwiZ2V0VmlkZW9VUkwiLCJnZXRWaWRlb1RyYWNrVVJMIiwiZ2V0VmlkZW9UcmFjayIsImdldEF1ZGlvVVJMIiwiZ2V0QXVkaW9UcmFja1VSTCIsImdldEF1ZGlvVHJhY2siLCJnZXRTaWduYXR1cmVVUkwiLCJkb3dubG9hZCIsInRvIiwicmVzb2x2ZSIsInJlamVjdCIsInJxIiwicGlwZSIsImZzIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbiIsImdldFJlY29yZHMiLCJmb3JtIiwicGFnZVNpemUiLCJmb3JtX2lkIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJleHRlbnRzIiwiY2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxVQUFVLEdBQUdDLGtCQUFRQyxTQUFSLENBQWtCQyxnQkFBbEIsQ0FBbkI7O0FBQ0EsTUFBTUMsR0FBRyxHQUFJQyxPQUFELElBQWFMLFVBQVUsQ0FBQztBQUFDTSxFQUFBQSxPQUFPLEVBQUUsSUFBVjtBQUFnQixLQUFHRDtBQUFuQixDQUFELENBQW5DOztBQUVBLE1BQU1FLGNBQWMsR0FBRztBQUNyQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ1Asa0JBQWMsY0FEUDtBQUVQLGNBQVU7QUFGSDtBQURZLENBQXZCO0FBT0EsTUFBTUMsUUFBUSxHQUFHLDRCQUFqQjs7QUFFQSxNQUFNQyxNQUFOLENBQWE7QUFDWEMsRUFBQUEsY0FBYyxDQUFDQyxRQUFELEVBQVc7QUFDdkIsV0FBT0gsUUFBUSxHQUFHRyxRQUFsQjtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLENBQUNSLE9BQUQsRUFBVTtBQUNsQixXQUFPLHNCQUFRO0FBQUNDLE1BQUFBLE9BQU8sRUFBRSxJQUFWO0FBQWdCLFNBQUdEO0FBQW5CLEtBQVIsQ0FBUDtBQUNEOztBQUVERixFQUFBQSxPQUFPLENBQUNFLE9BQUQsRUFBVTtBQUNmLFdBQU9ELEdBQUcsQ0FBQ0MsT0FBRCxDQUFWO0FBQ0Q7O0FBRURTLEVBQUFBLDhCQUE4QixDQUFDQyxLQUFELEVBQVFWLE9BQVIsRUFBaUI7QUFDN0MsVUFBTVcsTUFBTSxHQUFHLG9CQUFPLEVBQVAsRUFBV1QsY0FBWCxFQUEyQkYsT0FBM0IsQ0FBZjs7QUFFQSxRQUFJVSxLQUFKLEVBQVc7QUFDVEMsTUFBQUEsTUFBTSxDQUFDUixPQUFQLENBQWUsWUFBZixJQUErQk8sS0FBL0I7QUFDRDs7QUFFRCxX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QUFOLEVBQWVMLE1BQWY7QUFDRCxLQUpNLENBQVA7QUFLRDs7QUFFRE0sRUFBQUEsVUFBVSxDQUFDM0MsT0FBRCxFQUFVNEMsSUFBVixFQUFnQm5DLFFBQWhCLEVBQTBCb0MsUUFBMUIsRUFBb0M7QUFDNUMsVUFBTWxDLEVBQUUsR0FBRztBQUNUbUMsTUFBQUEsT0FBTyxFQUFFRixJQUFJLENBQUNsQixFQURMO0FBRVRkLE1BQUFBLFFBQVEsRUFBRWlDLFFBRkQ7QUFHVHBDLE1BQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJO0FBSGIsS0FBWDtBQU1BLFdBQU8sS0FBS1YsV0FBTCxDQUFpQkMsT0FBakIsRUFBMEIsc0JBQTFCLEVBQWtEO0FBQUNXLE1BQUFBO0FBQUQsS0FBbEQsQ0FBUDtBQUNEOztBQUVEb0MsRUFBQUEsaUJBQWlCLENBQUMvQyxPQUFELEVBQVU0QyxJQUFWLEVBQWdCbkMsUUFBaEIsRUFBMEJvQyxRQUExQixFQUFvQztBQUNuRCxVQUFNbEMsRUFBRSxHQUFHO0FBQ1RtQyxNQUFBQSxPQUFPLEVBQUVGLElBQUksQ0FBQ2xCLEVBREw7QUFFVGQsTUFBQUEsUUFBUSxFQUFFaUMsUUFGRDtBQUdURyxNQUFBQSxPQUFPLEVBQUUsQ0FIQTtBQUlUdkMsTUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUk7QUFKYixLQUFYO0FBT0EsV0FBTyxLQUFLVixXQUFMLENBQWlCQyxPQUFqQixFQUEwQiw4QkFBMUIsRUFBMEQ7QUFBQ1csTUFBQUE7QUFBRCxLQUExRCxDQUFQO0FBQ0Q7O0FBeE1VOztBQTJNYixNQUFNc0MsTUFBTSxHQUFHLElBQUl0RSxNQUFKLEVBQWY7ZUFFZXNFLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBleHRlbmQgfSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCByZXFQcm9taXNlID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWVzdCk7XG5jb25zdCByZXEgPSAob3B0aW9ucykgPT4gcmVxUHJvbWlzZSh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgaGVhZGVyczoge1xuICAgICdVc2VyLUFnZW50JzogJ0Z1bGNydW0gU3luYycsXG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG59O1xuXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwczovL2FwaS5mdWxjcnVtYXBwLmNvbSc7XG5cbmNsYXNzIENsaWVudCB7XG4gIHVybEZvclJlc291cmNlKHJlc291cmNlKSB7XG4gICAgcmV0dXJuIEJBU0VfVVJMICsgcmVzb3VyY2U7XG4gIH1cblxuICByYXdSZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gcmVxdWVzdCh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuICB9XG5cbiAgcmVxdWVzdChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnNGb3JBdXRoZW50aWNhdGVkUmVxdWVzdCh0b2tlbiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICByZXN1bHQuaGVhZGVyc1snWC1BcGlUb2tlbiddID0gdG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZSh1c2VyTmFtZSwgcGFzc3dvcmQpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVyaTogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi91c2Vycy5qc29uJyksXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VyTmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICBzZW5kSW1tZWRpYXRlbHk6IHRydWVcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzOiBkZWZhdWx0T3B0aW9ucy5oZWFkZXJzXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICBhdXRoZW50aWNhdGVXaXRoVG9rZW4odG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuZ2V0UmVxdWVzdE9wdGlvbnModG9rZW4sICcvYXBpL3YyL3VzZXJzLmpzb24nKSk7XG4gIH1cblxuICBnZXRSZXF1ZXN0T3B0aW9ucyh0b2tlbiwgcGF0aCwgb3B0cykge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnNGb3JBdXRoZW50aWNhdGVkUmVxdWVzdCh0b2tlbiwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKHBhdGgpLFxuICAgICAgLi4ub3B0c1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2UoYWNjb3VudCwgcGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh0aGlzLmdldFJlcXVlc3RPcHRpb25zKGFjY291bnQudG9rZW4sIHBhdGgsIG9wdHMpKTtcbiAgfVxuXG4gIGdldFN5bmMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL19wcml2YXRlL3N5bmMuanNvbicpO1xuICB9XG5cbiAgZ2V0Um9sZXMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3JvbGVzLmpzb24nKTtcbiAgfVxuXG4gIGdldE1lbWJlcnNoaXBzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9tZW1iZXJzaGlwcy5qc29uJyk7XG4gIH1cblxuICBnZXRGb3JtcyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvZm9ybXMuanNvbicpO1xuICB9XG5cbiAgZ2V0Q2hvaWNlTGlzdHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2Nob2ljZV9saXN0cy5qc29uJyk7XG4gIH1cblxuICBnZXRDbGFzc2lmaWNhdGlvblNldHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2NsYXNzaWZpY2F0aW9uX3NldHMuanNvbicpO1xuICB9XG5cbiAgZ2V0UHJvamVjdHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3Byb2plY3RzLmpzb24nKTtcbiAgfVxuXG4gIGdldFBob3RvcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9waG90b3MuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0VmlkZW9zKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3ZpZGVvcy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRBdWRpbyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9hdWRpby5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVzKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3NpZ25hdHVyZXMuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0Q2hhbmdlc2V0cyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGNvdW50czogJzAnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2NoYW5nZXNldHMuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0UXVlcnlVUkwoYWNjb3VudCwgc3FsKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBxOiBzcWwsXG4gICAgICBmb3JtYXQ6ICdqc29uc2VxJyxcbiAgICAgIGFycmF5czogMVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXF1ZXN0T3B0aW9ucyhhY2NvdW50LnRva2VuLCAnL2FwaS92Mi9xdWVyeScsIHtxc30pO1xuICB9XG5cbiAgZ2V0UGhvdG9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9waG90b3MvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVHJhY2tVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfS90cmFjay5qc29uP3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVHJhY2soYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCBgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfS90cmFjay5qc29uYCk7XG4gIH1cblxuICBnZXRBdWRpb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0QXVkaW9UcmFja1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRBdWRpb1RyYWNrKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgYC9hcGkvdjIvYXVkaW8vJHsgbWVkaWEuaWQgfS90cmFjay5qc29uYCk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9zaWduYXR1cmVzLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZG93bmxvYWQodXJsLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3QodXJsKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XG4gICAgICBycS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjb3JkcyhhY2NvdW50LCBmb3JtLCBzZXF1ZW5jZSwgcGFnZVNpemUpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIGZvcm1faWQ6IGZvcm0uaWQsXG4gICAgICBwZXJfcGFnZTogcGFnZVNpemUsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9yZWNvcmRzLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgZm9ybV9pZDogZm9ybS5pZCxcbiAgICAgIHBlcl9wYWdlOiBwYWdlU2l6ZSxcbiAgICAgIGV4dGVudHM6IDAsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9yZWNvcmRzL2hpc3RvcnkuanNvbicsIHtxc30pO1xuICB9XG59XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19