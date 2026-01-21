import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LocationModal({ isOpen, setIsOpen, selectedLocations, setSelectedLocations }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [allRegions, setAllRegions] = useState([]);
    const [filteredRegions, setFilteredRegions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && allRegions.length === 0) {
            const fetchAllRegions = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get('/api/studies/region/list');

                    const cleanedData = response.data.map((reg, index) => ({
                        ...reg,
                        mpngSn: reg.mpngSn,
                        fullLocation: `${reg.sdNm} ${reg.sggNm.replace(reg.sdNm, "").trim()}`
                    }));
                    setAllRegions(cleanedData);
                    setFilteredRegions(cleanedData);
                } catch (error) {
                    console.error("지역 로딩 실패:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAllRegions();
        }
    }, [isOpen, allRegions.length]);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        const filtered = allRegions.filter(reg =>
            reg.sdNm.toLowerCase().includes(query) || reg.sggNm.toLowerCase().includes(query)
        );
        setFilteredRegions(filtered);
    }, [searchQuery, allRegions]);

    const toggleLocation = (reg) => {
        const isAlreadySelected = selectedLocations.some(
            item => String(item.mpngSn) === String(reg.mpngSn)
        );

        if (isAlreadySelected) {
            setSelectedLocations(selectedLocations.filter(
                item => String(item.mpngSn) !== String(reg.mpngSn)
            ));
        } else {
            setSelectedLocations([...selectedLocations, { mpngSn: reg.mpngSn, name: reg.fullLocation }]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-violet-900/20 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-md w-full h-[650px] flex flex-col relative z-10 border border-violet-100/50">

                <div className="flex flex-col flex-1 overflow-hidden p-6">
                    {selectedLocations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 shrink-0 max-h-24 overflow-y-auto">
                            {selectedLocations.map(loc => (
                                <span key={`selected-${loc.mpngSn}`} className="flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {loc.name}
                                    <button onClick={() => toggleLocation(loc)} className="ml-2 hover:text-red-500">✕</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none mb-4"
                        placeholder="지역 검색..."
                    />

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <ul className="grid gap-1.5">
                            {filteredRegions.map((reg) => {
                                const isSelected = selectedLocations.some(
                                    (selected) => String(selected.mpngSn) === String(reg.mpngSn)
                                );

                                return (
                                    <li
                                        key={`list-item-${reg.mpngSn}`}
                                        className={`p-3.5 cursor-pointer rounded-xl transition-all flex justify-between items-center border ${
                                            isSelected
                                                ? 'bg-violet-50 border-violet-300 text-violet-700'
                                                : 'hover:bg-gray-50 border-transparent text-gray-600'
                                        }`}
                                        onClick={() => toggleLocation(reg)}
                                    >
                                        <span className="font-medium text-sm">{reg.fullLocation}</span>
                                        {isSelected && (
                                            <span className="text-violet-600 font-extrabold text-lg">✓</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <button onClick={() => setIsOpen(false)} className="mt-4 w-full py-4 bg-violet-600 text-white rounded-2xl font-bold">
                        선택 완료
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LocationModal;