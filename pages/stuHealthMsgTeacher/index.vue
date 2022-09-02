<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		
		<uni-grid :column="2" :showBorder="false"  :square="false" :highlight="false" style="padding: 0.5rem 0;">
			<uni-grid-item>
				<uni-datetime-picker class="healthmsg-date-picker" type="date" :end="curDate" :clear-icon="false" 
					:value="date" @change="dateChange"/>
			</uni-grid-item>
			<uni-grid-item>
				 <view class="uni-flex uni-row">
					<view class="flex-item">
						<picker  @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
							<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
								:value="curGrdText"></uni-easyinput-select>
						</picker>
					</view>
					<view class="flex-item">
						<picker  @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
							<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
								:value="curClsText"></uni-easyinput-select>
						</picker>
					</view>
				</view>
			</uni-grid-item>
		</uni-grid>
		
		<uni-title type="h1" :title="curGrdClsText" align="center" style="margin-top: 20px;"></uni-title>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('report')">
			<uni-title type="h3" title="上报情况" align="left"></uni-title>
			<uni-grid :column="2" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="已上报" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #18bc37;">{{pageData.num_of_reported}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="未上报" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.num_of_no_reported}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('healthCode')">
			<uni-title type="h3" title="健康码" align="left"></uni-title>
			<uni-grid :column="3" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="绿码" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #18bc37;">{{pageData.code_g}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="黄码" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.code_y}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="红码" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #e43d33;">{{pageData.code_r}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('itineraryCard')">
			<uni-title type="h3" title="行程卡" align="left"></uni-title>
			<uni-grid :column="2" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="正常" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #18bc37;">{{pageData.card_risky0}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="异常" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.card_risky1}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('unusual')">
			<uni-title type="h3" title="发烧/咳嗽/流涕/咽疼" align="left"></uni-title>
			<uni-grid :column="2" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="没有" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #18bc37;">{{pageData.is_unusual0}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="有" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.is_unusual1}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('roomyUnusual')">
			<uni-title type="h3" title="同住人异常" align="left"></uni-title>
			<uni-grid :column="3" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="健康码异常" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.roomy_code_unusual}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="行程卡异常" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.roomy_card_unusual}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="发热等症状" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.roomy_is_unusual}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		
		<uni-card class="healthmsg-card" is-shadow @click="clickItem('note')">
			<uni-title type="h3" title="特殊情况" align="left"></uni-title>
			<uni-grid :column="2" :showBorder="false"  :square="false" :highlight="false">
				<uni-grid-item>
					<uni-title color="#666" title="没有" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #18bc37;">{{pageData.special0}}</text>
				</uni-grid-item>
				<uni-grid-item>
					<uni-title color="#666" title="有" align="center"></uni-title>
					<text class="healthmsg-item-num" style="color: #f3a73f;">{{pageData.special1}}</text>
				</uni-grid-item>
			</uni-grid>
		</uni-card>
		<!-- index界面保留，index1界面屏蔽 -->
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				curDate:'',
				date: '',
				grdIndex: 0,
				clsIndex: 0,
				grdArray: [{
					text: '',
					value: '-1'
				}],
				clsArray: [{
					text: '',
					value: '-1'
				}],
				pageData: {
					card_g: '',
					card_r: '',
					card_y: '',
					code_g: '',
					code_r: '',
					code_y: '',
					is_unusual0: '',
					is_unusual1: '',
					num_of_no_reported: '',
					num_of_reported: '',
					roomy_is_unusual0: '',
					roomy_is_unusual1: '',
					special0: '',
					special1: '',
				}
			}
		},
		components: {
			mynavBar
		},
		computed: {
			curGrdText() {
				const curGrd = this.grdArray[this.grdIndex]
				return curGrd?curGrd.text:''
			},
			curClsText() {
				const curCls = this.clsArray[this.clsIndex]
				return curCls?curCls.text:''
			},
			curGrdClsText() {
				const curGrd = this.grdArray[this.grdIndex]||{text: ''}
				const curCls = this.clsArray[this.clsIndex]||{text: ''}
				if(curGrd.value==="-1"&&curCls.value==="-1") {
					return "全校健康数据统计"
				}else if(curCls.value==="-1"){
					return curGrd.text+"健康数据统计"
				}else {
					return curGrd.text+curCls.text+"健康数据统计"
				}
			}
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			// index1界面用这个
			// this.navItem = util.getPageData(option);
			// index界面用这个
			this.navItem = util.getTabbarMenu();
			this.index_code=this.navItem.access.split("#")[1]
			// var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			// this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
			this.curDate = this.moment().format('YYYY-MM-DD');
			this.date = this.curDate;

			this.getGrd();

			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			dateChange(value) {
				this.date = value;
				this.$nextTick(() => {
					this.getPageData();
				});
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: true,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.getPageData();
					} else {
						this.clsArray = [];
						// this.pagedata = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			grdClick(e) {
				if (this.grdIndex !== e.detail.value) {
					this.grdIndex = e.detail.value;
					this.clsIndex = 0;
					this.clsArray = [];
					this.getCls();
				}
			},
			clsClick(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value;
					this.getPageData();
				}
			},
			getPageData() {
				const curGrd = this.grdArray[this.grdIndex]||{}
				const curCls = this.clsArray[this.clsIndex]||{}
				if(curGrd.value&&curCls.value) {
					this.showLoading();
					this.post(
						this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/statistics',
						{
							date: this.date,
							sch_code: this.personInfo.sch_code,
							grd_codes: curGrd.value==='-1'?'':curGrd.value,
							cls_codes: curCls.value==='-1'?'':curCls.value,
							index_code: this.index_code
						},
						(data) => {
							const dataStr = {}
							for(const key in data) {
								dataStr[key] = String(data[key])
							}
							this.pageData = dataStr
							this.hideLoading();
						}
					);
				}
			},
			clickItem(url) {
				const curGrd = this.grdArray[this.grdIndex]
				const curCls = this.clsArray[this.clsIndex]
				if(curGrd && curCls) {
					util.openwithData('/pages/stuHealthMsgTeacher/' + url , {
						...this.navItem,
						grd_code: curGrd.value === '-1' ? '' : curGrd.value,
						cls_code: curCls.value === '-1' ? '' : curCls.value,
						datetime: this.date,
					})
				}
			}

		}
	}
</script>

<style>
	.healthmsg-date-picker {
		padding: 0 0.5rem;
	}
	.healthmsg-card:active {
		background-color: #f1f1f1;
	}
	.healthmsg-item-num {
		font-size: 2rem;
		text-align: center;
		padding: 0 0.5rem 0.5rem;
	}
</style>
