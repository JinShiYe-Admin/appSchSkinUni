<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<template v-if="dataFlag===1">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-list class="uni-list" :border="false">
					<checkbox-group >
						<label  class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
							<view>
								<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
							</view>
							<view>{{item.text}}</view>
						</label>
					</checkbox-group>
				</uni-list>
			</scroll-view>
		</template>
		<template v-else-if="dataFlag===2">
			<scroll-view class="select-scroll" scroll-y="true">
				<uni-collapse class="warp" @change="collapseChange">
					<uni-collapse-item v-for="(sub, key) in list" :key="key" :open="sub.open" :show-animation="sub.showAnimation" :disabled="sub.disabled" :title="sub.subName">
						<uni-list class="uni-list" :border="false">
							<checkbox-group >
								<label  class="uni-list-cell uni-list-cell-pd collapse" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
									<view>
										<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
									</view>
									<view>{{item.text}}</view>
								</label>
							</checkbox-group>
						</uni-list>
					</uni-collapse-item>
				</uni-collapse>
			</scroll-view>
		</template>
		<template v-else-if="dataFlag===3">
			<uni-row>
				<uni-col :span="11" style="border-right: 1px solid rgba(238,238,238,.5);">
					<scroll-view class="select-scroll" scroll-y="true" style="background:#FFFFFF ;">
						<uni-collapse class="warp" @change="collapseChange">
							<uni-collapse-item v-for="(sub, key) in list" :key="key" :open="sub.open" :show-animation="sub.showAnimation" :disabled="sub.disabled" :title="sub.subName">
								<uni-list class="uni-list" :border="false"  style="background:#F9F9F9 ;">
									<label  class="uni-list-cell uni-list-cell-pd collapse" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
										<view>{{item.text}}</view>
									</label>
								</uni-list>
							</uni-collapse-item>
						</uni-collapse>
					</scroll-view>
				</uni-col>
				<uni-col :span="13">
					<scroll-view class="select-scroll" scroll-y="true" style="background:#FFFFFF ;">
						<uni-list class="uni-list" :border="false" style="background:#FFFFFF ;">
							<checkbox-group >
								<label  class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in stuList" :key="index" @click="userClick(item)">
									<view>
										<checkbox style="transform:scale(0.7)" color="#00CFBD" :value="item.value"  :checked="item.checked" />
									</view>
									<view>{{item.text}}</view>
								</label>
							</checkbox-group>
						</uni-list>
					</scroll-view>
				</uni-col>
			</uni-row>
		</template>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	const listData = [{
					subName: '默认开启',
					disabled: false,
					content: '折叠内容主体，可自定义内容及样式'
				},
				{
					subName: '折叠内容',
					disabled: false,
					content: '折叠内容主体，这是一段比较长内容。默认折叠主要内容，只显示当前项标题。点击标题展开，才能看到这段问题。再次点击标题，折叠内容。'
				},
				{
					subName: '折叠内容',
					disabled: false,
					content: '折叠内容主体，这是一段比较长内容。默认折叠主要内容，只显示当前项标题。点击标题展开，才能看到这段问题。再次点击标题，折叠内容。'
				},
				{
					subName: '折叠内容',
					disabled: false,
					content: '折叠内容主体，这是一段比较长内容。默认折叠主要内容，只显示当前项标题。点击标题展开，才能看到这段问题。再次点击标题，折叠内容。'
				},
				{
					subName: '折叠内容',
					disabled: false,
					content: '折叠内容主体，这是一段比较长内容。默认折叠主要内容，只显示当前项标题。点击标题展开，才能看到这段问题。再次点击标题，折叠内容。'
				},
				{
					subName: '禁用状态',
					disabled: false,
					content: '折叠内容主体，这是一段比较长内容。默认折叠主要内容，只显示当前项标题。点击标题展开，才能看到这段问题。再次点击标题，折叠内容。'
				}
			]
	export default {
		data() {
			return {
				list: listData,
				stuList:[{text:'张三',value:'1'},{text:'李四',value:'2'},],
				personInfo: {},
				tabBarItem: {},
				dataFlag:1,//1选择年级 2选择班级
				index_code:'',
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='选择学生'
			this.tabBarItem = itemData;
			console.log("itemData: " + JSON.stringify(itemData));
			this.dataFlag=itemData.dataFlag
			this.index_code=itemData.index_code
			setTimeout(function() {
				
			}, 100);
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			userClick(user){
				user.checked=!user.checked
			},
			textClick(){
				let checkTec=[]
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshSetPeople', {data: this.stuList});
				uni.navigateBack();
			},
			collapseChange(e){
				console.log(e);
			},
			getGrdDataArray(){
				let comData={
					get_grd: true,
					all_grd: false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
				})
			}
		}
	}
</script>

<style>
	 
	.select-scroll{
		/* #ifdef APP-PLUS */
		height: calc(100vh - 80px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 45px);
		/* #endif */
		background: #FBFBFB;
	}
	.warp .uni-list{
		background: #FFFFFF;
	}
	.uni-list-cell {
		justify-content: flex-start
	}
	.uni-list-cell.uni-list-cell-pd.collapse{
		padding-left: 20px;
	}
</style>
