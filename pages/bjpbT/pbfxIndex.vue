<template>
	<view style="">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="flexCenter semView">
			<view @click="clickSem(0)" :class="btnFlag==0?'sh0Btn':'sh1Btn'">全校分析</view>
			<view @click="clickSem(1)" :class="btnFlag==0?'sh1Btn':'sh0Btn'">班级分析</view>
		</view>
		<view class="tempLine"></view>
		<view v-if="btnFlag==1" class="flexCenter grdClsView">
			<view class="grdCls" @click="showGrdCls()">{{grdArray[grdIndex].text}} {{clsArray[clsIndex].text}}</view>
			<view><uni-icons class="downIcon" type="down" size="15"></uni-icons></view>
		</view>
		<view class="flexStart typeTime">
			<view class="timeShow1">统计时段：</view>
			<view class="timeShow2">
				<uni-datetime-picker v-if="btnFlag==0" :clearIcon="false" :border="false" @change="change0" v-model="range0" type="daterange" rangeSeparator="至" />
				<uni-datetime-picker v-else :clearIcon="false" :border="false" @change="change1" v-model="range1" type="daterange" rangeSeparator="至" />
			</view>
			<view><uni-icons class="downIcon" type="down" size="15"></uni-icons></view>
		</view>
		<view class="tempLine"></view>
		<view v-if="btnFlag==0" class="pageList0">
			<view class="bigText">荣誉榜</view>
			<view class="tempList flexStart">
				<view class="showText0 setBG">排名</view>
				<view class="showText1 setBG">班级</view>
				<view class="showText2 setBG">获得“文明班级”次数</view>
			</view>
			<view class="tempList flexStart" v-for="(item,index) in schData.honor_count_list" :key="index">
				<view class="showText0">{{++index}}</view>
				<view class="showText1">{{item.cls_name}}</view>
				<view class="showText2">{{item.count}}</view>
			</view>
		</view>
		<view v-if="btnFlag==1" class="pageList2">
			<view class="bigText">获得文明班级次数</view>
			<view class="count">{{clsData.honor_list.length}}</view>
			<view class="tempList flexStart">
				<view class="showText0 setBG">序号</view>
				<view class="showText1 setBG">获得“文明班级”称号时间</view>
			</view>
			<view class="tempList flexStart" v-for="(item,index) in clsData.honor_list" :key="index">
				<view class="showText0">{{++index}}</view>
				<view class="showText1">{{item.begin_date.split(' ')[0]}} 至 {{item.end_date.split(' ')[0]}}</view>
			</view>
		</view>
		<view class="tempLine"></view>
		<view v-if="btnFlag==0" class="pageList1">
			<view class="bigText">班级扣分榜</view>
			<view class="tempList flexStart">
				<view class="showText0 setBG">排名</view>
				<view class="showText1 setBG">班级</view>
				<view class="showText2 setBG">扣分次数</view>
				<view class="showText3 setBG">扣分值</view>
			</view>
			<view class="tempList flexStart" v-for="(item,index) in schData.score_list" :key="index">
				<view class="showText0">{{++index}}</view>
				<view class="showText1">{{item.cls_name}}</view>
				<view class="showText2">{{item.count}}</view>
				<view class="showText3">{{parseInt(item.score)}}</view>
			</view>
		</view>
		<view v-if="btnFlag==1" class="pageList3">
			<view class="bigText">评比项目扣分榜</view>
			<view class="tempList flexStart">
				<view class="showText0 setBG">排名</view>
				<view class="showText1 setBG">评比项</view>
				<view class="showText2 setBG">扣分值</view>
			</view>
			<view class="tempList flexStart" v-for="(item,index) in clsData.item_score_list" :key="index">
				<view class="showText0">{{++index}}</view>
				<view class="showText1">{{item.item_name}}</view>
				<view class="showText2">{{parseInt(item.score)}}</view>
			</view>
		</view>
		<view class="tempLine"></view>
		<view class="pageList4">
			<view class="bigText">评比项目得分分析</view>
			<view class="flexStart fenlei">
				<view class="lookStr">查看：</view>
				<view v-if="btnFlag==0" class="type0" :class="type0Inex==0?'type1':''" @click="clickType(0)">一级分类</view>
				<view v-if="btnFlag==0" class="type0" :class="type0Inex==1?'type1':''" @click="clickType(1)">二级分类</view>
				<view v-if="btnFlag==0" class="type0" :class="type0Inex==2?'type1':''" @click="clickType(2)">评比项</view>
				
				<view v-if="btnFlag==1" class="type0" :class="type1Inex==0?'type1':''" @click="clickType(0)">一级分类</view>
				<view v-if="btnFlag==1" class="type0" :class="type1Inex==1?'type1':''" @click="clickType(1)">二级分类</view>
				<view v-if="btnFlag==1" class="type0" :class="type1Inex==2?'type1':''" @click="clickType(2)">评比项</view>
			</view>
			<view class="charts-box">
			    <qiun-data-charts 
			      type="column"
			      :opts="opts"
				  :ontouch="true"
			      :chartData="chartData"
			    />
			  </view>
		</view>
		<view style="height: 10px;"></view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="z-index: 300;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级和班级</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">年级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(item, index)'
							:style="index==grdIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">班级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArrayTemp" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(item, index)'
							:style="index==clsIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="height: 50px;margin: 20px 0;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment/moment.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				btnFlag:0,
				range0: [],
				range1: [],
				
				//顶部筛选框相关内容
				grdIndex: 0,
				grdIndexTemp: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsIndex: 0,
				clsArray: [{
					text: '',
					value: ''
				}],
				clsIndexTemp: 0,
				clsArrayTemp: [{
					text: '',
					value: ''
				}],
				schData:[],
				clsData:[],
				type0Inex:0,
				type1Inex:0,
				
				chartData: {},
				      //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				      opts: {
				        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
				        padding: [15,15,20,5],
				        enableScroll: true,
				        legend: {
				          show: false
				        },
				        xAxis: {
							disabled:true,
				          disableGrid: true,
						  itemCount:10,
						  scrollShow:true
				        },
				        yAxis: {
				          data: [
				            {
				              min: -40,
				              max: 40
				            }
				          ],
				          splitNumber: 4
				        },
				        extra: {
				          column: {
				            type: "group",
				            width: 30,
				            activeBgColor: "#000000",
				            activeBgOpacity: 0.08,
				            barBorderCircle: true,
				            linearType: "custom"
				          }
				        }
				      }
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			// this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			let tempA = moment().format('YYYY-MM-DD')
			// this.nowDate = tempA
			let tempTime = moment().subtract(1, 'months').format('YYYY-MM-DD')
			this.range0.push(tempTime)
			this.range0.push(tempA)
			this.range1.push(tempTime)
			this.range1.push(tempA)
			this.getBtn0Data();
			this.getGrd(1)
			this.getScore()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickType(index){
				if (this.btnFlag == 0) {
					if (this.type0Inex != index) {
						this.type0Inex = index
						this.getScore()
					}
				} else{
					if (this.type1Inex != index) {
						this.type1Inex = index
						this.getScore()
					}
				}
			},
			showGrdCls(){
				this.$refs.popup.open();
			},
			clickSem(flag){
				this.btnFlag = flag
				this.getScore()
			},
			change0(e) {
				this.getBtn0Data()
				this.getScore()
			},
			change1(e) {
				this.getBtn1Data()
				this.getScore()
			},
			getBtn0Data(){
				// 6.4.全校分析
				let comData = {
					begin_time:this.range0[0],
					end_time:this.range0[1],
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/schAnalysis', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.schData = data0
						console.log('data0:'+JSON.stringify(data0))
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getBtn1Data(){
				// 6.5.班级分析
				let comData = {
					begin_time:this.range1[0],
					end_time:this.range1[1],
					cls_code:this.clsArray[this.clsIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/clsAnalysis', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.clsData = data0
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getScore(){
				// 6.6.项目得分分析
				let comData = {
					index_code: this.index_code,
				}
				if (this.btnFlag == 0) {
					comData.begin_time = this.range0[0]
					comData.end_time = this.range0[1]
					comData.level = this.type0Inex + 1
				} else{
					comData.begin_time = this.range1[0]
					comData.end_time = this.range1[1]
					comData.level = this.type1Inex + 1
					comData.cls_code = this.clsArray[this.clsIndex].value
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/itemAnalysis', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						// this.clsData = data0
						let tempA = []
						let tempB = []
						for (var i = 0; i < data0.list.length; i++) {
							let tempM = data0.list[i]
							tempA.push(tempM.item_name)
							tempB.push(parseInt(tempM.score))
						}
						let max = Math.max(...tempB);
						let min = Math.min(...tempB);
						console.log('tempB:'+JSON.stringify(tempB))
						console.log('max:'+max+',min:'+min)
						let tempNum0 = Math.abs(max)
						let tempNum1 = Math.abs(min)
						let tempNum2 = 0
						if (tempNum0>tempNum1) {
							tempNum2 = tempNum0
						} else{
							tempNum2 = tempNum1
						}
						let tempZ = {
				              min: -tempNum2,
				              max: tempNum2
				            }
						this.opts.yAxis.data[0] = tempZ
						let res = {
						    categories: tempA,
						    series: [
						      {
						        name: "",
						        data: tempB
						      }
						    ]
						  };
						this.chartData = JSON.parse(JSON.stringify(res));
					} else {
						this.showToast(data.msg);
					}
				})
			},
			grdSelect(item, index) {
				if (this.grdIndexTemp != index) {
					this.grdIndexTemp = index;
					this.getCls(2);
				}
			},
			clsSelect(item, index) {
				if (this.clsIndexTemp != index) {
					this.clsIndexTemp = index;
				}
			},
			popSure(flag) {
				this.$refs.popup.close();
				if (flag == 0) {
					this.grdIndexTemp = this.grdIndex;
					this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
					this.clsIndexTemp = this.clsIndex;
				} else {
					this.grdIndex = this.grdIndexTemp;
					this.clsArray = JSON.parse(JSON.stringify(this.clsArrayTemp));
					this.clsIndex = this.clsIndexTemp;
					this.getBtn1Data();
					this.getScore()
				}
			},
			getGrd(flag) { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
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
						this.getCls(flag);
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(flag) { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					get_cls: true,
					all_cls: false,
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
						this.clsArrayTemp = JSON.parse(JSON.stringify(clsArray));
						this.clsIndexTemp = 0;
						if (flag == 1) {
							this.clsArray = JSON.parse(JSON.stringify(clsArray));
							this.getBtn1Data()
							this.getScore()
						}
					} else {
						this.clsArray = [];
						this.clsArrayTemp = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.charts-box {
		margin-top: 10px;
	    width: 100%;
	    height: 350px;
	  }
	.semView{
		margin: 20px 0 0 0;
		font-size: 13px;
		text-align: center;
		
		.sh0Btn{
			width: 100px;
			color: #00b6ab;
			padding-bottom: 5px;
			border-bottom: 1px solid #00b6ab;
		}
		
		.sh1Btn{
			width: 100px;
			color: #7f7f7f;
			padding-bottom: 5px;
			border-bottom: 1px solid #7f7f7f;
		}
	}
	.typeTime{
		margin: 15px 10px 8px 15px;
		.timeShow1{
			font-size: 14px;
			text-align: center;
			color: #333;
		}
		.timeShow2{
			width: 230px;
			margin-top: -8px;
		}
	}
	.tempLine{
		height: 8px;
		background: #f2f2f2;
	}
	.grdClsView{
		margin: 15px 0 -5px 0;
		.grdCls{
			font-size: 18px;
			color: #333;
			font-weight: 700;
			text-align: center;
			margin-right: 5px;
		}
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
	
	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: calc(100% - 300px);
		font-size: 14px;
		color: #333333;
		background: #d7d7d7;
	}
	
	.pageList0{
		padding: 10px 15px;
		
		.bigText{
			font-size: 16px;
			color: #333;
			font-weight: 700;
		}
		.tempList{
			margin-top: 10px;
			font-size: 13px;
			color: #333;
			text-align: center;
			height: 30px;
			
			.showText0{
				width: 50px;
				padding-top: 5px;
			}
			.showText1{
				width: 100px;
				margin-left: 2px;
				padding-top: 5px;
			}
			.showText2{
				margin-left: 2px;
				width: calc(100% - 154px);
				padding-top: 5px;
			}
			.setBG{
				background: #d7d7d7;
			}
		}
	}
	.pageList1{
		padding: 10px 15px;
		
		.bigText{
			font-size: 16px;
			color: #333;
			font-weight: 700;
		}
		.tempList{
			margin-top: 10px;
			font-size: 13px;
			color: #333;
			text-align: center;
			height: 30px;
			
			.showText0{
				width: 50px;
				padding-top: 5px;
			}
			.showText1{
				width: calc(100% - 196px);
				margin-left: 2px;
				padding-top: 5px;
			}
			.showText2{
				margin-left: 2px;
				width: 70px;
				padding-top: 5px;
			}
			.showText3{
				margin-left: 2px;
				width: 70px;
				padding-top: 5px;
			}
			.setBG{
				background: #d7d7d7;
			}
		}
	}
	
	.pageList2{
		padding: 10px 15px;
		
		.bigText{
			font-size: 16px;
			color: #333;
			font-weight: 700;
		}
		.count{
			color:  #b8741a;
			font-size: 36px;
			text-align: center;
			font-weight: 700;
		}
		.tempList{
			margin-top: 10px;
			font-size: 13px;
			color: #333;
			text-align: center;
			height: 30px;
			
			.showText0{
				width: 50px;
				padding-top: 5px;
			}
			.showText1{
				width: calc(100% - 52px);
				margin-left: 2px;
				padding-top: 5px;
			}
			.setBG{
				background: #d7d7d7;
			}
		}
	}
	
	.pageList3{
		padding: 10px 15px;
		
		.bigText{
			font-size: 16px;
			color: #333;
			font-weight: 700;
		}
		.tempList{
			margin-top: 10px;
			font-size: 13px;
			color: #333;
			text-align: center;
			height: 30px;
			
			.showText0{
				width: 50px;
				padding-top: 5px;
			}
			.showText1{
				width: calc(100% - 124px);
				margin-left: 2px;
				padding-top: 5px;
			}
			.showText2{
				margin-left: 2px;
				width: 70px;
				padding-top: 5px;
			}
			.setBG{
				background: #d7d7d7;
			}
		}
	}
	
	.pageList4{
		padding: 10px 15px;
		
		.bigText{
			font-size: 16px;
			color: #333;
			font-weight: 700;
		}
		.fenlei{
			margin: 10px 0 0 0;
			.lookStr{
				font-size: 14px;
				color: #333;
			}
			.type0{
				font-size: 13px;
				color: #797979;
				margin-left: 20px;
			}
			.type1{
				color: rgb(44, 150, 189);
				border-bottom: 3px solid rgba(44, 150, 189, 1);
			}
		}
	}
</style>
