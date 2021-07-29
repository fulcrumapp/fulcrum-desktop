import request from 'request';
import Promise from 'bluebird';
import fs from 'fs';
import { extend } from 'lodash';

const reqPromise = Promise.promisify(request);
const req = (options) => reqPromise({forever: true, ...options});

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
    return request({forever: true, ...options});
  }

  request(options) {
    return req(options);
  }

  optionsForAuthenticatedRequest(token, options) {
    const result = extend({}, defaultOptions, options);

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

    return this.getResource(account, '/api/v2/photos.json', {qs});
  }

  getVideos(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/videos.json', {qs});
  }

  getAudio(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/audio.json', {qs});
  }

  getSignatures(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/signatures.json', {qs});
  }

  getChangesets(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      counts: '0'
    };

    return this.getResource(account, '/api/v2/changesets.json', {qs});
  }

  getQueryURL(account, sql) {
    const qs = {
      q: sql,
      format: 'jsonseq',
      arrays: 1
    };

    return this.getRequestOptions(account.token, '/api/v2/query', {qs});
  }

  getPhotoURL(account, media) {
    return this.urlForResource(`/api/v2/photos/${ media.id }?token=${account.token}`);
  }

  getVideoURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${ media.id }?token=${account.token}`);
  }

  getVideoTrackURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${ media.id }/track.json?token=${account.token}`);
  }

  getVideoTrack(account, media) {
    return this.getResource(account, `/api/v2/videos/${ media.id }/track.json`);
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${ media.id }?token=${account.token}`);
  }

  getAudioTrackURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${ media.id }/track.json?token=${account.token}`);
  }

  getAudioTrack(account, media) {
    return this.getResource(account, `/api/v2/audio/${ media.id }/track.json`);
  }

  getSignatureURL(account, media) {
    return this.urlForResource(`/api/v2/signatures/${ media.id }?token=${account.token}`);
  }

  download(url, to) {
    return new Promise((resolve, reject) => {
      const rq = request(url).pipe(fs.createWriteStream(to));
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

    return this.getResource(account, '/api/v2/records.json', {qs});
  }

  getRecordsHistory(account, form, sequence, pageSize) {
    const qs = {
      form_id: form.id,
      per_page: pageSize,
      extents: 0,
      sequence: sequence || 0
    };

    return this.getResource(account, '/api/v2/records/history.json', {qs});
  }
}

const client = new Client();

export default client;
