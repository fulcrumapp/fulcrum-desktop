import RecordValues from './record-values';
import pgformat from 'pg-format';
import { compact } from 'lodash';

export default class PostgresRecordValues extends RecordValues {
  static setupSearch(values, feature, options) {
    const searchableValue = feature.searchableValue;

    if (options.disableComplexTypes) {
      values.record_index_text = searchableValue;

      const strings = compact(feature.formValues.all.map(o => o.searchableValue && o.searchableValue.trim()));

      values.record_index = JSON.stringify(strings);

      return values;
    }

    values.record_index_text = searchableValue;
    values.record_index = {raw: `to_tsvector('simple', ${ pgformat('%L', searchableValue) })`};

    return values;
  }

  static setupPoint(values, latitude, longitude, options) {
    if (options.disableComplexTypes) {
      return JSON.stringify({
        type: 'Point',
        coordinates: [ longitude, latitude ]
      });
    }

    const wkt = pgformat('POINT(%s %s)', longitude, latitude);

    return {raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${ wkt }'), 4326))`};
  }
}
