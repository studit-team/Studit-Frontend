import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudySchedule() {
    const { studyId } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setIsLoading(true);
                // API 호출 (데이터 셋에 맞는 엔드포인트)
                const response = await axios.get(`/api/studies/${studyId}/schedules`);
                setSchedules(response.data);
            } catch (error) {
                console.error("❌ 스케줄 데이터 호출 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (studyId) fetchSchedules();
    }, [studyId]);

    // 날짜 및 시간 포맷팅 함수
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return {
            month: date.getMonth() + 1,
            day: date.getDate(),
            time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
            fullDate: date.toLocaleDateString('ko-KR', { weekday: 'short' })
        };
    };

    // 상태에 따른 배지 스타일 지정
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PLANNED': return 'bg-violet-100 text-violet-600';
            case 'COMPLETED': return 'bg-gray-100 text-gray-500';
            case 'CANCELLED': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-400';
        }
    };

    const getStatusText = (status) => {
        if (status === 'PLANNED') return '예정';
        if (status === 'COMPLETED') return '종료';
        if (status === 'CANCELLED') return '취소';
        return status;
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">일정을 불러오는 중...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">모임 일정</h2>
                    <p className="text-sm text-gray-500">스터디의 전체 일정을 확인하세요.</p>
                </div>
                <button className="btn bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
                    일정 추가
                </button>
            </div>

            {schedules.length > 0 ? (
                schedules.map((s) => {
                    const dt = formatDateTime(s.meetingAt);
                    return (
                        <div
                            key={s.scheduleId}
                            className={`p-5 rounded-xl border bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between transition-all hover:border-violet-200 ${
                                s.status === 'COMPLETED' ? 'opacity-60 bg-gray-50/50' : ''
                            } ${s.status === 'CANCELLED' ? 'border-red-100' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center gap-6">
                                {/* 날짜 표시 영역 */}
                                <div className="text-center min-w-[60px] border-r border-gray-100 dark:border-gray-700 pr-6">
                                    <div className="text-xs text-gray-400 font-bold uppercase">{dt.month}월</div>
                                    <div className={`text-2xl font-black ${s.status === 'PLANNED' ? 'text-violet-600' : 'text-gray-500'}`}>
                                        {dt.day}
                                    </div>
                                    <div className="text-[10px] text-gray-400">({dt.fullDate})</div>
                                </div>

                                {/* 상세 정보 영역 */}
                                <div>
                                    <h3 className={`font-bold mb-1 ${s.status === 'CANCELLED' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                        {s.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <span className="flex items-center">🕒 {dt.time}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="flex items-center">📍 {s.location}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                                </div>
                            </div>

                            {/* 상태 표시 영역 */}
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(s.status)}`}>
                                    {getStatusText(s.status)}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed text-gray-400">
                    등록된 일정이 없습니다.
                </div>
            )}
        </div>
    );
}

export default StudySchedule;