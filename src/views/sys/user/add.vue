<template> 
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <el-form :model="user" :rules="rules" ref="userForm" label-width="150px">
        <el-form-item label="账号:" prop="loginName">
          <el-input v-model="user.loginName"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" filterable prop="deptId">
          <el-button @click="showSelectDeptDialog" class="showSelectDeptBtn">{{user.deptName}}
          </el-button>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phonenumber">
          <el-input v-model="user.phonenumber"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <select-dept-dialog
      ref="selectDeptDialog"
      @submit="selectDeptHandel">

    </select-dept-dialog>
  </div>
</template>

<script>
  import {add} from '@/api/user'
  import {_delete, edit, get, list} from '@/api/role'
  import {menuTreeData, roleMenuTreeData} from '@/api/menus'
  import {selectDeptDialog} from './selectDeptDialog.vue'

  const defaultUser = {
    loginName: '',
    userName: '',
    deptId: '',
    email: '',
    phonenumber: '',

  };
  export default {
    name: 'UserDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        user: Object.assign({}, defaultUser),
        rules: {
          loginName: [
            {required: true, message: '登陆账号', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '请输入用户昵称', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
    },
    methods: {
      showSelectDeptDialog() {
        this.$refs.selectDeptDialog.show();
      },
      selectDeptHandel(dept) {
        this.temp.deptId = dept.id;
        this.temp.deptName = dept.deptName;
        console.log(JSON.stringify(this.temp))
      },
    }
  }
</script>
<style></style>



