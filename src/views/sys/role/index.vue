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
                @selection-change="handleSelectionChange"
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
                @click="handleShowProduct(scope.$index, scope.row)">查看
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
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>


    <el-dialog title="添加角色" :visible.sync="selectDialogVisible" width="80%">
      <el-form :model="role" size="small" label-width="140px">
        <el-form-item label="角色：">
          <el-input v-model="role.roleKey" class="input-width" placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：">
          <el-input v-model="role.roleName" class="input-width" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="role.remark" class="input-width" placeholder="角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddRole()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改角色" :visible.sync="updateDialogVisible" width="80%">
      <el-form :model="role" size="small" label-width="140px">
        <el-form-item label="角色：">
          <el-input v-model="role.roleKey" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：">
          <el-input v-model="role.roleName" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="role.remark" class="input-width"></el-input>
        </el-form-item>
      </el-form>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="updateDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleEditRole()">确 定</el-button>
      </div>
    </el-dialog>


  </div>


</template>

<script>
  import {_delete, add, edit, get, list} from '@/api/role'

  const defaultListQuery = {
    roleKey: null,
    roleName: null,
    pageNum: 1,
    pageSize: 20,
  };
  export default {
    name: "roleList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectDialogVisible: false,
        updateDialogVisible: false,
        role: {},
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
      //当前页翻页
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      //每页val条触发
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
        this.selectDialogVisible = true;
      },
      //添加角色
      handleAddRole() {
        //添加操作
        add(this.role).then(response => {
          this.selectDialogVisible = false;
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
        this.updateDialogVisible = true;
        get(row.roleId).then(response => {
          this.role = response.data;
        });
      },
      handleEditRole() {
        edit(this.role).then(response => {
          this.$message({
            message: '添加成功！',
            type: 'success',
            duration: 1000
          });
          this.updateDialogVisible = false;
          this.getList();
        });
      },

    }
  }
</script>
<style></style>



