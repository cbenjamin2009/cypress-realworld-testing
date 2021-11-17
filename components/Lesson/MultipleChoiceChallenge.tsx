import { useActor } from "@xstate/react"
import { useState } from "react"
import dynamic from "next/dynamic"

const NextLessonBtn = dynamic(() => import("./NextLessonBtn"), {
  ssr: false,
})

export default function LessonChallenge({
  progressService,
  lessonData,
  lessonPath,
  path,
  isCompleted,
}) {
  const [answerIndicies, setAnswerChecked] = useState([])
  const [, progressSend] = useActor(progressService)

  const isIncorrectAnswer = (index) => {
    return (
      answerIndicies.includes(index) &&
      lessonData.challenges[0].correctAnswerIndex !== index
    )
  }

  return (
    <>
      <hr className="mb-6" />
      <div data-test="multiple-choice-challenge" className="py-12 bg-teal-500">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-full lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 xl:col-span-2 text-center">
            <p className="text-base text-gray-50 font-semibold">
              Unlock the next lesson
            </p>
          </div>

          <div className="lesson-content lg:col-span-9 xl:col-span-7">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="mt-6 text-3xl leading-8 font-extrabold tracking-tight text-jade-100 sm:text-4xl">
                  {lessonData.challenges[0].question}
                </p>
              </div>

              <div className="mt-10 max-w-2xl mx-auto">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  {lessonData.challenges[0].answers.map((answer, index) => (
                    <div key={index} className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-8 w-8">
                          <input
                            id={`answer-${index}`}
                            data-test={`challenge-answer-${index}`}
                            name="answer"
                            type="checkbox"
                            className={`${
                              isIncorrectAnswer(index)
                                ? "text-gray-300 focus:ring-gray-300"
                                : ""
                            } focus:ring-blue-500 text-blue-600 border-gray-300 rounded h-8 w-8`}
                            onClick={() => {
                              setAnswerChecked((prev) => [...prev, index])
                              progressSend({
                                type: "SUBMIT_ANSWER",
                                id: lessonPath,
                                challengeIndex: 0,
                                userAnswerIndex: index,
                              })
                            }}
                          />
                        </div>
                        <label
                          htmlFor={`answer-${index}`}
                          className={`${
                            isIncorrectAnswer(index)
                              ? "line-through text-gray-300"
                              : ""
                          } ml-16 text-lg leading-6 font-medium text-gray-50`}
                        >
                          {answer}
                        </label>
                      </dt>
                    </div>
                  ))}
                </dl>
                <NextLessonBtn path={path} isCompleted={isCompleted} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  )
}
