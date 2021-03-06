/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

function LoadingWidget() {
  return (
    <Widget>
        <Widget.Header>
            Carregando...
        </Widget.Header>


        <Widget.Content>

            Desafio carregando
        </Widget.Content>
    </Widget>
    );
}

function QuestionWidget({ 
    question, 
    questionIndex,
    totalQuestions,
    onSubmit,
}) {
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState();
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative === undefined;


    return(
        <Widget>
            <Widget.Header>
                {/* <BackLinkArrow href="/" /> */}
                <h3>
                {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
                </h3>
            </Widget.Header>

        <img 
        alt="Descrição"
        style={{ 
            width: '100%',
            height: '150px',
            objectFit: 'cover',
        }}
        src={question.image}
        />
        <Widget.Content>
            <h2>
                {question.title}
            </h2>
            <p>
                {question.description}
            </p>

            <form 
            onSubmit={(infosDoEvento) => {
                infosDoEvento.preventDefault();
                setIsQuestionSubmited(true);
                setTimeout(() => {
                    onSubmit();
                    setIsQuestionSubmited(false);
                    setSelectedAlternative(undefined);
                }, 3 * 1000);
            }}
            >
            {question.alternatives.map((alternative, alternativeIndex) => {
                console.log('Para de de reclamar')
                const alternativeId = `alternative__${alternativeIndex}`;
                return (
                    <Widget.Topic
                    as="label"
                    key={alternativeId}
                        htmlFor={alternativeId}
                    >
                        <input 
                            // style={{ display: 'none' }}
                            id={alternativeId}
                            name={questionId}
                            onChange={() => setSelectedAlternative(alternativeIndex)}
                            type="radio"
                        />
                        {alternative}
                    </Widget.Topic>
                );
            })}

            {/* <pre>
            {JSON.stringify(question, null, 4)}
            </pre> */}

            <Button type="submit" disabled={!hasAlternativeSelected}>
                Confirmar
            </Button>
            {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
            {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
            </form>
        </Widget.Content>
    </Widget>
    );
}

    const screenStates = {
        QUIZ: 'QUIZ',
        LOADING: 'LOADING',
        RESULT: 'RESULT',
    };

export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const [results, setResult] = React.useState([]);
    // console.log('Perguntas criadas: ', db.questions);
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];


    // [React chama de: Efeitos || Effects]
    // React.useEffect
    // atualizado === willUpdate
    // morre === willUnmount
    React.useEffect(() => {
        // fetch() ...
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
        // nasce === didMount
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                    {screenState === screenStates.QUIZ && (
                        <QuestionWidget
                            question={question}
                            questionIndex={questionIndex}
                            totalQuestions={totalQuestions}
                            onSubmit={handleSubmitQuiz}
                     />
                    )}

                    {screenState === screenStates.LOADING && <LoadingWidget />}

                    {screenState === screenStates.RESULT && <div>Você acertou X questões, parabéns!</div>}
            </QuizContainer>
        </QuizBackground>
    );
}
