<template>
  <view class="imglistbx">
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" v-for="(item,index) in showList" :key='index'>
      <image :src="item" class="itemImg" @click="previewImage(index)" mode="aspectFill"></image>
      <icon size="18" type="cancel" class="cancelBtn" @click="deleteImg(index)" v-if="deleteBtn"></icon>
    </view>
    <!-- 上传控件 -->
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" @click="chooseImg" v-if="control&&showControl">
      <view class="itemImg uploadControl">+</view>
    </view>
    <view class="clear"></view>
  </view>
</template>

<script>
  export default {
    props: {
      //是否显示上传控件
      control: {
        type: Boolean,
        default: true
      },
      //是否显示上删除按钮
      deleteBtn: {
        type: Boolean,
        default: true
      },
      //行数量 
      columnNum: {
        type: [Number, String],
        default: 4
      },
      //上传最大数量
      maxCount: {
        type: Number,
        default: 4
      },
	  //显示的最大数量
	  showMaxCount: {
	    type: Number,
	    default: 4
	  },
      //服务返回回调的图片数组--回填
      mode: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        showList: [],
		modeLength:0,
        showControl: true,
		firstInit:true
      }
    },
    watch: {
      mode(v) {
        this.init(v)
      },
      showList(){
        if (this.showList.length >= this.showMaxCount) {
          this.showControl = false
          return
        };
         this.showControl = true;
      }
    },
    created() {
      this.init(this.mode)
    },
    methods: {
      init(v) {
		if(this.firstInit){
			this.modeLength=v.length
			this.firstInit=!this.firstInit
		}
        if (this.mode.length != 0) {
          this.showList = v;
          return
        };
        this.showList = [];
      },
      // 选择图片
      chooseImg() {
        uni.chooseImage({
          sizeType: ['compressed '],
          count: this.maxCount,
          success: (chooseImageRes) => {
            let tempFilePaths = chooseImageRes.tempFilePaths;
			let tempFiles = chooseImageRes.tempFiles;
            tempFilePaths=tempFilePaths.slice(0,this.showMaxCount-this.showList.length);
            tempFilePaths.forEach((item) => {
              this.showList.push(item);
            })
			console.log("tempFiles: ",tempFiles);
            this.$emit("chooseFile", this.showList, tempFilePaths,tempFiles)
          }
        });
      },
      //删除图片
      deleteImg(eq) {
        let deleteImg = this.showList;
        deleteImg.splice(eq, 1); //删除临时路径
        let fileeq=eq-this.modeLength
        this.$emit("imgDelete", deleteImg, eq,fileeq)
      },
      // 预览图片
      previewImage(eq) {
        let getUrl = this.showList;
        uni.previewImage({
          current: getUrl[eq],
          urls: getUrl
        })
      },
    }
  }
</script>

<style scoped>
  /* 上传  str */
  .imglistbx {
    width: 100%;
    height: 100%;
  }

  .imglistItem {
    position: relative;
    float: left;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }

  .column3 {
    width: 33.3333%;
    height: 160rpx;
  }

  .column4 {
    width: 25%;
    height: 130rpx;
  }

  .itemImg {
    width: 70%;
    height: 100%;
    margin: 0 auto;
    display: block;
    border-radius: 10rpx;
  }

  .cancelBtn {
    position: absolute;
    top: -10rpx;
    right: 10rpx;
  }

  /* 上传控件 */
  .uploadControl {
    font-size: 50rpx;
    color: #888;
    background-color: #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /*  上传  str end*/
  .clear {
    clear: both;
  }
</style>
