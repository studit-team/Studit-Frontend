import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function StudyNotice() {
    const { studyId } = useParams();
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/studies/${studyId}/notice`);
                setNotices(response.data);
            } catch (error) {
                console.error("❌ 공지사항 데이터 호출 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (studyId) fetchNotices();
    }, [studyId]);

    const handleRowClick = (id) => {
        setSelectedId(selectedId === id ? null : id);
    };

    if (isLoading) return <div className="p-8 text-center">로딩 중...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
                <div>
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 text-xl">공지사항</h2>
                    <p className="text-xs text-gray-500 mt-1">목록을 클릭하여 상세 내용을 확인하세요.</p>
                </div>
                <button className="btn bg-violet-600 text-white hover:bg-violet-700 text-sm px-4 py-2 rounded-lg transition-all shadow-sm">
                    글쓰기
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                        <th className="px-5 py-3 text-center w-20">번호</th>
                        <th className="px-5 py-3 text-left">제목 및 내용 미리보기</th>
                        <th className="px-5 py-3 text-center w-32">작성자</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {notices.length > 0 ? (
                        notices.map((notice, index) => (
                            <React.Fragment key={notice.boardId}>
                                {/* 목록 행: 클릭 시 상세 내용 토글 */}
                                <tr
                                    onClick={() => handleRowClick(notice.boardId)}
                                    className={`group hover:bg-violet-50/30 dark:hover:bg-violet-600/5 cursor-pointer transition-colors ${
                                        selectedId === notice.boardId ? 'bg-violet-50/50 dark:bg-violet-600/10' : ''
                                    }`}
                                >
                                    <td className="px-5 py-4 text-center text-gray-400 font-medium">
                                        {notices.length - index}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col max-w-xl">
                                            <div className="flex items-center mb-1">
                                                {notice.boardTyCd === "NOTICE" && (
                                                    <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded mr-2 shrink-0">공지</span>
                                                )}
                                                <span className={`font-bold transition-colors ${
                                                    selectedId === notice.boardId ? 'text-violet-600' : 'text-gray-800 dark:text-gray-200'
                                                }`}>
                                                        {notice.title}
                                                    </span>
                                            </div>
                                            {/* 💡 핵심: 선택되지 않았을 때만 ...으로 요약 표시 */}
                                            {selectedId !== notice.boardId && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {notice.content}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center text-gray-500 font-medium">
                                        {notice.username}
                                    </td>
                                </tr>

                                {/* 상세 내용 행: 펼쳐졌을 때만 렌더링 */}
                                {selectedId === notice.boardId && (
                                    <tr className="bg-gray-50/30 dark:bg-gray-900/20">
                                        <td colSpan="3" className="px-8 py-6 border-y border-gray-100 dark:border-gray-700">
                                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Notice Detail</span>
                                                    <div className="flex gap-2">
                                                        <button className="text-xs text-gray-400 hover:text-gray-600">수정</button>
                                                        <button className="text-xs text-red-400 hover:text-red-600">삭제</button>
                                                    </div>
                                                </div>
                                                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                                    {notice.content}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="px-5 py-20 text-center text-gray-400">
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudyNotice;