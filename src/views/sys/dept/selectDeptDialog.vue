<template>
  <el-dialog title="选择部门" ref="selectMenuDialog" :visible.sync="selectMenuDialogVisible">
    <el-input
      placeholder="输入关键字进行过滤" clearable
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      :data="tressData"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="selectMenuTree">
    </el-tree>

    <div slot="footer" class="dialog-footer">
      <el-button @click="selectMenuDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="selectMenuSubmit">确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      tress: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        selectMenuDialogVisible: false,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.selectMenuTree.filter(val);
      }
    },
    computed: {
      tressData: function () {
        let data = {
          id: 0,
          deptName: '根目录',
          children: this.tress
        };
        let menusArray = [data];
        return menusArray
      },
    },
    methods: {
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
