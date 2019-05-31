<template>
  <div class="app-container">

    <div class="filter-container">

      <el-button class="filter-item" type="primary" icon="el-icon-plus"
                 @click="handleCreateFirstCatalog">新增顶级类目
      </el-button>

    </div>

    <tree-table :data="trees" :columns="columns" border
                @expanded="handleExpanded"
                @edit="handleUpdate"
                @add="handleCreate"
                @attribute="handleAttribute"
    >

    </tree-table>

    <edit-dialog ref="editDialog" @success="editDeptSuccess"></edit-dialog>

    <attribute-dialog ref="attributeDialog" :title="attributeDialogTitle" :catalog-id="attributeDialogCatalogId"
                      @success="editDeptSuccess"></attribute-dialog>

  </div>
</template>

<script type="text/ecmascript-6">

  import treeTable from './catalogTreeTable'

  import editDialog from './editDialog'
  import attributeDialog from './attributeDialog'


  import {fetchList, saveCatalog} from '@/api/catalog'

  import {copyObjValue} from '@/utils';

  const firstCatalog = {
    cataId: 0,
    cataName: '一级',
    type: 1
  };


  let catalogMappedArr = {};

  export default {
    name: 'catalogList',
    components: {treeTable, editDialog, attributeDialog},
    filters: {
      menuTypeNameFilter(type) {
        return menuTypeKeyValue[type];
      },
      menuVisibleTagNameFilter(status) {
        return menuVisibleKeyValue[status];
      },
      noCacheNameFilter(status) {
        const statusMap = {
          '0': '是',
          '1': '否',
        };
        return statusMap[status];
      }
    },
    data() {
      return {
        columns: [
          {
            text: '类目ID',
            value: 'cataId',
            width: 100
          },
          {
            text: '类目名称',
            value: 'cataName',
            width: 300
          }
        ],
        treeTableList: [],
        expandedTreeMap: {},
        attributeDialogCatalogId: 0,
        attributeDialogTitle: {
          p1: '1级',
          p2: '2级',
          p3: '3级',
        }
      }
    },
    computed: {
      trees: {
        get() {
          return this.formatDataToTree(this.treeTableList);
        },
        set(value) {
          this.treeTableList = value;
        }
      }
    },
    created() {
      this.getList(firstCatalog);
    },
    methods: {
      formatDataToTree(arr) {
        let tree = [];
        let mappedArr = {};
        let arrElem;
        let mappedElem;

        for (let i = 0, len = arr.length; i < len; i++) {
          arrElem = arr[i];

          let _cacheTree = this.expandedTreeMap[arrElem.cataId];
          if (_cacheTree) {
            arrElem._expanded = _cacheTree._expanded;
          }

          mappedArr[arrElem.cataId] = arrElem;
          mappedArr[arrElem.cataId]['children'] = [];
        }

        catalogMappedArr = mappedArr;

        for (let id in mappedArr) {
          if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            if (mappedElem.cataParentId) {
              let _parent = mappedArr[mappedElem['cataParentId']];
              if (_parent) {
                _parent['children'].push(mappedElem);
                mappedArr[mappedElem['cataParentId']] = _parent;
              }
            }
            else {
              tree.push(mappedElem);
            }
          }
        }

        return tree;
      },
      getList(parent) {
        this.listLoading = true;
        let parentId = parent.cataId;
        fetchList(parentId, {"pageNum": 1, "pageSize": 100}).then(response => {
          let data = response.data;
          let catalogList = data.records;
          console.info(catalogList);
          this.treeTableList = this.treeTableList.concat(catalogList);
          this.listLoading = false;
        }).catch((e) => {
          this.$message.error('网络繁忙,请重试(' + e + ')');
          this.listLoading = false;
        })
      },
      handleCreate(row) {
        this.$refs.editDialog.handleCreate(row);
      },
      handleCreateFirstCatalog() {
        this.$refs.editDialog.handleCreate();
      },
      handleUpdate(row) {
        this.$refs.editDialog.handleUpdate(row);
      },
      handleRemove(row) {
        this.$confirm('确定是否删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeDept(row.id);
        });
      },
      removeDept(id) {
        deptsRemove(id).then((res) => {
          if (res.data.success) {
            this.getList(firstCatalog);
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$message({
              title: '失败',
              message: res.data.msg,
              type: 'error',
              duration: 2000
            })
          }

        })
      },
      editDeptSuccess(item) {
        let parent = firstCatalog;
        if (item.cataParentId) {
          parent = catalogMappedArr[item.cataParentId];
        }
        this.getList(parent);
      },
      handleExpanded(tree) {
        // 缓存展开过的菜单
        this.expandedTreeMap[tree.cataId] = tree;
        let list = this.treeTableList.map(function (item) {
          if (tree.cataId == item.cataId) {
            item._expanded = tree._expanded;
          }
          return item;
        });
        this.$set(this.treeTableList, list);
        if (tree._expanded) {
          this.getList(tree);
        }
      },
      handleAttribute(row) {
        this.attributeDialogTitle = this.getParentsName(row);
        this.attributeDialogCatalogId = row.cataId;
        this.$refs.attributeDialog.show(row);
      },
      getParentsName(row) {
        let p2 = catalogMappedArr[row.cataParentId];
        let p1 = catalogMappedArr[p2.cataParentId];
        return {
          p1: p1.cataName,
          p2: p2.cataName,
          p3: row.cataName
        }
      }
    },
  }
</script>

<style lang="scss" scoped="">
  .menuTypeTag {
    color: #fff;
    &.menuTypeM {
      background: #0a76a4;
    }
    &.menuTypeC {
      background: #409167;
    }
    &.menuTypeF {
      background: #9da408;
    }
    &.menuTypeP {
      background: #b3450e;
    }
  }

  .menuVisibleTag {
    color: #fff;
    &.menuVisibleTag0 {
      background-color: rgba(103, 194, 58, .1);
      border-color: rgba(103, 194, 58, .2);
      color: #67c23a;
    }
    &.menuVisibleTag1 {
      background-color: hsla(220, 4%, 58%, .1);
      border-color: hsla(220, 4%, 58%, .2);
      color: #909399;
    }
  }
</style>
