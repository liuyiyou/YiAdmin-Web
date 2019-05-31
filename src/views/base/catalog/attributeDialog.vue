<template>
  <div class="attributeDialogWrapper">

    <el-dialog :visible.sync="dialogFormVisible">

      <div slot="title" class="dialog-title">
        <span>{{title.p1}}</span><i class="el-icon-arrow-right"></i>
        <span>{{title.p2}}</span><i class="el-icon-arrow-right"></i>
        <span>{{title.p3}}</span><i class="el-icon-arrow-right"></i>
        <span>属性列表  (共有 <span class="countAttr">{{total}}</span> 个相关属性)</span>
      </div>

      <div class="filter-container">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus"
                   @click="showAddCatalogAttributeDialog">新增属性
        </el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="attrList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="属性ID" prop="id" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性类型" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{getTypeName(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性值" align="center" >
          <template slot-scope="scope">
            <span class="valuesLine">{{scope.row.values.join(', ')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>

    </el-dialog>

    <edit-attribute-dialog :title="title"  :catalog-id="catalogId" ref="editAttributeDialog"
                           @update="updateEvent"
                           @success="handleEditSuccess"></edit-attribute-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import {fetchAttributeList, addCatalogAttribute, editCatalogAttribute} from '@/api/catalog'
  import {copyObjValue} from '@/utils';
  import {validateMobile, validateEmail} from '@/utils/validate';
  import Pagination from '@/components/Pagination'
  import waves from '@/directive/waves'
  import editAttributeDialog from './editAttributeDialog'

//  属性类型：1-关键属性(SPU);2-销售属性(SKU) ,
  const typeOptions = {
    '1': '一般属性',
    '2': '销售属性',
  };

  export default {
    name: 'attributeDialog',
    components: {Pagination, editAttributeDialog},
    directives: {waves},
    props: {
      title: {
        type: Object,
        default: {
          p1: '1级',
          p2: '2级',
          p3: '3级',
        }
      },
      catalogId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        attrList: [],
        listLoading: false,
        total: 0,
        dialogStatus: 'create',
        queryParams: {
          catalogId: 0,
          page: 1,
          pageSize: 10,
        }
      };
    },
    methods: {
      getTypeName(type) {
        return typeOptions[type];
      },
      show(row) {
        this.dialogFormVisible = true;
        this.queryParams.catalogId = row.id;
        this.queryParams.page = 1;
        this.getList();
      },
      getList() {
        fetchAttributeList(this.queryParams).then((res) => {
          let resData = res.data;
          if (resData.success) {
            this.attrList = resData.data.records;
            this.total = resData.data.total;
          } else {
            this.$message.error(resData.msg);
          }
        });
      },
      handleUpdate(row) {
        this.$refs.editAttributeDialog.show(row.id);
      },
      showAddCatalogAttributeDialog() {
        this.$refs.editAttributeDialog.show();
      },
      handleAddCatalogAttribute() {
        addCatalogAttribute(this.queryParams).then((res) => {
          console.log(res)
        });
      },
      handleEditSuccess() {
        this.getList();
        this.updateEvent();

      },
      updateEvent(){
        this.$emit('update');
      }
    },

  }
</script>

<style lang="scss" scoped="">
  .countAttr {
    color: #F56C6C;
  }
  .valuesLine{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
