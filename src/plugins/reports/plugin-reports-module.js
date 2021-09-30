import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { ReportGenerator, APIClient, core } from '../../api';
import ConcurrentQueue from './concurrent-queue'

let template, header, footer, reportsPath, reportsFileName, account, queue;

const activate = async () => {
  const templateFile = fulcrum.args.reportsTemplate || path.join(process.cwd(), 'src', 'reports', 'template.ejs');

  template = fs.readFileSync(templateFile).toString();

  if (fulcrum.args.reportsHeader) {
    header = fs.readFileSync(fulcrum.args.reportsHeader).toString();
  }

  if (fulcrum.args.reportsFooter) {
    footer = fs.readFileSync(fulcrum.args.reportsFooter).toString();
  }

  reportsPath = fulcrum.args.reportsPath || fulcrum.dir('reports');
  reportsFileName = fulcrum.args.reportsFileName === 'title' ? 'title' : 'id';

  mkdirp.sync(reportsPath);
  // fulcrum.on('record:save', this.onRecordSave);
}
exports.activate = activate;

exports.deactivate = async () => {};

const workerFunction = async (task) => {
  try {
    const record = await account.findFirstRecord({id: task.id});

    await record.getForm();

    await runReport({record});
  } catch (err) {
    console.error('Error', err);
  }
}

const onRecordSave = async ({record}) => {
  runReport({record});
}

const runReport = async ({record, template, header, footer, cover}) => {
  const fileName = reportsFileName === 'title' ? record.displayValue || record.id : record.id;

  const outputFileName = path.join(reportsPath, fileName + '.pdf');

  if (fs.existsSync(outputFileName) && fs.statSync(outputFileName).size > 0) {
    return;
  }

  const params = {
    reportName: fileName,
    directory: reportsPath,
    template: template || template,
    header: header || header,
    footer: footer || footer,
    cover,
    data: {
      DateUtils: core.DateUtils,
      record: record,
      renderValues: renderValues,
      getPhotoURL: getPhotoURL
    },
    ejsOptions: {},
    reportOptions: {
      wkhtmltopdf: fulcrum.args.reportsWkhtmltopdf
    }
  };

  await generatePDF(params);

  if (fulcrum.args.reportsRepeatables) {
    for (const item of record.formValues.repeatableItems) {
      const repeatableFileName = reportsFileName === 'title' ? `${fileName} - ${item.displayValue}` : item.id;

      params.reportName = repeatableFileName;
      params.data.record = item;

      await generatePDF(params);
    }
  }
}

async function generatePDF(params) {
  console.log('Generating', params.data.record.isRecord ? 'record'.green : 'child record'.green, params.reportName);
  return await ReportGenerator.generate(params);
}

const getPhotoURL = (item) => {
  if (fulcrum.args.reportsMediaPath) {
    return path.join(fulcrum.args.reportsMediaPath, 'photos', item.mediaID + '.jpg');
  }

  const url = APIClient.getPhotoURL(account, {id: item.mediaID}).replace('?', '/large?');

  if (url.indexOf('.jpg') === -1) {
    return url.replace('?', '.jpg?');
  }

  return url;
}

const renderValues = (feature, renderFunction) => {
  return renderValuesRecursive(feature, feature.formValues.container.elements, renderFunction);
}

const renderValuesRecursive = (feature, elements, renderFunction) => {
  for (const element of elements) {
    const formValue = feature.formValues.get(element.key);

    renderFunction(element, formValue);

    if (element.isSectionElement) {
      renderValuesRecursive(feature, element.elements, renderFunction);
    } else if (element.isRepeatableElement) {
      let shouldRecurse = true;

      if (element.isRepeatableElement && fulcrum.args.reportsRecurse === false) {
        shouldRecurse = false;
      }

      if (formValue && shouldRecurse) {
        for (const item of formValue.items) {
          renderValuesRecursive(item, element.elements, renderFunction);
        }
      }
    }
  }
}

exports.command =  'reports',
exports.desc = 'run the pdf reports sync for a specific organization',
exports.builder = {
  org: {
    desc: 'organization name',
    required: true,
    type: 'string'
  },
  form: {
    desc: 'form name',
    type: 'array'
  },
  reportsSkip: {
    desc: 'skip form name',
    type: 'array'
  },
  reportsTemplate: {
    desc: 'path to ejs template file',
    type: 'string'
  },
  reportsHeader: {
    desc: 'path to header ejs template file',
    type: 'string'
  },
  reportsFooter: {
    desc: 'path to footer ejs template file',
    type: 'string'
  },
  reportsPath: {
    desc: 'report storage directory',
    type: 'string'
  },
  reportsMediaPath: {
    desc: 'media storage directory',
    type: 'string'
  },
  reportsFileName: {
    desc: 'file name',
    type: 'string'
  },
  reportsConcurrency: {
    desc: 'concurrent reports (between 1 and 10)',
    type: 'number',
    default: 5
  },
  reportsRepeatables: {
    desc: 'generate a PDF for each repeatable child record',
    type: 'boolean',
    default: false
  },
  reportsRecurse: {
    desc: 'recursively print all child items in each PDF',
    type: 'boolean',
    default: true
  },
  reportsWkhtmltopdf: {
    desc: 'path to wkhtmltopdf binary',
    type: 'string'
  }
},
exports.handler = async () => {
  await activate();

  account = await fulcrum.fetchAccount(fulcrum.args.org);

  const skipForms = fulcrum.args.reportsSkip || [];
  const includeForms = fulcrum.args.form != null ? fulcrum.args.form : null;

  if (account) {
    account = account;

    const forms = await account.findForms({});

    const concurrency = Math.min(Math.max(1, fulcrum.args.reportsConcurrency || 5), 50);

    queue = new ConcurrentQueue(workerFunction, concurrency);

    for (const form of forms) {
      if (skipForms.indexOf(form.name) > -1) {
        continue;
      }

      if (includeForms && includeForms.indexOf(form.name) === -1) {
        continue;
      }

      await form.findEachRecord({}, async (record) => {
        queue.push({id: record.rowID});
      });
    }

    await queue.drain();

  } else {
    console.error('Unable to find account', fulcrum.args.org);
  }
}
