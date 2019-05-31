<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">

    <el-table-column label="类目ID" width="100">
      <template slot-scope="scope">
        {{ scope.row.itemType ? '' : scope.row.id }}
      </template>
    </el-table-column>

    <el-table-column label="类目名称" width="300">
      <template slot-scope="scope">
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <div class="editItem" v-if="scope.row.itemType!=='add'"  @click="toggleExpanded(scope.$index)">
          <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(scope.row)" class="tree-ctrl">
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/>
            </span>
          <el-tag size="mini">{{scope.row.type}}级</el-tag>
          {{ scope.row.name }}
        </div>

      </template>
    </el-table-column>

    <el-table-column label="类目说明">
      <template slot-scope="scope">
        <span>{{ scope.row.descp }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="250">
      <template slot-scope="scope">
      <!--  <div v-if="scope.row.itemType!=='add'">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </div>
        <div class="addItem" v-else>
          <el-button class="" size="mini" @click="scope.row._edit=!scope.row._edit">添加{{scope.row.parentName}}子类目</el-button>
        </div>-->
        <!--<el-tooltip placement="top" v-permission="['catalog:edit']">-->
          <div slot="content">编辑</div>
          <el-button type="primary" circle icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
        <!--</el-tooltip>-->

        <!--<el-tooltip placement="top" v-permission="['catalog:add']">-->
          <div slot="content">添加下级</div>
          <el-button type="success" circle icon="el-icon-plus" @click="handleCreate(scope.row)"
                     v-if="scope.row.type <3 "></el-button>
        <!--</el-tooltip>-->
        <el-tooltip placement="top"  v-if="scope.row.type ==3 ">
          <div slot="content">属性列表</div>
          <el-button type="info" circle icon="el-icon-tickets" @click="handleAttribute(scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  // import permission from '@/directive/permission/index.js' // 权限判断指令
  import treeToArray from './eval'

  export default {
    name: 'catalogTreeTable',
    props: {
      /* eslint-disable */
      data: {
        type: [Array, Object],
        required: true
      },
      columns: {
        type: Array,
        default: () => []
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      formatData: function () {
        let tmp;
        if (!Array.isArray(this.data)) {
          tmp = [this.data]
        } else {
          tmp = this.data
        }
        const func = this.evalFunc || treeToArray;

        const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll];

        return func.apply(null, args);
      }
    },
    // directives: { permission },
    methods: {
      showRow: function (row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true);
        row.row._show = show;
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      toggleExpanded: function (trIndex) {
        const record = this.formatData[trIndex];
        record._expanded = !record._expanded;

        this.$emit('expanded',record);
      },
      iconShow(record) {
        return record.type !== 3;
      },
      handleEdit(row) {
        this.$emit('edit', row);
      },
      handleCreate(row) {
        this.$emit('add', row);
      },
      handleAttribute(row) {
        this.$emit('attribute', row);
      },
    }
  }
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }

  .processContainer {
    width: 100%;
    height: 100%;
  }

  table td {
    line-height: 26px;
  }

  .tree-ctrl {
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
