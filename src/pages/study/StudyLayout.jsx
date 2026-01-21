import React, {useEffect, useState} from "react";
import { useParams, Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import axios from "axios";

function StudyLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [studyData, setStudyData] = useState(null);
    const { studyId } = useParams();
    const menus = [
        { name: "홈", path: "" },
        { name: "공지사항", path: "notice" },
        { name: "모임 일정", path: "schedule" },
        { name: "과제/인증", path: "assignment" },
        { name: "자유 게시판", path: "free" }
    ];

    useEffect(() => {
        const fetchStudyHome = async () => {
            try {
                const response = await axios.get(`/api/studies/${studyId}/home`);
                console.log("✅ Study Home Data:", response.data);
                setStudyData(response.data); // 전체 데이터 저장
            } catch (error) {
                console.error("❌ 데이터 호출 실패:", error);
            }
        };
        if (studyId) fetchStudyHome();
    }, [studyId]);

    if (!studyData) return <div className="p-8">로딩 중...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    {/* 스터디 상단 고정 배너 */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-6">
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-violet-100 text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full">IT/프로그래밍</span>
                                    <span className="text-gray-400 text-sm">| 서울시 종로구</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">자바 마스터 스터디</h1>
                            </div>
                            <button className="btn bg-violet-600 text-white hover:bg-violet-700 h-fit shadow-md">스터디 참여하기</button>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl mx-auto">
                        <div className="grid grid-cols-12 gap-6">
                            {/* 왼쪽 메뉴 네비게이션 */}
                            <div className="col-span-12 md:col-span-3">
                                <nav className="space-y-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">게시판</h3>
                                    {menus.map((menu) => (
                                        <NavLink
                                            key={menu.name}
                                            to={menu.path}
                                            end={menu.path === ""}
                                            className={({ isActive }) =>
                                                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                                                    isActive
                                                        ? "bg-violet-100 text-violet-600 dark:bg-violet-600/20 dark:text-violet-400"
                                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`
                                            }
                                        >
                                            {menu.name}
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>

                            {/* 오른쪽 콘텐츠 영역: URL에 따라 컴포넌트가 교체됨 */}
                            <div className="col-span-12 md:col-span-9">
                                <Outlet context={{ studyData }} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudyLayout;