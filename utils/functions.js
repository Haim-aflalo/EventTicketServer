import fs from 'fs';

export async function read(path) {
  return JSON.parse(await fs.promises.readFile(path));
}

export async function write(path, data, f = null) {
  await fs.promises.writeFile(path, JSON.stringify(data, f, 2));
}

export function hasSameProps(obj1, obj2) {
  return Object.keys(obj1).every(function (prop) {
    return obj2.hasOwnProperty(prop);
  });
}
