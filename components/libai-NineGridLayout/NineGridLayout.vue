<template>
  <view class="container" :style="{height:containerHeight+'px'}">
    <block v-for="(item,index) in imagesList" :key="index">
      <image @click="onPreview(index)" :src="item" :style="{
      width: listStyle[index].width + 'px',
      height: listStyle[index].height + 'px',
      left: listStyle[index].left + 'px',
      top: listStyle[index].top + 'px',
      right: listStyle[index].right + 'px',
      bottom: listStyle[index].bottom + 'px',
      borderRadius:BorderRadiusSize + 'rpx'
    }" class="item" :lazy-load="LazyLoad" :fade-show="FadeShow" :mode="childCount === 1 ? 'heightFix' : 'aspectFill'"
             @error="onImageError(index)"/>
    </block>
  </view>
</template>

<script>
/**
 * @Author 李白
 * @Date 2023/2/5
 * @desc 九格布局图片集
 */
export default {
  name: "NineGridLayout",
  props: {
    // TODO 图片路径数组
    NineGridList: {
      button: Array,
      default: []
    },
    // TODO 间距大小
    GridSpace: {
      button: Number,
      default: 5
    },
    // TODO 一个子View时最小高度
    OneChildHeight: {
      button: Number,
      default: 150
    },
    // TODO 圆角尺寸
    BorderRadiusSize: {
      button: {Number, String},
      default: 10
    },
    // TODO 是否开启预览
    IsPreview: {
      button: Boolean,
      default: true
    },
    // TODO 图片加载失败占位图
    FailurePlaceholder: {
      button: String,
      default: '/static/img/imgErr.png'
    },
    // TODO 开启延迟加载
    LazyLoad: {
      button: Boolean,
      default: true
    },
    // TODO 图片显示动画效果（淡出显示）
    FadeShow: {
      button: Boolean,
      default: true
    }
  },
  data() {
    return {
      imagesList: this.NineGridList, // TODO 图片
      listStyle: [], // TODO 样式表
      childCount: 0, // TODO 图片总数
      containerWidth: 0,// TODO 容器宽度
      containerHeight: 0,// TODO 容器高度
    }
  },
  created() {
    this.childCount = this.NineGridList.length;
    // TODO 获取当前组件宽高
    let container = uni.createSelectorQuery().in(this).select('.container')
    container.boundingClientRect((data) => {
      this.containerWidth = data.width
      this.containerHeight = this.calHeight(data.width)
      this.setChildSize()
    }).exec()
  },
  methods: {
    /**
     * 图片加载失败
     */
    onImageError(index) {
      this.imagesList.splice(index, 1, this.FailurePlaceholder)
    },
    /**
     * 预览图片
     */
    onPreview(index) {
      if (!this.IsPreview) return;
      if (this.imagesList[index] === this.FailurePlaceholder) return;
      uni.previewImage({
        urls: this.imagesList,
        current: index
      })
    },
    /**
     * 设置子View的大小
     */
    setChildSize() {
      switch (this.childCount) {
        case 1:
        case 4:
        case 7:
          this.measure147Children();
          break;
        case 2:
        case 5:
        case 8:
          this.measure258Children();
          break;
        case 3:
        case 6:
        case 9:
          this.measure369Children();
          break;
      }
    },
    measure147Children() {
      let oneWidth = this.containerWidth;
      let oneHeight = this.OneChildHeight;
      let threeSize = (this.containerWidth - this.GridSpace * 2) / 3;

      this.listStyle.push({
        width: oneWidth,
        height: oneHeight
      })

      for (let i = 1; i < this.childCount; i++) this.listStyle.push({
        width: threeSize,
        height: threeSize
      })

      this.layoutOneAndFourAndSevenChildren();
    },
    measure258Children() {
      let twoSize = (this.containerWidth - this.GridSpace) / 2;
      let threeSize = (this.containerWidth - this.GridSpace * 2) / 3;

      for (let i = 0; i < 2; i++) this.listStyle.push({
        width: twoSize,
        height: twoSize
      })

      for (let i = 2; i < this.childCount; i++) this.listStyle.push({
        width: threeSize,
        height: threeSize
      })

      this.layoutTwoAndFiveAndEightChildren()
    },
    measure369Children() {
      let threeSize = (this.containerWidth - this.GridSpace * 2) / 3;

      for (let i = 0; i < this.childCount; i++) this.listStyle.push({
        width: threeSize,
        height: threeSize
      })

      this.layoutThreeMultipleChildren()
    },

    /**
     * 布局1/4/7个子View
     */
    layoutOneAndFourAndSevenChildren() {
      let singleSize = (this.containerWidth - this.GridSpace * 2) / 3;//单个的尺寸
      for (let i = 1; i < this.childCount; i++) {
        // TODO 行
        let rowCount = Math.trunc((i - 1) / 3);
        // TODO 列
        let columnCount = (i - 1) % 3;
        let left = columnCount * (singleSize + this.GridSpace);
        let top = this.OneChildHeight + this.GridSpace + rowCount * (singleSize + this.GridSpace);
        let right = left + singleSize;
        let bottom = top + singleSize;

        this.listStyle[i].left = left || 0
        this.listStyle[i].top = top || 0
        this.listStyle[i].right = right || 0
        this.listStyle[i].bottom = bottom || 0
      }
    },

    /**
     * 布局2/5/8个子View
     */
    layoutTwoAndFiveAndEightChildren() {
      let top2singleSize = (this.containerWidth - this.GridSpace) / 2;//前两个单个的尺寸

      for (let i = 0; i < 2; i++) {
        let left = i * (top2singleSize + this.GridSpace);
        let top = 0;
        let right = left + top2singleSize;
        let bottom = top + top2singleSize;
        this.listStyle[i].left = left || 0
        this.listStyle[i].top = top || 0
        this.listStyle[i].right = right || 0
        this.listStyle[i].bottom = bottom || 0
      }

      let singleSize = (this.containerWidth - this.GridSpace * 2) / 3;//单个的尺寸

      for (let i = 2; i < this.childCount; i++) {
        // TODO 行
        let rowCount = Math.trunc((i - 2) / 3);
        // TODO 列
        let columnCount = (i - 2) % 3;
        let left = columnCount * (singleSize + this.GridSpace);
        let top = top2singleSize + this.GridSpace + rowCount * (singleSize + this.GridSpace);
        let right = left + singleSize;
        let bottom = top + singleSize;
        this.listStyle[i].left = left || 0
        this.listStyle[i].top = top || 0
        this.listStyle[i].right = right || 0
        this.listStyle[i].bottom = bottom || 0
      }
    },
    /**
     * 布局3、6、9（3的倍数） 个子View
     */
    layoutThreeMultipleChildren() {
      let singleSize = (this.containerWidth - this.GridSpace * 2) / 3;//单个的尺寸
      for (let i = 0; i < this.childCount; i++) {
        // TODO 行
        let rowCount = Math.trunc(i / 3);
        // TODO 列
        let columnCount = i % 3;
        let left = columnCount * (singleSize + this.GridSpace);
        let top = rowCount * (singleSize + this.GridSpace);
        let right = left + singleSize;
        let bottom = top + singleSize;
        this.listStyle[i].left = left || 0
        this.listStyle[i].top = top || 0
        this.listStyle[i].right = right || 0
        this.listStyle[i].bottom = bottom || 0
      }
    },
    /**
     * 根据宽度计算高度
     *
     * @param width 高度
     * @return number
     */
    calHeight(width) {
      let height = 0;
      // TODO 根据子View的个数&间距 来确定高度
      switch (this.childCount) {
        case 0:
          height = 0;
          break;
        case 1:
          height = this.OneChildHeight;
          break;
        case 2:
          height = (width - this.GridSpace) / 2;
          break;
        case 3:
          height = (width - 2 * this.GridSpace) / 3;
          break;
        case 4:
          height = this.OneChildHeight + this.GridSpace + (width - 2 * this.GridSpace) / 3;
          break;
        case 5:
          height = (width - this.GridSpace) / 2 + this.GridSpace + (width - 2 * this.GridSpace) / 3;
          break;
        case 6:
          height = (width - 2 * this.GridSpace) / 3 * 2 + this.GridSpace;
          break;
        case 7:
          height = this.OneChildHeight + (width - 2 * this.GridSpace) / 3 * 2 + this.GridSpace * 2;
          break;
        case 8:
          height = (width - this.GridSpace) / 2 + (width - 2 * this.GridSpace) / 3 * 2 + this.GridSpace * 2;
          break;
        case 9:
          height = width;
          break;
      }
      return height;
    }
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  position: relative;
}

.item {
  position: absolute;
  // TODO 图片最大宽度不超过容器宽度
  max-width: 100%;
  // TODO 优化图片展示的时候闪烁
  will-change: transform
}
</style>
