import Vue from 'vue';

export default function treeToArray(data, expandAll, parent = null, level = null) {
  let tmp = [];
  const arrayList = Array.from(data);
  arrayList.forEach((record) => {
    if (typeof record._expanded === 'undefined') {
      Vue.set(record, '_expanded', expandAll);
    }
    let _level = 1;
    if (typeof level !== 'undefined' && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, '_level', _level);
    Vue.set(record, '_edit', false);
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent);
    }
    tmp.push(record);
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level);
      tmp = tmp.concat(children);
    }
  });
  return tmp;
}
