import { format } from 'util';
import RecordValues from './record-values';
import { compact } from 'lodash';

export default class MSSQLRecordValues extends RecordValues {
  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;

    const strings = compact(feature.formValues.all.map(o => o.searchableValue && o.searchableValue.trim()));

    values.record_index = JSON.stringify(strings);

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = format('POINT(%s %s)', longitude, latitude);
    return {raw: `geography::STGeomFromText('${ wkt }', 4326)`};
  }
}

