"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-gray-600 dark:text-gray-100", className)}
      classNames={{
          months: "flex flex-col items-center", // 캘린더 본체를 중앙으로 정렬
          month_caption: "flex justify-center items-center h-10 w-full relative mb-2",
          caption_label: "text-sm font-bold text-gray-800 dark:text-gray-100 mx-8", // mx-8로 글자 양옆에 버튼 공간 확보

          // nav를 absolute로 유지하되, 버튼들이 글자 근처에 오도록 px-10 정도로 간격 조정
          nav: "absolute inset-x-0 flex justify-between items-center px-10",

          button_previous: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500",
          button_next: "p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500",

          month_grid: "w-fit border-collapse mx-auto", // 달력 숫자들이 차지하는 공간만 사용하도록 w-fit 설정
          weekdays: "flex justify-center",
          weekday: "text-gray-400 dark:text-gray-500 font-medium w-9 text-center text-[0.8rem]",
          week: "flex justify-center w-full mt-1",
          day: "h-9 w-9 flex items-center justify-center p-0 relative",
          day_button: "h-8 w-8 flex items-center justify-center rounded-md text-sm transition-colors hover:bg-violet-500 hover:text-white aria-selected:bg-violet-500 aria-selected:text-white",

          today: "bg-gray-100 dark:bg-gray-700 text-violet-600 font-bold rounded-md", // 오늘 날짜 강조
          selected: "bg-violet-500 text-white rounded-md",
          outside: "text-gray-300 dark:text-gray-600 opacity-50",
          disabled: "text-gray-300 opacity-50",
          hidden: "invisible",
          ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>;
          }
          return <svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>;
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
