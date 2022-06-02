# feitui-select 下拉选择框
魔改 [easy-select](https://ext.dcloud.net.cn/plugin?id=2511)，改为uni_modules版

## Basic example
```js
<template>
    <view class="content" @click="useOutClickSide">
        <feitui-select ref="feituiSelect" size="medium" :value="selecValue" @selectOne="selectOne"></feitui-select>
    </view>
</template>

<script>
export default {
    data() {
        selecValue: '双皮奶'
    },
    methods: {
        selectOne(options) {
            this.selecValue = options.label
        },
        useOutClickSide() {
            this.$refs.feituiSelect.hideOptions && this.$refs.feituiSelect.hideOptions()
        }
    }
}
</script>
```

## Options
| props | type | require | explain |
| ----- | ---- | ------- | ------- |
| windowHeight | Num,str | false | 可用视口的高度，如果没传入会自动帮你计算 |
| value | String | false | 当前选中的值 |
| placeholder | String | false | 提示文字 |
| size | String | false | 可选'medium, small, mini'尺寸 |
| options | Array | false | options选项数据 |