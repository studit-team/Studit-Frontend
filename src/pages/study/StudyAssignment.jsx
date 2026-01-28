import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudyAssignment() {
    const { studyId } = useParams();
    // 1. state 변수명 수정 (assignments2 -> assignments)
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/studies/${studyId}/tasks`);
                // 서버에서 받은 그룹화된 데이터를 state에 저장
                setAssignments(response.data);
            } catch (error) {
                console.error("❌ 과제 데이터 호출 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (studyId) fetchTasks();
    }, [studyId]);

    // 로딩 중일 때 표시 (선택 사항)
    if (isLoading) return <div className="text-center p-10">로딩 중...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">과제 및 학습 인증</h2>
            <div className="grid grid-cols-1 gap-4">
                {assignments.map((task) => {
                    // 2. 제출 인원 계산 (status가 'Y'인 사람 수)
                    const submitCount = task.submissions ? task.submissions.filter(s => s.status === 'Y').length : 0;

                    // 3. 마감 상태 확인 (현재 시간 vs dueDate)
                    const isClosed = new Date(task.dueDate) < new Date();
                    const statusText = isClosed ? "마감됨" : "제출하기";

                    return (
                        <div key={task.taskId} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg dark:text-white">{task.title}</h3>
                                    {/* 날짜 포맷팅 (YYYY-MM-DD 형식으로 출력) */}
                                    <p className="text-sm text-gray-500">
                                        마감일: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isClosed
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-violet-600 text-white hover:bg-violet-700'
                                }`}>
                                    {statusText}
                                </button>
                            </div>

                            {/* 프로그레스 바 */}
                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-violet-500 h-full transition-all duration-500"
                                    style={{ width: `${(submitCount / task.maxMbrNocs) * 100}%` }}
                                ></div>
                            </div>

                            <p className="text-xs text-gray-400 mt-2 text-right">
                                현재 제출 인원: {submitCount}명 / {task.maxMbrNocs}명
                            </p>
                        </div>
                    );
                })}

                {assignments.length === 0 && (
                    <div className="text-center py-10 text-gray-500">등록된 과제가 없습니다.</div>
                )}
            </div>
        </div>
    );
}

export default StudyAssignment;