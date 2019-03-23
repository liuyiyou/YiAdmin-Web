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
          查询结果
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
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="账号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddUser()"
        size="mini">
        添加
      </el-button>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
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
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{scope.row.loginName}}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.phonenumber}}</template>
        </el-table-column>
        <el-table-column label="email" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="view(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="edit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delete(scope.$index, scope.row)">删除
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
  </div>


</template>

<script>
  import {list} from '@/api/user'
  import Pagination from '@/components/Pagination'


  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 20,
  };
  export default {
    name: "userList",
    components: {Pagination},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: 0,
        listLoading: true,
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
      handleAddUser() {
        this.$router.push({path: '/sys/addUser'});
      },

    }
  }
</script>
<style></style>



