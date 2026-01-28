import { defineComponent, ref, reactive } from 'vue';
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElCol, ElDatePicker, ElTimePicker, ElSwitch, ElCheckboxGroup, ElCheckbox, ElRadioGroup, ElRadio } from 'element-plus';

interface FormData {
  name: string;
  region: string;
  date1: string | null;
  date2: string | null;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}

export default defineComponent({
  name: 'Vue3TsApp',
  
  setup() {
    const message = ref<string>('Vue3组合式API生效！');
    
    const changeMessage = () => {
      message.value = 'Vue3 + Webpack5 MPA 成功！';
    };

    // 表单数据
    const form = reactive<FormData>({
      name: '',
      region: '',
      date1: null,
      date2: null,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });

    const onSubmit = () => {
      console.log('submit!', form);
    };

    return {
      message,
      changeMessage,
      form,
      onSubmit
    };
  },

  render() {
    return (
      <div class="vue3-page">
        <h1>Vue3 Page (Latest Version)</h1>
        <p>{this.message}</p>
        <button onClick={this.changeMessage}>点击修改</button>

        <div class="button-row">
          <ElButton>Default</ElButton>
          <ElButton type="primary">Primary</ElButton>
          <ElButton type="success">Success</ElButton>
          <ElButton type="info">Info</ElButton>
          <ElButton type="warning">Warning</ElButton>
          <ElButton type="danger">Danger</ElButton>
        </div>

        <ElForm model={this.form} labelWidth="auto" style={{ maxWidth: '600px' }}>
          <ElFormItem label="Activity name">
            <ElInput 
              v-model={this.form.name} 
            />
          </ElFormItem>
          
          <ElFormItem label="Activity zone">
            <ElSelect 
              v-model={this.form.region} 
              placeholder="please select your zone"
            >
              <ElOption label="Zone one" value="shanghai" />
              <ElOption label="Zone two" value="beijing" />
            </ElSelect>
          </ElFormItem>
          
          <ElFormItem label="Activity time">
            <ElCol span={11}>
              <ElDatePicker
                v-model={this.form.date1}
                type="date"
                placeholder="Pick a date"
                style={{ width: '100%' }}
              />
            </ElCol>
            <ElCol span={2} class="text-center">
              <span class="text-gray-500">-</span>
            </ElCol>
            <ElCol span={11}>
              <ElTimePicker
                v-model={this.form.date2}
                placeholder="Pick a time"
                style={{ width: '100%' }}
              />
            </ElCol>
          </ElFormItem>
          
          <ElFormItem label="Instant delivery">
            <ElSwitch 
              v-model={this.form.delivery} 
            />
          </ElFormItem>
          
          <ElFormItem label="Activity type">
            <ElCheckboxGroup 
              v-model={this.form.type}
            >
              <ElCheckbox value="Online activities" name="type">
                Online activities
              </ElCheckbox>
              <ElCheckbox value="Promotion activities" name="type">
                Promotion activities
              </ElCheckbox>
              <ElCheckbox value="Offline activities" name="type">
                Offline activities
              </ElCheckbox>
              <ElCheckbox value="Simple brand exposure" name="type">
                Simple brand exposure
              </ElCheckbox>
            </ElCheckboxGroup>
          </ElFormItem>
          
          <ElFormItem label="Resources">
            <ElRadioGroup 
              v-model={this.form.resource}
            >
              <ElRadio value="Sponsor">Sponsor</ElRadio>
              <ElRadio value="Venue">Venue</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          
          <ElFormItem label="Activity form">
            <ElInput 
              v-model={this.form.desc} 
              type="textarea" 
            />
          </ElFormItem>
          
          <ElFormItem>
            <ElButton type="primary" onClick={this.onSubmit}>Create</ElButton>
            <ElButton>Cancel</ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    );
  }
});