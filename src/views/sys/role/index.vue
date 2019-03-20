<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="角色：">
            <el-input style="width: 203px" v-model="listQuery.roleKey" placeholder="角色"></el-input>
          </el-form-item>
          <el-form-item label="角色名称：">
            <el-input style="width: 203px" v-model="listQuery.roleName" placeholder="角色名称"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddRoleForm()"
        size="mini">
        添加
      </el-button>
    </el-card>

    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.roleId}}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.roleKey}}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowRoleForm(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateRoleForm(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.pageNum"
                  :limit.sync="listQuery.pageSize"
                  @pagination="getList"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="role" label-position="left" label-width="100px" size="mini">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleKey" clearable/>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" clearable/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="role.remark" clearable/>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="roleTree"
            :data="rolesData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1]"
            :default-checked-keys="checkedKeys"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=== 'view'" hidden></el-button>
        <el-button v-if="dialogStatus != 'view'" type="primary"
                   @click="dialogStatus==='create'?handleAddRole():handleEditRole()">确定
        </el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import {_delete, add, edit, get, list} from '@/api/role'
  import {menuTreeData, roleMenuTreeData} from '@/api/menus'
  import Pagination from '@/components/Pagination'

  const defaultListQuery = {
    roleKey: null,
    roleName: null,
    pageNum: 1,
    pageSize: 20,
  };

  export default {
    name: "roleList",
    components: {Pagination},
    data() {
      return {

        //查询
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: 0,
        listLoading: true,

        //角色对象
        role: {},

        //新增、编辑、查看弹窗
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑角色',
          create: '新增角色',
          view: "查看角色",
        },


        //权限树
        rolesData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },

        rules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'change'}],
        },
      }
    },
    created() {
      this.getList();
    },
    watch: {},
    methods: {
      getList() {
        this.listLoading = true;
        list(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _delete(row.roleId).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },

      //添加角色
      handleAddRoleForm() {
        console.log("添加角色....")
        this.role = {};
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.checkedKeys = [];
        this.getMenuTreeData();
      },
      //添加角色
      handleAddRole() {
        //添加操作
        const _checkedKeys = this.$refs['roleTree'].getCheckedKeys();
        const _halfCheckedKeys = this.$refs['roleTree'].getHalfCheckedKeys();
        this.role.menuIds = _checkedKeys.concat(_halfCheckedKeys);
        add(this.role).then(response => {
          this.addDialogVisible = false;
          this.$message({
            message: '添加成功！',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      },
      //修改角色表单
      handleUpdateRoleForm(index, row) {
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        get(row.roleId).then(response => {
          this.role = response.data;
        });
        this.checkedKeys = [];
        this.getRoleMenuTreeData(row.roleId);
      },

      //查看角色表单
      handleShowRoleForm(index, row) {
        this.dialogStatus = 'view';
        this.dialogFormVisible = true;
        get(row.roleId).then(response => {
          this.role = response.data;
        });
        this.getRoleMenuTreeData(row.roleId);
      },

      handleEditRole() {
        const _checkedKeys = this.$refs['roleTree'].getCheckedKeys();
        const _halfCheckedKeys = this.$refs['roleTree'].getHalfCheckedKeys();
        this.role.menuIds = _checkedKeys.concat(_halfCheckedKeys);
        edit(this.role).then(response => {
          this.$message({
            message: '修改成功！',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
        this.dialogFormVisible = false;
      },


      formatDataToTree(arr) {
        let tree = [];
        let mappedArr = {};
        let arrElem;
        let checkedKeys = [];
        let mappedElem;
        let pidArray = [];

        for (let i = 0, len = arr.length; i < len; i++) {
          arrElem = arr[i];
          mappedArr[arrElem.id] = arrElem;
          mappedArr[arrElem.id]['childrens'] = [];
          pidArray.push(arrElem.pid);
        }

        for (let id in mappedArr) {
          if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];

            if (mappedElem.checked && pidArray.indexOf(mappedElem.id) < 0) {
              checkedKeys.push(mappedElem.id);
            }

            if (mappedElem.pid) {
              mappedArr[mappedElem['pid']]['childrens'].push(mappedElem);
            }
            else {
              tree.push(mappedElem);
            }
          }
        }

        return {
          tree: tree,
          checkedKeys: checkedKeys
        };
      },
      getRoleMenuTreeData(roleId) {
        this.listLoading = true;
        roleMenuTreeData(roleId).then(response => {
          this.loadMenuTreeSuccess(response);
        }).catch((e) => {
          this.$message.error('网络繁忙,请重试(' + e + ')');
          this.listLoading = false;
        })
      },
      getMenuTreeData() {
        this.listLoading = true;
        menuTreeData().then(response => {
          this.loadMenuTreeSuccess(response);
        }).catch((e) => {
          this.$message.error('网络繁忙,请重试(' + e + ')');
          this.listLoading = false;
        })
      },
      loadMenuTreeSuccess(response) {
        this.listLoading = false;
        console.info(response);
        if (response.success) {
          let _treeData = this.formatDataToTree(response.data);
          this.rolesData = _treeData.tree;
          this.checkedKeys = [];
          this.checkedKeys = _treeData.checkedKeys;
        } else {
          this.$message.error(response.msg);
        }
      },

    }
  }
</script>
<style></style>



