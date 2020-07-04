/*
学习笔记，如有错误，欢迎指正
参考：https://www.runoob.com/w3cnote/html5-canvas-intro.html
*/

/*
canvas标签的js使用：
step1：获取<canvas>标签
step2：创建该标签的context对象（内建的HTML5对象）
step3：调用该对象的各种方法
*/

// 初始化画布
var canvas=document.getElementById("canvas");  // step1
var ctx=canvas.getContext("2d");  // step2：此context对象用于showTime（即：显示时间）
ctx.strokeStyle='#7FFFD4';
ctx.lineWidth=3;  // 该线条的宽度（即边框的宽度）为3px
ctx.shadowBlur=5;  // 阴影的模糊级数
ctx.shadowColor='#7FFFD4';  // 阴影的颜色
// 初始化时间
var milliseconds=0;
var minutes=0;
var hour=0;
var date="";
var ctxBack=canvas.getContext("2d");  // step2：此context对象用于showBack（即：显示表盘）
var numBack=canvas.getContext("2d");
ctxBack.lineWidth=1;
ctxBack.shadowBlur=0;
ctxBack.shadowColor='#F0F8FF';

setInterval(pageInit,50);

function pageInit(){
	showTime();
	showBack();
	drawSecPin();
	drawMinPin();
	drawHouPin();
	setPoint();
	setNum();
}

function showTime(){
	var now=new Date();
	// 如：Tue Jun 30 2020 12:52:08 GMT+0800 (中国标准时间)，此时的毫秒为631
	var today=now.toLocaleDateString();  // today="2020-6-30"
	var time=now.toLocaleTimeString();  // time="12:52:08"
	var day=now.getDay();  // 获取“星期”：返回0-6，分别指代“星期日，星期一，...，星期六”
	var hrs=now.getHours();
	var min=now.getMinutes();
	var sec=now.getSeconds();
	var mil=now.getMilliseconds();  // 毫秒
	var smoothsec=sec+(mil/1000);  // sec为8秒，mil为631毫秒（即0.631秒），smoothsec为8.632秒
	var smoothmin=min+(smoothsec/60);  // 52分 + 8.631秒/60 = 52.14385分
	var hours=hrs+(smoothmin/60);  // 12.868950555555555时
	milliseconds=smoothsec;
	minutes=smoothmin;
	hour=hours;
	switch(day){
		case 1:  // 如果day为1，则执行下面一句，执行完跳出switch
		    date='一';
		    break;
		case 2:
		    date='二';
		    break;
		case 3:
		    date='三';
		    break;
		case 4:
		    date='四';
		    break;
		case 5:
		    date='五';
		    break;
		case 6:
		    date='六';
		    break;
		case 0:
		    date='日';
		    break;
	}

	/* 径向渐变填充的步骤：
	   step1：创建一个径向渐变，并设置该渐变的开始圆和结束圆
	   step2：设置填充方式为径向渐变。并在绘制的矩形内进行填充
	   step3：
	*/
	// step1
	gradient=ctx.createRadialGradient(250,250,5,250,250,300);  // createRadialGradient(开始圆的x坐标，开始圆的y坐标，开始圆的半径，结束圆的...)，Radial放射状的，Gradient梯度，Radial Gradient径向渐变（中心为圆心，向四周渐变）
	gradient.addColorStop(0,"#03303a");  // addColorStop(stop,color)：stop范围[0,1]，表示开始与结束之间的位置，此句是第一次出现，所以为开始位置（并不是为0就表示开始位置）
	gradient.addColorStop(1,"black");  // 此句为第二次出现，表示结束位置。值为1，表示距离开始位置为1
	
	// step2
	ctx.fillStyle=gradient;  // 填充样式为径向渐变。若为：ctx.fillStyle=color，表示纯色填充；若为ctx.fillStyle=pattern，表示图案填充
	ctx.fillRect(0,0,500,500);  // 	context.fillRect(x,y,width,height)：绘制矩形，并用上一句设置的方式填充。x为该矩形的左上角顶点的x坐标，width为该矩形的宽度
	
	// step3：绘制圆弧：arc(x, y, r, startAngle, endAngle, anticlockwise): 以(x, y) 为圆心，以r 为半径，从 startAngle 弧度开始到endAngle弧度结束。anticlosewise为布尔值（作为最后一个参数，可省），true 表示逆时针，false 表示顺时针(默认是顺时针)。
	// 时针从12开始，顺时针扫过的圆弧
	ctx.beginPath();  // 启动路径。即：着笔，准备绘制了
	ctx.strokeStyle='#87CEFA';  // 边框样式为color，且color为#87CEFA。
	ctx.arc(250,250,215,degToRad(0),degToRad((hours*30)-90));  // 这是绘制的路径。1圈 = 12小时=360°，则1小时=360°/12（即30°），故n小时*1=n*30度，即：时针顺时针扫过的度数
	ctx.stroke();  // 进行描边。即：沿着绘制的路径进行描绘
	
	// 分针从12开始，顺时针扫过的圆弧
	ctx.beginPath();  // 又开始着笔
	ctx.strokeStyle='#20B2AA';  
	ctx.arc(250,250,220,degToRad(0),degToRad(smoothmin*6-90));  // 1圈 = 60分钟=360°，则1分钟=360°/60（即6°），故n分钟*1=n*6度。即：分针顺时针扫过的度数
	ctx.stroke();

	// 秒针从12开始，顺时针扫过的圆弧
	ctx.beginPath();
	ctx.strokeStyle='#AFEEEE';
	ctx.arc(250,250,225,degToRad(0),degToRad(smoothsec*6-90));  // 1圈 = 60秒=360°，则1秒=360°/60（即6°），故n秒*1=n*6度。即：秒针顺时针扫过的度数
	ctx.stroke();

	ctx.font="25px Helvetica Bold";
	ctx.fillStyle='#7FFFD4';
	ctx.fillText(today+"/星期"+date,150,230);

	ctx.font="23px Helvetica Bold";
	ctx.fillStyle='#7FFFD4';
	ctx.fillText(time,190,280);  // context.fillText(text,x,y,maxWidth)，其中(x,y)是相对于画布的坐标，maxWidth（可省）为允许的最大文本宽度
}

