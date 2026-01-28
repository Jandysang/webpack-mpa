// src/components/ElementPlusJSXExample.jsx
import { ref, reactive } from 'vue'
import { 
  ElButton, 
  ElForm, 
  ElFormItem, 
  ElInput, 
  ElSelect, 
  ElOption, 
  ElTable, 
  ElTableColumn,
  ElMessageBox,
  ElMessage
} from 'element-plus'

// 定义并导出 JSX 组件
export default {
  setup() {
    // 表单数据
    const formData = reactive({
      name: '',
      age: '',
      gender: ''
    })

    // 表单验证规则
    const rules = reactive({
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
    })

    // 表格数据
    const tableData = ref([
      { id: 1, name: '张三', age: 25, gender: '男' },
      { id: 2, name: '李四', age: 30, gender: '女' },
      { id: 3, name: '王五', age: 28, gender: '男' }
    ])

    // 表单提交方法
    const handleSubmit = () => {
      if (formData.name && formData.age) {
        tableData.value.push({
          id: tableData.value.length + 1,
          ...formData
        })
        // 重置表单
        formData.name = ''
        formData.age = ''
        formData.gender = ''
        ElMessage.success('提交成功！')
      } else {
        ElMessage.error('请完善表单信息！')
      }
    }

    // 删除表格行方法
    const handleDelete = (id) => {
      ElMessageBox.confirm(
        '此操作将永久删除该记录, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        tableData.value = tableData.value.filter(item => item.id !== id)
        ElMessage.success('删除成功!')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    // 返回需要在渲染函数中使用的变量和方法
    return {
      formData,
      rules,
      tableData,
      handleSubmit,
      handleDelete
    }
  },

  // JSX 渲染函数
  render() {
    return (
      <div class="element-plus-jsx-example" style="padding: 20px;">
        <h3>Element Plus + 纯 JSX 文件示例</h3>
        
        {/* 表单组件 */}
        <ElForm
          model={this.formData}
          rules={this.rules}
          label-width="80px"
          style="margin-bottom: 20px; max-width: 600px;"
        >
          <ElFormItem label="姓名" prop="name">
            <ElInput v-model={this.formData.name} placeholder="请输入姓名" />
          </ElFormItem>
          
          <ElFormItem label="年龄" prop="age">
            <ElInput v-model={this.formData.age} type="number" placeholder="请输入年龄" />
          </ElFormItem>
          
          <ElFormItem label="性别">
            <ElSelect v-model={this.formData.gender} placeholder="请选择性别">
              <ElOption label="男" value="男" />
              <ElOption label="女" value="女" />
            </ElSelect>
          </ElFormItem>
          
          <ElFormItem>
            <ElButton type="primary" onClick={this.handleSubmit}>提交</ElButton>
            <ElButton style="margin-left: 10px;" onClick={() => {
              this.formData.name = ''
              this.formData.age = ''
              this.formData.gender = ''
            }}>重置</ElButton>
          </ElFormItem>
        </ElForm>
        
        {/* 表格组件 */}
        <ElTable
          data={this.tableData}
          border
          style="width: 100%; max-width: 800px;"
        >
          <ElTableColumn prop="id" label="ID" width="80" />
          <ElTableColumn prop="name" label="姓名" width="120" />
          <ElTableColumn prop="age" label="年龄" width="80" />
          <ElTableColumn prop="gender" label="性别" width="80" />
          <ElTableColumn label="操作" width="180">
            {{
              default: ({ row }) => (
                <div>
                  <ElButton 
                    type="text" 
                    onClick={() => this.handleDelete(row.id)}
                    style="color: #f56c6c;"
                  >
                    删除
                  </ElButton>
                </div>
              )
            }}
          </ElTableColumn>
        </ElTable>
      </div>
    )
  }
}