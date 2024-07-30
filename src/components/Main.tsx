import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

const answerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, answer: string, lesson: Lesson  ) => {
    let target = e.target as HTMLDivElement
    let question = document.getElementById("question");
    if (answer == lesson.rightAnswer) {
        target.textContent = ""
        target.classList.add("smile", "success-smile");
        question.textContent = lesson.rightWord;
        question.classList.remove("animate-error", "error");
        question.classList.add("animate-question", "success");
    } else {
        target.textContent = ""
        target.classList.add("smile", "error-smile");
        question.classList.add("animate-error", "error");
    }
}

export const Main = () => {

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0])
    const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0)

    ipcRenderer.on('open-file', (event, data) => {
        setLessons(data)
        setActiveLesson(data[0])
        setActiveLessonIndex(0)
    })

    ipcRenderer.on('reset-file', (event, data) => {
        setLessons([])
        setActiveLesson(null)
        setActiveLessonIndex(0)
    })

    return <div className="d-flex-jca align-items-center">
        {activeLesson && <div id="lesson" key={activeLesson.id} >
            <div id="question">{activeLesson.question}</div>
            <div className="answers">
                {activeLesson.answers.map((answer, i) => 
                <div key={`${activeLesson.id}_${i}`} 
                    className="answer" 
                    onClick={(e) => answerClick(e, answer, activeLesson)}>
                        {answer}
                </div>)}
            </div>
            
        </div>
        }
        <div className="navigation">
                {activeLessonIndex > 0 && <button className="btn-prev" onClick={() => {
                    let newActiveIndex = activeLessonIndex - 1;
                    let lessonCls = document.getElementById("lesson").classList;
                    lessonCls.remove("slide-in-left", "slide-in-right")
                    lessonCls.add("slide-out-right")
                    setTimeout(() => {
                        setActiveLessonIndex(newActiveIndex)
                        setActiveLesson(lessons[newActiveIndex])
                        lessonCls.remove("slide-out-right")
                        lessonCls.add("slide-in-left")
                    }, 500)
                    
                }}/>}
                {activeLessonIndex < lessons.length - 1 && <button className="btn-next" onClick={() => {
                    let newActiveIndex = activeLessonIndex + 1;
                    let lessonCls = document.getElementById("lesson").classList;
                    lessonCls.remove("slide-in-left", "slide-in-right")
                    lessonCls.add("slide-out-left")
                    
                    setTimeout(() => {
                        setActiveLessonIndex(newActiveIndex)
                        setActiveLesson(lessons[newActiveIndex])
                        lessonCls.remove("slide-out-left")
                        lessonCls.add("slide-in-right")
                        
                    }, 500)
                    
                    
                }}/>}
            </div>
    </div>
}