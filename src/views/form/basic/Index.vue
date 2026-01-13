<template>
  <a-page-header
      title="Title"
      sub-title="Basic form example"
  />

  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form
        :model="formState"
        :rules="rules"
        layout="horizontal"
        @finish="handleSubmit"
    >
      <!-- Title -->
      <a-form-item
          name="name"
          :label="t('form.basic-form.title.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
            v-model:value="formState.name"
            :placeholder="t('form.basic-form.title.placeholder')"
        />
      </a-form-item>

      <!-- Date -->
      <a-form-item
          name="buildTime"
          :label="t('form.basic-form.date.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-range-picker
            v-model:value="formState.buildTime"
            style="width: 100%"
        />
      </a-form-item>

      <!-- Goal -->
      <a-form-item
          name="description"
          :label="t('form.basic-form.goal.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-textarea
            rows="4"
            v-model:value="formState.description"
            :placeholder="t('form.basic-form.goal.placeholder')"
        />
      </a-form-item>

      <!-- Standard -->
      <a-form-item
          name="type"
          :label="t('form.basic-form.standard.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-textarea
            rows="4"
            v-model:value="formState.type"
            :placeholder="t('form.basic-form.standard.placeholder')"
        />
      </a-form-item>

      <!-- Client -->
      <a-form-item
          name="customer"
          :label="t('form.basic-form.client.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
            v-model:value="formState.customer"
            :placeholder="t('form.basic-form.client.placeholder')"
        />
      </a-form-item>

      <!-- Invites -->
      <a-form-item
          :label="t('form.basic-form.invites.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
            v-model:value="formState.invites"
            :placeholder="t('form.basic-form.invites.placeholder')"
        />
      </a-form-item>

      <!-- Weight -->
      <a-form-item
          :label="t('form.basic-form.weight.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input-number
            v-model:value="formState.weight"
            :min="0"
            :max="100"
        />
        <span> %</span>
      </a-form-item>

      <!-- Public -->
      <a-form-item
          name="target"
          :label="t('form.basic-form.public.label')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
          :help="t('form.basic-form.label.help')"
      >
        <a-radio-group v-model:value="formState.target">
          <a-radio :value="1">{{ t('form.basic-form.radio.public') }}</a-radio>
          <a-radio :value="2">{{ t('form.basic-form.radio.partially-public') }}</a-radio>
          <a-radio :value="3">{{ t('form.basic-form.radio.private') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- Conditional select -->
      <a-form-item v-if="formState.target === 2">
        <a-select v-model:value="formState.participants" mode="multiple">
          <a-select-option value="4">{{ t('form.basic-form.option.A') }}</a-select-option>
          <a-select-option value="5">{{ t('form.basic-form.option.B') }}</a-select-option>
          <a-select-option value="6">{{ t('form.basic-form.option.C') }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Actions -->
      <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
        <a-button type="primary" html-type="submit">
          {{ t('form.basic-form.form.submit') }}
        </a-button>
        <a-button style="margin-left: 8px">
          {{ t('form.basic-form.form.save') }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formState = reactive({
  name: '',
  buildTime: [],
  description: '',
  type: '',
  customer: '',
  invites: '',
  weight: null,
  target: 1,
  participants: []
})

const rules = {
  name: [
    { required: true, message: t('form.basic-form.title.required') }
  ],
  buildTime: [
    { required: true, message: t('form.basic-form.date.required') }
  ],
  description: [
    { required: true, message: t('form.basic-form.goal.required') }
  ],
  type: [
    { required: true, message: t('form.basic-form.standard.required') }
  ],
  customer: [
    { required: true, message: t('form.basic-form.client.required') }
  ]
}

const handleSubmit = (values) => {
  console.log('Received values of form:', values)
}
</script>
