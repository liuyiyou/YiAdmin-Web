<template>
  <div class="attributeDialogWrapper">

    <el-dialog :visible.sync="dialogFormVisible"
      @open="clearValidate">
      <div slot="title" class="dialog-title">
        <span>{{title.p1}}</span><i class="el-icon-arrow-right"></i>
        <span>{{title.p2}}</span><i class="el-icon-arrow-right"></i>
        <span>{{title.p3}}</span><i class="el-icon-arrow-right"></i>
        <span>{{dialogStatusName}}属性</span>
      </div>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px" size="mini">
        <el-form-item label="属性类型">
          <el-radio-group v-model="temp.type" :disabled="dialogStatus === 'update'">
            <el-radio
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.key">
              {{item.display_name}}
            </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="temp.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联品牌" prop="brandId">
          <el-select v-model="temp.brandId"
                     placeholder="请选择品牌"
                     filterable
                     reserve-keyword
                     clearable
                     @change="handleChangeBrandId"
                     @focus="loadAllBrands"
                     :loading="loadingBrand"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,index) in brandIdOptions"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" v-if="dialogStatus=='create'" prop="values">
          <el-select
            class="valuesByBrand"
            v-model="temp.values"
            multiple
            filterable
            allow-create
            default-first-option
            no-data-text="请输入属性值"
            placeholder="请输入属性值"
            @input="handleValuesInput"
            @change="handleValuesChange">
            <el-option
              v-for="item in valuesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" v-else>
          <div class="createWrapper">
            <el-button icon="el-icon-plus" type="primary" @click="showCreateAttrValDialog">新增</el-button>
          </div>

          <el-table
            height="250"
            border
            :data="searchTableValuesFilterData"
            style="width: 100%">
            <el-table-column
              label="ID"
              prop="id">
            </el-table-column>
            <el-table-column
              label="名称"
              prop="value">
              <template slot-scope="scope">
                <span v-if="!scope.row.editStatus">{{ scope.row.attrVal }}</span>
                <el-input v-else v-model="scope.row.attrValTemp" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="searchTableValues"
                  size="mini" clearable
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <!-- <el-button
                   size="mini"
                   type="primary"
                   plain
                   v-if="!scope.row.editStatus"
                   @click="showEditAttrValue(scope.row)">编辑
                 </el-button>-->
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  v-if="!scope.row.editStatus"
                  @click="handleDeleteAttributeValue(scope.row)">删除
                </el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.editStatus"
                  plain
                  type="success"
                  @click="handleSaveAttributeValue(scope.row)">保存
                </el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.editStatus"
                  plain
                  @click="hideEditAttrValue(scope.row)">取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleAddCatalogAttribute():handleEditAttribute()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <create-val-dialog
      ref="createValDialog"
      :attr-id="temp.id"
      :brand-id="temp.brandId"
      @success="handleCreateAttrValSuccess"></create-val-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import {
    addCatalogAttribute,
    editCatalogAttribute,
    fetchAttributeById,
    removeCatalogAttributeValue,
    editCatalogAttributeValue,
    addCatalogAttributeValue
  } from '@/api/catalog'
  import {fetchListByCatalogId} from '@/api/brand';
  import {copyObjValue, getByteLen} from '@/utils';
  import createValDialog from './createValDialog.vue'

  let temp = {
    id: '',
    name: "",//属性名称
    catalogId: '0',//属性所在的类目的类目ID
    type: '1',//属性类型：1-关键属性(SPU);2-销售属性(SKU)
    values: [],
    brandId: '0'
  };


  const brandIdOptions = [{
    label: '通用',
    value: '0'
  }];

  //属性类型：1-关键属性(SPU);2-销售属性(SKU) ,
  const typeOptions = [
    {key: '1', display_name: '一般属性'},
    {key: '2', display_name: '销售属性'},
  ];

  let dialogStatusNameMap = {
    update: '编辑',
    create: '新增'
  };

  let valuesByBrandCache = {};
  let catalogBrandCacheMap = {};

  export default {
    name: 'editAttributeDialog',
    components: {createValDialog},
    directives: {},
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
    computed: {
      dialogStatusName() {
        return dialogStatusNameMap[this.dialogStatus];
      },
      searchTableValuesFilterData() {
        return this.temp.values.filter(data => {
          return !this.searchTableValues || data.attrVal.toLowerCase().includes(this.searchTableValues.toLowerCase());
        });
      },
    },
    data() {

      const nameValidator = (rule, value, callback) => {
        let byteLen = getByteLen(value);
        if (byteLen == 0) {
          callback(new Error('请输入名称'))
        } else if (byteLen > 16) {
          callback(new Error('最多8个汉字或16个英文'))
        } else {
          callback()
        }
      };

      const valuesValidator = (rule, value, callback) => {
        if (!value || value.length == 0) {
          callback(new Error('请添加属性属性值'))
        } else {
          callback()
        }
      };

      return {
        temp: Object.assign({}, temp),
        typeOptions,
        brandIdOptions,
        dialogFormVisible: false,
        loadingBrand: false,
        dialogStatus: 'create',
        createValueInputEdit: false,
        valuesOptions: [],
        rules: {
          brandId: [{required: true, message: '请选择品牌', trigger: 'change'}],
          name: [{required: true, validator: nameValidator, trigger: 'change'}],
          values: [{required: true, validator: valuesValidator, trigger: 'change'}],
        },
        searchTableValues: '',
        newAttrValue: '',
      };
    },
    methods: {
      clearValidate() {
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });

      },
      show(id) {
        this.dialogFormVisible = true;
        this.resetTemp();
        if (id) {
          this.dialogStatus = 'update';
          this.loadAttributeById(id);
          this.loadAllBrands();
        } else {
          this.dialogStatus = 'create';
        }
      },
      hide() {
        this.dialogFormVisible = false;
        this.resetTemp();
      },
      resetTemp() {
        this.temp = Object.assign({}, temp);
      },
      resetNewAttrValueTemp() {
        this.brandIdOptions = Object.assign({}, brandIdOptions);
      },
      handleAddCatalogAttribute() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.addCatalogAttribute();
          }
        })
      },
      addCatalogAttribute() {
        let parmas = Object.assign({}, this.temp);
        delete parmas.id;
        parmas.catalogId = this.catalogId;
        parmas.values = parmas.values.map((item) => {
          let _item = {
            attrVal: item,
            brandId: parmas.brandId
          };
          return _item;
        });

        addCatalogAttribute(parmas).then((res) => {
          let data = res.data;
          if (data.success) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.resetTemp();
            this.hide();
            this.$emit('success', parmas)
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      handleEditAttribute() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.editAttribute();
          }
        })
      },
      editAttribute() {
        let parmas = Object.assign({}, this.temp);
        parmas.catalogId = this.catalogId;
        parmas.attrId = parmas.id;
//        delete parmas.values;
//        delete parmas.valuesOptions;

        editCatalogAttribute(parmas).then((res) => {
          let data = res.data;
          if (data.success) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.resetTemp();
            this.hide();
            this.$emit('success', parmas)
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      handleValuesChange(values) {
        this.valuesOptions = values.map((item) => {
          return {
            value: item,
            label: item
          }
        });
      },
      handleDeleteAttributeValue(row) {
        this.$confirm('删除属性值, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCatalogAttributeValue(row.id);
        });
      },
      handleSaveAttributeValue(row) {
        let params = {
          attrId: row.attrId,
          attrVal: row.attrValTemp,
          id: row.id,
          brandId: row.brandId,
        };
        editCatalogAttributeValue(params).then((res) => {
          let resData = res.data;
          if (resData.success) {
            this.$message.success('修改成功');
            this.updateEvent();
            row.editStatus = false;
            row.attrVal = row.attrValTemp;
          } else {
            this.$message.error(resData.msg);
          }
        });
      },
      showCreateAttrValDialog() {
        this.$refs.createValDialog.show();
      },
      handleCreateAttrValSuccess() {
        this.loadAttributeById(this.temp.id);
        this.updateEvent();
      },
      showEditAttrValue(row) {
        row.editStatus = true;
        row.attrValTemp = row.attrVal;
      },
      hideEditAttrValue(row) {
        row.editStatus = false;
      },
      deleteCatalogAttributeValue(id) {
        let pram = {
          id: id,
          attrId: this.temp.id
        };
        removeCatalogAttributeValue(pram).then((res) => {
          let resData = res.data;
          if (resData.success) {
            this.$message.success('删除成功');
            this.updateEvent();
            this.loadAttributeById(this.temp.id);
          } else {
            this.$message.error(resData.msg);
          }
        });
      },
      handleValuesInput(value) {
        console.log(value);
      },
      loadAllBrands() {
        if (!catalogBrandCacheMap[this.catalogId]) {
          this.loadBrandsByCatalogId();
        } else {
          this.$set(this, 'brandIdOptions', catalogBrandCacheMap[this.catalogId]);
        }

      },
      loadBrandsByCatalogId() {
        if (!this.catalogId) {
          return;
        }
        this.loadingBrand = true;
        fetchListByCatalogId(this.catalogId).then((res) => {
          this.loadingBrand = false;
          let resData = res.data;
          if (resData.success) {
            let _generateBrandIdOptions = this.generateOptions(resData.data);
            let _brandIdOptions = brandIdOptions.concat(_generateBrandIdOptions);
            catalogBrandCacheMap[this.catalogId] = _brandIdOptions;
            this.$set(this, 'brandIdOptions', _brandIdOptions);
          } else {
            this.$message.error(resData.msg);
          }
        }).catch(() => {
          this.loadingBrand = false;
        });
      },
      generateOptions(list) {
        if (Object.prototype.toString.call(list) !== '[object Array]') {
          return [];
        }
        return list.map((item) => {
          return {
            label: item.brandName,
            value: item.id + ''
          }
        });
      },
      loadAttributeById(id) {
        if (!id) {
          return;
        }
        fetchAttributeById(id).then((res) => {
          let resData = res.data;
          if (resData.success) {
            let data = resData.data;
            data.type = data.type + '';
            data.catalogId = id + '';
            data.brandId = this.temp.brandId;
            valuesByBrandCache = data.valuesByBrand;

            this.temp = copyObjValue(temp, data);

            this.handleChangeBrandId(this.temp.brandId);
            this.temp.valuesOptions = [];
          }
        });
      },
      handleChangeBrandId(brandId) {
        let valuesArray = valuesByBrandCache[brandId] || [];
        this.temp.values = valuesArray.map((item) => {
          let _item = {
            attrId: this.temp.id,
            attrVal: item.value,
            id: item.id,
            brandId: item.brandId,
            editStatus: false
          };
          return _item;
        });
      },
      updateEvent(){
        this.$emit('update');
      }
    },

  }
</script>

<style lang="scss" scoped="">
  .valuesByBrand {
    width: 100%;
  }

  .createWrapper {
    margin-bottom: 10px;
    width: 300px;

    /deep/ .el-input-group__append {
      color: hsl(210, 100%, 63%);
      background: hsl(212, 100%, 96%);
      border-color: hsl(211, 100%, 85%);
    }
  }

</style>
