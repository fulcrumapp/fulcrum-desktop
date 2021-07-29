import RecordValues from './record-values';

export default class SQLiteRecordValues extends RecordValues {
  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    return null;
  }
}
