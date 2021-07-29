const plugin = app.pluginsByName.mssql;

const progress = (name, index) => {
  plugin.updateStatus(name + ' : ' + index.toString());
};

console.log('Rebuilding photos...');

account.findEachPhoto({}, async (photo, {index}) => {
  if (++index % 100 === 0) {
    console.log('Photos:', index);
  }

  await plugin.updatePhoto(photo, account);
}).then(() => {
  console.log('');
  console.log('Done');
}).catch(err => {
  console.error(err);
});
