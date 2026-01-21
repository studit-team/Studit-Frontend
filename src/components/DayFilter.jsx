import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

function DayFilter({ selectedDays, setSelectedDays }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    // 📍 요일 데이터 상수로 관리
    const days = [
        { id: 'MON', name: '월요일' },
        { id: 'TUE', name: '화요일' },
        { id: 'WED', name: '수요일' },
        { id: 'THU', name: '목요일' },
        { id: 'FRI', name: '금요일' },
        { id: 'SAT', name: '토요일' },
        { id: 'SUN', name: '일요일' },
    ];

    const handleSelect = (dayId) => {
        if (dayId === 'ALL') {
            setSelectedDays([]);
            return;
        }

        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter((id) => id !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    // 외부 클릭 시 닫기
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [dropdownOpen]);

    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                type="button"
                className={`btn min-w-[130px] justify-start px-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${
                    selectedDays.length > 0 ? 'text-violet-600 border-violet-200 bg-violet-50/50' : 'text-gray-600'
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {/* 📍 요일 아이콘 (시계/달력 형태) */}
                <svg className={`w-4 h-4 shrink-0 mr-2 fill-current ${selectedDays.length > 0 ? 'text-violet-500' : 'text-gray-400'}`} viewBox="0 0 16 16">
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                    <path d="M9 4H7v5h5V7H9V4z" />
                </svg>
                <span className="font-bold whitespace-nowrap">
                    {selectedDays.length === 0 ? '요일' : `요일 (${selectedDays.length})`}
                </span>
                <svg className={`w-3 h-3 shrink-0 ml-auto fill-current text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12">
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                </svg>
            </button>

            <Transition
                show={dropdownOpen}
                tag="div"
                className="z-50 absolute top-full left-0 sm:left-auto sm:right-0 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1.5 rounded-2xl shadow-xl mt-1 overflow-hidden"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in duration-150 transform"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div ref={dropdown} className="px-3 py-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase pt-1.5 pb-2 px-1 border-b border-gray-50 mb-2">진행 요일</div>
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                        <li className="mb-0.5">
                            <label className="flex items-center px-2 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    className="form-checkbox text-violet-600 rounded border-gray-300"
                                    checked={selectedDays.length === 0}
                                    onChange={() => handleSelect('ALL')}
                                />
                                <span className={`text-sm font-medium ml-3 ${selectedDays.length === 0 ? 'text-violet-700 font-bold' : 'text-gray-600'}`}>전체</span>
                            </label>
                        </li>
                        {days.map((day) => (
                            <li key={day.id} className="mb-0.5">
                                <label className="flex items-center px-2 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox text-violet-600 rounded border-gray-300"
                                        checked={selectedDays.includes(day.id)}
                                        onChange={() => handleSelect(day.id)}
                                    />
                                    <span className={`text-sm font-medium ml-3 ${selectedDays.includes(day.id) ? 'text-violet-700 font-bold' : 'text-gray-600'}`}>
                                        {day.name}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default DayFilter;