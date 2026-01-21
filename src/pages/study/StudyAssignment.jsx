import React from "react";

function StudyAssignment() {
    const assignments = [
        { id: 1, title: "자바 인터페이스 구현하기", deadline: "2026-01-25", submitCount: 4, total: 5, status: "OPEN" },
        { id: 2, title: "조건문 연습문제 풀이", deadline: "2026-01-18", submitCount: 5, total: 5, status: "CLOSED" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">과제 및 학습 인증</h2>
            <div className="grid grid-cols-1 gap-4">
                {assignments.map((a) => (
                    <div key={a.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">{a.title}</h3>
                                <p className="text-sm text-gray-500">마감일: {a.deadline}</p>
                            </div>
                            <button className={`btn text-sm ${a.status === 'OPEN' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {a.status === 'OPEN' ? '제출하기' : '마감됨'}
                            </button>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-violet-500 h-full transition-all"
                                style={{ width: `${(a.submitCount/a.total)*100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right">현재 제출 인원: {a.submitCount}명 / {a.total}명</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudyAssignment;