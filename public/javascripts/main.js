$(function(){
    if(localStorage && localStorage.getItem('questions')){
        //If record is found in the local storage
        /* eslint-disable-next-line no-console */
        console.log(JSON.parse(localStorage.getItem('questions')));
        //var currQuestNo = JSON.parse(localStorage.getItem('currQuestNo')) * 1;
        updateView(localStorage.getItem("currQuestNo"),JSON.parse(localStorage.getItem("questions")));
        setInterval(timer, 1000);
    }
    else{
        
        $.post("/", function(data, status){
            //alert(status);
            /* eslint-disable-next-line no-console */
            console.log(data.questions)
            /* eslint-disable-next-line no-console */
            console.log(status)
            /* eslint-disable-next-line no-console */
            console.log(JSON.stringify(data.questions))
            localStorage.setItem("questions",JSON.stringify(data.questions));
            localStorage.setItem("currQuestNo",data.currQuestNo * 1);
            localStorage.setItem("score",data.score * 1);
            /* eslint-disable-next-line no-console */
            console.log(data.timeStamp);
            if(data.timeStamp * 1 == 0){
                localStorage.setItem("timestamp",data.serverTime * 1)
                /* eslint-disable-next-line no-console */
                console.log("new" + " " + localStorage.getItem("timestamp"));
            }else{
                localStorage.setItem("timestamp",data.timeStamp * 1)
                /* eslint-disable-next-line no-console */
                console.log("old" + " " + localStorage.getItem("timestamp"));
            }
            setInterval(timer, 1000);
            updateBackEnd();
            /* eslint-disable-next-line no-console */
            console.log(JSON.parse(localStorage.getItem("questions")))
            updateView(localStorage.getItem("currQuestNo"),JSON.parse(localStorage.getItem("questions")));
            
        });
    }
    
    // view update function
    function updateView(questNo,data){
        if(questNo*1 >= data.length){
            $('.result').text('Your score is ' + localStorage.getItem('score'));
        }
        else{
            $('.thequestion').text(data[questNo].theQuestion);
            $('.option1').text(data[questNo].option1);
            $('.option2').text(data[questNo].option2);
            $('.option3').text(data[questNo].option3);
            $('.option4').text(data[questNo].option4);
        }
        
    }


    // Click Handler
    $('button').click(function(){
        $('button').attr('disabled', true) // Using $(this) will select only the button that is clicked
        var selectedOptn = $(this).parent().next().text();
        /* eslint-disable-next-line no-console *///
        console.log(selectedOptn)
        var ans = JSON.parse(localStorage.getItem("questions"))[localStorage.getItem("currQuestNo")].theAnswer
        /* eslint-disable-next-line no-console *///
        console.log(ans)
        localStorage.setItem("currQuestNo",localStorage.getItem("currQuestNo") * 1 + 1);
        if(localStorage.getItem("currQuestNo") * 1 >= JSON.parse(localStorage.getItem("questions")).length){
            if(selectedOptn == ans){
                /* eslint-disable-next-line no-console */
                console.log("YES");
                /* eslint-disable-next-line no-console */
                console.log(ans + " " + selectedOptn)
                localStorage.setItem("score",localStorage.getItem("score")* 1 + 1);
                updateBackEnd();
            }
            else{
                /* eslint-disable-next-line no-console */
                console.log('NO')
                /* eslint-disable-next-line no-console */
                console.log(ans + " " + selectedOptn)
            }
            $('.result').text('Your score is ' + localStorage.getItem("score"));
            /* eslint-disable-next-line no-console */
            console.log('Your score' + localStorage.getItem("score"));
        }
        else{
            if(selectedOptn == ans){
                /* eslint-disable-next-line no-console */
                console.log("YES");
                /* eslint-disable-next-line no-console */
                console.log(ans + " " + selectedOptn)
                localStorage.setItem("score",localStorage.getItem("score")* 1 + 1);
                /* eslint-disable-next-line no-console */
                console.log('Your score' + localStorage.getItem("score"));
                updateView(localStorage.getItem("currQuestNo"),JSON.parse(localStorage.getItem("questions")));  // I know why am putting it here instead of outside
                $('button').attr('disabled', false);
                updateBackEnd();
            }
            else{
                /* eslint-disable-next-line no-console */
                console.log('NO')
                /* eslint-disable-next-line no-console */
                console.log(ans + " " + selectedOptn)
                updateView(localStorage.getItem("currQuestNo"),JSON.parse(localStorage.getItem("questions")));
                $('button').attr('disabled', false);
                /* eslint-disable-next-line no-console */
                console.log('Your score' + localStorage.getItem("score"));
            }
        }
        
        
    });

    // Update backend
    function updateBackEnd(){
        $.post('/update', {currQuestNo:localStorage.getItem("currQuestNo") * 1, score:localStorage.getItem("score") * 1, timeStamp:localStorage.getItem("timestamp") * 1}, function(data,status){
            /* eslint-disable-next-line no-console */
            console.log(data + " " + status);
        })
    }

    // Timer
    function timer() {
        var countDownDate = localStorage.getItem("timestamp") * 1 + 60 * 2000;
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000*60*60))/(1000*60));
        var seconds = Math.floor((distance % (1000*60))/1000);
        document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";
        if(distance < 0){
            clearInterval();
            document.getElementById("timer").innerHTML = "EXPIRED";
            $('button').attr('disabled', true)
            
        }

    }
    
})