import React from 'react';

function StudyCard({ study }) {

    const categoryTags = study.categoryNames
        ? study.categoryNames.split(',').map(tag => tag.trim())
        : [];

    const tags = study.tags && study.tags.length > 0 ? study.tags : categoryTags;

    const rating = study.rating || 0;
    const reviewCount = study.reviewCount || 0;
    const currentMembers = study.currentMbrCnt || 1;
    const price = study.price || 0;

    const duration = study.dayNames || "시간 미정";

    return (
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col h-full hover:shadow-md transition duration-200">
            <div className="grow">
                <header className="mb-3">
                    <h2 className="text-lg text-gray-800 dark:text-gray-100 font-bold leading-snug line-clamp-2">
                        {study.studyNm}
                    </h2>
                </header>

                <div className="flex items-start justify-between mb-4">
                    <div className="text-sm">
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 line-clamp-1">
                            {study.studyDc}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                            📍 지역: {study.sggNm}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-1">
                            {study.maxMbrNocs && `정원: ${study.maxMbrNocs}명`}
                        </div>
                    </div>
                    <img
                        className="w-12 h-12 rounded-full bg-gray-100"
                        src={study.avatar || `https://ui-avatars.com/api/?name=${study.leaderId}&background=random`}
                        alt="Leader"
                    />
                </div>

                <div className="flex items-center text-sm mb-4">
                    <span className="text-gray-500 dark:text-gray-400">
                        {currentMembers}/{study.maxMbrNocs} 참여중
                    </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                    {tags.map((tag, index) => (
                        <span key={index} className="text-[11px] font-medium px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-md">
                            # {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 text-right">
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {price > 0 ? `₩${price.toLocaleString()}` : '무료 스터디'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({duration})</span>
            </div>
        </div>
    );
}

export default StudyCard;