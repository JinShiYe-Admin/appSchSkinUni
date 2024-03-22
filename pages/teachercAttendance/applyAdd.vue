<template>
	<view style="background: #f2f2f2;padding-bottom: 5px;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存并发送" :textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<uni-forms v-if="type===0" ref="form" :modelValue="formData" :rules="rules" :label-width="100" label-position="top">
				<uni-forms-item label="补卡时间:" name="kq_attend_id" required>
					<uni-data-select 
						v-model="formData.kq_attend_id" 
						:localdata="replaceAbleList"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="补卡理由:" name="note" required>
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
			
			<uni-forms v-if="type===1" ref="form" :modelValue="formData" :rules="rules" :label-width="100" label-position="top">
				<uni-forms-item label="出差日期:" name="range" required>
					<uni-datetime-picker type="daterange" v-model="formData.range" :start="moment().add(1,'days').format('YYYY-MM-DD')"  rangeSeparator="至" :clear-icon="false" />
					<view class="form-item-info">{{rangeDays}} 天</view>
				</uni-forms-item>
				<uni-forms-item label="出差目的地:" name="toplace" required>
					<uni-easyinput type="text" v-model="formData.toplace" placeholder="请输入" :maxlength="100" />
				</uni-forms-item>
				<uni-forms-item label="带队人:" name="leader_code" required>
					<uni-data-select v-model="formData.leader_code" :localdata="leaderList"></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="随行人员:" name="user_codes">
					<my-selectCheckbox v-model="formData.user_codes" multiple :localdata="userList"></my-selectCheckbox>
					<view class="form-item-info">{{formData.user_codes.length}} 人</view>
				</uni-forms-item>
				<uni-forms-item label="出差事由:" name="note" required>
					<uni-easyinput type="textarea" v-model="formData.note" placeholder="请输入" :maxlength="300" />
				</uni-forms-item>
				<uni-forms-item label="交通工具:" name="tools">
					<uni-data-checkbox mode="tag" multiple v-model="formData.tools" selected-color="#2c96bd"
						:localdata="[{text:'火车',value:'火车'},{text:'汽车',value:'汽车'},{text:'轮船',value:'轮船'},{text:'飞机',value:'飞机'}]"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item label="经费来源:" name="funds">
					<uni-data-checkbox mode="tag" v-model="formData.funds" selected-color="#2c96bd"
						:localdata="[{text:'预算内',value:'预算内'},{text:'预算外',value:'预算外'},{text:'对方承担',value:'对方承担'},{text:'其它',value:'else'}]"></uni-data-checkbox>
					<view>
						<uni-easyinput v-show="formData.funds==='else'" type="text" v-model="formData.elseFunds" placeholder="请输入其它经费来源" :maxlength="30" />
					</view>
				</uni-forms-item>
			</uni-forms>
			
			<uni-forms v-if="type===2" ref="form" :modelValue="formData" :rules="rules" :label-width="100" label-position="top">
				<uni-forms-item label="外出时间:" name="range" required>
					<uni-datetime-picker v-model="formData.range" type="datetimerange" rangeSeparator="至" hide-second/>
				</uni-forms-item>
				<uni-forms-item label="外出地点:" name="toplace" required>
					<uni-easyinput type="text" v-model="formData.toplace" placeholder="请输入" :maxlength="100" />
				</uni-forms-item>
				<uni-forms-item label="外出事由:" name="note" required>
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
			
			<uni-forms v-if="type===3" ref="form" :modelValue="formData" :rules="rules" :label-width="100" label-position="top">
				<uni-forms-item label="加班时间：" name="range" required>
					<uni-datetime-picker v-model="formData.range" type="datetimerange" :start="moment().add(1,'days').format('YYYY-MM-DD')" rangeSeparator="至" hide-second/>
					<view class="form-item-info">{{rangeHours}}</view>
				</uni-forms-item>
				<uni-forms-item label="加班人员:" name="user_codes" required>
					<my-selectCheckbox v-model="formData.user_codes" multiple :localdata="userList"></my-selectCheckbox>
					<view class="form-item-info">{{formData.user_codes.length}} 人</view>
				</uni-forms-item>
				<uni-forms-item label="加班原因:" name="note" required>
					<uni-easyinput type="textarea" v-model="formData.note" placeholder="请输入" :maxlength="300" />
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
		</uni-card>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	import timeStrByMinutes from './common/timeStrByMinutes.js';
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
				tecList: [],
				formData: {
					kq_attend_id: '',
					note: '',
					range: [],
					toplace: '',
					leader_code: '',
					user_codes: [],
					tools: '',
					funds: '',
					elseFunds: '',
				},
				rules: {},
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
		computed: {
			rangeDays() {
				return this.formData.range.length>1 ? moment(this.formData.range[1]).startOf('days').diff(moment(this.formData.range[0]).startOf('days'), 'days')+1 : 0
			},
			rangeHours() {
				if(this.formData.range.length>1) {
					const minutes = moment(this.formData.range[1]).startOf('minutes').diff(moment(this.formData.range[0]).startOf('minutes'), 'minutes')
					return timeStrByMinutes(minutes)
				}
				return '';
			},
			leaderList() {
				const user_codes = this.formData.user_codes || [] 
				return this.tecList.map(v => ({value: v.tec_code, text: v.tec_name, disable: user_codes.includes(v.tec_code)}))
			},
			userList() {
				return this.tecList.map(v => ({value: v.tec_code, text: v.tec_name, disable: this.formData.leader_code===v.tec_code}))
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
				this.rules = {
					kq_attend_id: {
						rules: [{required: true, errorMessage: '请选择补卡时间'}]
					},
					note: {
						rules: [{required: true, errorMessage: '请输入补卡理由'}]
					},
				}
			} else if(this.type===1) {
				this.getTecList();
				this.rules = {
					range: {
						rules: [{required: true, errorMessage: '请选择出差日期'}]
					},
					toplace: {
						rules: [{required: true, errorMessage: '请输入出差目的地'}]
					},
					leader_code: {
						rules: [{required: true, errorMessage: '请选择带队人'}]
					},
					note: {
						rules: [{required: true, errorMessage: '请输入出差事由'}]
					},
				}
			} else if(this.type===2) {
				this.rules = {
					range: {
						rules: [{required: true, errorMessage: '请选择外出时间'}]
					},
					toplace: {
						rules: [{required: true, errorMessage: '请输入外出地点'}]
					},
					note: {
						rules: [{required: true, errorMessage: '请输入外出事由'}]
					},
				}
			} else if(this.type===3) {
				this.getTecList();
				this.rules = {
					range: {
						rules: [{required: true, errorMessage: '请选择加班时间'}]
					},
					user_codes: {
						rules: [{required: true, errorMessage: '请选择加班人员'}]
					},
					note: {
						rules: [{required: true, errorMessage: '请输入加班原因'}]
					},
				}
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
			getTecList() {
				// 获取教师列表
				this.post(this.globaData.INTERFACE_HR_SUB+'tec', {
					index_code: this.navItem.index_code,
				}, (data, res) => {
					if(data&&data.list) {
						this.tecList = data.list;
					}
				})
			},
			textClick() {
				this.$refs.form.validate().then(values => {
					// console.log(values)
					this.submitHandle(values)
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
			async submitHandle(values) {
				const postData = {
					kq_attend_id: values.kq_attend_id,
					note: values.note,
					toplace: values.toplace,
					leader_code: values.leader_code,
					tools: values.tools?values.tools.join():undefined,
					funds: values.funds==='else'?this.formData.elseFunds:values.funds
				}
				if(values.range&&values.range.length>1) {
					postData.begin_date = values.range[0];
					postData.end_date = values.range[1];
				}
				if(values.leader_code) {
					const leader = this.leaderList.find(v => v.value===values.leader_code);
					if(leader) postData.leader_name = leader.text;
				}
				if(values.user_codes&&values.user_codes.length) {
					const users = this.userList.filter(v => values.user_codes.includes(v.value));
					postData.user_codes = values.user_codes.join();
					postData.user_names = users.map(v => v.text).join();
				}
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
					...postData,
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
	
	.uni-forms-item .form-item-info {
		position: absolute;
		right: 5px;
		top: 12px;
		font-size: 12px;
	}
	
	>>> .uni-easyinput uni-input {
		font-size: 14px !important;
		padding-left: 10px !important;
	}
	>>> .content-clear-icon {
		padding: 0px 5px !important;
		font-size: 24px !important;
	}
</style>