function showBack(){
	for(var i=0;i<60;i++){
		ctxBack.save();  // 虽然showTime函数设置了新配置，但没有保存在数组中，此处是将默认配置保存到数组
		ctxBack.translate(250,250);
		ctxBack.rotate(i/60*2*Math.PI);
		ctxBack.beginPath();
		ctxBack.strokeStyle='#7FFFD4';
		ctxBack.moveTo(0,-250);
		ctxBack.lineWidth=i%5==0?5:2;
		ctxBack.lineTo(0,-230);
		ctxBack.stroke();
		ctxBack.closePath();
		ctxBack.restore();  // 虽然在save后，产生了新配置，但并没有将新配置保存到数组中，所以数组中只有默认配置，但此句将默认配置弹出，以便后续用到此默认配置
	}
	// 下面使用的是弹出的默认配置。默认配置的坐标原点是(0,0)，并不是平移后的(250,250)
	ctxBack.beginPath();
	ctxBack.arc(250,250,230,0,2*Math.PI);
	ctxBack.stroke();
}

// 绘制秒针
function drawSecPin(){
	ctxBack.save();  // 也是保存默认配置
	ctxBack.translate(250,250);
	ctxBack.rotate(milliseconds*(2*Math.PI)/60);
	ctxBack.beginPath();
	ctxBack.strokeStyle='#AFEEEE';
	ctxBack.lineWidth=1;
	ctxBack.lineJoin="bevel";  // 角的类型：miter（尖角）、round（圆角）、bevel（斜角，相当于竖直切掉角的尖尖部分）
	ctxBack.miterLimit=10;  // 只有当lineJoin属性为"miter"时，miterLimit 才有效，且当实际斜接长度大于10时，以lineJoin的"bevel"类型来显示
	ctxBack.moveTo(0,30);  // moveTo(x,y)：把画笔移动到指定的坐标(x,y)。相当于设置路径的起始点坐标。
	ctxBack.lineTo(3,-175);  // lineTo(x,y)：绘制一条从当前位置到指定坐标(x,y)的直线
	ctxBack.lineTo(13,-165);
	ctxBack.lineTo(0,-210);
	ctxBack.lineTo(-13,-165);
	ctxBack.lineTo(-3,-175);
	ctxBack.lineTo(0,30);
	ctxBack.stroke();
	ctxBack.closePath();
	ctxBack.restore();
}

