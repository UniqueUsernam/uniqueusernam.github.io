var myQuestions = [
    {
        question: "Which command force-completes a action in Terminal?",
        answers: {
            a: 'crutisl disable',
            b: 'forcecomplete:run',
            c: 'sudo and sudo rm',
            d: 'cat',
            e: 'sudo run'
        },
        correctAnswer: 'c'
    },
    {
        question: "How do you cancel an installation when Installer is prompting for administrator authentication?",
        answers: {
            a: 'Force-quit the Installer.',
            b: 'Drectly normal-quit the Installer',
            c: 'Close the window.',
            d: 'Press cancel on the admin authentication box and normal-quit the Installer. Do not directly quit or force-quit.',
            e: 'Press cancel on the admin authentication box.'
        },
        correctAnswer: 'd'
    },
    {
        question: "How can you lockdown a Terminal window? Don't write the whole process, just the command at the end.",
        answers: {
            a: 'killall Terminal',
            b: 'logout',
            c: 'close',
            d: 'done',
            e: 'lockdown'
        },
        correctAnswer: 'b'
    },
    {
        question: "What is the reccomended encryption for a disk image in Disk Utility? (Hint: It starts with AES and is the lowest form of AES encryption)?",
        answers: {
            a: '256-bit AES',
            b: '120-bit AES',
            c: '126-bit AES',
            d: '100-bit AES',
            e: '500-bit AES'
        },
        correctAnswer: 'c'
    },
    {
        question: "What error message does Finder display when you double-click on authserver?",
        answers: {
            a: 'The operation can\'t be completed because you don\'t have the necessary permission.',
            b: 'This folder is locked. It cannot be opened.',
            c: 'Sorry, this folder is restricted.',
            d: 'The folder "authserver" can\'t be opened because you don\'t have the permission to see it\'s contents.',
            e: 'PERMISSION DENIED.'
        },
        correctAnswer: 'd'
    },
    {
        question: "Is the ApplePushService folder in Application Support malware?",
        answers: {
            a: 'Yes, it is malware.',
            b: 'No, it\'s not malware, but it dosen\'t help anything on your mac.',
            c: 'No, it\'s not malware, and it is related to iCloud sync <i>and</i> is a layer of security',
            d: 'It\'s not malware, and it\'s a layer of security, but nothing else.',
            e: 'It is not malware and is related to iCloud syncing, but nothing else.',
        },
        correctAnswer: 'c'
    },
    {
        question: "What is the main basic pourpase of the cron.deny and at.deny documents, in short?",
        answers: {
            a: 'They determine all computer permissions.',
            b: 'They deny certain users to execute any Terminal commands whatsoever.',
            c: 'They manage user passwords and administrator privlages.',
            d: 'They determine permissions for a few specific Terminal commands.',
            e: 'They mamage the Kernel.',
        },
        correctAnswer: 'd'
    },
    {
        question: "What is the opposite document to cron.deny and at.deny but still determines the same permissions and have half the same name?",
        answers: {
            a: 'allowPemissions.docx',
            b: 'allowTerminalCommands.allow',
            c: 'Allow-commands.deny',
            d: 'allowPermissions.deny',
            e: 'At.allow and cron.allow',
        },
        correctAnswer: 'e'
    },
    {
        question: "What are the two locations of at.deny, cron.deny, at.allow, and cron.allow?",
        answers: {
            a: '/System/Library/Accounts/Acess and /System/Library/Accounts/Authentication',
            b: '/Library/Security and /Library/User Template',
            c: '/private/var/at and /etc/',
            d: '/Users and /System/Volumes',
            e: '/Library/Apple/usr and /Library/Filesystems',
        },
        correctAnswer: 'c'
    },
    {
        question: "What application do at.deny, cron.deny, at.allow, and cron.allow open with, even though Finder does not realise it?",
        answers: {
            a: 'Microsoft Word',
            b: 'TextEdit',
            c: 'Xcode',
            d: 'Terminal',
            e: 'Preview',
        },
        correctAnswer: 'a'
    }
];
var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);

function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

    function showQuestions(questions, quizContainer){
        // we'll need a place to store the output and the answer choices
        var output = [];
        var answers;

        // for each question...
        for(var i=0; i<questions.length; i++){

            // first reset the list of answers
            answers = [];

            // for each available answer...
            for(letter in questions[i].answers){

                // ...add an html radio button
                answers.push(
                    '<label>'
                    // Show and make work radio buttons...
                        + '<input type="radio" name="question'+i+'" value="'+letter+'">'
                        + letter + ') '
                        + questions[i].answers[letter]
                    + '</label><br/>'
                );
            }

            // add this question and its answers to the output
            output.push(
                '<div class="question">' + questions[i].question + '</div>'
                + '<div class="answers">' + answers.join('') + '</div>'
            );
        }

        // finally combine our output list into one string of html and put it on the page
        quizContainer.innerHTML = output.join('');
    }


    function showResults(questions, quizContainer, resultsContainer){

        // gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');

        // keep track of user's answers
        var userAnswer = '';
        var numCorrect = 0;

        // for each question...
        for(var i=0; i<questions.length; i++){

            // find selected answer
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;

            // if answer is correct
            if(userAnswer===questions[i].correctAnswer){
                // add to the number of correct answers
                numCorrect++;

                // color the answers green
                answerContainers[i].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else{
                // color the answers red
                answerContainers[i].style.color = 'red';
            }
        }

        // show number of correct answers out of total
        resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    }

    // show questions right away
    showQuestions(questions, quizContainer);

    // on submit, show results
    submitButton.onclick = function(){
        showResults(questions, quizContainer, resultsContainer);
    }

}
