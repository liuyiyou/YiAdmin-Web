<template>
  <div class="editMenuDialogWrapper">
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="editDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" size="mini">
        <el-form-item label="上级部门">
          <!--<el-input v-model="temp.parentName" :disabled="true"/>-->
          <el-button @click="showSelectDeptDialog" class="showSelectDeptBtn">{{temp.parentName || '根目录'}}
          </el-button>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="temp.deptName" clearable/>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="temp.orderNum" clearable/>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="temp.leader" clearable/>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="temp.mobile" clearable/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" clearable/>
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.key">
              {{item.displayName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateDeptLoading"
                   @click="dialogStatus==='create'?createDataValidate():updateDataValidate()">确定
        </el-button>
      </div>
    </el-dialog>

    <select-dept-dialog
      :tress="tress"
      ref="selectDeptDialog"
      @submit="selectDeptHandel"></select-dept-dialog>

  </div>

</template>

<script type="text/ecmascript-6">
  import {deptsEdit, deptsAdd} from '@/api/depts'
  import {copyObjValue} from '@/utils';
  import {validateMobile, validateEmail} from '@/utils/validate';

  import selectDeptDialog from './selectDeptDialog.vue'

  const statusOptions = [
    {key: '0', displayName: '正常'},
    {key: '1', displayName: '停用'},
  ];

  let temp = {
    id: 0,
    parentId: 0,
    parentName: '根目录',
    deptName: '',
    orderNum: 0,
    leader: '',
    mobile: '',
    email: '',
    status: '0',
  };

  export default {
    name: 'editMenuDialog',
    components: {selectDeptDialog},
    props: {
      tress: {
        type: Array,
        default: []
      }
    },
    data() {

      const mobileValidator = (rule, value, callback) => {
        if (value && !validateMobile(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      };

      const emailValidator = (rule, value, callback) => {
        if (value && !validateEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      };

      return {
        statusOptions,
        temp: Object.assign({}, temp),
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        rules: {
          deptName: [{required: true, message: '请输入部门名称', trigger: 'change'}],
          status: [{required: true, message: '请选择部门状态', trigger: 'change'}],
          mobile: [{validator: mobileValidator, message: '请输入正确的手机号码', trigger: 'change'}],
          email: [{validator: emailValidator, message: '请输入正确的邮箱', trigger: 'change'}],
        },
        updateDeptLoading: false,
      };
    },
    methods: {
      resetTemp() {
        this.temp = Object.assign({}, temp);
      },
      handleCreate(row) {
        this.resetTemp();
        if (row.id) {
          this.selectDeptHandel(row);
        }
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['editDataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
       // this.temp = copyObjValue(this.temp, row);
        this.temp.status = this.temp.status + '';
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
        deptsEdit(tempData).then((res) => {
          if (res.data.success) {
            this.$message({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('success');
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
        deptsAdd(tempData).then((res) => {
          if (res.data.success) {
            this.$message({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('success');
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
      },
      selectDeptHandel(dept) {
        this.temp.parentId = dept.id;
        this.temp.parentName = dept.deptName;
      },
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
