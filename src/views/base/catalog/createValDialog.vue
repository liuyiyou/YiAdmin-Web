<template>
  <div class="createValDialog">
    <el-dialog :visible.sync="createValDialogFormVisible" title="新增属性值" width="500px">
      <el-form ref="createForm" :rules="newAttrValueRules" :model="newAttrValueTemp" label-width="80px" size="mini">
        <el-form-item prop="attrVal" label="属性值">
          <el-input placeholder="请输入新属性值" v-model="newAttrValueTemp.attrVal" size="mini" clearable
                    class="createInput">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createValDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateAttrVal">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">

  import {
    addCatalogAttributeValue
  } from '@/api/catalog'

  import {getByteLen} from '@/utils';

  let newAttrValueTemp = {
    attrId: 0,
    attrVal: "",
    attrValTemp: "",
    brandId: '0',
  };

  export default {
    name: 'createValDialog',
    props: {
      attrId: {
        type: [String, Number],
        required: true
      },
      brandId: {
        type: [String, Number],
        required: true
      },
    },
    data() {
      const attrValValidator = (rule, value, callback) => {
        let byteLen = getByteLen(value);
        if (byteLen == 0) {
          callback(new Error('请输入属性值'))
        } else if (byteLen > 16) {
          callback(new Error('最多8个汉字或16个英文'))
        } else {
          callback()
        }
      };
      return {
        newAttrValueTemp: Object.assign({}, newAttrValueTemp),
        createValDialogFormVisible: false,
        newAttrValueRules: {
          attrVal: [{required: true, validator: attrValValidator, trigger: 'blur'}],
        },
      }
    },
    methods: {
      resetNewAttrValueTemp() {
        this.newAttrValueTemp = Object.assign({}, newAttrValueTemp);
      },
      show() {
        this.createValDialogFormVisible = true;
      },
      hide() {
        this.createValDialogFormVisible = false;
      },
      handleCreateAttrVal() {
        this.$refs['createForm'].validate((valid) => {
          if (valid) {
            this.createAttrVal();
          }
        })
      },
      createAttrVal() {
        this.newAttrValueTemp.attrId = this.attrId;
        this.newAttrValueTemp.brandId = this.brandId;

        addCatalogAttributeValue(this.newAttrValueTemp).then((res) => {
          let resData = res.data;
          if (resData.success) {
            this.$message.success('新增属性值成功');
            this.$emit('success');
            this.resetNewAttrValueTemp();
            this.hide();
          } else {
            this.$message.error(resData.msg);
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>
