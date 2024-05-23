import React, { createContext, useState, useContext } from 'react';

const QuestionsContext = createContext();

export const useQuestions = () => useContext(QuestionsContext);

export const QuestionsProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [questionIds, setQuestionIds] = useState([]);
    const [userName, setUserName] = useState('');
    const [creatorName, setcreatorName] = useState('');

    const storeQuestions = (fetchedQuestions) => {
        const formattedQuestions = fetchedQuestions.map(question => ({
            id: question.questionID,
            question: question.question,
            options: question.options
        }));
        setQuestions(formattedQuestions);
        setQuestionIds(formattedQuestions.map(q => q.id));
    };

    const value = {
        questions,
        questionIds,
        storeQuestions,
        userName,
        setUserName,
        creatorName,
        setcreatorName
    };

    return (
        <QuestionsContext.Provider value={value}>
            {children}
        </QuestionsContext.Provider>
    );
};
