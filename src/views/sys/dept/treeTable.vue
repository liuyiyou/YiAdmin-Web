<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus"
                 @click="handleCreate">新增
      </el-button>
    </div>

    <tree-table :data="deptsArray" :columns="columns" border @expanded="expandedHandel">
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag class="menuVisibleTag" :class="'menuVisibleTag'+scope.row.status ">
            {{ scope.row.status | menuVisibleTagNameFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </tree-table>

    <edit-dept-dialog :tress="deptsArray" ref="editDeptDialog" @success="editDeptSuccess"></edit-dept-dialog>

  </div>
</template>

<script type="text/ecmascript-6">

  import treeTable from '@/components/TreeTable'
  import editDeptDialog from './editDeptDialog'
  import {deptsList, deptsRemove, deptsSave} from '@/api/depts'
  import {copyObjValue} from '@/utils';

  const menuTypeMapOptions = [
    {key: 'M', displayName: '目录'},
    {key: 'C', displayName: '菜单'},
    {key: 'F', displayName: '按钮'},
    {key: 'P', displayName: '项目'},
  ];

  const menuTypeKeyValue = menuTypeMapOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.displayName;
    return acc
  }, {});

  const menuVisibleOptions = [
    {key: 0, displayName: '显示'},
    {key: 1, displayName: '隐藏'},
  ];

  const menuVisibleKeyValue = menuVisibleOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.displayName;
    return acc
  }, {});

  export default {
    name: 'TreeTableDemo',
    components: {treeTable, editDeptDialog},
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
        menuTypeMapOptions,
        menuVisibleOptions,
        columns: [
          {
            text: '部门名称',
            value: 'deptName',
            width: 200
          }
        ],
        deptsArray: [],
        expandedTreeMap: {}
      }
    },
    created() {
      this.getList();
    },
    methods: {
      formatDataToTree(arr) {
        let tree = [];
        let mappedArr = {};
        let arrElem;
        let mappedElem;

        for (let i = 0, len = arr.length; i < len; i++) {
          arrElem = arr[i];
          arrElem['status'] = arrElem['status'] + '';
          let _cacheTree = this.expandedTreeMap[arrElem.id];
          if (_cacheTree) {
            arrElem._expanded = _cacheTree._expanded;
          }

          mappedArr[arrElem.deptId] = arrElem;
          mappedArr[arrElem.deptId]['children'] = [];
        }
        for (let id in mappedArr) {
          if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            if (mappedElem.parentId) {
              let _parent = mappedArr[mappedElem['parentId']];
              if (_parent) {
                mappedElem['parentName'] = _parent['deptName'];
                _parent['children'].push(mappedElem);

                mappedArr[mappedElem['parentId']] = _parent;
              }
            }
            else {
              tree.push(mappedElem);
            }
          }
        }
        tree.sort(this.sortByOrderNum);
        return tree;
      },
      sortByOrderNum(a, b) {
        return a.orderNum - b.orderNum;
      },
      getList() {
        this.listLoading = true;
        deptsList().then(response => {
          let data = response;
          console.info(data);
          if (data.success) {
            this.deptsArray = this.formatDataToTree(data.data);
          } else {
            this.$message.error(data.msg);
          }
          this.listLoading = false;
        }).catch((e) => {
          this.$message.error('网络繁忙,请重试(' + e + ')');
          this.listLoading = false;
        })
      },
      handleCreate(row) {
        this.$refs.editDeptDialog.handleCreate(row);
      },
      handleUpdate(row) {
        this.$refs.editDeptDialog.handleUpdate(row);
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
            this.getList();
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
      editDeptSuccess() {
        this.getList();
      },
      expandedHandel(tree) {
        // 缓存展开过的菜单
        this.expandedTreeMap[tree.id] = tree;
      },
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
