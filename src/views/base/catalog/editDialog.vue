<template>
  <div class="editMenuDialogWrapper">

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="editDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" size="mini">

        <el-form-item label="类目名称" prop="name">
          <el-input v-model="temp.name" clearable/>
        </el-form-item>
        <el-form-item label="类目说明" prop="descp">
          <el-input v-model="temp.descp" clearable/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateDeptLoading"
                   @click="dialogStatus==='create'?createDataValidate():updateDataValidate()">确定
        </el-button>
      </div>

    </el-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import {addCatalog, editCatalog} from '@/api/catalog'
  import {copyObjValue,getByteLen} from '@/utils';
  import {validateMobile, validateEmail} from '@/utils/validate';

  const statusOptions = [
    {key: '0', displayName: '正常'},
    {key: '1', displayName: '停用'},
  ];

  const temp = {
    id: '',//需要编辑的类目ID
    name: "",//类目名称
    descp: "",//类目说明
    parentId: 0,//类目的上级Id,一级类目传0
    type: 1 //类目类别 1-一级类目，2-二级类目，3-三级类目
  };

  export default {
    name: 'editCatalogDialog',
    components: {},
    data() {

      const nameValidator = (rule, value, callback) => {
        let byteLen = getByteLen(value);
        if (byteLen==0) {
          callback(new Error('请输入类目名称'))
        }else if (byteLen >16) {
          callback(new Error('最多8个汉字或16个英文'))
        } else {
          callback()
        }
      };

      return {
        statusOptions,
        temp,
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        rules: {
          name: [{required: true,validator: nameValidator,  trigger: 'change'}],
        },
        updateDeptLoading: false,
      };
    },
    methods: {
      resetTemp() {
        this.temp = Object.assign({},temp);
      },
      handleCreate(row) {
        this.resetTemp();
        if (row && row.id) {
          this.temp.parentId = row.id;
          this.temp.type = row.type + 1;
          if(this.temp.type>3){
            this.temp.type = 3;
          }
        } else {
          this.temp.parentId = 0;
        }
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = copyObjValue(this.temp, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      createDataValidate() {
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
            this.createData();
          }
        });
      },
      updateDataValidate() {
        this.$refs['editDataForm'].validate((valid) => {
          if (valid) {
            this.updateData();
          }
        });
      },
      updateData() {
        const tempData = Object.assign({}, this.temp);
        editCatalog(tempData).then((res) => {
          if (res.data.success) {
            this.$message({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('success',tempData);
            this.dialogFormVisible = false;
            this.resetTemp();
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
      createData() {
        const tempData = Object.assign({}, this.temp);
        delete tempData.id;
        addCatalog(tempData).then((res) => {
          if (res.data.success) {
            this.$message({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('success',tempData);
            this.dialogFormVisible = false;
            this.resetTemp();
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
      showSelectDeptDialog() {
        this.$refs.selectDeptDialog.show();
      }
    },

  }
</script>

<style lang="scss" scoped="">
  .showSelectDeptBtn {
    width: 100%;
    height: 36px;
    text-align: left;
  }

</style>