function drawMinPin(){
	ctxBack.save();
	ctxBack.translate(250,250);
	ctxBack.rotate(minutes*6*Math.PI/180);
	ctxBack.beginPath();
	ctxBack.strokeStyle='#20B2AA';
	ctxBack.lineWidth=1;
	ctxBack.lineJoin="bevel";
	ctxBack.miterLimit=10;
	ctxBack.moveTo(0,20);
	ctxBack.lineTo(3,-145);
	ctxBack.lineTo(10,-135);
	ctxBack.lineTo(0,-180);
	ctxBack.lineTo(-10,-135);
	ctxBack.lineTo(-3,-145);
	ctxBack.lineTo(0,20);
	ctxBack.stroke();
	ctxBack.closePath();
	ctxBack.restore();
}

function drawHouPin(){
	ctxBack.save();
	ctxBack.translate(250,250);
	ctxBack.rotate(hour*30*Math.PI/180);
	ctxBack.beginPath();
	ctxBack.strokeStyle='#87CEFA';
	ctxBack.lineWidth=1;
	ctxBack.lineJoin="bevel";
	ctxBack.miterLimit=10;
	ctxBack.moveTo(0,20);
	ctxBack.lineTo(3,-110);
	ctxBack.lineTo(10,-100);
	ctxBack.lineTo(0,-150);
	ctxBack.lineTo(-10,-100);
	ctxBack.lineTo(-3,-110);
	ctxBack.lineTo(0,20);
	ctxBack.stroke();
	ctxBack.closePath();
	ctxBack.restore();
}

function setPoint(){
	ctxBack.beginPath();
	ctxBack.fillStyle='black';
	ctxBack.arc(250,250,3,0,2*Math.PI);
	ctxBack.stroke();
}

// 绘制表盘的12个数字：12,1,2,3...11
function setNum(){
	numBack.save();  // 在做变形之前先保存状态是一个良好的习惯。详见《笔记》
	numBack.translate(250,250);  // 平移画布的坐标原点。详见：https://www.runoob.com/w3cnote/html5-canvas-intro.html
	numBack.beginPath();
	numBack.fillStyle='#7FFFD4';
	numBack.font="30px Helvetica";
	for(var i=0;i<60;i++){  // i为小格。60小格=360°，则1小格=6°，故i小格*1=i*6度
		if(i%5==0){  // 1圈：60小格，12大格，则60/12=5
			numBack.lineWidth=5;
			// 195为自定义的距离：这12个数字到原点的长度
			var xPoint=195*Math.sin(i*6*Math.PI/180);  // 度数转弧度
			var yPoint=-195*Math.cos(i*6*Math.PI/180);
			/* text：如果i==0，则text为12，否则为i/5
			   x：如果i==0，则x为-15，否则为xPoint-10
			   y：如果i==0，则y为-185，否则如果i<=30，则为yPoint+5，否则为yPoint+10
			*/
			numBack.fillText(i==0?12:i/5,i==0?-15:xPoint-10,i==0?-185:i<=30?yPoint+5:yPoint+10);
		}
	}

	numBack.stroke();  // 和下面一句位置互换，效果一样
	numBack.closePath();
	numBack.restore();  //
}

// 度数转弧度
function degToRad(degree){
	var result;
	var factor=Math.PI/180;
	if(degree==0){result=270*factor;}  // 由于画布的x坐标轴水平向右，圆心为原点，所以0度为原点指向数字3，加270表示从3顺时针到12，即degToRad(0)表示原点指向12，但非0度则正常，即从水平方向开始计算。如：degToRad(180)，水平顺时针扫过180度，指向数字9，为了让它从指向12开始顺时针扫，则要减90度
	else{result=degree*factor;}
	return result;
}

/*
一、弧度转度数：
∵ π弧度 = 180° （度）
∴ 1弧度 = 180°/π （度）
则 n弧度 = (180°/π)*n （度）
总结：乘 180°/π 还是 π/180°，就看要转成什么。转成弧度，分子为弧度π（即用：π/180°），转成度数，分子为度数180°（即用：180°/π）

二、渐变类型：
（一）线性渐变（直线方式）：createLinearGradient(x1,y1,x2,y2)。其中，x1，y1为开始点的坐标，x2,y2为结束点的坐标
（二）径向渐变（圆形方式）：createRadialGradient(x1,y1,r1,x2,y2,r2)。其中，x1,y1为开始圆的圆心坐标,r1为半径，x2,y2为结束圆的...
*/
