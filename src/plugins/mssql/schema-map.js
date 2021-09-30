//import pgformat from 'pg-format';
import wkt from 'wellknown';
import { core } from '../../api';

export default class SchemaMap {
  // * force 2d
  // * remove duplicate vertices
  static geomFromGeoJSON(geojsonGeometry) {
    if (geojsonGeometry == null) {
      return null;
    }

    return `geography::STGeomFromText('${ wkt.stringify(geojsonGeometry) }', 4326)`;
  }

  // * force to multi
  // * force 2d
  // * remove duplicate vertices
  static multiGeomFromGeoJSON(geojsonGeometry) {
    if (geojsonGeometry == null) {
      return null;
    }

    return this.geomFromGeoJSON(geojsonGeometry);
    // return `ST_RemoveRepeatedPoints(ST_Force2D(ST_Multi(ST_GeomFromText(${ pgformat('%L', wkt.stringify(geojsonGeometry)) }, 4326))))`;
  }

  static geometry(latitude, longitude) {
    return { raw: this.geomFromGeoJSON({type: 'Point', coordinates: [ +longitude, +latitude ]}) };
  }

  static trackGeometry(trackJSON) {
    if (trackJSON) {
      const track = new core.Track('video', trackJSON);

      const geoJSON = track.toGeoJSONMultiLineString();

      if (geoJSON && geoJSON.geometry && geoJSON.geometry.coordinates.length && geoJSON.geometry.coordinates[0].length > 1) {
        return { raw: this.multiGeomFromGeoJSON(geoJSON) };
      }
    }

    return null;
  }

  static jsonValue(value) {
    return value != null ? JSON.stringify(value) : null;
  }

  static record(row, values) {
    // records are special since they're already table-ized in a different code path.
    return {
      row_id: row.rowID,
      row_resource_id: values.record_resource_id,
      form_id: row._formRowID,
      form_resource_id: row.formID,
      project_id: row._projectRowID,
      project_resource_id: row._projectID,
      assigned_to_id: row._assignedToRowID,
      assigned_to_resource_id: row._assignedToID,
      status: values.status,
      latitude: values.latitude,
      longitude: values.longitude,
      created_at: values.created_at,
      updated_at: values.updated_at,
      version: values.version,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      server_created_at: values.server_created_at,
      server_updated_at: values.server_updated_at,
      record_index_text: values.record_index_text,
      record_index: values.record_index,
      geometry: values.geometry,
      altitude: values.altitude,
      speed: values.speed,
      course: values.course,
      horizontal_accuracy: values.horizontal_accuracy,
      vertical_accuracy: values.vertical_accuracy,
      form_values: values.form_values,
      changeset_id: row._changesetRowID,
      changeset_resource_id: row._changesetID,
      title: row.displayValue,
      created_latitude: values.created_latitude,
      created_longitude: values.created_longitude,
      created_geometry: values.created_geometry,
      created_altitude: values.created_altitude,
      created_horizontal_accuracy: values.created_horizontal_accuracy,
      updated_latitude: values.updated_latitude,
      updated_longitude: values.updated_longitude,
      updated_geometry: values.updated_geometry,
      updated_altitude: values.updated_altitude,
      updated_horizontal_accuracy: values.updated_horizontal_accuracy,
      created_duration: values.created_duration,
      updated_duration: values.updated_duration,
      edited_duration: values.edited_duration
    };
  }

