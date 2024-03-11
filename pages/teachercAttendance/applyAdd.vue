<template>
	<view style="background: #f2f2f2;padding-bottom: 5px;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存并发送" :textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<view v-if="type===0">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item label="补卡时间:" name="kq_attend_id" :label-width="90" required>
						<uni-data-select 
							v-model="formData.kq_attend_id" 
							:localdata="replaceAbleList"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item label="补卡理由:" name="note" :label-width="90" required>
						<uni-easyinput type="textarea" v-model="formData.note" placeholder="请输入" :maxlength="300" :clearable="false"/>
					</uni-forms-item>
					<uni-forms-item label="照片:">
						<view style="margin: -26px 0 12px 42px;">
							<span class="file-des">{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}</span>
						</view>
						<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn'
							@chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum"
							:showMaxCount="showMaxCount">
						</g-upload>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	const typeList = ['补卡','出差','外出','加班'];
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				type: -1,
				replaceAbleList: [],
				formData: {
					kq_attend_id: '',
					note: ''
				},
				rules: {
					kq_attend_id: {
						rules: [{required: true, errorMessage: '请选择补卡时间'}]
					},
					note: {
						rules: [{required: true, errorMessage: '请输入补卡理由'}]
					}
				},
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 9, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 9, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: '',
			}
		},
		components: {
			mynavBar, gUpload
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			this.type = this.navItem.type;
			this.navItem.text = `添加${typeList[this.type]}申请`;
			uni.setNavigationBarTitle({
				title: `添加${typeList[this.type]}申请`
			});
			
			if(this.type===0) {
				// 获取补卡时间
				this.post(this.globaData.INTERFACE_TECKQ+'kqAttend/replaceAbleList', {
					user_code: this.personInfo.user_code,
					index_code: this.navItem.index_code,
				}, (data, res) => {
					if(data&&data.list) {
						this.replaceAbleList = data.list.map(v => ({value: v.id, text: moment(v.ctime).format("YYYY-MM-DD HH:mm 缺卡")}))
					}
				})
			}

			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick() {
				this.$refs.form.validate().then(res => {
					this.submitHandle()
				}).catch(err => {
					console.log(err)
				})
			},
			//附件上传相关👇
			chooseFile(list, v, f) {
				this.imgList = list
				this.imgFiles = this.imgFiles.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete(list, eq, fileeq) {
				this.imgList = list
				this.imgFiles.splice(fileeq, 1); //删除临时路径
				this.imgNames.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
			},
			async submitHandle() {
				this.showLoading();
				// 上传图片
				let imgArray = [];
				if(this.imgList.length>0){
					await new Promise((resolve,reject) => {
						cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_JSKQ_KQDK, (encName,
							encAddrStr) => {
							if (encName.length > 0) {
								for (var i = 0; i < encName.length; i++) {
									imgArray.push({
										name: encName[i],
										url: encAddrStr[i],
									})
								}
							}
							resolve();
						})
					})
					if(imgArray.length==0) {
						this.showToast("图片保存失败");
						this.hideLoading();
						return;
					}
				}
				// 添加申请
				this.post(this.globaData.INTERFACE_TECKQ+'kqApply/add', {
					create_user_code: this.personInfo.user_code,
					create_user_name: this.personInfo.user_name,
					index_code: this.navItem.index_code,
					type: typeList[this.type],
					files: imgArray,
					...this.formData,
				}, (data, res) => {
					this.hideLoading();
					this.showToast(res.msg);
					if(res.state==='ok') {
						const eventChannel = this.getOpenerEventChannel();
						eventChannel.emit('refreshPage');
						uni.navigateBack();
					}
				})
			},
		}
	}
</script>

<style scoped>
	>>> .is-required {
		order: -1;
	}
	
</style>