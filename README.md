# demo

### 实现功能
> 1. 从json文件中读取model数据，生成节点模型
> 2. 拖拽模型到绘图区，生成节点后可编辑节点名称
> 3. 从节点的输出端口可连线到另一节点的输入端口,连线时高亮提示可用端口
> 4. 在绘图区内任意拖动节点，所有连线路径可动态更新
> 5. 选中节点或者连线路径，可以用delete键删除
> 6. 点击左上角按钮，导出所有数据为json文件并下载

### 代码结构
> 1. 入口: index.html
> 2. css/说明:
		index.css - 页面布局
		node.css - 节点图标布局
> 3. js/说明:
		main.js - 初始化
		model.js - 模型对象
		node.js - 节点对象
		port.js - 端口对象
		path.js - 连线路径对象

		view.js - 有关view的各种处理
		template.js - handlebars注入jquery
		event.js - 鼠标键盘事件监听
> 4. lib/js/: 调用的jquery和handlebars库
> 5. data/models.json: 模型数据



### note
> 1. 仅在chrome60下测试，浏览器兼容性待添加
> 2. ...