  static photo(row) {
    const hasLocation = row._latitude != null && row._longitude != null;

    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      access_key: row.id,
      record_id: row._recordRowID,
      record_resource_id: row._recordID,
      form_id: row._formRowID,
      form_resource_id: row._formID,
      exif: this.jsonValue(row._exif),
      file_size: row._fileSize,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      file: row._filePath,
      content_type: row._contentType,
      is_uploaded: row._isUploaded,
      is_stored: row._isStored,
      is_processed: row._isProcessed,
      geometry: hasLocation ? this.geometry(row._latitude, row._longitude) : null,
      latitude: hasLocation ? row._latitude : null,
      longitude: hasLocation ? row._longitude : null,
      altitude: row._altitude,
      direction: row._direction,
      accuracy: row._accuracy,
      width: row._width,
      height: row._height,
      make: row._make,
      model: row._model,
      software: row._software,
      date_time: row._dateTime
    };
  }

  static video(row) {
    return {
      row_id: row._rowID,
      row_resource_id: row.id,
      access_key: row.id,
      record_id: row._recordRowID,
      record_resource_id: row._recordID,
      form_id: row._formRowID,
      form_resource_id: row._formID,
      metadata: this.jsonValue(row._metadata),
      has_track: row._hasTrack,
      track: this.jsonValue(row._trackJSON),
      file_size: row._fileSize,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      file: row._filePath,
      content_type: row._contentType,
      is_uploaded: row._isUploaded,
      is_stored: row._isStored,
      is_processed: row._isProcessed,
      geometry: this.trackGeometry(row._trackJSON),
      width: row._width,
      height: row._height,
      duration: row._duration,
      bit_rate: row._bitRate
    };
  }

  static audio(row) {
    return {
      row_id: row._rowID,
      row_resource_id: row.id,
      access_key: row.id,
      record_id: row._recordRowID,
      record_resource_id: row._recordID,
      form_id: row._formRowID,
      form_resource_id: row._formID,
      metadata: this.jsonValue(row._metadata),
      has_track: row._hasTrack,
      track: this.jsonValue(row._trackJSON),
      file_size: row._fileSize,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      file: row._filePath,
      content_type: row._contentType,
      is_uploaded: row._isUploaded,
      is_stored: row._isStored,
      is_processed: row._isProcessed,
      geometry: this.trackGeometry(row._trackJSON),
      duration: row._duration,
      bit_rate: row._bitRate
    };
  }

  static signature(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      access_key: row.id,
      record_id: row._recordRowID,
      record_resource_id: row._recordID,
      form_id: row._formRowID,
      form_resource_id: row._formID,
      file_size: row._fileSize,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      file: row._filePath,
      content_type: row._contentType,
      is_uploaded: row._isUploaded,
      is_stored: row._isStored,
      is_processed: row._isProcessed
    };
  }

  static changeset(row) {
    const geometry = this.geomFromGeoJSON(row.boundingBoxAsGeoJSON);

    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      form_id: row._formRowID,
      form_resource_id: row._formID,
      metadata: this.jsonValue(row._metadata),
      closed_at: row._closedAt,
      created_by_id: row._createdByRowID,
      created_by_resource_id: row._createdByID,
      updated_by_id: row._updatedByRowID,
      updated_by_resource_id: row._updatedByID,
      closed_by_id: row._closedByRowID,
      closed_by_resource_id: row._closedByID,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      min_lat: row._minLat,
      max_lat: row._maxLat,
      min_lon: row._minLon,
      max_lon: row._maxLon,
      number_of_changes: row._numberOfChanges,
      number_of_creates: row._numberOfCreates,
      number_of_updates: row._numberOfUpdates,
      number_of_deletes: row._numberOfDeletes,
      metadata_index_text: row._metadataIndexText,
      metadata_index: row._metadataIndexText,
      bounding_box: geometry ? {raw: this.geomFromGeoJSON(row.boundingBoxAsGeoJSON)} : null
    };
  }

  static choiceList(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      name: row._name,
      description: row._description,
      version: row._version,
      items: this.jsonValue(row._choicesJSON),
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt
    };
  }

  static classificationSet(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      name: row._name,
      description: row._description,
      version: row._version,
      items: this.jsonValue(row._itemsJSON),
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt
    };
  }

  static form(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      name: row._name,
      description: row._description,
      version: row._version,
      elements: this.jsonValue(row._elementsJSON),
      status: row._status,
      status_field: this.jsonValue(row._statusFieldJSON),
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt,
      auto_assign: row._autoAssign,
      title_field_keys: this.jsonValue(row._titleFieldKeys),
      hidden_on_dashboard: row._hiddenOnDashboard,
      geometry_types: this.jsonValue(row._geometryTypes),
      geometry_required: row._geometryRequired,
      script: row._script,
      image: row._image,
      projects_enabled: !!row._projectEnabled,
      assignment_enabled: !!row._assignmentEnabled
    };
  }

  static project(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      name: row._name,
      description: row._description,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt
    };
  }

  static role(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      name: row._name,
      description: row._description,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt,
      is_system: row._isSystem,
      is_default: row._isDefault,
      can_manage_subscription: row.canManageSubscription,
      can_update_organization: row.canUpdateOrganization,
      can_manage_members: row.canManageMembers,
      can_manage_roles: row.canManageRoles,
      can_manage_apps: row.canManageApps,
      can_manage_projects: row.canManageProjects,
      can_manage_choice_lists: row.canManageChoiceLists,
      can_manage_classification_sets: row.canManageClassificationSets,
      can_create_records: row.canCreateRecords,
      can_update_records: row.canUpdateRecords,
      can_delete_records: row.canDeleteRecords,
      can_change_status: row.canChangeStatus,
      can_change_project: row.canChangeProject,
      can_assign_records: row.canAssignRecords,
      can_import_records: row.canImportRecords,
      can_export_records: row.canExportRecords,
      can_run_reports: row.canRunReports
    };
  }

  static membership(row) {
    return {
      row_id: row.rowID,
      row_resource_id: row.id,
      user_resource_id: row._userID,
      first_name: row._firstName,
      last_name: row._lastName,
      name: (row._firstName || '') + ' ' + (row._lastName || ''),
      email: row._email,
      role_id: row._roleRowID,
      role_resource_id: row._roleID,
      status: row.status,
      created_at: row._createdAt,
      updated_at: row._updatedAt,
      deleted_at: row._deletedAt
    };
  }
}
