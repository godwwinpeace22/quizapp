/* eslint-disable */
$('.options').on('click', function(){
	$('.options').attr('disabled', true)
	$('.disturb').show(0,function(){
		$('body').css({cursor:'loading'})
		$.post('/next', function(data,status){
			if(data.currQuestNo == 5 && data.completed == true){
				$('.prevent').css({display:'block',background:'white', opacity:'1'})
				$('section').hide()
				//window.location.href = '/completed'
				$('.options').attr('disabled', true) 
			}
			else{
				console.log(data);
				console.log(status)
				//console.log(JSON.parse(data))
				$('.thequestion').text(data.question.theQuestion);
				$('.option1').text(data.question.option1);
				$('.option2').text(data.question.option2);
				$('.option3').text(data.question.option3);
				$('.option4').text(data.question.option4);
				$('#currQuestNo').text(data.currQuestNo + ' / 4')
				$('#questions').text(data.question.theQuestion);
				$('.disturb').hide(0);
				$('body').css({cursor:'default'})
				$('.options').attr('disabled', false)
			}
			
		})
		
	})
	
})

var timeStamp = $('#timer').attr('timeStamp')
var serverTime = $('#timer').attr('serverTime')
console.log(timeStamp);
console.log(serverTime);
// Timer
function timer() {
	
	var countDownDate = timeStamp * 1;
	var now = new Date().getTime();
	var distance = countDownDate - now;
	var min = Math.floor((distance % (1000*60*60))/(1000*60))
	var minutes = min < 10 ? '0' + min : min;
	var sec = Math.floor((distance % (1000*60))/1000);
	var seconds = sec < 10 ? '0' + sec : sec;
	//console.log(distance);
	distance > 0 ? document.getElementById("timer").innerHTML = minutes + ":" + seconds : '' ;
	
	if(distance < 0){
		clearInterval();
		document.getElementById("timer").innerHTML = "EXPIRED";
		$('.prevent').css({display:'block',background:'white', opacity:'1'})
		$('section').hide()
		//window.location.href = '/completed'
		$('.options').attr('disabled', true)
			
	}

}
setInterval(timer, 1000);