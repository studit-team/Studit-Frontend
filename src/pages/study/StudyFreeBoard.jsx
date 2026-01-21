import React from "react";

function StudyFreeBoard() {
    const posts = [
        { id: 1, author: "김자바", content: "오늘 공부한 람다식 정리해서 블로그에 올렸어요! 다들 확인해보세요.", likes: 3, comments: 2, date: "1시간 전" },
        { id: 2, author: "이코드", content: "스터디 장소 근처에 맛있는 카페 찾았습니다. 모임 끝나고 가실 분?", likes: 5, comments: 4, date: "5시간 전" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">자유 게시판</h2>
                <button className="btn bg-violet-600 text-white text-sm shadow-md shadow-violet-200">글쓰기</button>
            </div>

            <div className="space-y-4">
                {posts.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-300 transition-colors cursor-pointer">
                        <div className="flex items-center mb-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-full mr-3 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${p.author}`} alt="avatar" />
                            </div>
                            <div>
                                <div className="text-sm font-bold dark:text-white">{p.author}</div>
                                <div className="text-xs text-gray-400">{p.date}</div>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                            {p.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium border-t border-gray-50 dark:border-gray-700 pt-3">
                            <span className="flex items-center gap-1 hover:text-violet-600 transition">❤️ {p.likes}</span>
                            <span className="flex items-center gap-1 hover:text-violet-600 transition">💬 {p.comments}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudyFreeBoard;