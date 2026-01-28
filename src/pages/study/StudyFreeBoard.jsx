import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function StudyFreeBoard() {
    const { studyId } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                // URL 오타 수정: bord -> board
                const response = await axios.get(`/api/studies/${studyId}/board/list`);
                setPosts(response.data);
            } catch (error) {
                console.error("❌ 게시판 데이터 호출 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (studyId) fetchPosts();
    }, [studyId]);

    if (isLoading) return <div className="text-center p-10">게시글을 불러오는 중...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">자유 게시판</h2>
                <button className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-lg shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors">
                    글쓰기
                </button>
            </div>

            <div className="space-y-4">
                {posts.map((p) => (
                    <div key={p.boardId} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-300 transition-colors cursor-pointer shadow-sm">
                        <div className="flex items-center mb-3">
                            {/* 아바타: username를 기반으로 생성하거나 기본 이미지 표시 */}
                            <div className="w-9 h-9 bg-gray-100 rounded-full mr-3 overflow-hidden border border-gray-200">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${p.username}&background=random`}
                                    alt="avatar"
                                />
                            </div>
                            <div>
                                {/* 데이터 필드에 맞춰 username를 createdAt(null 처리) 적용 */}
                                <div className="text-sm font-bold dark:text-white">{p.username}</div>
                                <div className="text-xs text-gray-400">
                                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "작성일 없음"}
                                </div>
                            </div>
                        </div>

                        {/* 게시글 제목 (현재 데이터에 content가 없으므로 title을 메인으로 표시) */}
                        <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm mb-2">
                            {p.title}
                        </h3>

                        {/* 게시판 타입 표시 (FREE 등) */}
                        <div className="flex items-center gap-4 text-xs font-medium pt-3 border-t border-gray-50 dark:border-gray-700">
                            <span className="text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded">
                                #{p.boardTyCd}
                            </span>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
                        첫 번째 게시글을 남겨보세요!
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudyFreeBoard;