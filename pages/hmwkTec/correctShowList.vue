<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="text-align: center;margin: 10px 20px;font-size: 16px;font-weight: 700;">{{navItem.name}}</view>
		<view @click="clsClick()" style="font-size: 13px;padding-top: 10px;padding-left: 25px;width: 100px;">
			{{clsStr}}
			<uni-icons v-if="clsArray.length>1" style="float: right;margin-right: 20px;margin-top: 5px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
		</view>
		<view style="font-size: 12px;float: right;margin: -20px 20px 0 0;">人数：{{navItem.stu_count}}<span style="padding-left: 20px;"></span>  已交：{{navItem.submit_count}}<span style="padding-left: 20px;"></span>已批：{{navItem.correct_count}}</view>
		<view style="">
			<view style="margin: 10px;height: 450px;">
				<zb-table v-if="columns.length>0" @rowClick="rowClick" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
			</view>
			<!-- <view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view> -->
		</view>
		<uni-popup ref="popup1" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择班级</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArray" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(index)'
							:style="index==clsIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.cls_name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				clsIndex: 0,
				clsArray: [],
				clsStr: '',
				columns: [],
				dataSource:[],
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '作业批改';
			this.navItem.index = 100;
			this.index_code = this.navItem.index_code;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '作业批改'
			});
			
			this.clsArray = JSON.parse(JSON.stringify(this.navItem.clss));
			if (this.clsArray.length>1) {
				this.clsArray.unshift({
					cls_code:'',
					cls_name:'全部'
				})
			}
			this.clsStr = this.clsArray[this.clsIndex].cls_name;
			this.getList0();
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
			rowClick(row ,index){
				// console.log('rowClick:'+JSON.stringify(row))
				if (row.correct_evaluate == null && row.correct_score == null ) {
					
				}else{
					row.index_code = this.index_code;
					util.openwithData('/pages/hmwkTec/correctDetail1', row, {
						refreshCorrectShowList(data) { //子页面调用父页面需要的方法
							_this.loadMoreText = "加载中..."
							_this.flagRef = 0;
							_this.pageIndex = 1;
							_this.pagedata = [];
							_this.getList0();
						}
					})
				}
			},
			clsClick() {
				if (this.clsArray.length>1) {
					this.$refs.popup1.open();
				}
			},
			clsSelect(index) {
				if (this.clsIndex != index) {
					this.clsIndex = index;
					this.clsStr = this.clsArray[this.clsIndex].cls_name;
					this.getList0();
				}
				this.$refs.popup1.close();
			},
			getList0() {
				let comData = {
					page_size: 9999,
					page_number: 1,
					stu_work_id: this.navItem.id,
					cls_code:this.clsArray[this.clsIndex].cls_code,
					index_code: this.navItem.index_code,
				}
				// 6.6.批改详情列表
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/correctInfo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.navItem.stu_count = data.data.stu_count;
						this.navItem.correct_count = data.data.correct_count;
						this.navItem.submit_count = data.data.submit_count;
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '班级',
							name: 'cls_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '学生',
							name: 'stu_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '成绩',
							name: 'correct_score',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '评价',
							name: 'correct_evaluate_name',
							align:'center',
							fixed:false
						})
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.correct_evaluate) {
								if (tempM.correct_evaluate == 1) {
									tempM.correct_evaluate_name = '优秀';
								} else if (tempM.correct_evaluate == 2) {
									tempM.correct_evaluate_name = '良好';
								}  else if (tempM.correct_evaluate == 3) {
									tempM.correct_evaluate_name = '及格';
								}  else if (tempM.correct_evaluate == 4) {
									tempM.correct_evaluate_name = '不及格';
								} 
							}
						}
						this.columns = tempCol;
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getList0();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getList0();
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	
	::v-deep .uni-date-x {
		padding: 0px !important;
	}
	
	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}
	
	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}
	
	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}
	
	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}
</style>
