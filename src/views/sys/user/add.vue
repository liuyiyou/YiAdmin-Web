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
        <el-form-item label="部门ID" prop="deptId">
          <el-input v-model="user.deptId"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phonenumber">
          <el-input v-model="user.phonenumber"></el-input>
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit('userForm')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {add} from '@/api/user'
  import {_delete, edit, get, list} from '@/api/role'
  import {menuTreeData, roleMenuTreeData} from '@/api/menus'

  const defaultUser = {
    loginName: '',
    userName: '',
    deptId: '',
    email: '',
    phonenumber: '',
    //权限树
    rolesData: [],
    checkedKeys: [],

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
        //权限树
        rolesData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
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
    created(){
      this.getMenuTreeData();
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateBrand(this.$route.query.id, this.brand).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                add(this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.user = Object.assign({}, defaultUser);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.user = Object.assign({}, defaultUser);
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
        console.info("aaaaa");
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



