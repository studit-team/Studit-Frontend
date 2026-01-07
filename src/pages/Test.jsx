import React, {useState} from "react";
import Sidebar from "../partials/Sidebar.jsx";
import Header from "../partials/Header.jsx";
import FilterButton from "../components/DropdownFilter.jsx";
import Datepicker from "../components/Datepicker.jsx";
import DashboardCard01 from "../partials/dashboard/DashboardCard01.jsx";
import {Calendar} from "../components/ui/calendar.jsx";
import BarChart01 from "../charts/BarChart01.jsx";
import DoughnutChart from "../charts/DoughnutChart.jsx";

function Test() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Test</h1>
                            </div>
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                <FilterButton align="right" />
                                <Datepicker align="right" />
                                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                                    <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="max-xs:sr-only">Add View</span>
                                </button>
                            </div>
                        </div>
                        {/* 사용해보고 싶은 컴포넌트 밑에 div에 넣으시면 바로 보실 수 있습니다 */}
                        <div className="grid grid-cols-12 gap-6">

                            {/* 1. DashboardCard01 (보통 상단 가로를 길게 쓰거나 4칸 차지) */}
                            <div className="col-span-full xl:col-span-4">
                                <DashboardCard01 />
                            </div>

                            {/* 2. Calendar (너비를 적절히 지정) */}
                            <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-700/60 pb-2 text-sm uppercase tracking-wider">
                                    스터디 일정
                                </h2>
                                <div className="flex">
                                    <Calendar />
                                </div>
                            </div>

                            {/* 3. DoughnutChart (이미 작성하신 코드) */}
                            <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">스터디 참여 현황 (테스트)</h2>
                                </header>
                                <DoughnutChart
                                    width={389}
                                    height={260}
                                    data={{
                                        labels: ['출석', '결석', '예정'],
                                        datasets: [
                                            {
                                                label: '횟수',
                                                data: [15, 3, 7],
                                                backgroundColor: ['#10B981', '#EF4444', '#6366F1'],
                                                hoverBackgroundColor: ['#059669', '#DC2626', '#4F46E5'],
                                                borderWidth: 0,
                                            },
                                        ],
                                    }}
                                />
                            </div>
                            <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                                <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">스터디 활동 기록</h2>
                                </header>

                                <BarChart01
                                    width={595}
                                    height={248}
                                    data={{
                                        // 날짜 형식: MM-DD-YYYY
                                        labels: [
                                            '01-01-2025', '02-01-2025', '03-01-2025',
                                            '04-01-2025', '05-01-2025', '06-01-2025'
                                        ],
                                        datasets: [
                                            {
                                                label: '참여 완료',
                                                data: [12, 18, 15, 25, 22, 30],
                                                backgroundColor: '#6366F1', // Indigo 500
                                                hoverBackgroundColor: '#4F46E5',
                                                barPercentage: 0.6,
                                                categoryPercentage: 0.6,
                                                borderRadius: 4,
                                            },
                                            {
                                                label: '결석/미참여',
                                                data: [2, 1, 4, 2, 3, 1],
                                                backgroundColor: '#CBD5E1', // Slate 300
                                                hoverBackgroundColor: '#94A3B8',
                                                barPercentage: 0.6,
                                                categoryPercentage: 0.6,
                                                borderRadius: 4,
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Test;