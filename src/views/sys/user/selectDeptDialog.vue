<template>
  <el-dialog title="选择部门" ref="selectMenuDialog" :visible.sync="selectMenuDialogVisible">
    <el-input
      placeholder="输入关键字进行过滤"
      clearable
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="deptsArray"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="selectMenuTree">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="selectMenuDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="selectMenuSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {deptsList} from '@/api/depts';

  export default {
    data() {
      return {
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        selectMenuDialogVisible: false,
        deptsArray: []
      };
    },
    watch: {
      filterText(val) {
        this.$refs.selectMenuTree.filter(val);
      }
    },
    methods: {
      formatDataToTree(arr) {
        let tree = [];
        let mappedArr = {};
        let arrElem;
        let mappedElem;

        for (let i = 0, len = arr.length; i < len; i++) {
          arrElem = arr[i];
          if (arrElem['status'] === 0) {
            arrElem['status'] = arrElem['status'] + '';

            mappedArr[arrElem.id] = arrElem;
            mappedArr[arrElem.id]['children'] = [];
          }
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

        return tree;
      },
      getList() {
        this.listLoading = true;
        deptsList().then(response => {
          let data = response.data;
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
      selectMenuSubmit() {
        let menuNode = this.$refs.selectMenuTree.getCurrentNode();
        if (menuNode) {
          this.hide();
          this.$emit('submit', menuNode);
        } else {
          this.$message('请选择部门');
        }

      },
      show() {
        this.selectMenuDialogVisible = true;
        if (this.deptsArray.length === 0) {
          this.getList();
        }
      },
      hide() {
        this.selectMenuDialogVisible = false;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },
    },

  }
</script>

<style lang="scss" scoped="">


</style>
