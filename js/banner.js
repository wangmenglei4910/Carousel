function debounce(func, wait, immediate) {
	let timer = null,
		result = null;
	return function anonymous(...args) {
		let context = this,
			now = immediate && !timer;
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			!immediate ? result = func.call(context, ...args) : null;
		}, wait);
		now ? result = func.call(context, ...args) : null;
		return result;
	}
}
let bannerModule = (function () {
	let $container = $('.container'),
		$wrapper = $container.find('.wrapper'),
		$buttonprev = $container.find('.button-prev'),
		$buttonNext = $container.find('.button-next'),
		$pagination = $container.find('.pagination'),
		$slideList=null,
		$paginationList = null;
		let step=0,
		_DATA=null,
		autoTimer=null,
		interval=1000;
		
		function queryData(){
			$.ajax({
				url: 'json/bannerData1.json',
				method: 'GET',
				async: false,
				success: result =>_DATA=result
			});
		};
		function bindHTML(){
			let str1 = ``,
			str2 = ``;
		_DATA.forEach((item,index ) => {
			str1 += `<div class="slide">
				<img src="${item.pic}" alt="">
			</div>`;

			str2 += `<span class="${index===0?'active':''}"></span>`;
		});
		$wrapper.html(str1);
		$pagination.html(str2);

		//=>获取结构内容
		$slideList = $wrapper.children('.slide');
		$paginationList = $pagination.children('span');
		}

	function autoMove(){
		step++;
		if(step>=$slideList.length){
			$wrapper.css('left',0)
			step=1;
		}
		$wrapper.stop().animate({
			left:-step*1226
		},300)
		autoFocus();
	}

	function autoFocus(){
		let temp=step;
		temp===$slideList.length?temp=0:null;
		$paginationList.each((index,item)=>{
			let $item=$(item);
			if(index===temp){
				$item.addClass('active')
				return;
			}
			$item.removeClass('active');
		});
	}

function handPagenition(){
	$paginationList.click(function(){
		let index=$(this).index();
		step=index;
		$wrapper.stop().animate({
			left:-step*1226
		},300)
		autoFocus()
	})
}

function handelArrow(){
	$buttonNext.click(debounce(autoMove,300,1000))
	$buttonprev.click(debounce(function(){
		step--;
		if(step<0){
			$wrapper.css('left',-$slideList.length*1200);
			step=$slideList.length-1;
		}
		$wrapper.stop().animate({
			left:-step*1226
		},300);
		autoFocus();
	},300,1000))
}

	return {
		init() {
			queryData();
			bindHTML();
			autoTimer=setInterval(autoMove,interval);
			$container.on('mouseenter',()=>clearInterval(autoTimer)).on('mouseleave',()=>autoTimer=setInterval(autoMove,interval));
			handPagenition();
			handelArrow();
		}
	}
})();
bannerModule.init()